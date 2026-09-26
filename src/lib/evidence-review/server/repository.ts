import "server-only";

import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

import type {
  Database,
  EvidenceFinding,
  EvidenceProfile,
  EvidenceReviewSubmission,
  Json,
  Person,
  ProfileAccessToken,
  TalentOptIn,
  WorkflowEvent,
} from "../database.types";
import type { EvidenceReviewLanguage } from "../consent";
import type { FindingStatus, OptInState, ReviewState } from "../domain";
import {
  getNetworkOptInConsentText,
  NETWORK_OPT_IN_CONSENT_VERSION,
} from "../network-consent";
import type {
  CoherenceInput,
  PublishProfileInput,
  WorkTimeInput,
} from "../operator/validation";
import type { ValidatedEvidenceReviewSubmission } from "../validation";
import { getDatabaseClient } from "./db";
import {
  generateAccessToken,
  hashAccessToken,
  isAccessTokenUsable,
  isValidAccessTokenFormat,
} from "./tokens";

export class EvidenceReviewRepositoryError extends Error {
  readonly code: string | null;

  constructor(operation: string, error: PostgrestError) {
    super(`Evidence Review persistence failed during ${operation}`);
    this.name = "EvidenceReviewRepositoryError";
    this.code = error.code ?? null;
  }
}

type PersonIdentity = Pick<
  ValidatedEvidenceReviewSubmission,
  "fullName" | "email" | "country" | "currentRole"
>;

type FindingInput = {
  findingStatus: FindingStatus;
  capability: string;
  explanation: string;
  evidenceReference?: string;
  sortOrder: number;
};

type ProfileVersionInput = {
  submissionId: string;
  professionalIntentSnapshot: Json;
  evidenceContextSnapshot: Json;
  recommendations?: Json[];
};

type NetworkConsent = {
  version: string;
  text: string;
  acceptedAt: string;
};

export type OperatorSubmissionInspection = {
  submission: EvidenceReviewSubmission;
  person: Pick<
    Person,
    "id" | "full_name" | "email" | "country" | "current_role"
  >;
  latestProfile: EvidenceProfile | null;
  findings: EvidenceFinding[];
};

export type OperatorQueueItem = {
  submissionId: string;
  personId: string;
  fullName: string;
  email: string;
  country: string;
  currentRole: string;
  reviewState: ReviewState;
  coherenceStatus: EvidenceReviewSubmission["coherence_status"];
  evidenceType: EvidenceReviewSubmission["evidence_type"];
  source: EvidenceReviewSubmission["source"];
  campaign: string | null;
  createdAt: string;
  latestProfileVersion: number | null;
  latestProfileCreatedAt: string | null;
};

export type PrivateProfileAccess = {
  token: ProfileAccessToken;
  profile: EvidenceProfile;
  submission: EvidenceReviewSubmission;
  person: Pick<Person, "id" | "full_name" | "country" | "current_role">;
  findings: EvidenceFinding[];
};

export type IssuedPrivateAccess = {
  token: string;
  record: ProfileAccessToken;
};

export type PrivateOptInAccess = {
  access: PrivateProfileAccess;
  eligibility: "ELIGIBLE" | "NOT_CONFIRMED";
  optIn: TalentOptIn | null;
};

export class EvidenceReviewRepository {
  constructor(
    private readonly database: SupabaseClient<Database> = getDatabaseClient(),
  ) {}

  async findOrCreatePerson(identity: PersonIdentity): Promise<Person> {
    const normalizedEmail = identity.email.trim().toLowerCase();
    const existing = await this.database
      .from("people")
      .select("*")
      .eq("email_normalized", normalizedEmail)
      .maybeSingle();

    if (existing.error) {
      throw new EvidenceReviewRepositoryError("finding a person", existing.error);
    }
    if (existing.data) {
      return existing.data;
    }

    const created = await this.database
      .from("people")
      .insert({
        full_name: identity.fullName,
        email: normalizedEmail,
        country: identity.country,
        current_role: identity.currentRole,
      })
      .select("*")
      .single();

    if (!created.error) {
      return created.data;
    }

    if (created.error.code === "23505") {
      const raced = await this.database
        .from("people")
        .select("*")
        .eq("email_normalized", normalizedEmail)
        .single();
      if (!raced.error) {
        return raced.data;
      }
      throw new EvidenceReviewRepositoryError(
        "resolving a concurrent person creation",
        raced.error,
      );
    }

    throw new EvidenceReviewRepositoryError("creating a person", created.error);
  }

