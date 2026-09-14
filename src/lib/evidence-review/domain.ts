export const REVIEW_STATES = [
  "SUBMITTED",
  "CLARIFICATION_NEEDED",
  "NOT_ACTIONABLE_YET",
  "READY_FOR_REVIEW",
  "REVIEW_IN_PROGRESS",
  "REVIEW_DELIVERED",
  "CORRECTION_REQUESTED",
  "REVIEW_CONFIRMED",
] as const;

export type ReviewState = (typeof REVIEW_STATES)[number];

export const OPT_IN_STATES = [
  "NOT_OFFERED",
  "OFFERED",
  "ACCEPTED",
  "DECLINED",
] as const;

export type OptInState = (typeof OPT_IN_STATES)[number];

export const FINDING_STATUSES = [
  "SUPPORTED",
  "PARTIAL",
  "UNKNOWN",
  "NEEDS_CLARIFICATION",
] as const;

export type FindingStatus = (typeof FINDING_STATUSES)[number];

export const EVIDENCE_TYPES = [
  "PUBLIC_REPOSITORY",
  "PERSONAL_PROJECT",
  "PROFESSIONAL_PROJECT",
  "OPEN_SOURCE_CONTRIBUTION",
  "TECHNICAL_ARTIFACT",
  "PRIVATE_PROFESSIONAL_EXPERIENCE",
  "OTHER",
] as const;

export type EvidenceType = (typeof EVIDENCE_TYPES)[number];

export const OPPORTUNITY_STATUSES = [
  "OPEN",
  "REVIEW_ONLY",
  "NOT_LOOKING",
] as const;

export type OpportunityStatus = (typeof OPPORTUNITY_STATUSES)[number];

export const PROFESSIONAL_INTENTS = [
  "FULL_TIME",
  "FREELANCE",
  "CONTRACT",
  "PART_TIME",
] as const;

export type ProfessionalIntent = (typeof PROFESSIONAL_INTENTS)[number];

export const ATTRIBUTION_SOURCES = [
  "linkedin_manual_discovery",
  "pyar",
  "python_colombia",
  "linkedin_organic",
  "referral",
  "direct",
  "github_discovery",
  "huggingface_discovery",
] as const;

export type AttributionSource = (typeof ATTRIBUTION_SOURCES)[number];

export const COHERENCE_STATUSES = [
  "PENDING",
  "READY",
  "CLARIFICATION_NEEDED",
  "NOT_ACTIONABLE_YET",
] as const;

export type CoherenceStatus = (typeof COHERENCE_STATUSES)[number];

export const WORKFLOW_ENTITY_TYPES = [
  "PERSON",
  "SUBMISSION",
  "PROFILE",
  "OPT_IN",
  "ACCESS_TOKEN",
] as const;

export type WorkflowEntityType = (typeof WORKFLOW_ENTITY_TYPES)[number];

export const WORKFLOW_EVENT_TYPES = [
  "SUBMISSION_CREATED",
  "REVIEW_STATE_CHANGED",
  "COHERENCE_REVIEWED",
  "PROFILE_VERSION_CREATED",
  "PROFILE_DELIVERED",
  "CORRECTION_REQUESTED",
  "PROFILE_CONFIRMED",
  "OPT_IN_OFFERED",
  "OPT_IN_ACCEPTED",
  "OPT_IN_DECLINED",
  "ACCESS_TOKEN_CREATED",
  "ACCESS_TOKEN_REVOKED",
  "WORK_RECORDED",
] as const;

export type WorkflowEventType = (typeof WORKFLOW_EVENT_TYPES)[number];

export type DerivedTalentState =
  | "EVIDENCE_REVIEW_COMPLETED_NO_OPTIN"
  | "TALENT_PROFILE_ACTIVE"
  | null;
