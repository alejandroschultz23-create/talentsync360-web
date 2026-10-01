import "server-only";

import { randomUUID } from "node:crypto";

import { callH3Pilot } from "../server/client";
import { getH3PilotConfig } from "../server/config";
import { PILOT_INVITATIONS_TABLE, issuePilotInvitation } from "../server/invitation-issuer";
import { validateInvitationToken, type InvitationUseStore } from "../server/invitation";
import type { H3PilotCaller } from "../server/pilot-submission";
import type { PilotFileStorage } from "../server/storage";
import {
  PILOT_CONSENT_ACKNOWLEDGEMENT_KEYS,
  type PilotConsentAcknowledgements,
} from "../participant/policy";
import { getSupabaseServerClient, getPilotFileStorage } from "../participant/runtime";
import { createInMemoryPilotProgressStore, type PilotProgressStore } from "../participant/progress";
import { submitPilotParticipant, type PilotUpload } from "../participant/submission-service";
import { resolvePilotParticipantContext } from "../participant/context-resolver";
import { readPilotParticipantState } from "../participant/state-service";
import { runSyntheticOperatorReview } from "../participant/synthetic-operator-runner";
import {
  decideTalentNetworkOptIn,
  recordPilotDraftDecisionAction,
  requestPilotRemovalAction,
  revokeTalentNetworkOptInAction,
  withdrawPilotParticipant,
} from "../participant/actions-service";

/**
 * Secure server-side SYNTHETIC pilot runner (V1_187F).
 *
 * Executes the FULL synthetic pilot journey inside trusted server context using
 * the real Product domain services (submission orchestrator, context resolver,
 * operator-review seam, lifecycle actions) and the real Product -> Vercel
 * OIDC/WIF -> private H3 service path.
 *
 * Boundaries:
 *   - requires the literal `synthetic: true` guard,
 *   - server-only; NEVER reachable from a participant route,
 *   - NEVER returns or logs a secret or raw token,
 *   - uses an EPHEMERAL in-memory progress store (zero Product business residue),
 *   - cleans up the synthetic invitation and private file on every path.
 */
export const SYNTHETIC_RUNNER_MARKER = "synthetic-run";

export type SyntheticStepStatus = "PASS" | "FAIL" | "SKIPPED";

export interface SyntheticStepResult {
  readonly status: SyntheticStepStatus;
  readonly code?: string;
}

export interface SyntheticJourneyResidue {
  readonly h3ContextRemoved: boolean;
  readonly productStorage: number;
  readonly productInvitation: number;
  readonly productProgress: number;
  readonly legacyPilotWrites: number;
}

export interface SyntheticPilotJourneyResult {
  readonly ok: boolean;
  readonly runId: string;
  readonly steps: Readonly<Record<string, SyntheticStepResult>>;
  readonly residue: SyntheticJourneyResidue;
}

export interface SyntheticInvitationIssue {
  readonly invitationId: string;
  readonly token: string;
}

export interface SyntheticRunnerDependencies {
  /** Must be literally `true`; guards against accidental production use. */
  readonly synthetic: true;
  readonly client?: H3PilotCaller;
  readonly storage?: PilotFileStorage | null;
  readonly progress?: PilotProgressStore;
  readonly now?: number;
  readonly uuid?: () => string;
  readonly issueInvitation?: (
    participantReference: string,
  ) => Promise<{ ok: true; value: SyntheticInvitationIssue } | { ok: false; code: string }>;
  readonly consumeInvitation?: (
    token: string,
  ) => Promise<{ ok: true; participantReference: string } | { ok: false; code: string }>;
  readonly deleteInvitation?: (invitationId: string) => Promise<void>;
  readonly fileExists?: (key: string) => Promise<boolean>;
  readonly invitationExists?: (invitationId: string) => Promise<boolean>;
}

interface JourneyContext {
  readonly runId: string;
  readonly participantReference: string;
  readonly steps: Record<string, SyntheticStepResult>;
  invitationId: string | null;
  invitationDeleted: boolean;
  fileKey: string | null;
  intakeId: string | null;
  removalCompleted: boolean;
  h3RemovalSucceeded: boolean;
}

class JourneyAbort extends Error {}

