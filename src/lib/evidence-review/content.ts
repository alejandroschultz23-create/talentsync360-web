import type {
  EvidenceType,
  OpportunityStatus,
  ProfessionalIntent,
} from "./domain";
import type { EvidenceReviewLanguage } from "./consent";

type EvidenceReviewContent = {
  landing: {
    eyebrow: string;
    title: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
    time: string;
    notCvTitle: string;
    notCvBody: string;
    dimensions: { title: string; body: string }[];
    unknownRule: string;
    shareTitle: string;
    shareBody: string;
    shareExamples: string[];
    warning: string;
    howTitle: string;
    steps: { number: string; title: string; body: string }[];
    trustTitle: string;
    trustLead: string;
    trustItems: string[];
    closingTitle: string;
    closingBody: string;
  };
  form: {
    eyebrow: string;
    title: string;
    lead: string;
    time: string;
    required: string;
    optional: string;
    fields: Record<string, string>;
    placeholders: Record<string, string>;
    evidenceTypes: Record<EvidenceType, string>;
    opportunityStatuses: Record<OpportunityStatus, string>;
    opportunityHelp: Record<OpportunityStatus, string>;
    workModes: Record<ProfessionalIntent, string>;
    confidentialWarning: string;
    consentBoundary: string;
    privacyPrefix: string;
    privacyLink: string;
    submit: string;
    submitting: string;
    errors: {
      field: string;
      consent: string;
      submission: string;
    };
  };
  submitted: {
    eyebrow: string;
    title: string;
    body: string;
    next: string;
    home: string;
  };
};