  async createSubmission(
    input: ValidatedEvidenceReviewSubmission,
  ): Promise<EvidenceReviewSubmission> {
    const person = await this.findOrCreatePerson(input);
    const result = await this.database
      .from("evidence_review_submissions")
      .insert({
        person_id: person.id,
        evidence_type: input.evidenceType,
        evidence_url: input.evidenceUrl ?? null,
        individual_contribution: input.individualContribution,
        professional_context: input.professionalContext ?? null,
        opportunity_status: input.opportunityStatus,
        professional_intents: input.professionalIntents,
        source: input.source,
        campaign: input.campaign,
        review_consent_version: input.reviewConsentVersion,
        review_consent_text: input.reviewConsentText,
        review_consent_at: input.reviewConsentAt,
      })
      .select("*")
      .single();

    if (result.error) {
      throw new EvidenceReviewRepositoryError("creating a submission", result.error);
    }
    return result.data;
  }

  async getSubmission(
    submissionId: string,
  ): Promise<EvidenceReviewSubmission> {
    const result = await this.database
      .from("evidence_review_submissions")
      .select("*")
      .eq("id", submissionId)
      .single();

    if (result.error) {
      throw new EvidenceReviewRepositoryError(
        "loading a submission",
        result.error,
      );
    }
    return result.data;
  }

  async inspectSubmission(
    submissionId: string,
  ): Promise<OperatorSubmissionInspection> {
    const submission = await this.getSubmission(submissionId);
    const personResult = await this.database
      .from("people")
      .select("id, full_name, email, country, current_role")
      .eq("id", submission.person_id)
      .single();

    if (personResult.error) {
      throw new EvidenceReviewRepositoryError(
        "loading submission identity",
        personResult.error,
      );
    }

    const latestProfile = await this.getLatestProfile(submissionId);
    let findings: EvidenceFinding[] = [];
    if (latestProfile) {
      const findingsResult = await this.database
        .from("evidence_findings")
        .select("*")
        .eq("profile_id", latestProfile.id)
        .order("sort_order", { ascending: true });
      if (findingsResult.error) {
        throw new EvidenceReviewRepositoryError(
          "loading profile findings",
          findingsResult.error,
        );
      }
      findings = findingsResult.data;
    }

    return {
      submission,
      person: personResult.data,
      latestProfile,
      findings,
    };
  }

  async listOperationalQueue(limit = 20): Promise<OperatorQueueItem[]> {
    const submissionsResult = await this.database
      .from("evidence_review_submissions")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(limit);

    if (submissionsResult.error) {
      throw new EvidenceReviewRepositoryError(
        "loading the operational queue",
        submissionsResult.error,
      );
    }

    return Promise.all(
      submissionsResult.data.map(async (submission) => {
        const [personResult, latestProfile] = await Promise.all([
          this.database
            .from("people")
            .select("id, full_name, email, country, current_role")
            .eq("id", submission.person_id)
            .single(),
          this.getLatestProfile(submission.id),
        ]);

        if (personResult.error) {
          throw new EvidenceReviewRepositoryError(
            "loading queue identity",
            personResult.error,
          );
        }

        return {
          submissionId: submission.id,
          personId: personResult.data.id,
          fullName: personResult.data.full_name,
          email: personResult.data.email,
          country: personResult.data.country,
          currentRole: personResult.data.current_role,
          reviewState: submission.review_state,
          coherenceStatus: submission.coherence_status,
          evidenceType: submission.evidence_type,
          source: submission.source,
          campaign: submission.campaign,
          createdAt: submission.created_at,
          latestProfileVersion: latestProfile?.review_version ?? null,
          latestProfileCreatedAt: latestProfile?.created_at ?? null,
        };
      }),
    );
  }