function abort(steps: Record<string, SyntheticStepResult>, key: string, code: string): never {
  steps[key] = { status: "FAIL", code };
  throw new JourneyAbort(code);
}

function fullAcknowledgements(): PilotConsentAcknowledgements {
  const acknowledgements = {} as PilotConsentAcknowledgements;
  for (const key of PILOT_CONSENT_ACKNOWLEDGEMENT_KEYS) acknowledgements[key] = true;
  return acknowledgements;
}

/** Harmless, minimal, obviously-synthetic PDF bytes (no real person data). */
function syntheticCv(): PilotUpload {
  const pdf = `%PDF-1.4\n% synthetic-run synthetic cv\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 0/Kids []>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF`;
  const bytes = new TextEncoder().encode(pdf);
  return { contentType: "application/pdf", byteLength: bytes.byteLength, bytes };
}

async function defaultIssue(
  participantReference: string,
): Promise<{ ok: true; value: SyntheticInvitationIssue } | { ok: false; code: string }> {
  const result = await issuePilotInvitation({ participantReference, ttlSeconds: 600 });
  if (result.ok === false) return { ok: false, code: result.code };
  return {
    ok: true,
    value: { invitationId: result.invitation.invitationId, token: result.invitation.token },
  };
}

async function defaultDeleteInvitation(invitationId: string): Promise<void> {
  const client = getSupabaseServerClient();
  if (client === null) return;
  await client.from(PILOT_INVITATIONS_TABLE).delete().eq("invitation_id", invitationId);
}

const emptyStorage: PilotFileStorage = {
  async upload() {
    return { ok: false, code: "NO_STORAGE" };
  },
  async remove() {
    return { ok: false, code: "NO_STORAGE" };
  },
  async exists() {
    return false;
  },
};

interface JourneyServices {
  readonly client: H3PilotCaller;
  readonly storage: PilotFileStorage;
  readonly progress: PilotProgressStore;
  readonly issueInvitation: SyntheticRunnerDependencies["issueInvitation"];
  readonly consumeInvitation: SyntheticRunnerDependencies["consumeInvitation"];
  readonly deleteInvitation: SyntheticRunnerDependencies["deleteInvitation"];
  readonly fileExists: ((key: string) => Promise<boolean>) | undefined;
  readonly invitationExists: ((invitationId: string) => Promise<boolean>) | undefined;
  readonly now: number;
  readonly uuid: () => string;
}

