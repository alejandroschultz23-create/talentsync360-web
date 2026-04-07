'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'es';

interface Translations {
  nav: {
    companies: string;
    talents: string;
    methodology: string;
    contact: string;
    contactShort: string;
  };
  footer: {
    tagline: string;
    companiesTitle: string;
    companiesLink1: string;
    companiesLink2: string;
    talentsTitle: string;
    talentsLink1: string;
    talentsLink2: string;
    resourcesTitle: string;
    resourcesLink1: string;
    copyright: string;
    terms: string;
    privacy: string;
  };
  home: {
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    ctaShortlist: string;
    ctaGoldList: string;
    pipelineTitle: string;
    pipelineTagline: string;
    pipelineSub: string;
    step1Label: string;
    step1Title: string;
    step1Desc: string;
    step2Label: string;
    step2Title: string;
    step2Desc: string;
    step3Label: string;
    step3Title: string;
    step3Desc: string;
    trustTitle: string;
    trust1Value: string;
    trust1Label: string;
    trust1Desc: string;
    trust2Value: string;
    trust2Label: string;
    trust2Desc: string;
    trust3Value: string;
    trust3Label: string;
    trust3Desc: string;
    ctaTitle: string;
    ctaDesc: string;
    ctaButton: string;
  };
  companies: {
    badge: string;
    title: string;
    subtitle: string;
    ctaShortlist: string;
    ctaMethodology: string;
    tiersTitle: string;
    tiersSubtitle: string;
    rolesTitle: string;
    rolesSubtitle: string;
    ctaTitle: string;
    ctaDesc: string;
    ctaButton: string;
  };
  talents: {
    badge: string;
    title: string;
    subtitle: string;
    subtitleAccent: string;
    ctaApply: string;
    processTitle: string;
    processSubtitle: string;
    stage1Label: string;
    stage1Title: string;
    stage1Desc: string;
    stage2Label: string;
    stage2Title: string;
    stage2Desc: string;
    stage3Label: string;
    stage3Title: string;
    stage3Desc: string;
    benefitTitle: string;
    benefit1Num: string;
    benefit1Title: string;
    benefit1Desc: string;
    benefit2Num: string;
    benefit2Title: string;
    benefit2Desc: string;
    benefit3Num: string;
    benefit3Title: string;
    benefit3Desc: string;
    checklistTitle: string;
    checklist1: string;
    checklist2: string;
    checklist3: string;
    ctaButton: string;
  };
  methodology: {
    badge: string;
    title: string;
    subtitle: string;
    criteriaTitle: string;
    criteria1Title: string;
    criteria1Desc: string;
    criteria2Title: string;
    criteria2Desc: string;
    criteria3Title: string;
    criteria3Desc: string;
    deliverablesTitle: string;
    deliverablesSubtitle: string;
    deliverable1: string;
    deliverable2: string;
    deliverable3: string;
    deliverable4: string;
    deliverable5: string;
    signalBadge: string;
    signalTitle: string;
    signalDesc: string;
    signalResult: string;
  };
  contact: {
    title: string;
    titleTalent: string;
    subtitle: string;
    subtitleTalent: string;
    subtitleGeneral: string;
    labelName: string;
    labelEmail: string;
    labelRole: string;
    optionB2B: string;
    optionB2C: string;
    optionGeneral: string;
    labelMessage: string;
    labelMessageTalent: string;
    labelCurrentRole: string;
    labelExperience: string;
    labelEnglishLevel: string;
    placeholderName: string;
    placeholderEmail: string;
    placeholderCurrentRole: string;
    placeholderExperience: string;
    placeholderMessage: string;
    placeholderMessageTalent: string;
    buttonSubmit: string;
    buttonSubmitTalent: string;
    privacyNote: string;
    directLabel: string;
    ctaButton: string;
  };
  terms: {
    title: string;
    intro: string;
    section1Title: string;
    section1Desc: string;
    section2Title: string;
    section2Desc: string;
    section3Title: string;
    section3Desc: string;
    section4Title: string;
    section4Desc: string;
    footer: string;
  };
  privacy: {
    title: string;
    intro: string;
    section1Title: string;
    section1Desc: string;
    section2Title: string;
    section2ListItem1: string;
    section2ListItem2: string;
    section2ListItem3: string;
    section2ListItem4: string;
    section3Title: string;
    section3Desc: string;
    section4Title: string;
    section4Desc: string;
    footer: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    nav: {
      companies: 'Companies',
      talents: 'Talents',
      methodology: 'Methodology',
      contact: 'Contact Us',
      contactShort: 'Contact',
    },
    footer: {
      tagline: 'Curated shortlists of nearshore talent (LATAM) with verified C1+ English.',
      companiesTitle: 'For Companies',
      companiesLink1: 'Hire Talent',
      companiesLink2: '360° Methodology',
      talentsTitle: 'For Talents',
      talentsLink1: 'Validate Profile',
      talentsLink2: 'Opportunities',
      resourcesTitle: 'Resources',
      resourcesLink1: 'Contact Support',
      copyright: 'All rights reserved.',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
    },
    home: {
      heroBadge: 'Not a Job Board. A Shortlist Engine.',
      heroTitle: 'Hire LATAM. Skip the Resume Noise.',
      heroSubtitle: "We send 3-5 candidates who've passed our screening. You decide. No resume stack.",
      ctaShortlist: 'Request Shortlist',
      ctaGoldList: 'See How It Works',
      pipelineTitle: 'How TalentSync360 Works',
      pipelineTagline: 'Less noise. More signal. 3 steps to validated candidates.',
      pipelineSub: 'No resume piles. No guesswork. Just validated candidates.',
      step1Label: 'Step 1',
      step1Title: 'You Brief. We Validate Feasibility.',
      step1Desc: 'Tell us role, KPIs, salary range, and must-haves. We confirm feasibility within 24h.',
      step2Label: 'Step 2',
      step2Title: 'We Validate & Test',
      step2Desc: 'English test + practical task. Candidates scored on actual skills. No guessing.',
      step3Label: 'Step 3',
      step3Title: 'Shortlist in Your Inbox. Ready to Interview.',
      step3Desc: '3-5 pre-screened candidates with scorecards. You interview, you decide.',
      trustTitle: 'What We Actually Deliver',
      trust1Value: '3–5',
      trust1Label: 'Curated Shortlist. Not CV Stack.',
      trust1Desc: 'We filter. You interview. No resume pile to sort through.',
      trust2Value: '100%',
      trust2Label: 'English Verified. Not Self-Reported.',
      trust2Desc: 'Every candidate validated on actual English proficiency. No assumptions.',
      trust3Value: '48h',
      trust3Label: 'Candidates in 48h',
      trust3Desc: 'Feasibility confirmed. Shortlist sent. You decide next step.',
      ctaTitle: 'Ready to Get Started?',
      ctaDesc: 'Send us your brief. We confirm feasibility and deliver your shortlist within 48 hours.',
      ctaButton: 'Request Your Shortlist',
    },
    companies: {
      badge: 'For Companies',
      title: 'Staff LATAM. Prove Every Hire.',
      subtitle: 'Curated shortlists with human screening, practical testing, and evidence-backed scorecards. Less churn, less risk, more speed.',
      ctaShortlist: 'Request Shortlist',
      ctaMethodology: 'See Our Standard',
      tiersTitle: 'Choose Your Shortlist Tier',
      tiersSubtitle: 'Every tier includes human screening and evidence-backed evaluation. Pick the depth that matches your hiring confidence needs.',
      rolesTitle: 'Core Nearshore Roles We Cover',
      rolesSubtitle: 'Low-friction roles pre-validated for immediate integration.',
      ctaTitle: 'Ready to scale your team?',
      ctaDesc: 'Book a brief 15-minute alignment call to understand your needs and confirm our current talent pool availability.',
      ctaButton: 'Book Discovery Call',
    },
    talents: {
      badge: 'The Gold List',
      title: 'Get Validated. Get Global Opportunities.',
      subtitle: 'TalentSync360 is not a job board. It is a 360° validation platform connecting the top 1% of LATAM talent with US and European companies.',
      subtitleAccent: 'Proven English. Proven Execution. Proven Reliability.',
      ctaApply: 'Apply to the Gold List',
      processTitle: 'The Validation Process',
      processSubtitle: 'Rigorous, fair, and oriented toward real performance outcomes.',
      stage1Label: 'Stage 1: Voice Note',
      stage1Title: 'C1+ English Verification',
      stage1Desc: 'Submit a 90-second recording demonstrating your experience and crisis management skills. We evaluate clarity, confidence, and professional accent.',
      stage2Label: 'Stage 2: Writing Test',
      stage2Title: 'Business Communication',
      stage2Desc: 'Solve a hypothetical case via email under time pressure. We evaluate writing quality, executive tone, and analytical capacity.',
      stage3Label: 'Stage 3: Work Sample',
      stage3Title: 'Real-World Task',
      stage3Desc: 'A role-specific technical task (QA, Support, Design, Content). If you pass the scorecard, you enter the Gold List permanently.',
      benefitTitle: 'Benefits for Gold List Members',
      benefit1Num: '01',
      benefit1Title: 'High-Level Exposure',
      benefit1Desc: "Your profile doesn't compete in a sea of CVs. You are in a curated shortlist that CEOs see directly.",
      benefit2Num: '02',
      benefit2Title: 'Competitive Salaries (USD/EUR)',
      benefit2Desc: 'We work exclusively with companies that value your seniority and pay according to premium nearshore standards.',
      benefit3Num: '03',
      benefit3Title: 'Valuable Feedback',
      benefit3Desc: "Even if you don't make the shortlist, you receive your scorecard score so you know exactly what to improve.",
      checklistTitle: "Got What It Takes?",
      checklist1: 'C1+ English (Professional Fluent)',
      checklist2: 'Proven experience in remote roles',
      checklist3: 'US business hours availability (EST/CST)',
      ctaButton: 'Start Validation',
    },
    methodology: {
      badge: 'Our Method',
      title: 'The Shortlist Quality Standard',
      subtitle: 'Every shortlist candidate is validated by experts, not algorithms. Rigorous testing. Evidence-backed decisions.',
      criteriaTitle: 'How We Validate',
      criteria1Title: 'Verified C1+ English',
      criteria1Desc: 'Standardized testing (oral + written) human-corrected by language experts.',
      criteria2Title: 'Role-Specific Technical Test',
      criteria2Desc: 'A real-world task mapped to the job description with a clear performance scorecard.',
      criteria3Title: 'Human Soft-Skills Screening',
      criteria3Desc: 'Live interviews to validate professional communication, reliability, and culture fit.',
      deliverablesTitle: 'What You Receive',
      deliverablesSubtitle: 'With every shortlist candidate.',
      deliverable1: '360° Profile per finalist candidate',
      deliverable2: 'Executive summary with English proficiency scores',
      deliverable3: 'Technical test results + raw work evidence',
      deliverable4: 'Detailed soft-skills behavioral evaluation',
      deliverable5: 'Expert recommendation + potential risk factors',
      signalBadge: 'Signal Over Noise',
      signalTitle: 'Signal Over Noise',
      signalDesc: 'Matching is oriented strictly towards verified skills and output performance, not demographic data. Our results are based on objective evidence (tests + human scorecards), minimizing intuition-based bias.',
      signalResult: 'You hire faster. You decide with evidence. You reduce churn.',
    },
    contact: {
      title: 'Get in Touch',
      titleTalent: 'Apply to the Gold List',
      subtitle: 'Tell us about the role you need to fill. We typically confirm feasibility and initial candidate signal within 24 hours.',
      subtitleTalent: 'Ready to join the top 1% of LATAM talent? Tell us about yourself and start your validation process.',
      subtitleGeneral: 'Have a question or need more information? We are here to help.',
      labelName: 'Full Name *',
      labelEmail: 'Work Email *',
      labelRole: 'I am looking for...',
      optionB2B: 'Hiring nearshore talent (B2B)',
      optionB2C: 'Applying as a talent (B2C)',
      optionGeneral: 'General inquiry',
      labelMessage: 'Message / Role Requirements *',
      labelMessageTalent: 'Why should you be on the Gold List? *',
      labelCurrentRole: 'Current Role *',
      labelExperience: 'Years of Experience *',
      labelEnglishLevel: 'English Level',
      placeholderName: 'Your full name',
      placeholderEmail: 'email@company.com',
      placeholderCurrentRole: 'e.g. Customer Support Rep',
      placeholderExperience: 'e.g. 5 years',
      placeholderMessage: 'Briefly describe the role, required skills, and specific KPIs...',
      placeholderMessageTalent: 'Tell us why you should be on the Gold List...',
      buttonSubmit: 'Submit Inquiry',
      buttonSubmitTalent: 'Apply to Gold List',
      privacyNote: 'By submitting this form, you agree to our privacy policy and data processing terms.',
      directLabel: 'Direct Access',
      ctaButton: 'Book a 15-min Alignment Call',
    },
    terms: {
      title: 'Terms of Service',
      intro: 'Welcome to TalentSync360. By accessing our website and using our services, you agree to comply with and be bound by the following terms.',
      section1Title: '1. Services Provided',
      section1Desc: 'TalentSync360 provides recruitment, validation, and headhunting services for nearshore talent. We act as a bridge between high quality professionals in LATAM and companies searching for validated skills.',
      section2Title: '2. Professional Integrity',
      section2Desc: 'Candidates applying through our platform warrant that all information provided (experience, skills, and identity) is truthful. Misrepresentation may result in immediate expulsion from the Gold List and notification to the involved client.',
      section3Title: '3. No Guarantee of Placement',
      section3Desc: 'While we strive to match top talent with elite companies, entry into our validation process or Gold List does not guarantee immediate employment or placement.',
      section4Title: '4. Limitation of Liability',
      section4Desc: "TalentSync360 is not liable for outcomes following a candidate's hire. All final employment decisions and contracts are the responsibility of the hiring company and the professional.",
      footer: 'These terms are effective as of April',
    },
    privacy: {
      title: 'Privacy Policy',
      intro: 'At TalentSync360, we are committed to protecting your privacy and ensuring the security of your personal data. This policy outlines how we collect, use, and safeguard your information.',
      section1Title: '1. Information We Collect',
      section1Desc: 'We collect information that you provide directly to us through our contact forms, applications, and during the validation process. This includes your name, email address, professional experience, resumes, and video/audio recordings used for language proficiency testing.',
      section2Title: '2. How We Use Your Data',
      section2ListItem1: 'To evaluate your skills for nearshore job opportunities.',
      section2ListItem2: 'To present curated shortlists to our partner companies.',
      section2ListItem3: 'To communicate with you regarding your application or inquiry.',
      section2ListItem4: 'To improve our validation methodology and platform experience.',
      section3Title: '3. Data Sharing',
      section3Desc: 'We share candidate data (scorecards, resumes, and results) only with prospective employers who have entered into a confidential recruitment agreement with us. We never sell your data to third parties.',
      section4Title: '4. Your Rights',
      section4Desc: 'You have the right to request access to, correction of, or deletion of your personal data at any time. To exercise these rights, please contact us at privacy@talentsync360.com.',
      footer: 'Last Updated: April',
    },
  },
  es: {
    nav: {
      companies: 'Empresas',
      talents: 'Talento',
      methodology: 'Metodología',
      contact: 'Contactar',
      contactShort: 'Contacto',
    },
    footer: {
      tagline: 'Shortlists curadas de talento nearshore (LATAM) con ingles C1+ verificado.',
      companiesTitle: 'Para Empresas',
      companiesLink1: 'Contratar Talento',
      companiesLink2: 'Metodologia 360',
      talentsTitle: 'Para Talento',
      talentsLink1: 'Validar Perfil',
      talentsLink2: 'Oportunidades',
      resourcesTitle: 'Recursos',
      resourcesLink1: 'Contacto Soporte',
      copyright: 'Todos los derechos reservados.',
      terms: 'Terminos de Servicio',
      privacy: 'Politica de Privacidad',
    },
    home: {
      heroBadge: 'Talento LATAM Validado. No es Bolsa de Trabajo.',
      heroTitle: 'Contrata LATAM. Con Criterio.',
      heroSubtitle: 'Te enviamos 3-5 candidatos validados. Vos decis. Sin pilas de CVs.',
      ctaShortlist: 'Solicitar Shortlist',
      ctaGoldList: 'Mira Como Funciona',
      pipelineTitle: 'Como Funciona TalentSync360',
      pipelineTagline: 'Criterio real. Tres pasos hasta candidatos validados.',
      pipelineSub: 'Sin pilas de CVs. Sin especulacion. Solo candidatos validados.',
      step1Label: 'Paso 1',
      step1Title: 'Vos Nos Das el Brief. Nosotros Validamos Viabilidad.',
      step1Desc: 'Contanos rol, KPIs, rango salarial y requisitos. Confirmamos viabilidad en 24h.',
      step2Label: 'Paso 2',
      step2Title: 'Nosotros Validamos y Testeamos',
      step2Desc: 'Test de ingles + tarea practica. Candidatos evaluados en habilidades reales. Sin especulacion.',
      step3Label: 'Paso 3',
      step3Title: 'Shortlist en Tu Inbox. Lista para Entrevistar.',
      step3Desc: '3-5 candidatos pre-screenados con scorecards. Vos entrevistas, vos decis.',
      trustTitle: 'Que Realmente Entregamos',
      trust1Value: '3–5',
      trust1Label: 'Shortlist Curada. No Pila de CVs.',
      trust1Desc: 'Nosotros filtramos. Vos entrevistas. Sin pila de CVs para ordenar.',
      trust2Value: '100%',
      trust2Label: 'Ingles Verificado. No Autodeclarado.',
      trust2Desc: 'Cada candidato validado en ingles real. Sin especulacion.',
      trust3Value: '48h',
      trust3Label: 'Candidatos en 48h',
      trust3Desc: 'Viabilidad confirmada. Shortlist enviada. Vos decis el siguiente paso.',
      ctaTitle: 'Listo para Empezar?',
      ctaDesc: 'Envianos tu brief. Confirmamos viabilidad y entregamos tu shortlist en 48 horas.',
      ctaButton: 'Solicita Tu Shortlist',
    },
    companies: {
      badge: 'Para Empresas',
      title: 'Staffing LATAM. Demostra Cada Contratacion.',
      subtitle: 'Shortlists curadas con screening humano, pruebas practicas y scorecards basados en evidencia. Menos rotacion, menos riesgo, mas velocidad.',
      ctaShortlist: 'Solicitar Shortlist',
      ctaMethodology: 'Ver Nuestro Estandar',
      tiersTitle: 'Elegi Tu Tier de Shortlist',
      tiersSubtitle: 'Cada tier incluye screening humano y evaluacion basada en evidencia. Elegi la profundidad que se adapte a tus necesidades de confianza.',
      rolesTitle: 'Roles Nearshore Principales que Cubrimos',
      rolesSubtitle: 'Roles de baja friccion pre-validados para integracion inmediata.',
      ctaTitle: 'Listo para escalar tu equipo?',
      ctaDesc: 'Reserva una llamada de alineacion de 15 minutos para entender tus necesidades y confirmar disponibilidad de talento.',
      ctaButton: 'Reservar Llamada',
    },
    talents: {
      badge: 'La Gold List',
      title: 'Valida tu Perfil. Accede a Oportunidades Globales.',
      subtitle: 'TalentSync360 no es una bolsa de trabajo. Es una plataforma de validacion 360 que conecta al 1% del talento LATAM con empresas de EE.UU. y Europa.',
      subtitleAccent: 'Ingles Comprobado. Ejecucion Comprobada. Confiabilidad Comprobada.',
      ctaApply: 'Aplicar a la Gold List',
      processTitle: 'El Proceso de Validacion',
      processSubtitle: 'Riguroso, justo y orientado a resultados de rendimiento reales.',
      stage1Label: 'Etapa 1: Nota de Voz',
      stage1Title: 'Verificacion de Ingles C1+',
      stage1Desc: 'Envianos una grabacion de 90 segundos demostrando tu experiencia y habilidades de manejo de crisis. Evaluamos claridad, confianza y acento profesional.',
      stage2Label: 'Etapa 2: Prueba de Escritura',
      stage2Title: 'Comunicacion Empresarial',
      stage2Desc: 'Resuelve un caso hipotetico por email bajo presion de tiempo. Evaluamos calidad de escritura, tono ejecutivo y capacidad analitica.',
      stage3Label: 'Etapa 3: Muestra de Trabajo',
      stage3Title: 'Tarea del Mundo Real',
      stage3Desc: 'Una tarea tecnica especifica del rol (QA, Soporte, Diseno, Contenido). Si pasas el scorecard, entras a la Gold List permanentemente.',
      benefitTitle: 'Beneficios para Miembros de la Gold List',
      benefit1Num: '01',
      benefit1Title: 'Exposicion de Alto Nivel',
      benefit1Desc: 'Tu perfil no compite en un mar de CVs. Estas en una shortlist curada que los CEOs ven directamente.',
      benefit2Num: '02',
      benefit2Title: 'Salarios Competitivos (USD/EUR)',
      benefit2Desc: 'Trabajamos exclusivamente con empresas que valoran tu seniority y pagan segun estandares nearshore premium.',
      benefit3Num: '03',
      benefit3Title: 'Feedback de Valor',
      benefit3Desc: 'Incluso si no llegas a la shortlist, recibis tu puntuacion en el scorecard para saber exactamente que mejorar.',
      checklistTitle: 'Tenes lo que se necesita?',
      checklist1: 'Ingles C1+ (Fluido Profesional)',
      checklist2: 'Experiencia comprobable en roles remotos',
      checklist3: 'Disponibilidad horario US (EST/CST)',
      ctaButton: 'Comenzar Validacion',
    },
    methodology: {
      badge: 'Nuestro Metodo',
      title: 'El Estandar de Calidad de Shortlist',
      subtitle: 'Cada candidato de shortlist es validado por expertos, no por algoritmos. Testing riguroso. Decisiones basadas en evidencia.',
      criteriaTitle: 'Como Validamos',
      criteria1Title: 'Ingles C1+ Verificado',
      criteria1Desc: 'Testing estandarizado (oral + escrito) corregido por humanos por expertos en idioma.',
      criteria2Title: 'Test Tecnico Especifico del Rol',
      criteria2Desc: 'Una tarea del mundo real mapeada a la descripcion del puesto con un scorecard de rendimiento claro.',
      criteria3Title: 'Screening de Soft Skills Humano',
      criteria3Desc: 'Entrevistas en vivo para validar comunicacion profesional, confiabilidad y fit cultural.',
      deliverablesTitle: 'Lo que Recibis',
      deliverablesSubtitle: 'Con cada candidato de la shortlist.',
      deliverable1: 'Perfil 360 por candidato finalista',
      deliverable2: 'Resumen ejecutivo con puntuaciones de profiency en ingles',
      deliverable3: 'Resultados de test tecnico + evidencia cruda del trabajo',
      deliverable4: 'Evaluacion comportamental detallada de soft skills',
      deliverable5: 'Recomendacion de experto + factores de riesgo potenciales',
      signalBadge: 'Con Criterio, No Al Azar',
      signalTitle: 'Con Criterio, No Al Azar',
      signalDesc: 'El matching se orienta estrictamente hacia habilidades y rendimiento verificados, no datos demograficos. Nuestros resultados se basan en evidencia objetiva (tests + scorecards humanos), minimizando el bias basado en intuicion.',
      signalResult: 'Contratas mas rapido. Decidis con evidencia. Reducis la rotacion.',
    },
    contact: {
      title: 'Ponete en Contacto',
      titleTalent: 'Aplicar a la Gold List',
      subtitle: 'Contanos sobre el rol que necesitas cubrir. Tipicamente confirmamos viabilidad y senal inicial de candidato en 24 horas.',
      subtitleTalent: 'Listo para unirte al top 1% del talento LATAM? Cuentanos sobre vos y comienza tu proceso de validacion.',
      subtitleGeneral: 'Tenes alguna pregunta o necesitás mas informacion? Estamos aca para ayudarte.',
      labelName: 'Nombre Completo *',
      labelEmail: 'Email de Trabajo *',
      labelRole: 'Estoy buscando...',
      optionB2B: 'Contratar talento nearshore (B2B)',
      optionB2C: 'Aplicar como talento (B2C)',
      optionGeneral: 'Consulta general',
      labelMessage: 'Mensaje / Requerimientos del Rol *',
      labelMessageTalent: 'Por que deberias estar en la Gold List? *',
      labelCurrentRole: 'Rol Actual *',
      labelExperience: 'Anos de Experiencia *',
      labelEnglishLevel: 'Nivel de Ingles',
      placeholderName: 'Tu nombre completo',
      placeholderEmail: 'email@tuempresa.com',
      placeholderCurrentRole: 'ej. Soporte al Cliente',
      placeholderExperience: 'ej. 5 anos',
      placeholderMessage: 'Describi brevemente el rol, habilidades requeridas y KPIs especificos...',
      placeholderMessageTalent: 'Cuentanos por que deberias estar en la Gold List...',
      buttonSubmit: 'Enviar Consulta',
      buttonSubmitTalent: 'Aplicar a la Gold List',
      privacyNote: 'Al enviar este formulario, aceptas nuestra politica de privacidad y terminos de procesamiento de datos.',
      directLabel: 'Acceso Directo',
      ctaButton: 'Reservar Llamada de Alineacion de 15 min',
    },
    terms: {
      title: 'Terminos y Condiciones',
      intro: 'Bienvenido a TalentSync360. Al acceder a nuestro sitio web y utilizar nuestros servicios, aceptas cumplir y estar sujeto a los siguientes terminos.',
      section1Title: '1. Servicios Prestados',
      section1Desc: 'TalentSync360 ofrece servicios de reclutamiento, validacion y caza de talentos para talento nearshore. Actuamos como puente entre profesionales de alta calidad en LATAM y empresas que buscan habilidades validadas.',
      section2Title: '2. Integridad Profesional',
      section2Desc: 'Los candidatos que aplican a traves de nuestra plataforma garantizan que toda la informacion proporcionada (experiencia, habilidades e identidad) es veridica. La informacion falsa puede resultar en expulsion inmediata de la Gold List y notificacion al cliente involucrado.',
      section3Title: '3. Sin Garantia de Colocacion',
      section3Desc: 'Si bien nos esforzamos por conectar al mejor talento con empresas de elite, la entrada a nuestro proceso de validacion o a la Gold List no garantiza empleo o colocacion inmediata.',
      section4Title: '4. Limitacion de Responsabilidad',
      section4Desc: 'TalentSync360 no es responsable de los resultados posteriores a la contratacion de un candidato. Todas las decisiones y contratos de empleo finales son responsabilidad de la empresa contratante y del profesional.',
      footer: 'Estos terminos son efectivos desde Abril',
    },
    privacy: {
      title: 'Politica de Privacidad',
      intro: 'En TalentSync360, estamos comprometidos a proteger tu privacidad y garantizar la seguridad de tus datos personales. Esta politica describe como recopilamos, usamos y protegemos tu informacion.',
      section1Title: '1. Informacion que Recopilamos',
      section1Desc: 'Recopilamos informacion que nos proporcionas directamente a traves de nuestros formularios de contacto, solicitudes y durante el proceso de validacion. Esto incluye tu nombre, direccion de correo electronico, experiencia profesional, curriculums y grabaciones de video/audio utilizadas para pruebas de proficiency en idiomas.',
      section2Title: '2. Como Usamos Tus Datos',
      section2ListItem1: 'Para evaluar tus habilidades para oportunidades de trabajo nearshore.',
      section2ListItem2: 'Para presentar shortlists curadas a nuestras empresas asociadas.',
      section2ListItem3: 'Para comunicarnos contigo respecto a tu solicitud o consulta.',
      section2ListItem4: 'Para mejorar nuestra metodologia de validacion y experiencia de plataforma.',
      section3Title: '3. Compartir de Datos',
      section3Desc: 'Solo compartimos datos de candidatos (scorecards, curriculums y resultados) con empleadores potenciales que han celebrado un acuerdo de reclutamiento confidencial con nosotros. Nunca vendemos tus datos a terceros.',
      section4Title: '4. Tus Derechos',
      section4Desc: 'Tienes derecho a solicitar acceso, correccion o eliminacion de tus datos personales en cualquier momento. Para ejercer estos derechos, contactanos en privacy@talentsync360.com.',
      footer: 'Ultima Actualizacion: Abril',
    },
  },
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ts360-lang') as Language | null;
    if (stored === 'en' || stored === 'es') {
      setLangState(stored);
    } else {
      setLangState('en');
    }
    setMounted(true);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('ts360-lang', newLang);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      lang: 'en' as Language,
      setLang: () => {},
      t: translations['en'],
    };
  }
  return context;
}
