import type { PilotConsentAcknowledgementKey } from "./policy";

/**
 * Invited H3 Preview pilot — participant-facing copy (V1_187B).
 *
 * Pure module. Spanish is the primary participant language; English is the
 * alternate. No internal provider names (H3/Neon/Cloud Run), no secrets, no
 * operator-facing language.
 */
export type PilotLanguage = "es" | "en";

export interface PilotConsentItem {
  readonly key: PilotConsentAcknowledgementKey;
  readonly es: string;
  readonly en: string;
}

export const PILOT_CONSENT_ITEMS: readonly PilotConsentItem[] = [
  {
    key: "preview_test_understanding",
    es: "Entiendo que esto es una vista previa (piloto) y no un servicio de producción.",
    en: "I understand this is a preview pilot, not a production service.",
  },
  {
    key: "pilot_purpose_understood",
    es: "Entiendo el propósito del piloto: revisar mis materiales profesionales para generar un borrador de perfil.",
    en: "I understand the pilot purpose: reviewing my professional materials to produce a profile draft.",
  },
  {
    key: "authorized_sources_only",
    es: "Solo se procesarán las fuentes que autorizo explícitamente aquí.",
    en: "Only the sources I explicitly authorise here will be processed.",
  },
  {
    key: "authorization_not_truth",
    es: "Autorizar una fuente no significa que su contenido sea verdadero ni verificado.",
    en: "Authorising a source does not mean its content is true or verified.",
  },
  {
    key: "unknown_may_remain",
    es: "Entiendo que alguna información puede permanecer como DESCONOCIDA.",
    en: "I understand that some information may remain UNKNOWN.",
  },
  {
    key: "external_presentation_disabled",
    es: "La presentación externa está deshabilitada en este piloto.",
    en: "External presentation is disabled in this pilot.",
  },
  {
    key: "talent_network_separate",
    es: "La adhesión a la Talent Network es una decisión separada y opcional.",
    en: "Joining the Talent Network is a separate and optional decision.",
  },
  {
    key: "correction_right",
    es: "Puedo solicitar correcciones sobre el borrador generado.",
    en: "I can request corrections to the generated draft.",
  },
  {
    key: "withdrawal_right",
    es: "Puedo retirarme del piloto en cualquier momento.",
    en: "I can withdraw from the pilot at any time.",
  },
  {
    key: "removal_right",
    es: "Puedo solicitar la eliminación de mis datos del piloto.",
    en: "I can request the removal of my pilot data.",
  },
  {
    key: "retention_max_30_days",
    es: "Acepto la retención máxima de 30 días después del piloto.",
    en: "I accept a maximum post-pilot retention of 30 days.",
  },
  {
    key: "materials_refer_to_participant",
    es: "Confirmo que los materiales se refieren a mí.",
    en: "I confirm the materials refer to me.",
  },
] as const;

const PILOT_STATUS_LABELS: Record<PilotLanguage, Record<string, string>> = {
  es: {
    SUBMITTED: "Enviado",
    UNDER_REVIEW: "En revisión",
    DRAFT_READY: "Borrador listo",
    CORRECTION_REQUESTED: "Corrección solicitada",
    CONFIRMED: "Confirmado",
    WITHDRAWN: "Retirado",
    REMOVAL_PENDING: "Eliminación pendiente",
    REMOVED: "Eliminado",
    NOT_SUBMITTED: "Sin enviar",
  },
  en: {
    SUBMITTED: "Submitted",
    UNDER_REVIEW: "Under review",
    DRAFT_READY: "Draft ready",
    CORRECTION_REQUESTED: "Correction requested",
    CONFIRMED: "Confirmed",
    WITHDRAWN: "Withdrawn",
    REMOVAL_PENDING: "Removal pending",
    REMOVED: "Removed",
    NOT_SUBMITTED: "Not submitted",
  },
};

export function pilotStatusLabel(language: PilotLanguage, status: string): string {
  return PILOT_STATUS_LABELS[language][status] ?? status;
}

