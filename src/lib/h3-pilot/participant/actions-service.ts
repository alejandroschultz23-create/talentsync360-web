import "server-only";

import { callH3Pilot, type H3PilotCallResult } from "../server/client";
import { requestPilotRemoval, type PilotRemovalOutcome } from "../server/removal";
import type { H3PilotCaller } from "../server/pilot-submission";
import type { PilotFileStorage } from "../server/storage";
import {
  isPilotDraftDecisionUi,
  isPilotOptInAction,
  mapPilotDraftDecision,
  type PilotDraftDecisionUi,
  type PilotOptInAction,
} from "./decisions";
import {
  PILOT_OPT_IN_GRANT_REASON,
  PILOT_OPT_IN_REVOKE_REASON,
  PILOT_OPT_IN_SOURCE,
  PILOT_PARTICIPANT_ACTOR,
} from "./policy";
import { PILOT_BFF_OPERATOR } from "./submission-service";
import { readPilotParticipantState } from "./state-service";
import { resolvePilotParticipantContext, type ResolvePilotContextResult } from "./context-resolver";
import { pilotContent, type PilotLanguage } from "./content";
import type { PilotProgressStore } from "./progress";

/**
 * Participant lifecycle & decision actions (V1_187E).
 *
 * HARD BOUNDARY: participant routes MUST NOT reach H3 operator/review actions.
 * This module only calls the participant operations below and fails closed on
 * anything else. Promotion is NEVER performed here.
 *
 * CANONICAL ID INVARIANT: every mutation that requires a canonical id resolves
 * it fresh from H3 (`readPilotParticipantContext`) immediately before the call.
 * Product NEVER infers ids and NEVER trusts a stored id for a mutation.
 */
export const PARTICIPANT_DECISION_OPERATIONS = [
  "readPilotParticipantContext",
  "readPilotStatus",
  "getProfessionalProfileDraft",
  "recordDraftDecision",
  "grantTalentNetworkOptIn",
  "revokeTalentNetworkOptIn",
  "withdrawPilot",
] as const;

export const PARTICIPANT_FORBIDDEN_OPERATIONS = [
  "createClaim",
  "linkClaimEvidence",
  "changeClaimStatus",
  "submitCoherenceAssessment",
  "completeEvidenceReview",
  "generateProfessionalProfileDraft",
  "promoteTalentProfile",
] as const;

export type PilotActionFailure = { readonly ok: false; readonly code: string };

function isForbidden(operation: string): boolean {
  return (PARTICIPANT_FORBIDDEN_OPERATIONS as readonly string[]).includes(operation);
}

function participantCall(
  client: H3PilotCaller,
  operation: (typeof PARTICIPANT_DECISION_OPERATIONS)[number],
  payload: Record<string, unknown>,
): Promise<H3PilotCallResult> {
  if (isForbidden(operation)) return Promise.resolve({ ok: false, code: "OPERATOR_ACTION_FORBIDDEN" });
  return client(operation, payload);
}

export interface PilotActionDependencies {
  readonly progress: PilotProgressStore;
  readonly client?: H3PilotCaller;
  readonly now?: number;
  /** Test seam; defaults to the canonical H3 context resolver. */
  readonly resolveContext?: (intakeId: string) => Promise<ResolvePilotContextResult>;
}

function defaultClient(operation: string, payload: Record<string, unknown>): Promise<H3PilotCallResult> {
  return callH3Pilot(operation, payload);
}

function contextResolver(dependencies: PilotActionDependencies): (intakeId: string) => Promise<ResolvePilotContextResult> {
  if (dependencies.resolveContext !== undefined) return dependencies.resolveContext;
  const client = dependencies.client;
  return (intakeId) => resolvePilotParticipantContext(intakeId, client !== undefined ? { client } : {});
}

export interface RecordDraftDecisionInput {
  readonly participantReference: string;
  readonly decision: PilotDraftDecisionUi;
  readonly correctionMessage?: string;
}

