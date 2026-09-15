import type {
  EvidenceFinding,
  EvidenceProfile,
  EvidenceReviewSubmission,
  Json,
  Person,
} from "./database.types";
import {
  EVIDENCE_TYPES,
  OPPORTUNITY_STATUSES,
  PROFESSIONAL_INTENTS,
  type EvidenceType,
  type OpportunityStatus,
  type ProfessionalIntent,
} from "./domain";

type JsonObject = { [key: string]: Json | undefined };

export type ProfileRecommendation = {
  validationArea: string;
  rationale: string;
};

export type PrivateProfileView = {
  fullName: string;
  currentRole: string;
  country: string;
  reviewVersion: number;
  reviewedAt: string;
  confirmedAt: string | null;
  correctionRequestedAt: string | null;
  opportunityStatus: OpportunityStatus;
  workModes: ProfessionalIntent[];
  evidenceType: EvidenceType;
  evidenceUrl: string | null;
  individualContribution: string;
  professionalContext: string | null;
  findings: EvidenceFinding[];
  recommendations: ProfileRecommendation[];
};

function asObject(value: Json): JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonObject)
    : {};
}

function stringValue(value: Json | undefined, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function safeEvidenceUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 2_000) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export function buildPrivateProfileView(input: {
  profile: EvidenceProfile;
  submission: EvidenceReviewSubmission;
  person: Pick<Person, "full_name" | "current_role" | "country">;
  findings: EvidenceFinding[];
}): PrivateProfileView {
  const intent = asObject(input.profile.professional_intent_snapshot);
  const evidence = asObject(input.profile.evidence_context_snapshot);
  const rawModes = Array.isArray(intent.professional_intents)
    ? intent.professional_intents
    : [];
  const workModes = rawModes.filter(
    (mode): mode is ProfessionalIntent =>
      typeof mode === "string" &&
      PROFESSIONAL_INTENTS.includes(mode as ProfessionalIntent),
  );
  const rawOpportunity = stringValue(
    intent.opportunity_status,
    input.submission.opportunity_status,
  );
  const opportunityStatus = OPPORTUNITY_STATUSES.includes(
    rawOpportunity as OpportunityStatus,
  )
    ? (rawOpportunity as OpportunityStatus)
    : input.submission.opportunity_status;
  const rawEvidenceType = stringValue(
    evidence.evidence_type,
    input.submission.evidence_type,
  );
  const evidenceType = EVIDENCE_TYPES.includes(rawEvidenceType as EvidenceType)
    ? (rawEvidenceType as EvidenceType)
    : input.submission.evidence_type;
  const recommendations = Array.isArray(input.profile.recommendations)
    ? input.profile.recommendations.flatMap((item) => {
        const record = asObject(item);
        const validationArea = stringValue(record.validation_area).trim();
        const rationale = stringValue(record.rationale).trim();
        return validationArea && rationale
          ? [{ validationArea, rationale }]
          : [];
      })
    : [];

  return {
    fullName: stringValue(intent.full_name, input.person.full_name),
    currentRole: stringValue(intent.current_role, input.person.current_role),
    country: stringValue(intent.country, input.person.country),
    reviewVersion: input.profile.review_version,
    reviewedAt: input.profile.reviewed_at ?? input.profile.created_at,
    confirmedAt: input.profile.confirmed_at,
    correctionRequestedAt: input.profile.correction_requested_at,
    opportunityStatus,
    workModes,
    evidenceType,
    evidenceUrl: safeEvidenceUrl(evidence.evidence_url),
    individualContribution: stringValue(
      evidence.individual_contribution,
      input.submission.individual_contribution,
    ),
    professionalContext:
      stringValue(evidence.professional_context).trim() ||
      input.submission.professional_context,
    findings: [...input.findings].sort((a, b) => a.sort_order - b.sort_order),
    recommendations,
  };
}
