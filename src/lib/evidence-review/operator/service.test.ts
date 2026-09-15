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
    deliverProfileWithToken: vi.fn().mockResolvedValue({
      token: "a".repeat(43),
      record: {
        id: "00000000-0000-4000-8000-000000000003",
        profile_id: "00000000-0000-4000-8000-000000000002",
        token_hash: "hash",
        expires_at: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
        revoked_at: null,
        created_at: new Date().toISOString(),
        last_used_at: null,
      },
    }),
    reissueProfileAccess: vi.fn().mockResolvedValue({
      token: "b".repeat(43),
      record: {
        id: "00000000-0000-4000-8000-000000000004",
        profile_id: "00000000-0000-4000-8000-000000000002",
        token_hash: "hash2",
        expires_at: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
        revoked_at: null,
        created_at: new Date().toISOString(),
        last_used_at: null,
      },
    }),
    revokeProfileAccess: vi.fn().mockResolvedValue(1),
    createProfileRevision: vi.fn().mockResolvedValue({
      id: "00000000-0000-4000-8000-000000000005",
      submission_id: "00000000-0000-4000-8000-000000000001",
      review_version: 2,
      supersedes_profile_id: "00000000-0000-4000-8000-000000000002",
      reviewed_at: new Date().toISOString(),
      delivered_at: null,
    } as EvidenceProfile),
    recordProfileNotification: vi.fn().mockResolvedValue({
      id: "00000000-0000-4000-8000-000000000006",
      entity_type: "PROFILE",
      entity_id: "00000000-0000-4000-8000-000000000002",
      event_type: "PROFILE_NOTIFICATION_RECORDED",
      actor_reference: "operator-1",
      occurred_at: new Date().toISOString(),
      metadata: { status: "sent" },
    }),
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

  describe("Phase D operator commands", () => {
    it("delivers profile with token, attempts email, records notification, and returns transient url", async () => {
      const repo = repository("REVIEW_IN_PROGRESS");
      const mockInspection = {
        person: { email: "operator@example.test" },
        latestProfile: { review_version: 1 },
      };
      (repo.inspectSubmission as ReturnType<typeof vi.fn>).mockResolvedValue(mockInspection);
      const mockEmail = vi.fn().mockResolvedValue("sent");
      const service = new EvidenceReviewOperatorService(
        repo,
        "https://www.talentsync360.com",
        mockEmail,
      );

      const result = await service.deliverProfile({
        submissionId: submission("REVIEW_IN_PROGRESS").id,
        actorReference: "operator-1",
        expiresHours: 48,
      });

      expect(result.ok).toBe(true);
      expect(result.command).toBe("deliver-profile");
      expect(result.notification).toBe("sent");
      expect(result.access_url).toContain("/talents/evidence-review/access/");
      expect(mockEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "operator@example.test",
          language: "es",
        }),
      );
      expect(repo.recordProfileNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "sent",
          actorReference: "operator-1",
        }),
      );
    });

    it("delivers profile safely even when email fails (email failure does not roll back)", async () => {
      const repo = repository("REVIEW_IN_PROGRESS");
      (repo.inspectSubmission as ReturnType<typeof vi.fn>).mockResolvedValue({
        person: { email: "operator@example.test" },
        latestProfile: { review_version: 1 },
      });
      const mockEmail = vi.fn().mockRejectedValue(new Error("Email down"));
      const service = new EvidenceReviewOperatorService(
        repo,
        "https://www.talentsync360.com",
        mockEmail,
      );

      const result = await service.deliverProfile({
        submissionId: submission("REVIEW_IN_PROGRESS").id,
        actorReference: "operator-1",
      });

      expect(result.ok).toBe(true);
      expect(result.notification).toBe("failed");
      expect(result.access_url).toBeDefined();
      expect(repo.recordProfileNotification).toHaveBeenCalledWith(
        expect.objectContaining({ status: "failed" }),
      );
    });

    it("rejects deliverProfile if not in REVIEW_IN_PROGRESS", async () => {
      const repo = repository("READY_FOR_REVIEW");
      const service = new EvidenceReviewOperatorService(repo);
      await expect(
        service.deliverProfile({
          submissionId: submission("READY_FOR_REVIEW").id,
          actorReference: "operator-1",
        }),
      ).rejects.toThrow("requires REVIEW_IN_PROGRESS");
    });

    it("reissues access, returning newly generated transient url", async () => {
      const repo = repository("REVIEW_DELIVERED");
      const service = new EvidenceReviewOperatorService(repo);
      const result = await service.reissueAccess({
        submissionId: submission("REVIEW_DELIVERED").id,
        actorReference: "operator-1",
        expiresHours: 24,
      });

      expect(result.ok).toBe(true);
      expect(result.command).toBe("reissue-access");
      expect(result.access_url).toContain("/talents/evidence-review/access/");
      expect(repo.reissueProfileAccess).toHaveBeenCalled();
    });

    it("revokes access without altering profile content", async () => {
      const repo = repository("REVIEW_DELIVERED");
      const service = new EvidenceReviewOperatorService(repo);
      const result = await service.revokeAccess({
        submissionId: submission("REVIEW_DELIVERED").id,
        actorReference: "operator-1",
      });

      expect(result.ok).toBe(true);
      expect(result.command).toBe("revoke-access");
      expect(result.revoked_count).toBe(1);
      expect(repo.revokeProfileAccess).toHaveBeenCalledWith(
        submission("REVIEW_DELIVERED").id,
        "operator-1",
      );
    });

    it("revises profile: transitions CORRECTION_REQUESTED to REVIEW_IN_PROGRESS then creates revision v(N+1)", async () => {
      const repo = repository("CORRECTION_REQUESTED");
      const service = new EvidenceReviewOperatorService(repo);
      const profile = await service.reviseProfile(
        submission("CORRECTION_REQUESTED").id,
        profileInput,
      );

      expect(repo.transitionReviewState).toHaveBeenCalledWith(
        submission("CORRECTION_REQUESTED").id,
        "REVIEW_IN_PROGRESS",
        profileInput.actor_reference,
      );
      expect(repo.createProfileRevision).toHaveBeenCalledWith(
        submission("CORRECTION_REQUESTED").id,
        profileInput,
      );
      expect(profile.review_version).toBe(2);
      expect(profile.supersedes_profile_id).toBeDefined();
      expect(profile.delivered_at).toBeNull();
    });

    it("rejects reviseProfile if submission is not in CORRECTION_REQUESTED", async () => {
      const repo = repository("REVIEW_IN_PROGRESS");
      const service = new EvidenceReviewOperatorService(repo);
      await expect(
        service.reviseProfile(
          submission("REVIEW_IN_PROGRESS").id,
          profileInput,
        ),
      ).rejects.toThrow("requires CORRECTION_REQUESTED");
    });
  });
});
