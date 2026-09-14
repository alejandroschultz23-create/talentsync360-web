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
} from "../database.types";
import type { FindingStatus, OptInState, ReviewState } from "../domain";
import type { ValidatedEvidenceReviewSubmission } from "../validation";
import { getDatabaseClient } from "./db";
import {
  generateAccessToken,
  hashAccessToken,
  isAccessTokenUsable,
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
      p_actor_reference: actorReference ?? null,
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
      p_actor_reference: actorReference ?? null,
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
        p_actor_reference: actorReference ?? null,
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
      p_actor_reference: actorReference ?? null,
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
      p_network_consent_version: consent?.version ?? null,
      p_network_consent_text: consent?.text ?? null,
      p_network_consent_at: consent?.acceptedAt ?? null,
    });
    if (result.error) {
      throw new EvidenceReviewRepositoryError(
        "transitioning talent opt-in",
        result.error,
      );
    }
    return result.data;
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