export async function recordPilotDraftDecisionAction(
  input: RecordDraftDecisionInput,
  dependencies: PilotActionDependencies,
): Promise<{ ok: true } | PilotActionFailure> {
  if (!isPilotDraftDecisionUi(input.decision)) return { ok: false, code: "INVALID_DECISION" };
  const progress = await dependencies.progress.get(input.participantReference);
  if (progress === null) return { ok: false, code: "PILOT_NOT_SUBMITTED" };

  const client = dependencies.client ?? defaultClient;
  const resolveContext = contextResolver(dependencies);

  // Resolve the canonical draft id immediately before the mutation.
  const contextResult = await resolveContext(progress.intakeId);
  if (contextResult.ok === false) return { ok: false, code: contextResult.code };
  const professionalProfileDraftId = contextResult.context.professionalProfileDraftId;
  if (professionalProfileDraftId === null) return { ok: false, code: "DRAFT_NOT_READY" };

  const mapped = mapPilotDraftDecision(input.decision);
  const result = await participantCall(client, "recordDraftDecision", {
    intakeId: progress.intakeId,
    professionalProfileDraftId,
    decision: mapped,
    changedBy: PILOT_PARTICIPANT_ACTOR,
    decidedAt: new Date(dependencies.now ?? Date.now()).toISOString(),
  });
  if (result.ok === false) return { ok: false, code: result.code };

  // NOTE: no promotion, no opt-in, no external presentation is ever triggered.
  return { ok: true };
}

export interface OptInDecisionInput {
  readonly participantReference: string;
  readonly action: PilotOptInAction;
  readonly language?: PilotLanguage;
}

export async function decideTalentNetworkOptIn(
  input: OptInDecisionInput,
  dependencies: PilotActionDependencies,
): Promise<{ ok: true } | PilotActionFailure> {
  if (!isPilotOptInAction(input.action)) return { ok: false, code: "INVALID_OPT_IN_ACTION" };
  const progress = await dependencies.progress.get(input.participantReference);
  if (progress === null) return { ok: false, code: "PILOT_NOT_SUBMITTED" };

  // Product UI eligibility (confirmed draft) is a Product presentation policy.
  // Canonical H3 remains the final eligibility authority.
  const state = await readPilotParticipantState(
    { participantReference: input.participantReference, language: input.language ?? "es" },
    {
      progress: dependencies.progress,
      ...(dependencies.client !== undefined ? { client: dependencies.client } : {}),
    },
  );
  if (state.ok === false) return { ok: false, code: state.code };
  if (state.state.optInEligible === false) return { ok: false, code: "OPT_IN_NOT_ELIGIBLE" };

  if (input.action === "DECLINE") {
    await dependencies.progress.markTalentNetworkDeclined(input.participantReference);
    return { ok: true };
  }

  // Resolve canonical ids immediately before the mutation.
  const contextResult = await contextResolver(dependencies)(progress.intakeId);
  if (contextResult.ok === false) return { ok: false, code: contextResult.code };
  const { personId, evidenceReviewId } = contextResult.context;
  if (personId === null || evidenceReviewId === null) return { ok: false, code: "OPT_IN_NOT_ELIGIBLE" };

  const client = dependencies.client ?? defaultClient;
  const result = await participantCall(client, "grantTalentNetworkOptIn", {
    personId,
    evidenceReviewId,
    source: PILOT_OPT_IN_SOURCE,
    changedBy: PILOT_PARTICIPANT_ACTOR,
    reason: PILOT_OPT_IN_GRANT_REASON,
  });
  if (result.ok === false) return { ok: false, code: result.code };
  return { ok: true };
}

export interface WithdrawInput {
  readonly participantReference: string;
  readonly reason: string;
}

