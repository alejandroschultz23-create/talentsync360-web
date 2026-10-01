/**
 * Participant-visible pilot status mapping (owner decision V1_187A).
 *
 * Presentation labels ONLY. Product does NOT duplicate canonical H3 state; it
 * derives labels from `readPilotStatus` fields. Canonical source fields:
 *   intakeStatus, retentionState, consentStatus, evidenceReviewStatus,
 *   draftStatus, draftDecision.
 */
export const PILOT_PRESENTATION_STATUSES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "DRAFT_READY",
  "CORRECTION_REQUESTED",
  "CONFIRMED",
  "WITHDRAWN",
  "REMOVAL_PENDING",
  "REMOVED",
] as const;
export type PilotPresentationStatus = (typeof PILOT_PRESENTATION_STATUSES)[number];

export interface H3PilotStatusView {
  readonly intakeStatus: "ACTIVE" | "WITHDRAWN" | "REMOVED";
  readonly retentionState: "RETENTION_ACTIVE" | "REMOVAL_DUE" | "REMOVED";
  readonly consentStatus: "GRANTED" | "WITHDRAWN" | "DECLINED" | null;
  readonly evidenceReviewStatus:
    | "REVIEW_PENDING"
    | "REVIEW_IN_PROGRESS"
    | "REVIEW_COMPLETED"
    | "REVIEW_REJECTED"
    | null;
  readonly draftStatus: "GENERATED" | "AWAITING_REVIEW" | "CONFIRMED" | "SUPERSEDED" | null;
  readonly draftDecision: "CONFIRMED" | "CORRECTION_REQUESTED" | "REJECTED" | null;
}

export function mapPilotPresentationStatus(view: H3PilotStatusView): PilotPresentationStatus {
  if (view.intakeStatus === "REMOVED" || view.retentionState === "REMOVED") {
    return "REMOVED";
  }
  if (view.retentionState === "REMOVAL_DUE") return "REMOVAL_PENDING";
  if (view.intakeStatus === "WITHDRAWN" || view.consentStatus === "WITHDRAWN") return "WITHDRAWN";
  if (view.draftDecision === "CORRECTION_REQUESTED") return "CORRECTION_REQUESTED";
  if (view.draftDecision === "CONFIRMED" || view.draftStatus === "CONFIRMED") return "CONFIRMED";
  if (view.draftStatus === "GENERATED" || view.draftStatus === "AWAITING_REVIEW") return "DRAFT_READY";
  if (view.evidenceReviewStatus === "REVIEW_IN_PROGRESS" || view.evidenceReviewStatus === "REVIEW_PENDING") {
    return "UNDER_REVIEW";
  }
  return "SUBMITTED";
}