  async recordCoherenceDecision(
    submissionId: string,
    input: CoherenceInput,
  ): Promise<EvidenceReviewSubmission> {
    const result = await this.database.rpc(
      "record_evidence_review_coherence",
      {
        p_submission_id: submissionId,
        p_decision: input.decision,
        p_dimensions: input.dimensions as unknown as Json,
        p_operator_note: input.operator_note,
        p_actor_reference: input.actor_reference,
        ...(input.clarification_required === undefined
          ? {}
          : { p_clarification_required: input.clarification_required }),
      },
    );

    if (result.error) {
      throw new EvidenceReviewRepositoryError(
        "recording the coherence decision",
        result.error,
      );
    }
    return result.data;
  }

  async createProfileV1(
    submissionId: string,
    input: PublishProfileInput,
  ): Promise<EvidenceProfile> {
    const result = await this.database.rpc("create_evidence_profile_v1", {
      p_submission_id: submissionId,
      p_findings: input.findings as unknown as Json,
      p_recommendations: input.recommendations as unknown as Json,
      p_actor_reference: input.actor_reference,
    });

    if (result.error) {
      throw new EvidenceReviewRepositoryError(
        "creating internal profile v1",
        result.error,
      );
    }
    return result.data;
  }

  async createProfileRevision(
    submissionId: string,
    input: PublishProfileInput,
  ): Promise<EvidenceProfile> {
    const result = await this.database.rpc("create_evidence_profile_revision", {
      p_submission_id: submissionId,
      p_findings: input.findings as unknown as Json,
      p_recommendations: input.recommendations as unknown as Json,
      p_actor_reference: input.actor_reference,
    });
    if (result.error) {
      throw new EvidenceReviewRepositoryError(
        "creating an internal profile revision",
        result.error,
      );
    }
    return result.data;
  }

  async deliverProfileWithToken(input: {
    submissionId: string;
    expiresAt: Date;
    actorReference: string;
  }): Promise<IssuedPrivateAccess> {
    const token = generateAccessToken();
    const result = await this.database.rpc(
      "deliver_evidence_profile_with_token",
      {
        p_submission_id: input.submissionId,
        p_token_hash: hashAccessToken(token),
        p_expires_at: input.expiresAt.toISOString(),
        p_actor_reference: input.actorReference,
      },
    );
    if (result.error) {
      throw new EvidenceReviewRepositoryError(
        "delivering a profile with private access",
        result.error,
      );
    }
    return { token, record: result.data };
  }

  async reissueProfileAccess(input: {
    submissionId: string;
    expiresAt: Date;
    actorReference: string;
  }): Promise<IssuedPrivateAccess> {
    const token = generateAccessToken();
    const result = await this.database.rpc(
      "reissue_evidence_profile_access",
      {
        p_submission_id: input.submissionId,
        p_token_hash: hashAccessToken(token),
        p_expires_at: input.expiresAt.toISOString(),
        p_actor_reference: input.actorReference,
      },
    );
    if (result.error) {
      throw new EvidenceReviewRepositoryError(
        "reissuing private profile access",
        result.error,
      );
    }
    return { token, record: result.data };
  }

  async revokeProfileAccess(
    submissionId: string,
    actorReference: string,
  ): Promise<number> {
    const result = await this.database.rpc("revoke_evidence_profile_access", {
      p_submission_id: submissionId,
      p_actor_reference: actorReference,
    });
    if (result.error) {
      throw new EvidenceReviewRepositoryError(
        "revoking private profile access",
        result.error,
      );
    }
    return result.data;
  }

