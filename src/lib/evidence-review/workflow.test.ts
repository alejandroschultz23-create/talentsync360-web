import { describe, expect, it } from "vitest";

import type { OptInState, ReviewState } from "./domain";
import {
  assertProfileContentMutable,
  canTransitionOptIn,
  canTransitionReview,
  deriveTalentState,
  nextProfileVersion,
  OPT_IN_TRANSITIONS,
  REVIEW_TRANSITIONS,
} from "./workflow";

describe("review workflow", () => {
  it("accepts every approved review transition", () => {
    for (const [from, targets] of Object.entries(REVIEW_TRANSITIONS)) {
      for (const to of targets) {
        expect(canTransitionReview(from as ReviewState, to)).toBe(true);
      }
    }
  });

  it("rejects arbitrary and terminal review transitions", () => {
    expect(canTransitionReview("SUBMITTED", "REVIEW_DELIVERED")).toBe(false);
    expect(canTransitionReview("REVIEW_CONFIRMED", "REVIEW_IN_PROGRESS")).toBe(
      false,
    );
    expect(canTransitionReview("NOT_ACTIONABLE_YET", "SUBMITTED")).toBe(false);
  });
});

describe("opt-in workflow", () => {
  it("allows offer, acceptance, and decline", () => {
    expect(canTransitionOptIn("NOT_OFFERED", "OFFERED")).toBe(true);
    expect(canTransitionOptIn("OFFERED", "ACCEPTED")).toBe(true);
    expect(canTransitionOptIn("OFFERED", "DECLINED")).toBe(true);
  });

  it("rejects reopening and arbitrary transitions", () => {
    const terminalStates: OptInState[] = ["ACCEPTED", "DECLINED"];
    for (const state of terminalStates) {
      expect(OPT_IN_TRANSITIONS[state]).toEqual([]);
    }
    expect(canTransitionOptIn("NOT_OFFERED", "ACCEPTED")).toBe(false);
  });
});

describe("profile versioning", () => {
  it("starts deterministically at version one", () => {
    expect(nextProfileVersion(null, false)).toBe(1);
  });

  it("increments only after a correction request", () => {
    expect(nextProfileVersion(1, true)).toBe(2);
    expect(() => nextProfileVersion(1, false)).toThrow(
      "requires a correction request",
    );
  });

  it("does not permit delivered profile content to be overwritten", () => {
    expect(() => assertProfileContentMutable(null)).not.toThrow();
    expect(() =>
      assertProfileContentMutable("2026-09-14T12:00:00.000Z"),
    ).toThrow("immutable");
  });

  it("derives network state without persisting duplicate states", () => {
    expect(deriveTalentState("REVIEW_CONFIRMED", "NOT_OFFERED")).toBe(
      "EVIDENCE_REVIEW_COMPLETED_NO_OPTIN",
    );
    expect(deriveTalentState("REVIEW_CONFIRMED", "ACCEPTED")).toBe(
      "TALENT_PROFILE_ACTIVE",
    );
    expect(deriveTalentState("REVIEW_CONFIRMED", "DECLINED")).toBe(
      "EVIDENCE_REVIEW_COMPLETED_NO_OPTIN",
    );
    expect(deriveTalentState("REVIEW_DELIVERED", "ACCEPTED")).toBeNull();
    expect(deriveTalentState("REVIEW_CONFIRMED", "ACCEPTED", "2026-09-16T00:00:00Z")).toBe(
      "EVIDENCE_REVIEW_COMPLETED_NO_OPTIN",
    );
  });
});