export interface PilotCopy {
  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;
  readonly previewNotice: string;
  readonly explanationPoints: readonly string[];
  readonly startCta: string;
  readonly consentTitle: string;
  readonly consentIntro: string;
  readonly consentBoundary: string;
  readonly policyVersionLabel: string;
  readonly consentRequired: string;
  readonly sourcesTitle: string;
  readonly cvLabel: string;
  readonly coverLetterLabel: string;
  readonly fileFormats: string;
  readonly fileTooLarge: string;
  readonly fileTypeInvalid: string;
  readonly cvRequired: string;
  readonly identityTitle: string;
  readonly identityCheckbox: string;
  readonly submit: string;
  readonly submitting: string;
  readonly genericError: string;
  readonly statusTitle: string;
  readonly statusBody: string;
  readonly draftTitle: string;
  readonly draftConfirm: string;
  readonly draftCorrection: string;
  readonly draftReject: string;
  readonly correctionLabel: string;
  readonly correctionPlaceholder: string;
  readonly correctionHelp: string;
  readonly rejectConfirm: string;
  readonly optInTitle: string;
  readonly optInBody: string;
  readonly optInJoin: string;
  readonly optInDecline: string;
  readonly optInNote: string;
  readonly withdraw: string;
  readonly withdrawNote: string;
  readonly revokeOptIn: string;
  readonly revokeNote: string;
  readonly removal: string;
  readonly removalNote: string;
  readonly removalPending: string;
  readonly accessInvalid: string;
  readonly refresh: string;
}

