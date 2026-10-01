import "server-only";

import { callH3Pilot, type H3PilotCallResult } from "../server/client";
import type { H3PilotCaller } from "../server/pilot-submission";
import {
  mapPilotPresentationStatus,
  type H3PilotStatusView,
  type PilotPresentationStatus,
} from "../server/pilot-status";
import { isDraftDecisionOpen, isTalentNetworkOptInEligible } from "./decisions";
import { pilotStatusLabel, type PilotLanguage } from "./content";
import {
  resolvePilotParticipantContext,
  type PilotParticipantContext,
} from "./context-resolver";
import type { PilotProgressStore } from "./progress";

/**
 * Participant-visible state (V1_187B).
 *
 * The canonical H3 `readPilotStatus` is the ONLY source of governance state.
 * Product adds no second governance state; it composes presentation labels and
 * UI eligibility from canonical fields.
 */
export interface PilotParticipantState {
  readonly stage: string;
  readonly hasSubmission: boolean;
  readonly presentationStatus: PilotPresentationStatus | null;
  readonly label: string;
  readonly optInEligible: boolean;
  readonly canRevokeOptIn: boolean;
  readonly draftDecisionOpen: boolean;
  readonly draft: unknown | null;
  readonly cleanupPending: boolean;
  readonly canWithdraw: boolean;
  readonly canRequestRemoval: boolean;
  readonly talentNetworkDeclined: boolean;
}

export interface ComposePilotParticipantStateInput {
  readonly hasProgress: boolean;
  readonly statusView: H3PilotStatusView | null;
  readonly draft: unknown | null;
  readonly cleanupPending: boolean;
  readonly talentNetworkDeclined: boolean;
  readonly optInStatus: string | null;
  readonly language: PilotLanguage;
}

export function composePilotParticipantState(
  input: ComposePilotParticipantStateInput,
): PilotParticipantState {
  if (input.hasProgress === false || input.statusView === null) {
    return {
      stage: "NOT_SUBMITTED",
      hasSubmission: false,
      presentationStatus: null,
      label: pilotStatusLabel(input.language, "NOT_SUBMITTED"),
      optInEligible: false,
      canRevokeOptIn: false,
      draftDecisionOpen: false,
      draft: null,
      cleanupPending: false,
      canWithdraw: false,
      canRequestRemoval: false,
      talentNetworkDeclined: false,
    };
  }

  const view = input.statusView;
  const presentationStatus = mapPilotPresentationStatus(view);
  const terminal = presentationStatus === "REMOVED" || presentationStatus === "WITHDRAWN";
  const draftDecisionOpen = input.draft !== null && isDraftDecisionOpen(view);

  return {
    stage: presentationStatus,
    hasSubmission: true,
    presentationStatus,
    label: pilotStatusLabel(input.language, presentationStatus),
    optInEligible: isTalentNetworkOptInEligible(view) && input.talentNetworkDeclined === false,
    canRevokeOptIn: input.optInStatus === "GRANTED" && terminal === false,
    draftDecisionOpen,
    draft: input.draft,
    cleanupPending: input.cleanupPending,
    canWithdraw: terminal === false,
    canRequestRemoval: presentationStatus !== "REMOVED",
    talentNetworkDeclined: input.talentNetworkDeclined,
  };
}

const INTAKE_STATES = ["ACTIVE", "WITHDRAWN", "REMOVED"] as const;
const RETENTION_STATES = ["RETENTION_ACTIVE", "REMOVAL_DUE", "REMOVED"] as const;
const CONSENT_STATES = ["GRANTED", "WITHDRAWN", "DECLINED"] as const;
const REVIEW_STATES = ["REVIEW_PENDING", "REVIEW_IN_PROGRESS", "REVIEW_COMPLETED", "REVIEW_REJECTED"] as const;
const DRAFT_STATES = ["GENERATED", "AWAITING_REVIEW", "CONFIRMED", "SUPERSEDED"] as const;
const DECISION_STATES = ["CONFIRMED", "CORRECTION_REQUESTED", "REJECTED"] as const;

function pick<T extends readonly string[]>(value: unknown, allowed: T): T[number] | null {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T[number]) : null;
}

