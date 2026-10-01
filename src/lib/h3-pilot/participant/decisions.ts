import { mapPilotPresentationStatus, type H3PilotStatusView } from "../server/pilot-status";

/**
 * Participant decision mapping (V1_187B). Pure module.
 *
 * UI decisions map EXACTLY to canonical H3 values. Product never invents new
 * governance states and never persists a second governance state.
 */
export const PILOT_DRAFT_DECISION_UI = ["CONFIRM", "REQUEST_CORRECTION", "REJECT"] as const;
export type PilotDraftDecisionUi = (typeof PILOT_DRAFT_DECISION_UI)[number];

export type CanonicalDraftDecision = "CONFIRMED" | "CORRECTION_REQUESTED" | "REJECTED";

export const PILOT_DRAFT_DECISION_MAP: Record<PilotDraftDecisionUi, CanonicalDraftDecision> = {
  CONFIRM: "CONFIRMED",
  REQUEST_CORRECTION: "CORRECTION_REQUESTED",
  REJECT: "REJECTED",
};

export function isPilotDraftDecisionUi(value: unknown): value is PilotDraftDecisionUi {
  return typeof value === "string" && (PILOT_DRAFT_DECISION_UI as readonly string[]).includes(value);
}

export function mapPilotDraftDecision(decision: PilotDraftDecisionUi): CanonicalDraftDecision {
  return PILOT_DRAFT_DECISION_MAP[decision];
}

/** Promotion (external presentation) is NEVER performed by these decisions. */
export const PILOT_PROMOTES_ON_DECISION = false;

export const PILOT_OPT_IN_ACTIONS = ["JOIN", "DECLINE"] as const;
export type PilotOptInAction = (typeof PILOT_OPT_IN_ACTIONS)[number];

export function isPilotOptInAction(value: unknown): value is PilotOptInAction {
  return typeof value === "string" && (PILOT_OPT_IN_ACTIONS as readonly string[]).includes(value);
}

export const PILOT_LIFECYCLE_ACTIONS = ["WITHDRAW", "REVOKE_OPT_IN", "REMOVAL"] as const;
export type PilotLifecycleAction = (typeof PILOT_LIFECYCLE_ACTIONS)[number];

export function isPilotLifecycleAction(value: unknown): value is PilotLifecycleAction {
  return typeof value === "string" && (PILOT_LIFECYCLE_ACTIONS as readonly string[]).includes(value);
}

/**
 * Talent Network opt-in is offered ONLY when:
 *   - review = REVIEW_COMPLETED
 *   - a draft exists
 *   - draft decision = CONFIRMED
 * It is NEVER auto-enabled and NEVER shown during initial submission.
 */
export function isTalentNetworkOptInEligible(view: H3PilotStatusView): boolean {
  const draftExists =
    view.draftStatus === "GENERATED" ||
    view.draftStatus === "AWAITING_REVIEW" ||
    view.draftStatus === "CONFIRMED";
  return (
    view.evidenceReviewStatus === "REVIEW_COMPLETED" &&
    draftExists &&
    view.draftDecision === "CONFIRMED"
  );
}

/**
 * Draft decision actions are available for a draft that is not already in a
 * terminal participant decision. A correction request is terminal for this
 * version (a new revision only happens through the canonical process).
 */
export function isDraftDecisionOpen(view: H3PilotStatusView): boolean {
  return mapPilotPresentationStatus(view) === "DRAFT_READY";
}
