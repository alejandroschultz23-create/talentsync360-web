import { describe, expect, it, vi } from "vitest";

import type {
  EvidenceProfile,
  EvidenceReviewSubmission,
} from "../database.types";
import type { ReviewState } from "../domain";
import {
  EvidenceReviewOperatorService,
  type EvidenceReviewOperatorRepository,
} from "./service";
import type { CoherenceInput, PublishProfileInput } from "./validation";

function submission(reviewState: ReviewState): EvidenceReviewSubmission {
  return {
    id: "00000000-0000-4000-8000-000000000001",
    review_state: reviewState,
    coherence_status: "PENDING",
  } as EvidenceReviewSubmission;
}

const coherenceInput: CoherenceInput = {
  actor_reference: "synthetic-operator",
  dimensions: {
    RESPONSE_RELEVANCE: "CONFIRMED",
    PROFESSIONAL_INTENT_CLARITY: "CONFIRMED",
    INDIVIDUAL_CONTRIBUTION_CLARITY: "CONFIRMED",
    EXPECTATION_CONSISTENCY: "UNKNOWN",
    EVIDENCE_READINESS: "CONFIRMED",
    FOLLOW_THROUGH: "NOT_APPLICABLE",
  },
  operator_note: "Synthetic coherence note.",
  decision: "READY_FOR_REVIEW",
};

const profileInput: PublishProfileInput = {
  actor_reference: "synthetic-operator",
  findings: [
    {
      finding_status: "UNKNOWN",
      capability: "Cloud depth",
      explanation: "Not enough evidence for a responsible conclusion; not a gap.",
      sort_order: 0,
    },
  ],
  recommendations: [],
};

function repository(
  reviewState: ReviewState,
): EvidenceReviewOperatorRepository {
  return {
    getSubmission: vi.fn().mockResolvedValue(submission(reviewState)),
    inspectSubmission: vi.fn(),
    listOperationalQueue: vi.fn(),
    recordCoherenceDecision: vi
      .fn()
      .mockResolvedValue(submission(coherenceInput.decision)),
    transitionReviewState: vi
      .fn()
      .mockResolvedValue(submission("REVIEW_IN_PROGRESS")),
    createProfileV1: vi.fn().mockResolvedValue({
      id: "00000000-0000-4000-8000-000000000002",
      submission_id: "00000000-0000-4000-8000-000000000001",
      review_version: 1,
      delivered_at: null,
    } as EvidenceProfile),
    recordWorkTime: vi.fn(),
  };
}

describe("EvidenceReviewOperatorService", () => {
  it.each([
    "READY_FOR_REVIEW",
    "CLARIFICATION_NEEDED",
    "NOT_ACTIONABLE_YET",
  ] as const)("records allowed SUBMITTED -> %s decisions", async (decision) => {
    const repo = repository("SUBMITTED");
    const service = new EvidenceReviewOperatorService(repo);
    const input: CoherenceInput = {
      ...coherenceInput,
      decision,
      clarification_required:
        decision === "CLARIFICATION_NEEDED"
          ? "Please clarify the individual contribution."
          : undefined,
    };

    await service.recordCoherence(submission("SUBMITTED").id, input);
    expect(repo.recordCoherenceDecision).toHaveBeenCalledWith(
      submission("SUBMITTED").id,
      input,
    );
  });

  it("rejects invalid coherence transitions and observed follow-through initially", async () => {
    const wrongStateService = new EvidenceReviewOperatorService(
      repository("REVIEW_IN_PROGRESS"),
    );
    await expect(
      wrongStateService.recordCoherence(
        submission("SUBMITTED").id,
        coherenceInput,
      ),
    ).rejects.toThrow("Invalid review transition");

    const initialService = new EvidenceReviewOperatorService(
      repository("SUBMITTED"),
    );
    await expect(
      initialService.recordCoherence(submission("SUBMITTED").id, {
        ...coherenceInput,
        dimensions: {
          ...coherenceInput.dimensions,
          FOLLOW_THROUGH: "CONFIRMED",
        },
      }),
    ).rejects.toThrow("NOT_APPLICABLE");
  });

  it("requires REVIEW_IN_PROGRESS for profile v1 and never invokes delivery", async () => {
    const wrongRepo = repository("READY_FOR_REVIEW");
    const wrongService = new EvidenceReviewOperatorService(wrongRepo);
    await expect(
      wrongService.publishProfile(submission("SUBMITTED").id, profileInput),
    ).rejects.toThrow("requires REVIEW_IN_PROGRESS");
    expect(wrongRepo.createProfileV1).not.toHaveBeenCalled();

    const readyRepo = repository("REVIEW_IN_PROGRESS");
    const readyService = new EvidenceReviewOperatorService(readyRepo);
    const profile = await readyService.publishProfile(
      submission("SUBMITTED").id,
      profileInput,
    );
    expect(profile.review_version).toBe(1);
    expect(profile.delivered_at).toBeNull();
    expect("deliverProfile" in readyRepo).toBe(false);
  });
});
