import { z } from "zod";

import {
  REVIEW_CONSENT_TEXT,
  REVIEW_CONSENT_VERSION,
  type EvidenceReviewLanguage,
} from "./consent";
import type { ValidatedEvidenceReviewSubmission } from "./validation";
import { evidenceReviewSubmissionSchema } from "./validation";

const fieldNameMap: Record<string, string> = {
  fullName: "full_name",
  currentRole: "current_role",
  evidenceType: "evidence_type",
  evidenceUrl: "evidence_url",
  individualContribution: "individual_contribution",
  professionalContext: "professional_context",
  opportunityStatus: "opportunity_status",
  professionalIntents: "professional_intents",
  reviewConsentVersion: "review_consent",
  reviewConsentText: "review_consent",
  reviewConsentAt: "review_consent",
};

export type ValidPublicSubmission = {
  submission: ValidatedEvidenceReviewSubmission;
  language: EvidenceReviewLanguage;
};

export type PublicSubmissionValidation =
  | { success: true; data: ValidPublicSubmission }
  | { success: false; errors: Record<string, string> };

export function validatePublicEvidenceReviewPayload(
  input: unknown,
  consentAt = new Date(),
): PublicSubmissionValidation {
  const recordResult = z.record(z.string(), z.unknown()).safeParse(input);
  if (!recordResult.success) {
    return { success: false, errors: { form: "Invalid request" } };
  }

  const inputRecord = recordResult.data;
  const language: EvidenceReviewLanguage =
    inputRecord.language === "es" ? "es" : "en";
  const errors: Record<string, string> = {};

  if (inputRecord.review_consent_accepted !== true) {
    errors.review_consent = "Review consent is required";
  }

  const result = evidenceReviewSubmissionSchema.safeParse({
    fullName: inputRecord.full_name,
    email: inputRecord.email,
    country: inputRecord.country,
    currentRole: inputRecord.current_role,
    evidenceType: inputRecord.evidence_type,
    evidenceUrl: inputRecord.evidence_url,
    individualContribution: inputRecord.individual_contribution,
    professionalContext: inputRecord.professional_context,
    opportunityStatus: inputRecord.opportunity_status,
    professionalIntents: inputRecord.professional_intents,
    source: inputRecord.source,
    campaign: inputRecord.campaign,
    reviewConsentVersion: REVIEW_CONSENT_VERSION,
    reviewConsentText: REVIEW_CONSENT_TEXT[language],
    reviewConsentAt: consentAt.toISOString(),
  });

  if (!result.success) {
    for (const issue of result.error.issues) {
      const phaseAName = String(issue.path[0] ?? "form");
      const publicName = fieldNameMap[phaseAName] ?? phaseAName;
      errors[publicName] ??= issue.message;
    }
  }

  if (Object.keys(errors).length > 0 || !result.success) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: { submission: result.data, language },
  };
}