export const evidenceReviewContent = {
  es: {
    landing: {
      eyebrow: "PROFESSIONAL EVIDENCE REVIEW",
      title: "Tu experiencia dice mucho. Veamos qué podés demostrar con evidencia.",
      lead:
        "Mostranos algo que hiciste. Te devolvemos una lectura estructurada de lo que tu experiencia realmente permite demostrar.",
      primaryCta: "Solicitar revisión de evidencia",
      secondaryCta: "Cómo funciona",
      time: "Completar la solicitud lleva aproximadamente 2–4 minutos.",
      notCvTitle: "Esto no es otra base de CVs",
      notCvBody:
        "Revisamos una experiencia concreta para separar lo que está respaldado por evidencia de aquello que todavía necesita contexto.",
      dimensions: [
        { title: "Fortalezas", body: "Capacidades respaldadas de forma clara por lo compartido." },
        { title: "Evidencia parcial", body: "Señales útiles que todavía no permiten una conclusión completa." },
        { title: "Desconocidos", body: "Aspectos que la evidencia disponible no permite evaluar." },
        { title: "Necesita aclaración", body: "Información incompleta o contradictoria que conviene revisar." },
      ],
      unknownRule:
        "Desconocido no significa brecha. La ausencia de evidencia pública no se interpreta como ausencia de habilidad.",
      shareTitle: "Qué podés compartir",
      shareBody:
        "Elegí una experiencia que conozcas bien y explicá cuál fue tu contribución individual.",
      shareExamples: [
        "Repositorio público, GitHub o Hugging Face",
        "Proyecto personal, profesional, académico u open source",
        "Portfolio, demo, caso de estudio o documentación",
        "Explicación de arquitectura o decisión técnica",
        "Experiencia profesional privada descripta por vos",
        "Otro trabajo que permita entender cómo resolvés problemas",
      ],
      warning:
        "No compartas código fuente privado, información de clientes ni material confidencial.",
      howTitle: "Cómo funciona",
      steps: [
        { number: "01", title: "Elegí una experiencia", body: "Puede ser pública o privada; un enlace es opcional." },
        { number: "02", title: "La revisamos", body: "Buscamos evidencia, límites y puntos que necesiten aclaración." },
        { number: "03", title: "Recibí tu Evidence Profile privado", body: "La entrega privada se habilitará más adelante en el proceso." },
        { number: "04", title: "Vos decidís qué sigue", body: "Recibir la revisión no te incorpora a TalentSync360." },
      ],
      trustTitle: "Una revisión con límites claros",
      trustLead:
        "La revisión organiza evidencia profesional; no certifica habilidades ni promete resultados laborales.",
      trustItems: [
        "No garantiza entrevistas ni empleo.",
        "Tu perfil no se publica automáticamente.",
        "Este consentimiento no autoriza presentarte a empresas.",
        "Unirte a TalentSync360 después es opcional y requerirá una decisión separada.",
        "El inglés no es un requisito universal y GitHub no es obligatorio.",
        "Más adelante vas a poder solicitar correcciones.",
      ],
      closingTitle: "Empezá por una experiencia concreta",
      closingBody:
        "No necesitás CV, contraseña, nivel de inglés, LinkedIn, GitHub ni teléfono.",
    },
    form: {
      eyebrow: "SOLICITUD DE EVIDENCE REVIEW",
      title: "Contanos qué hiciste y cuál fue tu aporte.",
      lead:
        "Elegí una experiencia concreta. No hace falta que sea pública ni que tenga un enlace.",
      time: "Tiempo estimado: 2–4 minutos",
      required: "Obligatorio",
      optional: "Opcional",
      fields: {
        full_name: "Nombre completo",
        email: "Email",
        country: "País",
        current_role: "Rol actual",
        evidence_type: "Tipo de evidencia",
        evidence_url: "Enlace a la evidencia",
        individual_contribution: "¿Cuál fue tu contribución individual?",
        professional_context: "Contexto profesional",
        opportunity_status: "¿Qué querés que tengamos en cuenta hoy?",
        professional_intents: "Modalidades de trabajo que considerarías",
        review_consent: "Consentimiento para esta revisión",
      },
      placeholders: {
        full_name: "Tu nombre y apellido",
        email: "vos@ejemplo.com",
        country: "Argentina, Colombia, México…",
        current_role: "Backend Engineer, Data Analyst…",
        evidence_url: "https://…",
        individual_contribution:
          "Qué problema resolviste, qué decisiones tomaste y qué parte hiciste vos.",
        professional_context:
          "Equipo, restricciones, alcance o contexto que ayude a interpretar la experiencia.",
      },
      evidenceTypes: {
        PUBLIC_REPOSITORY: "Repositorio público (incluye GitHub o Hugging Face)",
        PERSONAL_PROJECT: "Proyecto personal",
        PROFESSIONAL_PROJECT: "Proyecto profesional",
        OPEN_SOURCE_CONTRIBUTION: "Contribución open source",
        TECHNICAL_ARTIFACT: "Portfolio, demo, caso, documentación o explicación técnica",
        PRIVATE_PROFESSIONAL_EXPERIENCE: "Experiencia profesional privada descripta por mí",
        OTHER: "Otro",
      },
      opportunityStatuses: {
        OPEN: "Estoy abierto/a a oportunidades",
        REVIEW_ONLY: "Solo quiero la revisión",
        NOT_LOOKING: "No estoy buscando oportunidades ahora",
      },
      opportunityHelp: {
        OPEN: "Podés indicar qué modalidades considerarías.",
        REVIEW_ONLY: "La revisión no te incorpora a ninguna red de talento.",
        NOT_LOOKING: "Podés recibir la revisión aunque no estés buscando trabajo.",
      },
      workModes: {
        FULL_TIME: "Tiempo completo",
        FREELANCE: "Freelance",
        CONTRACT: "Contrato",
        PART_TIME: "Tiempo parcial",
      },
      confidentialWarning:
        "No compartas código privado, nombres de clientes, credenciales ni información confidencial.",
      consentBoundary:
        "Este consentimiento no autoriza membresía en TalentSync360, marketing, publicación del perfil ni presentación a empresas.",
      privacyPrefix: "Consultá también nuestra",
      privacyLink: "Política de Privacidad",
      submit: "Enviar evidencia",
      submitting: "Enviando…",
      errors: {
        field: "Revisá este campo.",
        consent: "Necesitamos tu autorización específica para realizar esta revisión.",
        submission: "No pudimos recibir la solicitud. Revisá los campos e intentá nuevamente.",
      },
    },
    submitted: {
      eyebrow: "SOLICITUD RECIBIDA",
      title: "Recibimos tu evidencia.",
      body:
        "Primero verificaremos que tengamos suficiente contexto para realizar una revisión útil. Si necesitamos aclarar algo, te contactaremos antes de avanzar.",
      next:
        "No necesitás hacer nada más ahora. Esta confirmación no implica membresía ni garantiza una oportunidad laboral.",
      home: "Volver al inicio",
    },
  },
  en: {
    landing: {
      eyebrow: "PROFESSIONAL EVIDENCE REVIEW",
      title: "Your experience says a lot. Let’s see what you can demonstrate with evidence.",
      lead:
        "Show us something you built. We’ll give you a structured reading of what your experience can genuinely demonstrate.",
      primaryCta: "Request an evidence review",
      secondaryCta: "How it works",
      time: "The request takes approximately 2–4 minutes to complete.",
      notCvTitle: "This is not another CV database",
      notCvBody:
        "We review one concrete experience to separate evidence-backed signals from areas that still need context.",
      dimensions: [
        { title: "Strengths", body: "Capabilities clearly supported by what you shared." },
        { title: "Partial evidence", body: "Useful signals that do not yet support a complete conclusion." },
        { title: "Unknowns", body: "Areas the available evidence does not allow us to assess." },
        { title: "Needs clarification", body: "Incomplete or contradictory information worth reviewing." },
      ],
      unknownRule:
        "Unknown does not mean gap. A lack of public evidence is not treated as a lack of skill.",
      shareTitle: "What you can share",
      shareBody:
        "Choose an experience you know well and explain your individual contribution.",
      shareExamples: [
        "Public repository, GitHub or Hugging Face",
        "Personal, professional, academic or open-source project",
        "Portfolio, demo, case study or documentation",
        "Architecture or technical decision explanation",
        "Private professional experience described by you",
        "Other work that shows how you solve problems",
      ],
      warning:
        "Do not share private source code, client information or confidential material.",
      howTitle: "How it works",
      steps: [
        { number: "01", title: "Choose an experience", body: "It can be public or private; a link is optional." },
        { number: "02", title: "We review it", body: "We identify evidence, limits and points that need clarification." },
        { number: "03", title: "Receive your private Evidence Profile", body: "Private delivery will become available later in the process." },
        { number: "04", title: "You decide what happens next", body: "Receiving the review does not enroll you in TalentSync360." },
      ],
      trustTitle: "A review with clear boundaries",
      trustLead:
        "The review organizes professional evidence; it does not certify skills or promise employment outcomes.",
      trustItems: [
        "No interview or employment guarantee.",
        "Your profile is not published automatically.",
        "This consent does not authorize presenting you to companies.",
        "Joining TalentSync360 later is optional and requires a separate decision.",
        "English is not universally required, and GitHub is not mandatory.",
        "You will be able to request corrections later.",
      ],
      closingTitle: "Start with one concrete experience",
      closingBody:
        "You do not need a CV, password, English level, LinkedIn, GitHub or phone number.",
    },
    form: {
      eyebrow: "EVIDENCE REVIEW REQUEST",
      title: "Tell us what you built and what you contributed.",
      lead:
        "Choose one concrete experience. It does not need to be public or have a link.",
      time: "Estimated time: 2–4 minutes",
      required: "Required",
      optional: "Optional",
      fields: {
        full_name: "Full name",
        email: "Email",
        country: "Country",
        current_role: "Current role",
        evidence_type: "Evidence type",
        evidence_url: "Evidence link",
        individual_contribution: "What was your individual contribution?",
        professional_context: "Professional context",
        opportunity_status: "What should we consider about your current intent?",
        professional_intents: "Work arrangements you would consider",
        review_consent: "Consent for this review",
      },
      placeholders: {
        full_name: "Your full name",
        email: "you@example.com",
        country: "Argentina, Colombia, Mexico…",
        current_role: "Backend Engineer, Data Analyst…",
        evidence_url: "https://…",
        individual_contribution:
          "The problem you solved, decisions you made and the part you owned.",
        professional_context:
          "Team, constraints, scope or context that helps us understand the experience.",
      },
      evidenceTypes: {
        PUBLIC_REPOSITORY: "Public repository (including GitHub or Hugging Face)",
        PERSONAL_PROJECT: "Personal project",
        PROFESSIONAL_PROJECT: "Professional project",
        OPEN_SOURCE_CONTRIBUTION: "Open-source contribution",
        TECHNICAL_ARTIFACT: "Portfolio, demo, case study, documentation or technical explanation",
        PRIVATE_PROFESSIONAL_EXPERIENCE: "Private professional experience described by me",
        OTHER: "Other",
      },
      opportunityStatuses: {
        OPEN: "I’m open to opportunities",
        REVIEW_ONLY: "I only want the review",
        NOT_LOOKING: "I’m not looking for opportunities right now",
      },
      opportunityHelp: {
        OPEN: "You can indicate which work arrangements you would consider.",
        REVIEW_ONLY: "The review does not enroll you in a talent network.",
        NOT_LOOKING: "You can receive the review even when you are not job searching.",
      },
      workModes: {
        FULL_TIME: "Full time",
        FREELANCE: "Freelance",
        CONTRACT: "Contract",
        PART_TIME: "Part time",
      },
      confidentialWarning:
        "Do not share private code, client names, credentials or confidential information.",
      consentBoundary:
        "This consent does not authorize TalentSync360 membership, marketing, profile publication or presentation to companies.",
      privacyPrefix: "Also review our",
      privacyLink: "Privacy Policy",
      submit: "Submit evidence",
      submitting: "Submitting…",
      errors: {
        field: "Please review this field.",
        consent: "We need your specific authorization to perform this review.",
        submission: "We could not receive the request. Review the fields and try again.",
      },
    },
    submitted: {
      eyebrow: "REQUEST RECEIVED",
      title: "We received your evidence.",
      body:
        "We will first verify that we have enough context to perform a useful review. If anything needs clarification, we will contact you before moving forward.",
      next:
        "You do not need to do anything else now. This confirmation does not imply membership or guarantee an employment opportunity.",
      home: "Back to home",
    },
  },
} satisfies Record<EvidenceReviewLanguage, EvidenceReviewContent>;