  async recordProfileNotification(input: {
    profileId: string;
    status: "sent" | "skipped" | "failed";
    actorReference: string;
  }): Promise<WorkflowEvent> {
    const result = await this.database.rpc(
      "record_evidence_profile_notification",
      {
        p_profile_id: input.profileId,
        p_status: input.status,
        p_actor_reference: input.actorReference,
      },
    );
    if (result.error) {
      throw new EvidenceReviewRepositoryError(
        "recording profile notification outcome",
        result.error,
      );
    }
    return result.data;
  }

  async resolvePrivateProfileAccess(
    token: unknown,
    now = new Date(),
    touch = true,
  ): Promise<PrivateProfileAccess | null> {
    if (!isValidAccessTokenFormat(token)) return null;

    const tokenResult = await this.database
      .from("profile_access_tokens")
      .select("*")
      .eq("token_hash", hashAccessToken(token))
      .maybeSingle();
    if (tokenResult.error) {
      throw new EvidenceReviewRepositoryError(
        "resolving private profile access",
        tokenResult.error,
      );
    }
    if (
      !tokenResult.data ||
      !isAccessTokenUsable(
        {
          expiresAt: tokenResult.data.expires_at,
          revokedAt: tokenResult.data.revoked_at,
        },
        now,
      )
    ) {
      return null;
    }

    const profileResult = await this.database
      .from("evidence_profiles")
      .select("*")
      .eq("id", tokenResult.data.profile_id)
      .maybeSingle();
    if (profileResult.error) {
      throw new EvidenceReviewRepositoryError(
        "loading the private profile",
        profileResult.error,
      );
    }
    const profile = profileResult.data;
    if (!profile?.delivered_at) return null;

    const [submissionResult, personResult, findingsResult] = await Promise.all([
      this.database
        .from("evidence_review_submissions")
        .select("*")
        .eq("id", profile.submission_id)
        .maybeSingle(),
      this.database
        .from("people")
        .select("id, full_name, country, current_role")
        .eq("id", profile.person_id)
        .maybeSingle(),
      this.database
        .from("evidence_findings")
        .select("*")
        .eq("profile_id", profile.id)
        .order("sort_order", { ascending: true }),
    ]);
    if (submissionResult.error || personResult.error || findingsResult.error) {
      throw new EvidenceReviewRepositoryError(
        "loading private profile relationships",
        submissionResult.error ?? personResult.error ?? findingsResult.error!,
      );
    }
    if (
      !submissionResult.data ||
      !personResult.data ||
      submissionResult.data.person_id !== profile.person_id ||
      personResult.data.id !== profile.person_id
    ) {
      return null;
    }

    let tokenRecord = tokenResult.data;
    if (touch) {
      const touched = await this.database
        .from("profile_access_tokens")
        .update({ last_used_at: now.toISOString() })
        .eq("id", tokenRecord.id)
        .is("revoked_at", null)
        .gt("expires_at", now.toISOString())
        .select("*")
        .maybeSingle();
      if (touched.error) {
        throw new EvidenceReviewRepositoryError(
          "recording private profile access",
          touched.error,
        );
      }
      if (!touched.data) return null;
      tokenRecord = touched.data;
    }

    return {
      token: tokenRecord,
      profile,
      submission: submissionResult.data,
      person: personResult.data,
      findings: findingsResult.data,
    };
  }

  async confirmPrivateProfile(token: string): Promise<EvidenceProfile> {
    const result = await this.database.rpc(
      "confirm_evidence_profile_by_token",
      { p_token_hash: hashAccessToken(token) },
    );
    if (result.error) {
      throw new EvidenceReviewRepositoryError(
        "confirming a private profile",
        result.error,
      );
    }
    return result.data;
  }

  async requestPrivateProfileCorrection(
    token: string,
    correctionMessage: string,
  ): Promise<EvidenceProfile> {
    const result = await this.database.rpc(
      "request_evidence_profile_correction_by_token",
      {
        p_token_hash: hashAccessToken(token),
        p_correction_message: correctionMessage,
      },
    );
    if (result.error) {
      throw new EvidenceReviewRepositoryError(
        "requesting a private profile correction",
        result.error,
      );
    }
    return result.data;
  }

