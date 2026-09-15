import type {
  EvidenceProfile,
  EvidenceReviewSubmission,
  WorkflowEvent,
} from "../database.types";
import { assertReviewTransition } from "../workflow";
import { sendEvidenceProfileReadyEmail } from "../server/notifications";
import { buildPrivateAccessUrl } from "../server/tokens";
import type {
  IssuedPrivateAccess,
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
  deliverProfileWithToken(input: {
    submissionId: string;
    expiresAt: Date;
    actorReference: string;
  }): Promise<IssuedPrivateAccess>;
  reissueProfileAccess(input: {
    submissionId: string;
    expiresAt: Date;
    actorReference: string;
  }): Promise<IssuedPrivateAccess>;
  revokeProfileAccess(
    submissionId: string,
    actorReference: string,
  ): Promise<number>;
  createProfileRevision(
    submissionId: string,
    input: PublishProfileInput,
  ): Promise<EvidenceProfile>;
  recordProfileNotification(input: {
    profileId: string;
    status: "sent" | "skipped" | "failed";
    actorReference: string;
  }): Promise<WorkflowEvent>;
};

export type DeliverProfileOutput = {
  ok: true;
  command: "deliver-profile";
  submission_id: string;
  profile_id: string;
  review_version: number;
  expires_at: string;
  notification: "sent" | "skipped" | "failed";
  access_url: string;
  warning: string;
};

export type ReissueAccessOutput = {
  ok: true;
  command: "reissue-access";
  submission_id: string;
  profile_id: string;
  expires_at: string;
  access_url: string;
  warning: string;
};

export type RevokeAccessOutput = {
  ok: true;
  command: "revoke-access";
  submission_id: string;
  revoked_count: number;
};

export class EvidenceReviewOperatorService {
  constructor(
    private readonly repository: EvidenceReviewOperatorRepository,
    private readonly siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL || "https://www.talentsync360.com",
    private readonly sendNotification = sendEvidenceProfileReadyEmail,
  ) {}

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

  async deliverProfile(input: {
    submissionId: string;
    actorReference: string;
    expiresHours?: number;
    now?: Date;
  }): Promise<DeliverProfileOutput> {
    const submission = await this.repository.getSubmission(input.submissionId);
    if (submission.review_state !== "REVIEW_IN_PROGRESS") {
      throw new Error("Profile delivery requires REVIEW_IN_PROGRESS");
    }

    const now = input.now ?? new Date();
    const hours = input.expiresHours ?? 72;
    const expiresAt = new Date(now.getTime() + hours * 3600 * 1000);

    const { token, record } = await this.repository.deliverProfileWithToken({
      submissionId: input.submissionId,
      expiresAt,
      actorReference: input.actorReference,
    });

    const accessUrl = buildPrivateAccessUrl(this.siteUrl, token);

    let notificationStatus: "sent" | "skipped" | "failed" = "skipped";
    try {
      const inspection = await this.repository.inspectSubmission(input.submissionId);
      notificationStatus = await this.sendNotification({
        email: inspection.person.email,
        language: "es",
        accessUrl,
      });
    } catch {
      notificationStatus = "failed";
    }

    await this.repository.recordProfileNotification({
      profileId: record.profile_id,
      status: notificationStatus,
      actorReference: input.actorReference,
    });

    const inspection = await this.repository.inspectSubmission(input.submissionId);
    const reviewVersion = inspection.latestProfile?.review_version ?? 1;

    return {
      ok: true,
      command: "deliver-profile",
      submission_id: input.submissionId,
      profile_id: record.profile_id,
      review_version: reviewVersion,
      expires_at: record.expires_at,
      notification: notificationStatus,
      access_url: accessUrl,
      warning: "Sensitive: transient private access URL. Do not persist, log or forward.",
    };
  }

  async reissueAccess(input: {
    submissionId: string;
    actorReference: string;
    expiresHours?: number;
    now?: Date;
  }): Promise<ReissueAccessOutput> {
    await this.repository.getSubmission(input.submissionId);
    const now = input.now ?? new Date();
    const hours = input.expiresHours ?? 72;
    const expiresAt = new Date(now.getTime() + hours * 3600 * 1000);

    const { token, record } = await this.repository.reissueProfileAccess({
      submissionId: input.submissionId,
      expiresAt,
      actorReference: input.actorReference,
    });

    const accessUrl = buildPrivateAccessUrl(this.siteUrl, token);

    return {
      ok: true,
      command: "reissue-access",
      submission_id: input.submissionId,
      profile_id: record.profile_id,
      expires_at: record.expires_at,
      access_url: accessUrl,
      warning: "Sensitive: transient private access URL. Do not persist, log or forward.",
    };
  }

  async revokeAccess(input: {
    submissionId: string;
    actorReference: string;
  }): Promise<RevokeAccessOutput> {
    await this.repository.getSubmission(input.submissionId);
    const revokedCount = await this.repository.revokeProfileAccess(
      input.submissionId,
      input.actorReference,
    );

    return {
      ok: true,
      command: "revoke-access",
      submission_id: input.submissionId,
      revoked_count: revokedCount,
    };
  }

  async reviseProfile(
    submissionId: string,
    input: PublishProfileInput,
  ): Promise<EvidenceProfile> {
    const submission = await this.repository.getSubmission(submissionId);
    if (submission.review_state !== "CORRECTION_REQUESTED") {
      throw new Error("Profile revision requires CORRECTION_REQUESTED");
    }

    assertReviewTransition(submission.review_state, "REVIEW_IN_PROGRESS");
    await this.repository.transitionReviewState(
      submissionId,
      "REVIEW_IN_PROGRESS",
      input.actor_reference,
    );

    return this.repository.createProfileRevision(submissionId, input);
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