/** Defensive parse of the canonical H3 status payload; unknown fields become null. */
export function parsePilotStatusView(value: unknown): H3PilotStatusView | null {
  if (value === null || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const intakeStatus = pick(record.intakeStatus, INTAKE_STATES);
  const retentionState = pick(record.retentionState, RETENTION_STATES);
  if (intakeStatus === null || retentionState === null) return null;
  return {
    intakeStatus,
    retentionState,
    consentStatus: pick(record.consentStatus, CONSENT_STATES),
    evidenceReviewStatus: pick(record.evidenceReviewStatus, REVIEW_STATES),
    draftStatus: pick(record.draftStatus, DRAFT_STATES),
    draftDecision: pick(record.draftDecision, DECISION_STATES),
  };
}

export interface ReadPilotParticipantStateInput {
  readonly participantReference: string;
  readonly language: PilotLanguage;
}

export interface ReadPilotParticipantStateDependencies {
  readonly progress: PilotProgressStore;
  readonly client?: H3PilotCaller;
}

export type ReadPilotParticipantStateResult =
  | { readonly ok: true; readonly state: PilotParticipantState }
  | { readonly ok: false; readonly code: string };

function defaultClient(operation: string, payload: Record<string, unknown>): Promise<H3PilotCallResult> {
  return callH3Pilot(operation, payload);
}

export async function readPilotParticipantState(
  input: ReadPilotParticipantStateInput,
  dependencies: ReadPilotParticipantStateDependencies,
): Promise<ReadPilotParticipantStateResult> {
  const progress = await dependencies.progress.get(input.participantReference);
  if (progress === null) {
    return {
      ok: true,
      state: composePilotParticipantState({
        hasProgress: false,
        statusView: null,
        draft: null,
        cleanupPending: false,
        talentNetworkDeclined: false,
        optInStatus: null,
        language: input.language,
      }),
    };
  }

  const client = dependencies.client ?? defaultClient;

  // Canonical ids are ALWAYS re-resolved from H3 immediately before use. The
  // Product progress record is a non-authoritative hint only.
  const contextResult = await resolvePilotParticipantContext(progress.intakeId, { client });
  if (contextResult.ok === false) return { ok: false, code: contextResult.code };
  const context = contextResult.context;

  // The intake exists but the participant binding is not (yet) present.
  if (context.personId === null) {
    return { ok: true, state: safeSubmittedState(input.language, progress.cleanupPendingFileKeys.length > 0) };
  }

  const statusPayload: Record<string, unknown> = {
    intakeId: progress.intakeId,
    personId: context.personId,
  };
  if (context.evidenceReviewId !== null) statusPayload.evidenceReviewId = context.evidenceReviewId;
  if (context.professionalProfileDraftId !== null) {
    statusPayload.professionalProfileDraftId = context.professionalProfileDraftId;
  }
  if (context.talentNetworkOptInPermissionGrantId !== null) {
    statusPayload.permissionGrantId = context.talentNetworkOptInPermissionGrantId;
  }

  const status = await client("readPilotStatus", statusPayload);
  if (status.ok === false) return { ok: false, code: status.code };

  const view = parsePilotStatusView(status.value);
  if (view === null) return { ok: false, code: "INVALID_STATUS_PAYLOAD" };

  // Draft is read ONLY via the canonical draft id resolved from H3. Product
  // never guesses the latest draft.
  let draft: unknown | null = null;
  if (context.professionalProfileDraftId !== null) {
    const draftResult = await client("getProfessionalProfileDraft", {
      professionalProfileDraftId: context.professionalProfileDraftId,
    });
    if (draftResult.ok === false) return { ok: false, code: draftResult.code };
    if (draftResult.value === undefined) return { ok: false, code: "DRAFT_PAYLOAD_MISSING" };
    const scope = validateDraftScope(draftResult.value, context);
    if (scope.ok === false) return { ok: false, code: scope.code };
    draft = draftResult.value;
  }

  const optInStatus =
    context.talentNetworkOptInPermissionGrantId !== null ? "GRANTED" : parseOptInStatus(status.value);

  return {
    ok: true,
    state: composePilotParticipantState({
      hasProgress: true,
      statusView: view,
      draft,
      cleanupPending: progress.cleanupPendingFileKeys.length > 0,
      talentNetworkDeclined: progress.talentNetworkDeclined,
      optInStatus,
      language: input.language,
    }),
  };
}

function safeSubmittedState(language: PilotLanguage, cleanupPending: boolean): PilotParticipantState {
  return {
    stage: "SUBMITTED",
    hasSubmission: true,
    presentationStatus: "SUBMITTED",
    label: pilotStatusLabel(language, "SUBMITTED"),
    optInEligible: false,
    canRevokeOptIn: false,
    draftDecisionOpen: false,
    draft: null,
    cleanupPending,
    canWithdraw: false,
    canRequestRemoval: true,
    talentNetworkDeclined: false,
  };
}

/**
 * If the canonical draft payload exposes scope ids, they MUST match the context.
 * Fail closed on mismatch; otherwise accept the opaque payload.
 */
export function validateDraftScope(
  value: unknown,
  context: PilotParticipantContext,
): { ok: true } | { ok: false; code: string } {
  if (value === null || typeof value !== "object") return { ok: true };
  const record = value as Record<string, unknown>;
  const draftRecord =
    record.draft !== null && typeof record.draft === "object"
      ? (record.draft as Record<string, unknown>)
      : record;
  const personId = draftRecord.personId;
  if (typeof personId === "string" && context.personId !== null && personId !== context.personId) {
    return { ok: false, code: "PILOT_DRAFT_SCOPE_MISMATCH" };
  }
  const evidenceReviewId = draftRecord.evidenceReviewId;
  if (
    typeof evidenceReviewId === "string" &&
    context.evidenceReviewId !== null &&
    evidenceReviewId !== context.evidenceReviewId
  ) {
    return { ok: false, code: "PILOT_DRAFT_SCOPE_MISMATCH" };
  }
  return { ok: true };
}

const OPT_IN_STATES = ["GRANTED", "REVOKED", "DECLINED"] as const;

/**
 * Canonical opt-in state, read defensively from readPilotStatus. Product does
 * not persist opt-in truth; only canonical H3 does.
 */
export function parseOptInStatus(value: unknown): string | null {
  if (value === null || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const candidate = record.optInStatus ?? record.talentNetworkStatus ?? record.talentNetworkOptInStatus;
  return pick(candidate, OPT_IN_STATES);
}
