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
      talentPoolTitle: string;
      talentPoolSub: string;
      engineLoadLabel: string;
      availableEngineTimeLabel: string;
      solutionSplit: {
        consultancyTitle: string;
        consultancyDesc: string;
        consultancyBullet1: string;
        consultancyBullet2: string;
        consultancyBullet3: string;
        consultancyCta: string;
        startupTitle: string;
        startupDesc: string;
        startupBullet1: string;
        startupBullet2: string;
        startupBullet3: string;
        startupCta: string;
      };
      faqTitle: string;
      faqClients: { q: string; a: string }[];
      faqTalents: { q: string; a: string }[];
      solutionModals: {
        whiteLabelTitle: string;
        whiteLabelBody: string;
        whiteLabelBullet1: string;
        whiteLabelBullet2: string;
        whiteLabelBullet3: string;
        runwayTitle: string;
        runwayBody: string;
        runwayBullet1: string;
        runwayBullet2: string;
        runwayBullet3: string;
        runwayBullet4: string;
        formFirstName: string;
        formLastName: string;
        formEmail: string;
        formMessage: string;
        formSubmit: string;
        formSubmitWhiteLabel: string;
        formSubmitRunway: string;
        formSuccess: string;
        formError: string;
        msgPreloadWhiteLabel: string;
        msgPreloadRunway: string;
      };
    };
    companies: {
      badge: string;
      title: string;
      subtitle: string;
      ctaShortlist: string;
      ctaMethodology: string;
      tiersTitle: string;
      tiersSubtitle: string;
      sprintTitle: string;
      sprintPrice: string;
      sprintCandidates: string;
      sprintSla: string;
      sprintIncludes: string[];
      replacementGuarantee: string;
      noReplacement: string;
      rolesTitle: string;
      rolesSubtitle: string;
      professionalRoles: { title: string; desc: string; kpis: string }[];
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
    labelFirstName: string;
    labelLastName: string;
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
    placeholderFirstName: string;
    placeholderLastName: string;
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
      heroBadge: 'TalentSync360 Engine: High-Velocity Intake Active',
      heroTitle: 'Technical Capacity Delivery in 72 Hours.',
      heroSubtitle: 'Strategic Nearshore Capacity Partner. We operate from LATAM\'s #1 tech hub (Argentina) to ensure quality and cultural fit. Validated engineering solutions delivered fast.',
      ctaShortlist: 'For Companies',
      ctaGoldList: 'For Talents',
      pipelineTitle: 'TalentSync360 Operational Pipeline',
      pipelineTagline: 'Engineering precision. Factual validation.',
      pipelineSub: 'Decisions based on engineering evidence. Zero resume noise.',
      step1Label: '01 Intake',
      step1Title: 'Requirement Mapping',
      step1Desc: 'Role, KPIs, and cultural parameters are defined. Feasibility confirmation arrives within 24 hours.',
      step2Label: '02 Process',
      step2Title: 'Technical Vetting',
      step2Desc: 'Senior engineers conduct technical screenings and practical tasks. Recorded C1/C2 verification ensures communication clarity.',
      step3Label: '03 Output',
      step3Title: 'Shortlist Delivery',
      step3Desc: '3-5 pre-screened finalists arrive with full technical scorecards. Readiness for immediate deployment.',
      trustTitle: 'Authority Metrics',
      trust1Value: '80%',
      trust1Label: 'Talent Gap Reduction',
      trust1Desc: 'Bridging the talent gap in the Spanish market through high-speed nearshore pipelines.',
      trust2Value: '60%',
      trust2Label: 'Startups Savings',
      trust2Desc: 'Average burn rate reduction for US/EU startups using the TalentSync360 Engine.',
      trust3Value: '95%',
      trust3Label: '30-Day Fill Rate',
      trust3Desc: 'Vacancies filled within 30 days of engine activation.',
      ctaTitle: 'Activate the Engine',
      ctaDesc: 'Enter requirements. Receive curated shortlists. Extend runway.',
      ctaButton: 'Request Shortlist',
      talentPoolTitle: 'Real-time Talent Pool Velocity',
      talentPoolSub: 'The Engine eliminates fixed verticals. Infrastructure maps talent across 250+ technical parameters, ensuring precision matching based on real engineering contributions.',
      engineLoadLabel: 'ENGINE LOAD',
      availableEngineTimeLabel: 'AVAILABLE ENGINE TIME',
      solutionSplit: {
        consultancyTitle: 'For Spanish IT Consultancies',
        consultancyDesc: 'Your white-label engine to win projects without worrying about delivery.',
        consultancyBullet1: 'White-label integration with existing teams',
        consultancyBullet2: 'Immediate capacity for project overflows',
        consultancyBullet3: 'Timezone alignment with EEA operations',
        consultancyCta: 'View White-Label Terms',
        startupTitle: 'For US/EU Startups',
        startupDesc: 'Extend your runway by 60% with the best talent from Argentina in your timezone.',
        startupBullet1: '60% Average reduction in burn rate',
        startupBullet2: 'Technical vetting via Senior CTO network',
        startupBullet3: 'Flexible contract scaling (Up/Down in 30 days)',
        startupCta: 'Request Runway Analysis',
      },
      faqTitle: 'Frequently Asked Questions',
      faqClients: [
        { q: "How much does the service cost?", a: "We offer performance-based pricing starting at $350. We only win when you hire." },
        { q: "How long to receive a shortlist?", a: "Usually within 2 to 5 business days, depending on the role complexity." },
        { q: "What's the replacement guarantee?", a: "Silver and Gold tiers include a 90-day replacement guarantee at no extra cost." },
        { q: "How do you verify English levels?", a: "Every candidate undergoes a recorded C1+ Voice Check and a business writing assessment." },
        { q: "Can I hire more than one person?", a: "Yes. You can scale your team by requesting multiple shortlists or hiring several finalists." }
      ],
      faqTalents: [
        { q: "How do I get paid?", a: "Clients pay you directly. We help set up the initial contract and payment terms in USD/EUR." },
        { q: "What types of roles are available?", a: "The engine focuses on Operations, Support, Executive Assistants, QA, Design, Content Writing, and senior IT talent with 5+ years of experience." },
        { q: "Is there a cost for the talent?", a: "No. Our validation and placement services are 100% free for professionals." },
        { q: "What's the selection process?", a: "Voice Note (English), Business Writing Test, and a Practical Role-Specific Task." },
        { q: "What English level is required?", a: "We exclusively work with C1+ (Professional Fluent) candidates for international roles." }
      ],
      solutionModals: {
        whiteLabelTitle: 'White-Label Partnership Terms',
        whiteLabelBody: 'TalentSync360 Engine operates as an invisible sourcing motor for consultancies. This model eliminates recruitment overhead and accelerates technical delivery cycles.',
        whiteLabelBullet1: '72-hour curated shortlist delivery to maintain competitive speed',
        whiteLabelBullet2: 'White-label model: present profiles as your own internal talent',
        whiteLabelBullet3: '90-day replacement guarantee included at no extra cost',
        runwayTitle: 'Financial Runway Optimization Analysis',
        runwayBody: 'TalentSync360 Engine projects direct financial optimizations in engineering budgets through high-speed nearshore pipeline integration.',
        runwayBullet1: '40% to 60% proven savings vs local hiring markets',
        runwayBullet2: 'Full timezone synchronicity (EST/CST | GMT/CET) for real-time collaboration',
        runwayBullet3: 'Top 3% LATAM engineering talent with verified C1/C2 English',
        runwayBullet4: 'Flexible scaling: scale team capacity up or down in 30-day cycles',
        formFirstName: 'First Name',
        formLastName: 'Last Name',
        formEmail: 'Business Email',
        formMessage: 'Message',
        formSubmit: 'Send Request',
        formSubmitWhiteLabel: 'Send White-Label Request',
        formSubmitRunway: 'Send for Analysis',
        formSuccess: 'Request Received. The synchronization will begin shortly.',
        formError: 'Error sending request. Please try again.',
        msgPreloadWhiteLabel: 'Interested in White-Label terms for consultancy operations.',
        msgPreloadRunway: 'Requesting a Runway Analysis and nearshore cost projection.',
      }
    },
    companies: {
      badge: 'For Companies',
      title: 'Staff LATAM. Prove Every Hire.',
      subtitle: 'Curated shortlists with human screening, practical testing, and evidence-backed scorecards. Less churn, less risk, more speed.',
      ctaShortlist: 'Request Shortlist',
      ctaMethodology: 'See Our Standard',
      tiersTitle: 'Shortlist Sprint White-Label',
      tiersSubtitle: 'A single, powerful solution. A technical validation fee 100% creditable to the final hire.',
      sprintTitle: 'Shortlist Sprint',
      sprintPrice: '1,250 EUR/USD',
      sprintCandidates: '3-5 senior candidates',
      sprintSla: '72 hours',
      sprintIncludes: [
        '100% creditable to final hire',
        'Vetted senior candidates',
        'Delivered in 72h or the sprint is free',
        'Argentina Power (LATAM hub)',
      ],
      replacementGuarantee: 'Replacement guarantee included',
      noReplacement: 'No replacement guarantee',
      rolesTitle: 'Core Software Engineering Roles',
      rolesSubtitle: 'Pure tech talent pre-validated for immediate integration.',
      professionalRoles: [
        { title: 'React / Next.js Engineer', desc: 'Frontend architectures and modern web applications.', kpis: 'Code Quality, Delivery Speed' },
        { title: 'Node.js Backend Engineer', desc: 'Scalable APIs, microservices, and database optimization.', kpis: 'API Latency, Uptime' },
        { title: 'AI / ML Engineer', desc: 'LLM integrations, data pipelines, and intelligent models.', kpis: 'Model Accuracy, Deployment' },
        { title: 'DevOps / SRE', desc: 'Cloud infrastructure, CI/CD, and system reliability.', kpis: 'Deployment Frequency, MTTR' },
        { title: 'Go Developer', desc: 'High-performance backend systems and concurrency.', kpis: 'System Throughput' },
        { title: 'Python Engineer', desc: 'Backend services, data processing, and automation.', kpis: 'Clean Code, Efficiency' },
      ],
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
      labelFirstName: 'First Name *',
      labelLastName: 'Last Name *',
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
      placeholderFirstName: 'Your first name',
      placeholderLastName: 'Your last name',
      placeholderEmail: 'email@company.com',
      placeholderCurrentRole: 'e.g. Customer Support Rep',
      placeholderExperience: 'e.g. 5 years',
      placeholderMessage: 'Briefly describe the role, required skills, and specific KPIs...',
      placeholderMessageTalent: 'Tell us why you should be on the Gold List...',
      buttonSubmit: 'Request Shortlist',
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
      heroBadge: 'TalentSync360 Engine: Intake de Alta Velocidad Activo',
      heroTitle: 'Entrega de Capacidad Técnica en 72h',
      heroSubtitle: 'Partner Estratégico de Capacidad Nearshore. Operamos desde el hub técnico #1 de LATAM (Argentina) para asegurar calidad y fit cultural. Soluciones de ingeniería validadas entregadas rápido.',
      ctaShortlist: 'Para Empresas',
      ctaGoldList: 'Para Talento',
      pipelineTitle: 'Pipeline Operacional TalentSync360',
      pipelineTagline: 'Precisión de ingeniería. Validación factual.',
      pipelineSub: 'Decisiones basadas en evidencia de ingeniería. Ruido de CV cero.',
      step1Label: '01 Intake',
      step1Title: 'Mapeo de Requerimientos',
      step1Desc: 'Se definen el rol, los KPIs y los parámetros culturales. La confirmación de viabilidad llega en 24 horas.',
      step2Label: '02 Proceso',
      step2Title: 'Vetting Técnico',
      step2Desc: 'Ingenieros Senior realizan screenings técnicos y tareas prácticas. La verificación C1/C2 recorded asegura claridad comunicativa.',
      step3Label: '03 Output',
      step3Title: 'Entrega de Shortlist',
      step3Desc: '3-5 finalistas pre-seleccionados llegan con scorecards técnicos completos. Listos para deployment inmediato.',
      trustTitle: 'Métricas de Autoridad',
      trust1Value: '80%',
      trust1Label: 'Reducción de Brecha de Talento',
      trust1Desc: 'Cerrando la brecha de talento en el mercado español a través de pipelines nearshore de alta velocidad.',
      trust2Value: '60%',
      trust2Label: 'Ahorro para Startups',
      trust2Desc: 'Reducción promedio del burn rate para startups de EE.UU./UE utilizando TalentSync360 Engine.',
      trust3Value: '95%',
      trust3Label: 'Fill Rate a 30 Días',
      trust3Desc: 'Vacantes cubiertas dentro de los 30 días posteriores a la activación del motor.',
      ctaTitle: 'Activar el Motor',
      ctaDesc: 'Ingresar requerimientos. Recibir shortlists curadas. Extender runway.',
      ctaButton: 'Solicitar Shortlist',
      talentPoolTitle: 'Velocidad del Pool de Talento en Tiempo Real',
      talentPoolSub: 'El Motor de TalentSync360 elimina las verticales fijas. La infraestructura mapea talento mediante más de 250 parámetros técnicos, garantizando un emparejamiento de precisión basado en contribuciones reales de ingeniería.',
      engineLoadLabel: 'CARGA DEL MOTOR',
      availableEngineTimeLabel: 'TIEMPO DE MOTOR DISPONIBLE',
      solutionSplit: {
        consultancyTitle: 'Para Consultoras IT Españolas',
        consultancyDesc: 'Tu motor de marca blanca para ganar proyectos sin preocuparte por el delivery.',
        consultancyBullet1: 'Integración marca blanca con equipos actuales',
        consultancyBullet2: 'Capacidad inmediata para overflow de proyectos',
        consultancyBullet3: 'Alineación horaria perfecta (GMT+1/CET)',
        consultancyCta: 'Ver Términos de Marca Blanca',
        startupTitle: 'Para Startups de EE.UU./UE',
        startupDesc: 'Extendé tu runway un 60% con el mejor talento de Argentina en tu zona horaria.',
        startupBullet1: '60% de reducción promedio en burn rate',
        startupBullet2: 'Vetting técnico mediante red de CTOs Senior',
        startupBullet3: 'Escalamiento flexible de contratos (30 días)',
        startupCta: 'Solicitar Análisis de Runway',
      },
      faqTitle: 'Preguntas Frecuentes',
      faqClients: [
        { q: "¿Cuál es el costo del servicio?", a: "Ofrecemos precios basados en resultados desde $350. Solo ganamos cuando vos contratás." },
        { q: "¿Cuánto tiempo toma recibir la shortlist?", a: "Normalmente entre 2 y 5 días hábiles, según la complejidad del rol." },
        { q: "¿Qué pasa si no me gusta ningún candidato?", a: "Los tiers Plata y Oro incluyen una garantía de reemplazo de 90 días sin costo extra." },
        { q: "¿Cómo verifican el nivel de inglés?", a: "Cada candidato pasa por un Voice Check C1+ grabado y una evaluación de escritura empresarial." },
        { q: "¿Puedo contratar a más de un candidato?", a: "Sí. Podés escalar tu equipo solicitando múltiples shortlists o contratando varios finalistas." }
      ],
      faqTalents: [
        { q: "¿Cómo me pagan?", a: "Los clientes te pagan directamente. Ayudamos a configurar el contrato inicial y términos en USD/EUR." },
        { q: "¿Qué tipo de roles están buscando?", a: "El motor de búsqueda se enfoca en Operaciones, Soporte, Asistentes Ejecutivos, QA, Diseño, Redacción de Contenido y talento IT senior con más de 5 años de experiencia comprobable." },
        { q: "¿Tiene algún costo para el talento?", a: "No. Nuestros servicios de validación y colocación son 100% gratuitos para profesionales." },
        { q: "¿Cómo es el proceso de selección?", a: "Nota de Voz (Inglés), Test de Escritura y una Tarea Práctica específica del rol." },
        { q: "¿Qué nivel de inglés necesito?", a: "Trabajamos exclusivamente con candidatos C1+ (Fluido Profesional) para roles internacionales." }
      ],
      solutionModals: {
        whiteLabelTitle: 'Términos de Partner Marca Blanca',
        whiteLabelBody: 'El Motor de TalentSync360 opera como un motor de sourcing invisible para consultoras. Este modelo elimina los costos fijos de reclutamiento y acelera los ciclos de entrega técnica.',
        whiteLabelBullet1: 'Entrega de shortlists curadas en 72 horas para mantener competitividad',
        whiteLabelBullet2: 'Modelo marca blanca: presentación de perfiles como talento propio',
        whiteLabelBullet3: 'Garantía de reemplazo de 90 días incluida sin costo adicional',
        runwayTitle: 'Análisis de Optimización de Runway',
        runwayBody: 'El Motor de TalentSync360 proyecta optimizaciones financieras directas en presupuestos de ingeniería mediante integración de pipelines nearshore.',
        runwayBullet1: 'Ahorro comprobado de entre el 40% y 60% vs contratación local',
        runwayBullet2: 'Sincronía horaria completa (GMT+1/CET | EST/CST) para trabajo en tiempo real',
        runwayBullet3: 'Talento Top 3% de ingeniería LATAM con inglés C1/C2 verificado',
        runwayBullet4: 'Escalamiento flexible: ajuste de capacidad de equipo en ciclos de 30 días',
        formFirstName: 'Nombre',
        formLastName: 'Apellido',
        formEmail: 'Email Corporativo',
        formMessage: 'Mensaje',
        formSubmit: 'Enviar Solicitud',
        formSubmitWhiteLabel: 'Enviar Solicitud de Marca Blanca',
        formSubmitRunway: 'Enviar para Análisis',
        formSuccess: 'Solicitud Recibida. La sincronización comenzará pronto.',
        formError: 'Error al enviar la solicitud. Por favor reintentá.',
        msgPreloadWhiteLabel: 'Interés en términos de Marca Blanca para operaciones de consultoría.',
        msgPreloadRunway: 'Solicitud de Análisis de Runway y proyección de costos nearshore.',
      }
    },
    companies: {
      badge: 'Para Empresas',
      title: 'Talento LATAM validado con inglés C1+ y screening humano.',
      subtitle: 'Liberación operativa en tu zona horaria.',
      ctaShortlist: 'Solicitar Shortlist',
      ctaMethodology: 'Ver Nuestro Estándar',
      tiersTitle: 'Shortlist Sprint White-Label',
      tiersSubtitle: 'Una única y potente solución. Un fee de validación técnica 100% acreditable a la contratación final.',
      sprintTitle: 'Shortlist Sprint',
      sprintPrice: '1.250 EUR/USD',
      sprintCandidates: '3-5 candidatos senior',
      sprintSla: '72 horas',
      sprintIncludes: [
        '100% acreditable a la contratación final',
        'Candidatos senior veteados en 72 horas',
        'O el sprint es gratis',
        'Argentina Power (hub LATAM)',
      ],
      replacementGuarantee: 'Garantía de reemplazo',
      noReplacement: 'Sin garantía de reemplazo',
      rolesTitle: 'Roles Principales de Ingeniería de Software',
      rolesSubtitle: 'Talento puramente técnico pre-validado para integración inmediata.',
      professionalRoles: [
        { title: 'React / Next.js Engineer', desc: 'Arquitecturas frontend y aplicaciones web modernas.', kpis: 'Calidad de Código, Velocidad de Entrega' },
        { title: 'Node.js Backend Engineer', desc: 'APIs escalables, microservicios y optimización de bases de datos.', kpis: 'Latencia API, Uptime' },
        { title: 'AI / ML Engineer', desc: 'Integraciones LLM, pipelines de datos y modelos inteligentes.', kpis: 'Precisión de Modelos, Deployment' },
        { title: 'DevOps / SRE', desc: 'Infraestructura cloud, CI/CD y confiabilidad de sistemas.', kpis: 'Frecuencia de Deployment, MTTR' },
        { title: 'Go Developer', desc: 'Sistemas backend de alto rendimiento y concurrencia.', kpis: 'Throughput del Sistema' },
        { title: 'Python Engineer', desc: 'Servicios backend, procesamiento de datos y automatización.', kpis: 'Código Limpio, Eficiencia' },
      ],
      ctaTitle: '¿Listo para escalar tu equipo?',
      ctaDesc: 'Reservá una llamada de alineación de 15 minutos para entender tus necesidades y confirmar disponibilidad de talento.',
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
      labelFirstName: 'Nombre *',
      labelLastName: 'Apellido *',
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
      placeholderFirstName: 'Tu nombre',
      placeholderLastName: 'Tu apellido',
      placeholderEmail: 'email@tuempresa.com',
      placeholderCurrentRole: 'ej. Soporte al Cliente',
      placeholderExperience: 'ej. 5 anos',
      placeholderMessage: 'Describi brevemente el rol, habilidades requeridas y KPIs especificos...',
      placeholderMessageTalent: 'Cuentanos por que deberias estar en la Gold List...',
      buttonSubmit: 'Solicitar Shortlist',
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
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ts360-lang') as Language | null;
      if (stored === 'en' || stored === 'es') return stored;
    }
    return 'en';
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
