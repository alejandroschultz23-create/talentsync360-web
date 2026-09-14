export const REVIEW_CONSENT_VERSION = "evidence-review-v1-2026-09-14";

export const REVIEW_CONSENT_TEXT = {
  es: "Autorizo a TalentSync360 a utilizar la información enviada para realizar esta Professional Evidence Review y contactarme en relación con ella.",
  en: "I authorize TalentSync360 to use the information I submit to perform this Professional Evidence Review and contact me about it.",
} as const;

export type EvidenceReviewLanguage = keyof typeof REVIEW_CONSENT_TEXT;