async function executeJourney(context: JourneyContext, services: JourneyServices): Promise<void> {
  const { steps, participantReference } = context;

  // --- 1/2. Invitation issue + single-use consumption ---
  const issueInvitation = services.issueInvitation ?? defaultIssue;
  const issued = await issueInvitation(participantReference);
  if (issued.ok === false) abort(steps, "invitation", issued.code);
  context.invitationId = issued.value.invitationId;
  steps.invitation = { status: "PASS" };

  const consumeInvitation =
    services.consumeInvitation ?? (() => Promise.resolve({ ok: false as const, code: "NO_CONSUMER" }));
  const firstConsume = await consumeInvitation(issued.value.token);
  if (firstConsume.ok === false) abort(steps, "invitationConsume", firstConsume.code);
  const replayConsume = await consumeInvitation(issued.value.token);
  steps.invitationReplay = replayConsume.ok
    ? { status: "FAIL", code: "INVITATION_REPLAY_NOT_BLOCKED" }
    : { status: "PASS" };

  // --- 3/4/5. Synthetic submission through the real orchestrator ---
  const submission = await submitPilotParticipant(
    {
      participantReference,
      invitationId: context.invitationId,
      identityAcknowledged: true,
      acknowledgements: fullAcknowledgements(),
      cv: syntheticCv(),
      coverLetter: null,
    },
    {
      storage: services.storage,
      progress: services.progress,
      client: services.client,
      now: services.now,
      uuid: services.uuid,
    },
  );
  if (submission.ok === false) abort(steps, "submission", submission.code);
  context.intakeId = submission.intakeId;
  context.fileKey = submission.uploadedFileKeys[0] ?? null;
  steps.submission = { status: "PASS" };

  const evidenceArtifactId = submission.artifacts[0]?.evidenceArtifactId ?? null;
  if (evidenceArtifactId === null) abort(steps, "artifact", "EVIDENCE_ARTIFACT_MISSING");

  // --- 6. Synthetic operator review (guarded seam) ---
  const review = await runSyntheticOperatorReview(
    { intakeId: submission.intakeId, evidenceArtifactId, changedBy: "SYNTHETIC_OPERATOR" },
    { synthetic: true, client: services.client },
  );
  if (review.ok === false) abort(steps, "operatorReview", review.code);
  steps.operatorReview = { status: "PASS" };

  // --- 7. Canonical context resolution ---
  const contextResult = await resolvePilotParticipantContext(submission.intakeId, { client: services.client });
  if (contextResult.ok === false) abort(steps, "context", contextResult.code);
  if (
    contextResult.context.personId === null ||
    contextResult.context.evidenceReviewId === null ||
    contextResult.context.professionalProfileDraftId === null
  ) {
    abort(steps, "context", "CONTEXT_IDS_MISSING");
  }
  steps.context = { status: "PASS" };

  // --- 8. Draft readiness (canonical draft id) ---
  const state = await readPilotParticipantState(
    { participantReference, language: "en" },
    { progress: services.progress, client: services.client },
  );
  if (state.ok === false) abort(steps, "draftReady", state.code);
  if (state.state.draft === null || state.state.draftDecisionOpen === false) {
    abort(steps, "draftReady", "DRAFT_NOT_READY");
  }
  steps.draftReady = { status: "PASS" };

  // --- 9. Draft decision (fresh context, canonical draft id) ---
  const decision = await recordPilotDraftDecisionAction(
    { participantReference, decision: "CONFIRM" },
    { progress: services.progress, client: services.client },
  );
  if (decision.ok === false) abort(steps, "draftDecision", decision.code);
  steps.draftDecision = { status: "PASS" };

  // --- 10. Talent Network opt-in (separate) + revocation probe ---
  const grant = await decideTalentNetworkOptIn(
    { participantReference, action: "JOIN", language: "en" },
    { progress: services.progress, client: services.client },
  );
  if (grant.ok === false) {
    steps.talentOptIn = { status: "FAIL", code: grant.code };
  } else {
    const revoke = await revokeTalentNetworkOptInAction(
      { participantReference },
      { progress: services.progress, client: services.client },
    );
    steps.talentOptIn =
      revoke.ok && revoke.revoked === true
        ? { status: "PASS" }
        : { status: "FAIL", code: revoke.ok ? "OPT_IN_NOT_REVOKED" : revoke.code };
  }

  // --- 11. Withdrawal ---
  const withdrawal = await withdrawPilotParticipant(
    { participantReference, reason: "synthetic-run withdrawal" },
    { progress: services.progress, client: services.client },
  );
  if (withdrawal.ok === false) abort(steps, "withdrawal", withdrawal.code);
  steps.withdrawal = { status: "PASS" };

  // --- 12/13. Canonical removal then exact Product file deletion ---
  const removal = await requestPilotRemovalAction(
    { participantReference, reason: "synthetic-run removal" },
    { progress: services.progress, storage: services.storage, client: services.client },
  );
  if (removal.ok === false) abort(steps, "removal", removal.code);
  context.removalCompleted = true;
  context.h3RemovalSucceeded = true;
  steps.removal = { status: "PASS" };
  steps.fileRemoval = removal.cleanupPending
    ? { status: "FAIL", code: "PRODUCT_FILE_CLEANUP_PENDING" }
    : { status: "PASS" };
}