  async recordWorkTime(
    submissionId: string,
    input: WorkTimeInput,
  ): Promise<WorkflowEvent> {
    const result = await this.database.rpc(
      "record_evidence_review_work_time",
      {
        p_submission_id: submissionId,
        p_category: input.category,
        p_minutes: input.minutes,
        p_actor_reference: input.actor_reference,
        p_occurred_at: input.occurred_at,
      },
    );

    if (result.error) {
      throw new EvidenceReviewRepositoryError(
        "recording Evidence Review work time",
        result.error,
      );
    }
    return result.data;
  }

  async recordCoherenceReview(input: {
    submissionId: string;
    status: "READY" | "CLARIFICATION_NEEDED" | "NOT_ACTIONABLE_YET";
    details?: Json;
    reviewerReference?: string;
  }): Promise<EvidenceReviewSubmission> {
    const result = await this.database
      .from("evidence_review_submissions")
      .update({
        coherence_status: input.status,
        coherence_details: input.details ?? {},
        coherence_reviewed_at: new Date().toISOString(),
        reviewer_reference: input.reviewerReference ?? null,
      })
      .eq("id", input.submissionId)
      .select("*")
      .single();

    if (result.error) {
      throw new EvidenceReviewRepositoryError(
        "recording a coherence review",
        result.error,
      );
    }
    return result.data;
  }

  async transitionReviewState(
    submissionId: string,
    toState: ReviewState,
    actorReference?: string,
  ): Promise<EvidenceReviewSubmission> {
    const result = await this.database.rpc("transition_review_state", {
      p_submission_id: submissionId,
      p_to_state: toState,
      ...(actorReference === undefined
        ? {}
        : { p_actor_reference: actorReference }),
    });

    if (result.error) {
      throw new EvidenceReviewRepositoryError(
        "transitioning review state",
        result.error,
      );
    }
    return result.data;
  }

  async createProfileVersion(
    input: ProfileVersionInput,
  ): Promise<EvidenceProfile> {
    const result = await this.database.rpc("create_evidence_profile_version", {
      p_submission_id: input.submissionId,
      p_professional_intent_snapshot: input.professionalIntentSnapshot,
      p_evidence_context_snapshot: input.evidenceContextSnapshot,
      p_recommendations: input.recommendations ?? [],
    });

    if (result.error) {
      throw new EvidenceReviewRepositoryError(
        "creating a profile version",
        result.error,
      );
    }
    return result.data;
  }

  async addFinding(
    profileId: string,
    input: FindingInput,
  ): Promise<EvidenceFinding> {
    const result = await this.database
      .from("evidence_findings")
      .insert({
        profile_id: profileId,
        finding_status: input.findingStatus,
        capability: input.capability,
        explanation: input.explanation,
        evidence_reference: input.evidenceReference ?? null,
        sort_order: input.sortOrder,
      })
      .select("*")
      .single();

    if (result.error) {
      throw new EvidenceReviewRepositoryError("adding a finding", result.error);
    }
    return result.data;
  }

