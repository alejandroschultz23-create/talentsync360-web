import type { EvidenceReviewLanguage } from "./consent";
import {
  NETWORK_OPT_IN_BOUNDARY_STATEMENT,
  NETWORK_OPT_IN_CONSENT_TEXT,
} from "./network-consent";

export type OptInContent = {
  headerBadge: string;
  headerTitle: string;
  headerSubtitle: string;
  languageLabel: string;
  whatItMeansTitle: string;
  whatItMeansPoints: string[];
  whatItDoesNotMeanTitle: string;
  whatItDoesNotMeanPoints: string[];
  consentText: string;
  boundaryStatement: string;
  consentCheckboxLabel: string;
  yesButton: string;
  noButton: string;
  submitting: string;
  genericError: string;
  terminalAcceptedTitle: string;
  terminalAcceptedBody: string;
  terminalAcceptedNote: string;
  terminalDeclinedTitle: string;
  terminalDeclinedBody: string;
  terminalDeclinedNote: string;
  notOfferedTitle: string;
  notOfferedBody: string;
  startOfferButton: string;
  backToProfile: string;
  profileInvitation: string;
  profileDecisionButton: string;
};

export const optInContent: Record<EvidenceReviewLanguage, OptInContent> = {
  es: {
    headerBadge: "RED DE TALENTO TALENTSYNC360",
    headerTitle: "Tu Professional Evidence Review ya está completa.",
    headerSubtitle: "Incorporarte a TalentSync360 es una decisión completamente opcional e independiente.",
    languageLabel: "English",
    whatItMeansTitle: "¿Qué implica incorporarte a TalentSync360?",
    whatItMeansPoints: [
      "TalentSync360 puede conservar tu perfil profesional confirmado en su red de talento.",
      "Podemos contactarte directamente sobre oportunidades laborales o de consultoría potencialmente relevantes para tu perfil.",
      "Tu participación en la red es voluntaria y no tiene costo para vos.",
    ],
    whatItDoesNotMeanTitle: "Límites claros de esta autorización",
    whatItDoesNotMeanPoints: [
      "Esta autorización no permite presentar ni compartir tu perfil con ninguna empresa sin tu autorización explícita previa.",
      "Tu perfil no será público ni indexable en motores de búsqueda.",
      "No autoriza postulaciones ni vinculaciones automáticas con oportunidades.",
      "No garantiza empleos, entrevistas ni oportunidades.",
    ],
    consentText: NETWORK_OPT_IN_CONSENT_TEXT.es,
    boundaryStatement: NETWORK_OPT_IN_BOUNDARY_STATEMENT.es,
    consentCheckboxLabel: "Confirmo que deseo incorporarme a la red de talento y autorizo el uso de mi perfil confirmado bajo estos términos.",
    yesButton: "Sí, quiero incorporarme a TalentSync360.",
    noButton: "Por ahora no. Solo quería recibir la revisión.",
    submitting: "Procesando...",
    genericError: "No pudimos procesar tu solicitud en este momento. Por favor, intentá nuevamente.",
    terminalAcceptedTitle: "Ya formás parte de la red de talento de TalentSync360.",
    terminalAcceptedBody: "Conservaremos tu perfil confirmado como tu perfil actual de la red y podremos contactarte sobre oportunidades potencialmente relevantes.",
    terminalAcceptedNote: "Recordá: formar parte de la red no autoriza a TalentSync360 a presentar tu perfil ante ninguna empresa sin tu consentimiento previo para cada caso.",
    terminalDeclinedTitle: "Tu Professional Evidence Review sigue disponible.",
    terminalDeclinedBody: "Elegiste no incorporarte a la red de talento de TalentSync360 por ahora. Tu revisión de evidencia confirmada permanece disponible e intacta.",
    terminalDeclinedNote: "Haber declinado la red no genera ningún registro negativo ni afecta futuras interacciones con nosotros.",
    notOfferedTitle: "Decisión de Red de Talento",
    notOfferedBody: "Tu perfil de evidencia está confirmado. Para acceder a la opción de incorporarte a la red de talento, continuá desde tu perfil confirmado.",
    startOfferButton: "Ver decisión de red de talento",
    backToProfile: "Volver a mi perfil de evidencia",
    profileInvitation: "Tu Professional Evidence Review está completa. Si querés, ahora podés decidir si incorporarte a la red de talento de TalentSync360.",
    profileDecisionButton: "Decidir sobre la red de talento →",
  },
  en: {
    headerBadge: "TALENTSYNC360 TALENT NETWORK",
    headerTitle: "Your Evidence Review is already complete.",
    headerSubtitle: "Joining TalentSync360 is a completely optional and independent decision.",
    languageLabel: "Español",
    whatItMeansTitle: "What does joining TalentSync360 mean?",
    whatItMeansPoints: [
      "TalentSync360 may maintain your confirmed professional profile in its talent network.",
      "We may contact you regarding job or contract opportunities potentially relevant to your profile.",
      "Your participation in the network is voluntary and at no cost to you.",
    ],
    whatItDoesNotMeanTitle: "Clear boundaries of this authorization",
    whatItDoesNotMeanPoints: [
      "This authorization does not permit presenting or sharing your profile with any company without separate explicit prior authorization.",
      "Your profile will not be public or searchable on the web.",
      "It does not authorize automated applications or matching.",
      "It does not guarantee employment, interviews, or opportunities.",
    ],
    consentText: NETWORK_OPT_IN_CONSENT_TEXT.en,
    boundaryStatement: NETWORK_OPT_IN_BOUNDARY_STATEMENT.en,
    consentCheckboxLabel: "I confirm that I want to join the talent network and authorize using my confirmed profile under these terms.",
    yesButton: "Yes, I want to join TalentSync360.",
    noButton: "Not for now. I only wanted the review.",
    submitting: "Processing...",
    genericError: "We were unable to process your request at this time. Please try again.",
    terminalAcceptedTitle: "You are now part of the TalentSync360 Talent Network.",
    terminalAcceptedBody: "We will keep your confirmed profile as your current network profile and may contact you about potentially relevant opportunities.",
    terminalAcceptedNote: "Reminder: network membership does not authorize TalentSync360 to present your profile to any company without your prior case-by-case consent.",
    terminalDeclinedTitle: "Your Professional Evidence Review remains available.",
    terminalDeclinedBody: "You chose not to join the TalentSync360 Talent Network for now. Your confirmed evidence review remains available and intact.",
    terminalDeclinedNote: "Declining the network creates no negative signal and does not affect any future interactions with us.",
    notOfferedTitle: "Talent Network Decision",
    notOfferedBody: "Your evidence profile is confirmed. To access the option to join the talent network, continue from your confirmed profile.",
    startOfferButton: "View talent network decision",
    backToProfile: "Back to my evidence profile",
    profileInvitation: "Your Evidence Review is complete. If you’d like, you can now decide whether to join the TalentSync360 Talent Network.",
    profileDecisionButton: "Decide about the Talent Network →",
  },
};
