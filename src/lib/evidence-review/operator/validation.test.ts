import { describe, expect, it } from "vitest";

import { parseOperatorArguments } from "./arguments";
import {
  coherenceInputSchema,
  publishProfileInputSchema,
  submissionIdSchema,
  workTimeInputSchema,
} from "./validation";

const dimensions = {
  RESPONSE_RELEVANCE: "CONFIRMED",
  PROFESSIONAL_INTENT_CLARITY: "PARTIAL",
  INDIVIDUAL_CONTRIBUTION_CLARITY: "CONFIRMED",
  EXPECTATION_CONSISTENCY: "UNKNOWN",
  EVIDENCE_READINESS: "CONFIRMED",
  FOLLOW_THROUGH: "NOT_APPLICABLE",
} as const;

describe("Phase C operator validation", () => {
  it("accepts categorical coherence without a numeric score", () => {
    const result = coherenceInputSchema.safeParse({
      actor_reference: "synthetic-operator",
      dimensions,
      operator_note: "Enough clear context exists for a manual evidence review.",
      decision: "READY_FOR_REVIEW",
    });
    expect(result.success).toBe(true);

    expect(
      coherenceInputSchema.safeParse({
        actor_reference: "synthetic-operator",
        dimensions: { ...dimensions, RESPONSE_RELEVANCE: 5 },
        operator_note: "Numeric values are forbidden.",
        decision: "READY_FOR_REVIEW",
      }).success,
    ).toBe(false);

    expect(
      coherenceInputSchema.safeParse({
        actor_reference: "synthetic-operator",
        dimensions,
        operator_note: "Scores are not part of the coherence gate.",
        decision: "READY_FOR_REVIEW",
        score: 100,
      }).success,
    ).toBe(false);
  });

  it("requires one concrete clarification only for clarification decisions", () => {
    expect(
      coherenceInputSchema.safeParse({
        actor_reference: "synthetic-operator",
        dimensions,
        operator_note: "One concrete distinction remains unclear.",
        decision: "CLARIFICATION_NEEDED",
      }).success,
    ).toBe(false);

    expect(
      coherenceInputSchema.safeParse({
        actor_reference: "synthetic-operator",
        dimensions,
        operator_note: "One concrete distinction remains unclear.",
        decision: "CLARIFICATION_NEEDED",
        clarification_required:
          "Please distinguish your contribution from the team outcome.",
      }).success,
    ).toBe(true);
  });

  it("accepts every finding status and keeps UNKNOWN neutral", () => {
    const result = publishProfileInputSchema.safeParse({
      actor_reference: "synthetic-operator",
      findings: [
        {
          finding_status: "SUPPORTED",
          capability: "System design",
          explanation: "The described decision is supported by the evidence.",
          sort_order: 0,
        },
        {
          finding_status: "PARTIAL",
          capability: "Testing approach",
          explanation: "Only part of the testing approach is visible.",
          sort_order: 1,
        },
        {
          finding_status: "UNKNOWN",
          capability: "Cloud depth",
          explanation:
            "Available evidence does not support a responsible conclusion; this is not a gap.",
          sort_order: 2,
        },
        {
          finding_status: "NEEDS_CLARIFICATION",
          capability: "Ownership boundary",
          explanation: "A specific ownership ambiguity prevents interpretation.",
          sort_order: 3,
        },
      ],
      recommendations: [
        {
          validation_area: "Architecture reasoning",
          rationale: "Validate one design tradeoff in a future conversation.",
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("validates bounded integer work time and rejects scores", () => {
    expect(
      workTimeInputSchema.safeParse({
        actor_reference: "synthetic-operator",
        category: "EVIDENCE_REVIEW",
        minutes: 25,
      }).success,
    ).toBe(true);
    expect(
      workTimeInputSchema.safeParse({
        actor_reference: "synthetic-operator",
        category: "EVIDENCE_REVIEW",
        minutes: 0,
      }).success,
    ).toBe(false);
    expect(
      workTimeInputSchema.safeParse({
        actor_reference: "synthetic-operator",
        category: "EVIDENCE_REVIEW",
        minutes: 481,
      }).success,
    ).toBe(false);
    expect(
      workTimeInputSchema.safeParse({
        actor_reference: "synthetic-operator",
        category: "EVIDENCE_REVIEW",
        minutes: 25,
        candidate_score: 9,
      }).success,
    ).toBe(false);
  });

  it("rejects invalid UUIDs and any force bypass", () => {
    expect(submissionIdSchema.safeParse("not-a-uuid").success).toBe(false);
    expect(() =>
      parseOperatorArguments([
        "start-review",
        "--submission",
        "00000000-0000-4000-8000-000000000001",
        "--actor",
        "operator",
        "--force",
        "true",
      ]),
    ).toThrow("Unsupported option");
  });
});
