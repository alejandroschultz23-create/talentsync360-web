import type {
  EvidenceType,
  FindingStatus,
  OpportunityStatus,
  ProfessionalIntent,
} from "./domain";
import type { EvidenceReviewLanguage } from "./consent";

export const privateProfileContent = {
  es: {
    eyebrow: "PROFESSIONAL EVIDENCE PROFILE",
    accessInvalid: "Este enlace de acceso privado ya no es válido.",
    accessHelp: "Solicitá un nuevo enlace a TalentSync360 si todavía necesitás acceder.",
    version: "Versión",
    reviewedOn: "Revisado el",
    professionalIntent: "Intención profesional",
    opportunity: "Situación actual",
    workModes: "Modalidades consideradas",
    evidenceReviewed: "Evidencia revisada",
    evidenceType: "Tipo de evidencia",
    contribution: "Contribución individual informada",
    context: "Contexto profesional informado",
    evidenceLink: "Abrir evidencia compartida",
    findings: "Hallazgos",
    evidenceBasis: "Base de evidencia",
    recommendations: "Próxima validación recomendada",
    recommendationsEmpty: "No se registraron validaciones adicionales para esta versión.",
    transparency: "Cómo leer este perfil",
    transparencyBody:
      "Este perfil distingue lo respaldado, lo parcialmente respaldado, lo desconocido y lo que necesita aclaración. La información autodeclarada se presenta dentro de sus límites de verificación.",
    disclaimer:
      "No es una certificación, un puntaje profesional universal, una evaluación completa ni una garantía de entrevista o empleo.",
    correctionRequested: "Recibimos tu solicitud de corrección.",
    correctionRequestedBody:
      "Revisaremos la información manualmente. No implica que hayas fallado y no establece un plazo fijo.",
    confirmed: "Este Evidence Profile fue confirmado.",
    confirm: "Confirmar información",
    correction: "Solicitar corrección",
    correctionLabel: "¿Qué información necesita corrección?",
    correctionPlaceholder: "Describí una corrección concreta para esta versión.",
    correctionHelp: "Máximo 2000 caracteres. No incluyas credenciales ni material confidencial.",
    submitting: "Enviando…",
    genericError: "No pudimos completar la acción. Verificá el acceso e intentá nuevamente.",
    alreadyCorrection: "Ya recibimos una solicitud de corrección para esta versión.",
    confirmSuccess: "La información fue confirmada.",
    correctionSuccess: "Recibimos tu solicitud de corrección.",
    languageLabel: "English",
    opportunityStatuses: {
      OPEN: "Abierto/a a oportunidades",
      REVIEW_ONLY: "Solo revisión",
      NOT_LOOKING: "No busca oportunidades actualmente",
    },
    workModeLabels: {
      FULL_TIME: "Tiempo completo",
      FREELANCE: "Freelance",
      CONTRACT: "Contrato",
      PART_TIME: "Tiempo parcial",
    },
    evidenceTypes: {
      PUBLIC_REPOSITORY: "Repositorio público",
      PERSONAL_PROJECT: "Proyecto personal",
      PROFESSIONAL_PROJECT: "Proyecto profesional",
      OPEN_SOURCE_CONTRIBUTION: "Contribución open source",
      TECHNICAL_ARTIFACT: "Artefacto técnico",
      PRIVATE_PROFESSIONAL_EXPERIENCE: "Experiencia profesional privada autodescripta",
      OTHER: "Otro",
    },
    findingStatuses: {
      SUPPORTED: "Respaldado",
      PARTIAL: "Evidencia parcial",
      UNKNOWN: "Desconocido",
      NEEDS_CLARIFICATION: "Necesita aclaración",
    },
  },
  en: {
    eyebrow: "PROFESSIONAL EVIDENCE PROFILE",
    accessInvalid: "This private access link is no longer valid.",
    accessHelp: "Request a new link from TalentSync360 if you still need access.",
    version: "Version",
    reviewedOn: "Reviewed on",
    professionalIntent: "Professional intent",
    opportunity: "Current intent",
    workModes: "Work arrangements considered",
    evidenceReviewed: "Evidence reviewed",
    evidenceType: "Evidence type",
    contribution: "Self-reported individual contribution",
    context: "Self-reported professional context",
    evidenceLink: "Open shared evidence",
    findings: "Findings",
    evidenceBasis: "Evidence basis",
    recommendations: "Recommended next validation",
    recommendationsEmpty: "No additional validation was recorded for this version.",
    transparency: "How to read this profile",
    transparencyBody:
      "This profile distinguishes what is supported, partially supported, unknown, and what needs clarification. Self-reported information is shown within its verification limits.",
    disclaimer:
      "This is not a certification, universal professional score, complete assessment, interview guarantee, or employment guarantee.",
    correctionRequested: "We received your correction request.",
    correctionRequestedBody:
      "We will review the information manually. This does not mean you failed and does not promise a fixed turnaround.",
    confirmed: "This Evidence Profile has been confirmed.",
    confirm: "Confirm information",
    correction: "Request correction",
    correctionLabel: "What information needs correction?",
    correctionPlaceholder: "Describe one concrete correction for this version.",
    correctionHelp: "Maximum 2000 characters. Do not include credentials or confidential material.",
    submitting: "Submitting…",
    genericError: "We could not complete the action. Verify your access and try again.",
    alreadyCorrection: "We already received a correction request for this version.",
    confirmSuccess: "The information was confirmed.",
    correctionSuccess: "We received your correction request.",
    languageLabel: "Español",
    opportunityStatuses: {
      OPEN: "Open to opportunities",
      REVIEW_ONLY: "Review only",
      NOT_LOOKING: "Not currently looking",
    },
    workModeLabels: {
      FULL_TIME: "Full time",
      FREELANCE: "Freelance",
      CONTRACT: "Contract",
      PART_TIME: "Part time",
    },
    evidenceTypes: {
      PUBLIC_REPOSITORY: "Public repository",
      PERSONAL_PROJECT: "Personal project",
      PROFESSIONAL_PROJECT: "Professional project",
      OPEN_SOURCE_CONTRIBUTION: "Open-source contribution",
      TECHNICAL_ARTIFACT: "Technical artifact",
      PRIVATE_PROFESSIONAL_EXPERIENCE: "Self-described private professional experience",
      OTHER: "Other",
    },
    findingStatuses: {
      SUPPORTED: "Supported",
      PARTIAL: "Partial evidence",
      UNKNOWN: "Unknown",
      NEEDS_CLARIFICATION: "Needs clarification",
    },
  },
} satisfies Record<
  EvidenceReviewLanguage,
  {
    opportunityStatuses: Record<OpportunityStatus, string>;
    workModeLabels: Record<ProfessionalIntent, string>;
    evidenceTypes: Record<EvidenceType, string>;
    findingStatuses: Record<FindingStatus, string>;
    [key: string]: unknown;
  }
>;
