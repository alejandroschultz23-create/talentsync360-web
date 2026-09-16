import type {
  DerivedTalentState,
  OptInState,
  ReviewState,
} from "./domain";

export const REVIEW_TRANSITIONS: Readonly<
  Record<ReviewState, readonly ReviewState[]>
> = {
  SUBMITTED: [
    "READY_FOR_REVIEW",
    "CLARIFICATION_NEEDED",
    "NOT_ACTIONABLE_YET",
  ],
  CLARIFICATION_NEEDED: ["READY_FOR_REVIEW", "NOT_ACTIONABLE_YET"],
  NOT_ACTIONABLE_YET: [],
  READY_FOR_REVIEW: ["REVIEW_IN_PROGRESS"],
  REVIEW_IN_PROGRESS: ["REVIEW_DELIVERED"],
  REVIEW_DELIVERED: ["REVIEW_CONFIRMED", "CORRECTION_REQUESTED"],
  CORRECTION_REQUESTED: ["REVIEW_IN_PROGRESS"],
  REVIEW_CONFIRMED: [],
};

export const OPT_IN_TRANSITIONS: Readonly<
  Record<OptInState, readonly OptInState[]>
> = {
  NOT_OFFERED: ["OFFERED"],
  OFFERED: ["ACCEPTED", "DECLINED"],
  ACCEPTED: [],
  DECLINED: [],
};

export function canTransitionReview(
  from: ReviewState,
  to: ReviewState,
): boolean {
  return REVIEW_TRANSITIONS[from].includes(to);
}

export function assertReviewTransition(
  from: ReviewState,
  to: ReviewState,
): void {
  if (!canTransitionReview(from, to)) {
    throw new Error(`Invalid review transition: ${from} -> ${to}`);
  }
}

export function canTransitionOptIn(
  from: OptInState,
  to: OptInState,
): boolean {
  return OPT_IN_TRANSITIONS[from].includes(to);
}

export function assertOptInTransition(
  from: OptInState,
  to: OptInState,
): void {
  if (!canTransitionOptIn(from, to)) {
    throw new Error(`Invalid opt-in transition: ${from} -> ${to}`);
  }
}

export function nextProfileVersion(
  latestVersion: number | null,
  correctionRequested: boolean,
): number {
  if (latestVersion === null) {
    return 1;
  }

  if (!Number.isInteger(latestVersion) || latestVersion < 1) {
    throw new Error("Latest profile version must be a positive integer");
  }

  if (!correctionRequested) {
    throw new Error("A new profile version requires a correction request");
  }

  return latestVersion + 1;
}

export function assertProfileContentMutable(
  deliveredAt: string | Date | null,
): void {
  if (deliveredAt !== null) {
    throw new Error("Delivered evidence profile content is immutable");
  }
}

export function deriveTalentState(
  reviewState: ReviewState,
  optInState: OptInState,
  withdrawnAt: string | Date | null = null,
): DerivedTalentState {
  if (reviewState !== "REVIEW_CONFIRMED") {
    return null;
  }

  return optInState === "ACCEPTED" && withdrawnAt === null
    ? "TALENT_PROFILE_ACTIVE"
    : "EVIDENCE_REVIEW_COMPLETED_NO_OPTIN";
}
