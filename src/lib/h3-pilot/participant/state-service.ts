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
  const status = await client("readPilotStatus", { intakeId: progress.intakeId });
  if (status.ok === false) return { ok: false, code: status.code };

  const view = parsePilotStatusView(status.value);
  if (view === null) return { ok: false, code: "INVALID_STATUS_PAYLOAD" };

  let draft: unknown | null = null;
  if (view.evidenceReviewStatus === "REVIEW_COMPLETED") {
    const draftResult = await client("getProfessionalProfileDraft", { intakeId: progress.intakeId });
    if (draftResult.ok === true && draftResult.value !== undefined) draft = draftResult.value;
  }

  return {
    ok: true,
    state: composePilotParticipantState({
      hasProgress: true,
      statusView: view,
      draft,
      cleanupPending: progress.cleanupPendingFileKeys.length > 0,
      talentNetworkDeclined: progress.talentNetworkDeclined,
      optInStatus: parseOptInStatus(status.value),
      language: input.language,
    }),
  };
}

const OPT_IN_STATES = ["GRANTED", "REVOKED", "DECLINED"] as const;

/**
 * Canonical opt-in state, read defensively from readPilotStatus. Product does
 * not persist opt-in truth; only canonical H3 does.
 */
export function parseOptInStatus(value: unknown): string | null {
  if (value === null || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const candidate = record.optInStatus ?? record.talentNetworkStatus;
  return pick(candidate, OPT_IN_STATES);
}