  async getLatestProfile(submissionId: string): Promise<EvidenceProfile | null> {
    const result = await this.database
      .from("evidence_profiles")
      .select("*")
      .eq("submission_id", submissionId)
      .order("review_version", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (result.error) {
      throw new EvidenceReviewRepositoryError(
        "resolving the latest profile",
        result.error,
      );
    }
    return result.data;
  }

  async deliverProfile(
    profileId: string,
    actorReference?: string,
  ): Promise<EvidenceProfile> {
    const result = await this.database.rpc("deliver_evidence_profile", {
      p_profile_id: profileId,
      ...(actorReference === undefined
        ? {}
        : { p_actor_reference: actorReference }),
    });
    if (result.error) {
      throw new EvidenceReviewRepositoryError("delivering a profile", result.error);
    }
    return result.data;
  }

  async requestCorrection(
    profileId: string,
    correctionMessage: string,
    actorReference?: string,
  ): Promise<EvidenceProfile> {
    const result = await this.database.rpc(
      "request_evidence_profile_correction",
      {
        p_profile_id: profileId,
        p_correction_message: correctionMessage,
        ...(actorReference === undefined
          ? {}
          : { p_actor_reference: actorReference }),
      },
    );
    if (result.error) {
      throw new EvidenceReviewRepositoryError(
        "requesting a profile correction",
        result.error,
      );
    }
    return result.data;
  }

  async confirmProfile(
    profileId: string,
    actorReference?: string,
  ): Promise<EvidenceProfile> {
    const result = await this.database.rpc("confirm_evidence_profile", {
      p_profile_id: profileId,
      ...(actorReference === undefined
        ? {}
        : { p_actor_reference: actorReference }),
    });
    if (result.error) {
      throw new EvidenceReviewRepositoryError("confirming a profile", result.error);
    }
    return result.data;
  }

  async createTalentOptIn(
    personId: string,
    profileId: string,
  ): Promise<TalentOptIn> {
    const result = await this.database
      .from("talent_opt_ins")
      .insert({ person_id: personId, profile_id: profileId })
      .select("*")
      .single();
    if (result.error) {
      throw new EvidenceReviewRepositoryError("creating a talent opt-in", result.error);
    }
    return result.data;
  }

  async transitionTalentOptIn(
    optInId: string,
    toState: OptInState,
    consent?: NetworkConsent,
  ): Promise<TalentOptIn> {
    const result = await this.database.rpc("transition_talent_opt_in", {
      p_opt_in_id: optInId,
      p_to_state: toState,
      ...(consent
        ? {
            p_network_consent_version: consent.version,
            p_network_consent_text: consent.text,
            p_network_consent_at: consent.acceptedAt,
          }
        : {}),
    });
    if (result.error) {
      throw new EvidenceReviewRepositoryError(
        "transitioning talent opt-in",
        result.error,
      );
    }
    return result.data;
  }

  async getTalentOptIn(profileId: string): Promise<TalentOptIn | null> {
    const result = await this.database
      .from("talent_opt_ins")
      .select("*")
      .eq("profile_id", profileId)
      .is("withdrawn_at", null)
      .maybeSingle();
    if (result.error) {
      throw new EvidenceReviewRepositoryError(
        "fetching talent opt-in",
        result.error,
      );
    }
    return result.data;
  }

  async ensureTalentOptInOffered(
    personId: string,
    profileId: string,
  ): Promise<TalentOptIn> {
    let existing = await this.getTalentOptIn(profileId);
    if (!existing) {
      try {
        existing = await this.createTalentOptIn(personId, profileId);
      } catch (error) {
        if (
          !(error instanceof EvidenceReviewRepositoryError) ||
          error.code !== "23505"
        ) {
          throw error;
        }

        existing = await this.getTalentOptIn(profileId);
        if (!existing) throw error;
      }
    }
    if (existing.opt_in_status === "NOT_OFFERED") {
      return this.transitionTalentOptIn(existing.id, "OFFERED");
    }
    return existing;
  }

  async resolvePrivateOptInAccess(
    token: unknown,
    now = new Date(),
  ): Promise<PrivateOptInAccess | null> {
    const access = await this.resolvePrivateProfileAccess(token, now, false);
    if (!access) return null;

    if (
      access.submission.review_state !== "REVIEW_CONFIRMED" ||
      !access.profile.confirmed_at
    ) {
      return {
        access,
        eligibility: "NOT_CONFIRMED",
        optIn: null,
      };
    }

    const optIn = await this.getTalentOptIn(access.profile.id);
    return {
      access,
      eligibility: "ELIGIBLE",
      optIn,
    };
  }

  async offerTalentOptIn(
    token: unknown,
    now = new Date(),
  ): Promise<TalentOptIn> {
    const access = await this.resolvePrivateProfileAccess(token, now);
    if (!access) {
      throw new Error("Invalid private access");
    }
    if (
      access.submission.review_state !== "REVIEW_CONFIRMED" ||
      !access.profile.confirmed_at
    ) {
      throw new Error("Profile must be confirmed to offer talent opt-in");
    }
    return this.ensureTalentOptInOffered(access.person.id, access.profile.id);
  }

  async acceptTalentOptIn(
    token: unknown,
    language: EvidenceReviewLanguage = "es",
    now = new Date(),
  ): Promise<TalentOptIn> {
    const access = await this.resolvePrivateProfileAccess(token, now);
    if (!access) {
      throw new Error("Invalid private access");
    }
    if (
      access.submission.review_state !== "REVIEW_CONFIRMED" ||
      !access.profile.confirmed_at
    ) {
      throw new Error("Profile must be confirmed to accept talent opt-in");
    }

    const optIn = await this.getTalentOptIn(access.profile.id);
    if (!optIn || optIn.opt_in_status !== "OFFERED") {
      throw new Error("Talent opt-in must be OFFERED before it can be ACCEPTED");
    }

    const consentText = getNetworkOptInConsentText(language);
    return this.transitionTalentOptIn(optIn.id, "ACCEPTED", {
      version: NETWORK_OPT_IN_CONSENT_VERSION,
      text: consentText,
      acceptedAt: now.toISOString(),
    });
  }

  async declineTalentOptIn(
    token: unknown,
    now = new Date(),
  ): Promise<TalentOptIn> {
    const access = await this.resolvePrivateProfileAccess(token, now);
    if (!access) {
      throw new Error("Invalid private access");
    }
    if (
      access.submission.review_state !== "REVIEW_CONFIRMED" ||
      !access.profile.confirmed_at
    ) {
      throw new Error("Profile must be confirmed to decline talent opt-in");
    }

    const optIn = await this.getTalentOptIn(access.profile.id);
    if (!optIn || optIn.opt_in_status !== "OFFERED") {
      throw new Error("Talent opt-in must be OFFERED before it can be DECLINED");
    }

    return this.transitionTalentOptIn(optIn.id, "DECLINED");
  }

  async issueProfileAccessToken(
    profileId: string,
    expiresAt: Date,
  ): Promise<{ token: string; record: ProfileAccessToken }> {
    if (expiresAt.getTime() <= Date.now()) {
      throw new Error("Access token expiry must be in the future");
    }

    const token = generateAccessToken();
    const result = await this.database
      .from("profile_access_tokens")
      .insert({
        profile_id: profileId,
        token_hash: hashAccessToken(token),
        expires_at: expiresAt.toISOString(),
      })
      .select("*")
      .single();
    if (result.error) {
      throw new EvidenceReviewRepositoryError(
        "issuing a profile access token",
        result.error,
      );
    }
    return { token, record: result.data };
  }

  async resolveProfileAccessToken(
    token: string,
    now = new Date(),
  ): Promise<ProfileAccessToken | null> {
    const result = await this.database
      .from("profile_access_tokens")
      .select("*")
      .eq("token_hash", hashAccessToken(token))
      .maybeSingle();
    if (result.error) {
      throw new EvidenceReviewRepositoryError(
        "resolving a profile access token",
        result.error,
      );
    }
    if (!result.data || !isAccessTokenUsable(
      { expiresAt: result.data.expires_at, revokedAt: result.data.revoked_at },
      now,
    )) {
      return null;
    }

    const touched = await this.database
      .from("profile_access_tokens")
      .update({ last_used_at: now.toISOString() })
      .eq("id", result.data.id)
      .select("*")
      .single();
    if (touched.error) {
      throw new EvidenceReviewRepositoryError(
        "recording profile token use",
        touched.error,
      );
    }
    return touched.data;
  }

  async revokeProfileAccessToken(
    tokenId: string,
    revokedAt = new Date(),
  ): Promise<ProfileAccessToken> {
    const result = await this.database
      .from("profile_access_tokens")
      .update({ revoked_at: revokedAt.toISOString() })
      .eq("id", tokenId)
      .is("revoked_at", null)
      .select("*")
      .single();
    if (result.error) {
      throw new EvidenceReviewRepositoryError(
        "revoking a profile access token",
        result.error,
      );
    }
    return result.data;
  }
}
