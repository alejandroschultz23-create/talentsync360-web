import type {
  EvidenceProfile,
  EvidenceReviewSubmission,
  WorkflowEvent,
} from "../database.types";
import { assertReviewTransition } from "../workflow";
import type {
  OperatorQueueItem,
  OperatorSubmissionInspection,
} from "../server/repository";
import type {
  CoherenceInput,
  PublishProfileInput,
  WorkTimeInput,
} from "./validation";

export type EvidenceReviewOperatorRepository = {
  getSubmission(submissionId: string): Promise<EvidenceReviewSubmission>;
  inspectSubmission(
    submissionId: string,
  ): Promise<OperatorSubmissionInspection>;
  listOperationalQueue(limit?: number): Promise<OperatorQueueItem[]>;
  recordCoherenceDecision(
    submissionId: string,
    input: CoherenceInput,
  ): Promise<EvidenceReviewSubmission>;
  transitionReviewState(
    submissionId: string,
    toState: "REVIEW_IN_PROGRESS",
    actorReference?: string,
  ): Promise<EvidenceReviewSubmission>;
  createProfileV1(
    submissionId: string,
    input: PublishProfileInput,
  ): Promise<EvidenceProfile>;
  recordWorkTime(
    submissionId: string,
    input: WorkTimeInput,
  ): Promise<WorkflowEvent>;
};

export class EvidenceReviewOperatorService {
  constructor(private readonly repository: EvidenceReviewOperatorRepository) {}

  queue(limit?: number): Promise<OperatorQueueItem[]> {
    return this.repository.listOperationalQueue(limit);
  }

  inspect(submissionId: string): Promise<OperatorSubmissionInspection> {
    return this.repository.inspectSubmission(submissionId);
  }

  async recordCoherence(
    submissionId: string,
    input: CoherenceInput,
  ): Promise<EvidenceReviewSubmission> {
    const submission = await this.repository.getSubmission(submissionId);
    assertReviewTransition(submission.review_state, input.decision);

    if (
      submission.review_state === "SUBMITTED" &&
      input.dimensions.FOLLOW_THROUGH !== "NOT_APPLICABLE"
    ) {
      throw new Error(
        "FOLLOW_THROUGH must be NOT_APPLICABLE during initial coherence review",
      );
    }

    return this.repository.recordCoherenceDecision(submissionId, input);
  }

  async startReview(
    submissionId: string,
    actorReference: string,
  ): Promise<EvidenceReviewSubmission> {
    const submission = await this.repository.getSubmission(submissionId);
    assertReviewTransition(submission.review_state, "REVIEW_IN_PROGRESS");
    return this.repository.transitionReviewState(
      submissionId,
      "REVIEW_IN_PROGRESS",
      actorReference,
    );
  }

  async publishProfile(
    submissionId: string,
    input: PublishProfileInput,
  ): Promise<EvidenceProfile> {
    const submission = await this.repository.getSubmission(submissionId);
    if (submission.review_state !== "REVIEW_IN_PROGRESS") {
      throw new Error("Profile v1 requires REVIEW_IN_PROGRESS");
    }
    return this.repository.createProfileV1(submissionId, input);
  }

  async logTime(
    submissionId: string,
    input: WorkTimeInput,
  ): Promise<WorkflowEvent> {
    await this.repository.getSubmission(submissionId);
    return this.repository.recordWorkTime(submissionId, input);
  }
}

export function toSafeInspectionOutput(
  inspection: OperatorSubmissionInspection,
): Record<string, unknown> {
  const { submission, person, latestProfile, findings } = inspection;
  return {
    professional: {
      person_id: person.id,
      full_name: person.full_name,
      email: person.email,
      country: person.country,
      current_role: person.current_role,
    },
    professional_intent: {
      opportunity_status: submission.opportunity_status,
      work_modes: submission.professional_intents,
    },
    attribution: {
      source: submission.source,
      campaign: submission.campaign,
    },
    evidence: {
      evidence_type: submission.evidence_type,
      evidence_url: submission.evidence_url,
      individual_contribution: submission.individual_contribution,
      professional_context: submission.professional_context,
    },
    review: {
      submission_id: submission.id,
      review_state: submission.review_state,
      coherence_status: submission.coherence_status,
      coherence_details: submission.coherence_details,
      reviewer_reference: submission.reviewer_reference,
      coherence_reviewed_at: submission.coherence_reviewed_at,
    },
    latest_profile: latestProfile
      ? {
          profile_id: latestProfile.id,
          review_version: latestProfile.review_version,
          created_at: latestProfile.created_at,
          reviewed_at: latestProfile.reviewed_at,
          delivered_at: latestProfile.delivered_at,
          recommendations: latestProfile.recommendations,
          findings,
        }
      : null,
  };
}