export const pilotContent: Record<PilotLanguage, PilotCopy> = {
  es: {
    eyebrow: "PILOTO DE VISTA PREVIA",
    title: "Revisión de Evidencia Profesional — Piloto por invitación",
    lead: "Estás participando en una vista previa por invitación. Compartí tus materiales profesionales para recibir un borrador de perfil revisado.",
    previewNotice:
      "Piloto de vista previa. Solo evidencia profesional. Solo fuentes exactamente autorizadas. Presentación externa deshabilitada.",
    explanationPoints: [
      "Vista previa (piloto): funciones limitadas y en evaluación.",
      "Solo se procesa evidencia profesional que autorizás explícitamente.",
      "La presentación externa y la promoción están deshabilitadas.",
      "Podés corregir el borrador generado.",
      "Podés retirarte del piloto en cualquier momento.",
      "Podés solicitar la eliminación de tus datos del piloto.",
      "La adhesión a la Talent Network es una decisión separada y opcional.",
    ],
    startCta: "Comenzar mi envío",
    consentTitle: "Consentimiento del piloto",
    consentIntro:
      "Necesitamos tu consentimiento explícito, punto por punto. Marcar todas las casillas es obligatorio; el silencio no equivale a consentimiento.",
    consentBoundary:
      "Tu consentimiento se registra de forma canónica. Autorizar una fuente no implica que su contenido sea verdadero.",
    policyVersionLabel: "Versión de política",
    consentRequired: "Tenés que aceptar los doce puntos para continuar.",
    sourcesTitle: "Autorización de fuentes",
    cvLabel: "CV",
    coverLetterLabel: "Carta de presentación",
    fileFormats: "Aceptamos PDF o DOCX, hasta 5 MB.",
    fileTooLarge: "El archivo supera el límite de 5 MB.",
    fileTypeInvalid: "Formato no soportado. Aceptamos PDF o DOCX.",
    cvRequired: "El CV es obligatorio para este piloto.",
    identityTitle: "Confirmación de identidad",
    identityCheckbox: "Confirmo que los materiales profesionales que presenté o autoricé se refieren a mí.",
    submit: "Enviar al piloto",
    submitting: "Enviando…",
    genericError: "No pudimos completar la acción. Verificá tu acceso e intentá nuevamente.",
    statusTitle: "Estado de tu envío",
    statusBody: "Este es el estado de tu participación en el piloto.",
    draftTitle: "Borrador de perfil para tu revisión",
    draftConfirm: "Confirmar",
    draftCorrection: "Solicitar corrección",
    draftReject: "Rechazar",
    correctionLabel: "¿Qué información necesita corrección?",
    correctionPlaceholder: "Describí una corrección concreta para esta versión.",
    correctionHelp: "Máximo 2000 caracteres. No incluyas credenciales ni material confidencial.",
    rejectConfirm: "¿Confirmás que querés rechazar este borrador? No se promocionará ningún perfil.",
    optInTitle: "Talent Network (opcional y separado)",
    optInBody:
      "Tu borrador fue confirmado. La adhesión a la Talent Network es una decisión separada. No hay presentación externa automática.",
    optInJoin: "Unirme a la Talent Network",
    optInDecline: "Rechazar",
    optInNote: "Unirte no implica eliminación y podés salir más adelante.",
    withdraw: "Retirarme del piloto",
    withdrawNote:
      "Retirarte del piloto detiene tu participación. Es distinto de salir de la Talent Network y distinto de solicitar la eliminación de datos.",
    revokeOptIn: "Salir de Talent Network",
    revokeNote: "Salir de la Talent Network no implica la eliminación de tus datos.",
    removal: "Solicitar eliminación de mis datos del piloto",
    removalNote:
      "Se solicita la eliminación canónica y luego se borran los archivos exactos almacenados. Solo se muestra completado cuando ambos pasos finalizan.",
    removalPending:
      "La eliminación de datos se completó y la limpieza de archivos está pendiente. Reintentaremos de forma segura.",
    accessInvalid: "Este acceso de piloto ya no es válido.",
    refresh: "Actualizar",
  },
  en: {
    eyebrow: "PREVIEW PILOT",
    title: "Professional Evidence Review — Invited pilot",
    lead: "You are taking part in an invited preview. Share your professional materials to receive a reviewed profile draft.",
    previewNotice:
      "Preview pilot. Professional evidence only. Exactly authorised sources only. External presentation disabled.",
    explanationPoints: [
      "Preview (pilot): limited, under-evaluation features.",
      "Only professional evidence you explicitly authorise is processed.",
      "External presentation and promotion are disabled.",
      "You can correct the generated draft.",
      "You can withdraw from the pilot at any time.",
      "You can request removal of your pilot data.",
      "Talent Network opt-in is a separate, optional decision.",
    ],
    startCta: "Start my submission",
    consentTitle: "Pilot consent",
    consentIntro:
      "We need your explicit consent, point by point. Acknowledging every item is required; silence does not equal consent.",
    consentBoundary:
      "Your consent is recorded canonically. Authorising a source does not imply its content is true.",
    policyVersionLabel: "Policy version",
    consentRequired: "You must acknowledge all twelve items to continue.",
    sourcesTitle: "Source authorisation",
    cvLabel: "CV",
    coverLetterLabel: "Cover letter",
    fileFormats: "We accept PDF or DOCX, up to 5 MB.",
    fileTooLarge: "The file exceeds the 5 MB limit.",
    fileTypeInvalid: "Unsupported format. We accept PDF or DOCX.",
    cvRequired: "The CV is required for this pilot.",
    identityTitle: "Identity confirmation",
    identityCheckbox: "I confirm that the professional materials I submitted or authorised refer to me.",
    submit: "Submit to the pilot",
    submitting: "Submitting…",
    genericError: "We could not complete the action. Verify your access and try again.",
    statusTitle: "Your submission status",
    statusBody: "This is the state of your pilot participation.",
    draftTitle: "Profile draft for your review",
    draftConfirm: "Confirm",
    draftCorrection: "Request correction",
    draftReject: "Reject",
    correctionLabel: "What information needs correction?",
    correctionPlaceholder: "Describe one concrete correction for this version.",
    correctionHelp: "Maximum 2000 characters. Do not include credentials or confidential material.",
    rejectConfirm: "Are you sure you want to reject this draft? No profile will be promoted.",
    optInTitle: "Talent Network (optional and separate)",
    optInBody:
      "Your draft was confirmed. Joining the Talent Network is a separate decision. There is no automatic external presentation.",
    optInJoin: "Join the Talent Network",
    optInDecline: "Decline",
    optInNote: "Joining does not imply deletion and you can leave later.",
    withdraw: "Withdraw from the pilot",
    withdrawNote:
      "Withdrawing from the pilot stops your participation. It is different from leaving the Talent Network and from requesting data removal.",
    revokeOptIn: "Leave Talent Network",
    revokeNote: "Leaving the Talent Network does not imply deletion of your data.",
    removal: "Request removal of my pilot data",
    removalNote:
      "Canonical removal is requested first, then the exact stored files are deleted. Completion is shown only when both steps finish.",
    removalPending:
      "Data removal completed and file cleanup is pending. We will retry safely.",
    accessInvalid: "This pilot access is no longer valid.",
    refresh: "Refresh",
  },
};