export async function withdrawPilotParticipant(
  input: WithdrawInput,
  dependencies: PilotActionDependencies,
): Promise<{ ok: true } | PilotActionFailure> {
  const progress = await dependencies.progress.get(input.participantReference);
  if (progress === null) return { ok: false, code: "PILOT_NOT_SUBMITTED" };
  const client = dependencies.client ?? defaultClient;
  const result = await participantCall(client, "withdrawPilot", {
    intakeId: progress.intakeId,
    participantReference: input.participantReference,
    reason: input.reason,
    withdrawnBy: PILOT_BFF_OPERATOR,
    withdrawnAt: new Date(dependencies.now ?? Date.now()).toISOString(),
  });
  if (result.ok === false) return { ok: false, code: result.code };
  return { ok: true };
}

export type RevokeOptInResult =
  | { readonly ok: true; readonly revoked: boolean }
  | PilotActionFailure;

export async function revokeTalentNetworkOptInAction(
  input: { readonly participantReference: string },
  dependencies: PilotActionDependencies,
): Promise<RevokeOptInResult> {
  const progress = await dependencies.progress.get(input.participantReference);
  if (progress === null) return { ok: false, code: "PILOT_NOT_SUBMITTED" };

  // Resolve the CURRENT canonical grant id immediately before the mutation.
  const contextResult = await contextResolver(dependencies)(progress.intakeId);
  if (contextResult.ok === false) return { ok: false, code: contextResult.code };
  const { personId, talentNetworkOptInPermissionGrantId } = contextResult.context;

  // No current GRANTED grant -> safe idempotent no-op. Never pick a
  // historical/revoked permission.
  if (personId === null || talentNetworkOptInPermissionGrantId === null) {
    return { ok: true, revoked: false };
  }

  const client = dependencies.client ?? defaultClient;
  const result = await participantCall(client, "revokeTalentNetworkOptIn", {
    permissionGrantId: talentNetworkOptInPermissionGrantId,
    personId,
    changedBy: PILOT_PARTICIPANT_ACTOR,
    reason: PILOT_OPT_IN_REVOKE_REASON,
  });
  if (result.ok === false) return { ok: false, code: result.code };
  return { ok: true, revoked: true };
}

export interface PilotRemovalActionDependencies {
  readonly progress: PilotProgressStore;
  readonly storage: PilotFileStorage;
  readonly callRemoval?: (input: {
    intakeId: string;
    personId: string;
    reason: string;
    operator: string;
    fileKeys: readonly string[];
  }) => Promise<PilotRemovalOutcome>;
  readonly now?: number;
}

export type PilotRemovalActionResult =
  | { readonly ok: true; readonly cleanupPending: boolean; readonly pendingFileKeys: readonly string[] }
  | PilotActionFailure;

export async function requestPilotRemovalAction(
  input: { readonly participantReference: string; readonly reason: string },
  dependencies: PilotRemovalActionDependencies,
): Promise<PilotRemovalActionResult> {
  const progress = await dependencies.progress.get(input.participantReference);
  if (progress === null) return { ok: false, code: "PILOT_NOT_SUBMITTED" };

  const callRemoval =
    dependencies.callRemoval ??
    ((removalInput) => requestPilotRemoval(removalInput, { storage: dependencies.storage }));

  const outcome = await callRemoval({
    intakeId: progress.intakeId,
    personId: progress.personId,
    reason: input.reason,
    operator: PILOT_BFF_OPERATOR,
    fileKeys: progress.fileKeys,
  });

  if (outcome.ok === false) return { ok: false, code: outcome.code };

  if (outcome.cleanupPending) {
    await dependencies.progress.setCleanupPending(input.participantReference, outcome.pendingFileKeys);
    return { ok: true, cleanupPending: true, pendingFileKeys: outcome.pendingFileKeys };
  }
  return { ok: true, cleanupPending: false, pendingFileKeys: [] };
}

/** UI copy helper used by the participant components (keeps copy centralized). */
export function pilotLifecycleCopy(language: PilotLanguage) {
  return pilotContent[language];
}