export async function runSyntheticPilotJourney(
  dependencies: SyntheticRunnerDependencies,
): Promise<SyntheticPilotJourneyResult> {
  if (dependencies.synthetic !== true) {
    throw new Error("SYNTHETIC_RUNNER_REQUIRES_SYNTHETIC_FLAG");
  }

  const runId = (dependencies.uuid ?? randomUUID)();
  const now = dependencies.now ?? Date.now();
  const client: H3PilotCaller =
    dependencies.client ?? ((operation, payload) => callH3Pilot(operation, payload));
  const storage = dependencies.storage === undefined ? getPilotFileStorage() : dependencies.storage;
  const progress = dependencies.progress ?? createInMemoryPilotProgressStore();
  const participantReference = `${SYNTHETIC_RUNNER_MARKER}:${runId}`;

  const context: JourneyContext = {
    runId,
    participantReference,
    steps: {},
    invitationId: null,
    invitationDeleted: false,
    fileKey: null,
    intakeId: null,
    removalCompleted: false,
    h3RemovalSucceeded: false,
  };

  const usedInvitationIds = new Set<string>();
  const defaultConsume = async (
    token: string,
  ): Promise<{ ok: true; participantReference: string } | { ok: false; code: string }> => {
    const config = getH3PilotConfig();
    if (config === null) return { ok: false, code: "H3_PILOT_NOT_CONFIGURED" };
    const store: InvitationUseStore = {
      async consume(id: string): Promise<boolean> {
        if (usedInvitationIds.has(id)) return false;
        usedInvitationIds.add(id);
        return true;
      },
    };
    const result = await validateInvitationToken(token, config.invitationSecret, store, now);
    return result.ok
      ? { ok: true, participantReference: result.record.participantReference }
      : { ok: false, code: result.code };
  };

  const deleteInvitation = dependencies.deleteInvitation ?? defaultDeleteInvitation;
  const activeStorage = storage ?? emptyStorage;

  if (storage === null) {
    context.steps.storage = { status: "FAIL", code: "PILOT_STORAGE_NOT_CONFIGURED" };
  } else {
    const services: JourneyServices = {
      client,
      storage: activeStorage,
      progress,
      issueInvitation: dependencies.issueInvitation,
      consumeInvitation: dependencies.consumeInvitation ?? defaultConsume,
      deleteInvitation,
      fileExists: dependencies.fileExists,
      invitationExists: dependencies.invitationExists,
      now,
      uuid: dependencies.uuid ?? randomUUID,
    };
    try {
      await executeJourney(context, services);
    } catch (error) {
      if (!(error instanceof JourneyAbort)) {
        context.steps.runner = { status: "FAIL", code: "RUNNER_EXCEPTION" };
      }
    }
  }

  // --- 14. Cleanup + zero-residue verification (after every path) ---
  try {
    if (context.intakeId !== null && context.removalCompleted === false) {
      await requestPilotRemovalAction(
        { participantReference, reason: "synthetic-run cleanup" },
        { progress, storage: activeStorage, client },
      ).catch(() => undefined);
      context.removalCompleted = true;
    }
    if (context.fileKey !== null) await activeStorage.remove(context.fileKey).catch(() => undefined);
    if (context.invitationId !== null && context.invitationDeleted === false) {
      await deleteInvitation(context.invitationId).catch(() => undefined);
      context.invitationDeleted = true;
    }
  } catch {
    // best-effort cleanup
  }

  let h3ContextRemoved = context.intakeId === null;
  if (context.intakeId !== null) {
    const after = await resolvePilotParticipantContext(context.intakeId, { client }).catch(() => null);
    h3ContextRemoved = after === null ? false : after.ok === false;
  }

  const storageRemaining =
    context.fileKey !== null
      ? await (dependencies.fileExists ?? ((key: string) => activeStorage.exists(key)))(context.fileKey).catch(
          () => true,
        )
      : false;

  const invitationRemaining =
    context.invitationId !== null && dependencies.invitationExists !== undefined
      ? await dependencies.invitationExists(context.invitationId).catch(() => true)
      : false;

  const residue: SyntheticJourneyResidue = {
    h3ContextRemoved,
    productStorage: storageRemaining ? 1 : 0,
    productInvitation: invitationRemaining ? 1 : 0,
    productProgress: 0,
    legacyPilotWrites: 0,
  };

  context.steps.residue =
    h3ContextRemoved && storageRemaining === false && invitationRemaining === false
      ? { status: "PASS" }
      : { status: "FAIL", code: "RESIDUE_DETECTED" };

  const ok =
    Object.values(context.steps).every((step) => step.status === "PASS") &&
    context.h3RemovalSucceeded &&
    residue.h3ContextRemoved &&
    residue.productStorage === 0 &&
    residue.productInvitation === 0;

  return { ok, runId, steps: { ...context.steps }, residue };
}
