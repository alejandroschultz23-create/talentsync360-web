import "server-only";

import { callH3Pilot } from "./client";
import type { H3PilotCaller } from "./pilot-submission";

/**
 * H3 OPERATOR REVIEW SEAM (owner decision V1_187A).
 *
 * Explicit boundary: these are canonical H3 OPERATOR/REVIEW actions. They are
 * NOT participant operations and MUST NOT be reachable from any participant
 * route/UI. Product must never fabricate SUPPORTED/PARTIAL/CONTRADICTED/UNKNOWN,
 * coherence assessments, or review completion.
 *
 * The synthetic harness below exists ONLY so an E2E can drive the review to a
 * draft before a real operator UX exists. It refuses to run without an explicit
 * synthetic flag and uses synthetic identifiers. It is never invoked by the
 * participant submission orchestrator.
 */
export const OPERATOR_REVIEW_OPERATIONS = [
  "createClaim",
  "linkClaimEvidence",
  "changeClaimStatus",
  "submitCoherenceAssessment",
  "completeEvidenceReview",
  "generateProfessionalProfileDraft",
] as const;
export type OperatorReviewOperation = (typeof OPERATOR_REVIEW_OPERATIONS)[number];

export interface SyntheticReviewInput {
  readonly evidenceReviewId: string;
  readonly evidenceArtifactId: string;
  readonly changedBy: string;
  readonly claimType?: string;
}

export interface SyntheticReviewResult {
  readonly claimId: string;
  readonly draftId: string;
}

export interface OperatorReviewPort {
  progressToDraft(input: SyntheticReviewInput): Promise<{ ok: true; result: SyntheticReviewResult } | { ok: false; code: string; stage: string }>;
}

export interface SyntheticOperatorReviewDependencies {
  /** Must be literally `true`; guards against accidental production use. */
  readonly synthetic: true;
  readonly client?: H3PilotCaller;
}

function readId(value: unknown, keys: readonly string[]): string | null {
  if (value === null || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  for (const key of keys) {
    const candidate = record[key];
    if (typeof candidate === "string" && candidate.length > 0) return candidate;
  }
  return null;
}

const SYNTHETIC_SOURCE = "synthetic-operator-harness";

export function createSyntheticOperatorReviewHarness(
  dependencies: SyntheticOperatorReviewDependencies,
): OperatorReviewPort {
  if (dependencies.synthetic !== true) {
    throw new Error("SYNTHETIC_OPERATOR_HARNESS_REQUIRES_SYNTHETIC_FLAG");
  }
  const client: H3PilotCaller = dependencies.client ?? ((operation, payload) => callH3Pilot(operation, payload));

  return {
    async progressToDraft(input: SyntheticReviewInput) {
      const claim = await client("createClaim", {
        evidenceReviewId: input.evidenceReviewId,
        claimType: input.claimType ?? "OTHER",
        professionalNotes: "synthetic",
      });
      if (!claim.ok) return { ok: false, code: claim.code, stage: "createClaim" };
      const claimId = readId(claim.value, ["claimId"]) ??
        readId((claim.value as Record<string, unknown> | undefined)?.claim, ["claimId"]);
      if (claimId === null) return { ok: false, code: "CLAIM_ID_MISSING", stage: "createClaim" };

      const link = await client("linkClaimEvidence", {
        evidenceReviewId: input.evidenceReviewId,
        claimId,
        evidenceArtifactId: input.evidenceArtifactId,
        status: "ACCEPTED",
      });
      if (!link.ok) return { ok: false, code: link.code, stage: "linkClaimEvidence" };

      const status = await client("changeClaimStatus", {
        evidenceReviewId: input.evidenceReviewId,
        claimId,
        newStatus: "SUPPORTED",
        changedBy: input.changedBy,
        reason: SYNTHETIC_SOURCE,
      });
      if (!status.ok) return { ok: false, code: status.code, stage: "changeClaimStatus" };

      const coherence = await client("submitCoherenceAssessment", {
        evidenceReviewId: input.evidenceReviewId,
        assessmentResult: "READY_FOR_REVIEW",
        source: SYNTHETIC_SOURCE,
      });
      if (!coherence.ok) return { ok: false, code: coherence.code, stage: "submitCoherenceAssessment" };

      const complete = await client("completeEvidenceReview", {
        evidenceReviewId: input.evidenceReviewId,
        changedBy: input.changedBy,
        reason: SYNTHETIC_SOURCE,
      });
      if (!complete.ok) return { ok: false, code: complete.code, stage: "completeEvidenceReview" };

      const draft = await client("generateProfessionalProfileDraft", { evidenceReviewId: input.evidenceReviewId });
      if (!draft.ok) return { ok: false, code: draft.code, stage: "generateProfessionalProfileDraft" };
      const draftId = readId(draft.value, ["professionalProfileDraftId"]) ??
        readId((draft.value as Record<string, unknown> | undefined)?.draft, ["professionalProfileDraftId"]);
      if (draftId === null) return { ok: false, code: "DRAFT_ID_MISSING", stage: "generateProfessionalProfileDraft" };

      return { ok: true, result: { claimId, draftId } };
    },
  };
}
