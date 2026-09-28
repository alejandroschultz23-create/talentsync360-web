export const REVIEW_CONSENT_VERSION = "evidence-review-v1-2026-09-14";

export const REVIEW_CONSENT_TEXT = {
  es: "Con la presente solicitud, manifiesto expresamente mi voluntad y consentimiento para que la información proporcionada en esta oportunidad sea utilizada exclusivamente con la sola finalidad de la creación de un perfil profesional con el objetivo de que TalentSync360 acceda a los datos brindados.",
  en: "With this application, I expressly state my willingness and consent for the information provided on this occasion to be used solely and exclusively for the creation of a professional profile so that TalentSync360 may access the data provided.",
} as const;

export const REVIEW_CONSENT_CHECKBOX_LABEL = {
  es: "He leído y acepto este consentimiento.",
  en: "I have read and accept this consent statement.",
} as const;

export type EvidenceReviewLanguage = keyof typeof REVIEW_CONSENT_TEXT;

