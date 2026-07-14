export type Language = 'en' | 'es';

export interface Translations {
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
    ctaTalent: string;
    heroStat1Value: string;
    heroStat1Label: string;
    heroStat2Value: string;
    heroStat2Label: string;
    heroStat3Value: string;
    heroStat3Label: string;
    heroQualifier: string;

    icp: {
      title: string;
      cards: { title: string; desc: string }[];
    };

    talentPathway: {
      title: string;
      desc: string;
      cta: string;
    };

    pain: {
      title: string;
      card1Title: string;
      card1Desc: string;
      card2Title: string;
      card2Desc: string;
      card3Title: string;
      card3Desc: string;
      card4Title: string;
      card4Desc: string;
    };

    sprint: {
      eyebrow: string;
      title: string;
      desc: string;
      cta: string;
      specsTitle: string;
      specsStatus: string;
      items: string[];
    };

    demo: {
      eyebrow: string;
      title: string;
      explanation: string;
      subtitle: string;
      workspaceTitle: string;
      sampleBrief: string;
      briefDetails: string;
      tabInternal: string;
      tabClient: string;
      clientPortal: string;
      activeBrief: string;
      briefContext: string;
      availability: string;
      communication: string;
      vettingStatus: string;
      keyStrength: string;
      internalRisk: string;
      vettingChecklist: string;
      vettingEngineer: string;
      languageVerification: string;
      copyPastePrompt: string;
      readyPrompt: string;
      clientBrandingActive: string;
      btnInterview: string;
      embedNote: string;
      labelRequirement: string;
      labelEvidence: string;
      labelRationale: string;
      labelGap: string;
      labelNote: string;
      labelQuestion: string;
      loadingDemo: string;
      riskLabel: string;
      candidates: {
        name: string;
        country: string;
        timezone: string;
        match: string;
        exp: string;
        comm: string;
        avail: string;
        strength: string;
        risk: string;
        status: string;
        rationale: string;
        gap: string;
        note: string;
        question: string;
      }[];
    };

    howItWorks: {
      title: string;
      step1Title: string;
      step1Desc: string;
      step2Title: string;
      step2Desc: string;
      step3Title: string;
      step3Desc: string;
    };

    evidence: {
      eyebrow: string;
      title: string;
      desc: string;
      disclaimer: string;
      items: string[];
    };

    useCases: {
      eyebrow: string;
      title: string;
      items: { title: string; desc: string }[];
    };

    secondaryStartup: {
      title: string;
      desc: string;
      cta: string;
    };

    finalCta: {
      title: string;
      desc: string;
      cta: string;
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

    // Keep old variables for fallback compatibility
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
    talentGridProfiles: string;
    talentGridVetted: string;
    talentGridSimulated: string;
    talentGridDisclaimer: string;
    talentGridSignalMap: string;
    levelSenior: string;
    levelExpert: string;
    levelArch: string;
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
  itConsultancies: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPilot: string;
    ctaMethodology: string;
    sectionAudienceTitle: string;
    sectionAudienceSubtitle: string;
    audience1Title: string;
    audience1Desc: string;
    audience2Title: string;
    audience2Desc: string;
    audience3Title: string;
    audience3Desc: string;
    sectionWhiteLabelTitle: string;
    sectionWhiteLabelDesc: string;
    bullet1Title: string;
    bullet1Desc: string;
    bullet2Title: string;
    bullet2Desc: string;
    bullet3Title: string;
    bullet3Desc: string;
    screenTitle: string;
    screenBullet1: string;
    screenBullet2: string;
    screenBullet3: string;
    screenBullet4: string;
    processTitle: string;
    processSubtitle: string;
    step1Label: string;
    step1Title: string;
    step1Desc: string;
    step2Label: string;
    step2Title: string;
    step2Desc: string;
    step3Label: string;
    step3Title: string;
    step3Desc: string;
    ctaTitle: string;
    ctaDesc: string;
    ctaButton: string;
  };
  whatsapp: {
    buttonLabel: string;
    prefilledMessage: string;
    tooltip: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      companies: 'Companies',
      talents: 'Talents',
      methodology: 'Methodology',
      contact: 'Contact Us',
      contactShort: 'Contact',
    },
    footer: {
      tagline: 'Curated LATAM technical shortlists with human screening, technical signals, and English communication checks.',
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
      heroBadge: 'TECH TALENT INFRASTRUCTURE',
      heroTitle: 'Turn technical talent needs into decision-ready LATAM shortlists.',
      heroSubtitle: 'We help IT consultancies, staff augmentation agencies, software factories, startups and technology teams evaluate and present LATAM talent through structured evidence, human review and AI assistance.',
      ctaShortlist: 'Request a shortlist',
      ctaGoldList: 'View demo',
      ctaTalent: 'I’m a candidate',
      heroStat1Value: '72h Cycle',
      heroStat1Label: 'Target delivery timeframe',
      heroStat2Value: 'Human Vetted',
      heroStat2Label: 'Strict screening filter',
      heroStat3Value: 'White-Label',
      heroStat3Label: 'Direct client-ready format',
      heroQualifier: 'Target delivery begins after the technical brief has been validated. Highly specialized roles may require 2–5 business days.',

      icp: {
        title: 'One infrastructure, multiple hiring models',
        cards: [
          { title: 'IT Consultancies', desc: 'Respond to client briefs with structured technical shortlists ready to present.' },
          { title: 'Staff Augmentation Agencies', desc: 'Accelerate candidate validation and present LATAM talent through your existing commercial model.' },
          { title: 'Software Factories', desc: 'Cover new projects, specialized stacks and demand peaks without overloading your senior team.' },
          { title: 'Startups and Product Teams', desc: 'Build technical capacity without creating a full internal recruiting operation.' },
          { title: 'Direct-Hiring Companies', desc: 'Receive pre-evaluated candidates for permanent or long-term internal roles.' }
        ]
      },

      talentPathway: {
        title: 'Are you a LATAM developer or technology professional?',
        desc: 'Build your profile, share evidence of your experience and access opportunities aligned with your stack, seniority and availability.',
        cta: 'Join as talent'
      },

      pain: {
        title: 'The bottleneck is not finding profiles. It is turning them into reliable decisions.',
        card1Title: 'Senior screening load',
        card1Desc: 'Tech Leads, Delivery Managers and hiring teams spend valuable time reviewing profiles that lack structured evidence.',
        card2Title: 'Slow response',
        card2Desc: 'When an active need takes too long to qualify, projects, client opportunities and hiring plans lose momentum.',
        card3Title: 'Evidence that is difficult to compare',
        card3Desc: 'CVs, interviews and notes arrive in different formats, making consistent comparison difficult.',
        card4Title: 'Validation risk',
        card4Desc: 'Advancing with weak or incomplete evidence increases unproductive interviews, onboarding friction and delivery risk.',
      },

      sprint: {
        eyebrow: 'Primary Offer',
        title: 'One active brief. One focused Sprint. One client-ready shortlist.',
        desc: 'We focus sourcing and evaluation on one validated technical brief to deliver 3–5 finalists with comparable evidence and human review.',
        cta: 'Validate your brief',
        specsTitle: 'Sprint Specifications',
        specsStatus: 'STATUS: READY',
        items: [
          'One validated technical brief',
          'LATAM sourcing and pre-screening',
          '3–5 human-reviewed finalists',
          'Evidence-backed candidate scorecards',
          'White-label client presentation',
          'One structured feedback round',
          'Target delivery after brief validation',
          'Specialized-role exception'
        ],
      },

      demo: {
        eyebrow: 'INTERACTIVE DEMO',
        title: 'White-label candidate presentation',
        explanation: 'Consultancies and partners can present the shortlist under their own brand. Direct employers use it as a structured workspace for hiring decisions.',
        subtitle: 'Sample experience using fictional candidate data.',
        workspaceTitle: 'NovaTech Consulting Workspace',
        sampleBrief: 'Senior Node.js / TypeScript Engineer',
        briefDetails: 'B2B SaaS · Remote · Europe overlap',
        tabInternal: 'Internal Review',
        tabClient: 'Client Presentation',
        clientPortal: 'CLIENT PORTAL',
        activeBrief: 'Active Brief: Node.js',
        briefContext: 'Brief Context',
        availability: 'Availability',
        communication: 'Technical Communication',
        vettingStatus: 'Review Status',
        keyStrength: 'Key Strength',
        internalRisk: '(Internal Risk Indicator)',
        vettingChecklist: 'Vetting Assurance Checklist',
        vettingEngineer: 'Vetting Engineer: Senior Backend Specialist',
        languageVerification: 'Language Verification: Recorded audio & script pass',
        copyPastePrompt: '(Copy & Paste to Client Briefing)',
        readyPrompt: 'Ready to request the candidate file?',
        clientBrandingActive: 'CLIENT BRANDING APPLIED',
        btnInterview: 'Book Final Interview',
        embedNote: 'Sample client-facing presentation using the fictional NovaTech Consulting identity.',
        labelRequirement: 'Role Requirement',
        labelEvidence: 'Candidate Evidence',
        labelRationale: 'Match Rationale',
        labelGap: 'Identified Gap',
        labelNote: 'Reviewer Note',
        labelQuestion: 'Recommended Interview Question',
        loadingDemo: 'Loading white-label demo...',
        riskLabel: 'Uncertainty:',
        candidates: [
          {
            name: 'Candidate A.R.',
            country: 'Argentina',
            timezone: 'GMT-3',
            match: 'High fit',
            exp: '6 years Node.js & NestJS',
            comm: 'High technical communication signal',
            avail: '2 weeks',
            strength: 'Architected B2B billing systems; strong TypeScript type-safety expert',
            risk: 'Limited direct experience with AWS serverless (primarily ECS/Docker)',
            status: 'Human review completed',
            rationale: 'Candidate has built scalable Node.js microservices. Deep understanding of async communication.',
            gap: 'No serverless framework usage; needs minor onboarding on AWS Lambda.',
            note: 'Exceptional communication. Highly proactive. The stack aligns strongly with the core B2B platform requirements.',
            question: 'Can you explain a scenario where you optimized a SQL query that was blocking a database connection in Node.js?',
          },
          {
            name: 'Candidate M.S.',
            country: 'Colombia',
            timezone: 'GMT-5',
            match: 'High fit',
            exp: '5 years Node.js, Express & React',
            comm: 'High technical communication signal',
            avail: 'Immediate',
            strength: 'Full-stack profile; optimized SQL database queries reducing latency by 40%',
            risk: 'Prefers full-stack work; may get disengaged if limited only to pure backend APIs',
            status: 'Human review completed',
            rationale: 'Very strong problem solver. Has experience working with European startup timezone overlap.',
            gap: 'Database optimization is strong, but architectural design patterns are junior compared to Candidate A.R.',
            note: 'Highly motivated, ready to deploy immediately.',
            question: 'How do you handle state synchronization between microservices without creating tight coupling?',
          },
          {
            name: 'Candidate J.L.',
            country: 'Uruguay',
            timezone: 'GMT-3',
            match: 'Moderate fit',
            exp: '7 years Backend (Python & Node.js)',
            comm: 'High technical communication signal',
            avail: '4 weeks',
            strength: 'Strong DevOps understanding, CI/CD setup, Docker and PostgreSQL performance tuning',
            risk: 'Longer notice period (4 weeks)',
            status: 'Human review completed',
            rationale: 'Great fit for projects requiring infrastructure tuning alongside API development.',
            gap: 'Notice period is 4 weeks. Backend experience is split between Python and NodeJS.',
            note: 'Very stable profile, excellent code structure.',
            question: 'Describe how you would set up a CI/CD pipeline for a Node.js API with automated testing.',
          }
        ]
      },

      howItWorks: {
        title: 'How it works',
        step1Title: '1. Validate the brief',
        step1Desc: 'Define the stack, seniority, project context, timezone, language requirements and non-negotiables.',
        step2Title: '2. Screen and review',
        step2Desc: 'Talent signals are structured with AI assistance and reviewed by a senior human before delivery.',
        step3Title: '3. Review or present the shortlist',
        step3Desc: 'Consultancies and partners can use the white-label presentation. Direct employers receive a structured decision workspace.',
      },

      evidence: {
        eyebrow: 'Deliverable Evidence',
        title: 'What you actually receive',
        desc: 'We compile structured evidence for every finalist candidate. Instead of generic CVs, your delivery managers receive a complete decision package containing raw vetting signals, enabling you to present verified technical capability to your final client.',
        disclaimer: 'TalentSync360 does not make automated hiring decisions, guarantee perfect matches or certify a specific English level. Every shortlist is reviewed by a human before delivery.',
        items: [
          'Candidate executive summary',
          'Requirement-by-requirement match',
          'Technical evidence (runnable code tests & screener scorecards)',
          'Communication signals (recorded oral checks & writing tasks)',
          'Availability and timezone confirmation',
          'Operational risks and potential gaps identified',
          'Human reviewer notes & stack alignment',
          'Recommended final-interview questions'
        ],
      },

      useCases: {
        eyebrow: 'Operational Applications',
        title: 'Where TalentSync360 fits',
        items: [
          { title: 'Responding to an urgent client brief', desc: 'Structure and review a shortlist for an active client requirement without diverting the entire senior team.' },
          { title: 'Covering delivery overflow', desc: 'Add evaluation capacity when project demand temporarily exceeds the team’s internal recruiting or screening bandwidth.' },
          { title: 'Validating candidates already sourced internally', desc: 'Apply a consistent scorecard to candidates already found by recruiters, referrals or existing channels.' },
          { title: 'Entering an unfamiliar technical stack', desc: 'Clarify technical evidence and open questions when hiring for a stack your current team does not evaluate frequently.' },
          { title: 'Building a LATAM delivery pod', desc: 'Compare candidates for a distributed LATAM team using shared criteria for stack, communication, availability and timezone.' },
          { title: 'Hiring for an internal product or technology team', desc: 'Support direct hiring with pre-evaluated profiles and structured evidence for permanent or long-term roles.' }
        ]
      },

      secondaryStartup: {
        title: 'Hiring directly for your own product team?',
        desc: 'TalentSync360 also supports startups and technology companies building their own LATAM engineering teams.',
        cta: 'Explore hiring for companies',
      },

      finalCta: {
        title: 'Do you have an active technical talent need?',
        desc: 'Validate the role, context and shortlist feasibility before investing senior hours in screening.',
        cta: 'Request a Shortlist Sprint',
      },

      faqTitle: 'Frequently Asked Questions',
      faqClients: [
        { q: "Do you replace our internal recruiters?", a: "No. We act as an acceleration engine. Your recruiters focus on final coordination and client relations, while we handle specialized technical vetting." },
        { q: "Can candidates be presented under our own brand?", a: "Yes. Our deliverables are fully white-label. We supply anonymized profiles and scorecards that you can customize with your company logo and present as your own capability." },
        { q: "When does the 72-hour target begin?", a: "The target starts immediately after your technical brief has been validated and confirmed by our sourcing leads. This ensures we align search parameters before starting the clock." },
        { q: "What happens if the first shortlist is not suitable?", a: "If the initial candidates do not match, we review your structured feedback and execute a recalibration sprint according to the agreed brief scope, adjusting parameters immediately." },
        { q: "How is technical evidence reviewed?", a: "We do not rely on automated tests. Every test, work sample, and audio check is personally reviewed and scored by a senior engineer with relevant stack expertise." },
        { q: "Does AI automatically reject or select candidates?", a: "No. AI is used as decision support for signal extraction and rubric mapping. All final selection and rejection decisions remain strictly human-reviewed and operator-controlled." },
        { q: "Can a Shortlist Sprint continue as an ongoing service?", a: "Yes. Sprints can be scheduled on demand, or we can establish a recurring pipeline for active consultancies with ongoing recruitment flows." }
      ],

      faqTalents: [
        { q: "How do I get paid?", a: "Clients pay you directly. We help set up the initial contract and payment terms in USD/EUR." },
        { q: "What types of roles are available?", a: "The engine highlights our specialization in Commercial and Strategic Consulting, Talent Leaders and Senior Recruiters, and Technological Profiles with Business Vision. We maintain an emphasis on verifiable experience focused on 360° Profiles (reputation, results, and impact)." },
        { q: "Is there a cost for the talent?", a: "No. Our validation and placement services are 100% free for professionals." },
        { q: "What's the selection process?", a: "Voice Note (English), Business Writing Test, and a Practical Role-Specific Task." },
        { q: "What English level is required?", a: "While we prioritize profiles with C1 fluency for international markets, the English level is not 100% exclusive. We validate each talent's technical communication capacity to ensure the team fit is productive from day 1." }
      ],

      solutionModals: {
        whiteLabelTitle: 'White-Label Partnership Terms',
        whiteLabelBody: 'TalentSync360 Engine operates as an invisible sourcing motor for consultancies. This model eliminates recruitment overhead and accelerates technical delivery cycles.',
        whiteLabelBullet1: '72-hour curated shortlist delivery to maintain competitive speed',
        whiteLabelBullet2: 'White-label model: present profiles as your own internal talent',
        whiteLabelBullet3: '90-day replacement guarantee included at no extra cost',
        runwayTitle: 'Sourcing Optimization Analysis',
        runwayBody: 'TalentSync360 projects sourcing efficiency and budget optimization through timezone-aligned nearshore integrations.',
        runwayBullet1: 'Sourcing efficiency compared to local hiring markets',
        runwayBullet2: 'Full timezone synchronicity (EST/CST | GMT/CET) for real-time collaboration',
        runwayBullet3: 'Senior LATAM developers with English communication screening',
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
        msgPreloadRunway: 'Requesting a Sourcing Analysis and nearshore integration projection.',
      },

      // Keep old variables for fallback compatibility
      pipelineTitle: 'TalentSync360 Operational Pipeline',
      pipelineTagline: 'Technical screening criteria. Evidence-backed scorecards.',
      pipelineSub: 'Decisions based on technical signals. Zero resume noise.',
      step1Label: '01 Intake',
      step1Title: 'Requirement Mapping',
      step1Desc: 'Role, KPIs, and cultural parameters are defined. Feasibility confirmation arrives within 24 hours.',
      step2Label: '02 Process',
      step2Title: 'English & Technical Screening',
      step2Desc: 'Senior engineers conduct technical screenings against strict criteria. English communication screening ensures team alignment.',
      step3Label: '03 Output',
      step3Title: 'Shortlist Delivery',
      step3Desc: '3-5 screened finalists arrive with evidence-backed scorecards, ready for your interview process.',
      trustTitle: 'Vetting Standard',
      trust1Value: '72h',
      trust1Label: 'Shortlist Sprints',
      trust1Desc: 'Sprints designed for 48-72h shortlist cycles with a 72h target SLA for validated briefs.',
      trust2Value: '360°',
      trust2Label: 'Vetting Matrix',
      trust2Desc: 'Rigorous technical assessments, communication screenings, and culture fit evaluations.',
      trust3Value: '100%',
      trust3Label: 'Human-Screened',
      trust3Desc: 'Every candidate is personally reviewed by senior engineers before introduction.',
      ctaTitle: 'Activate the Engine',
      ctaDesc: 'Enter requirements. Receive curated shortlists. Reduce hiring noise.',
      ctaButton: 'Request Shortlist',
      talentPoolTitle: 'Real-time Sourcing Capability',
      talentPoolSub: 'The engine maps talent parameters dynamically, matching skills and experience directly to your technical requirements.',
      engineLoadLabel: 'ENGINE LOAD',
      availableEngineTimeLabel: 'AVAILABLE ENGINE TIME',
      talentGridProfiles: 'Profiles',
      talentGridVetted: 'Vetted',
      talentGridSimulated: '* Simulated load indicator',
      talentGridDisclaimer: 'Disclaimer: Region tracking and profile counts are simulated demonstration metrics of engine capacity. TalentSync360 does not make automated hiring decisions. AI assists signal extraction, rubric mapping, and shortlist preparation. Final evaluation remains human-reviewed and client-controlled.',
      talentGridSignalMap: 'DEMONSTRATION SIGNAL MAP | SCANNED REGIONS: LATAM-1 (ARG, BRA, COL, MEX) | LATAM-2 (CHL, PER, URY)',
      levelSenior: 'Senior',
      levelExpert: 'Expert',
      levelArch: 'Arch',
      solutionSplit: {
        consultancyTitle: 'For Spanish IT Consultancies',
        consultancyDesc: 'Your white-label partner to accelerate client project delivery without sourcing overhead.',
        consultancyBullet1: 'White-label integration with existing development teams',
        consultancyBullet2: 'Shortlist velocity to resolve project overflows quickly',
        consultancyBullet3: 'Timezone-aligned engineers matching your operations',
        consultancyCta: 'View White-Label Terms',
        startupTitle: 'For US/EU Startups',
        startupDesc: 'Deploy delivery-ready engineering talent aligned with your timezone and business goals.',
        startupBullet1: 'Timezone alignment for real-time collaboration',
        startupBullet2: 'Technical screening based on criteria',
        startupBullet3: 'Flexible contract scaling (up/down in 30 days)',
        startupCta: 'Request Sourcing Analysis',
      }
    },
    companies: {
      badge: 'For Companies',
      title: 'Staff LATAM. Prove Every Hire.',
      subtitle: 'Curated shortlists with human screening, practical testing, and evidence-backed scorecards. Less churn, less risk, more speed.',
      ctaShortlist: 'Request Shortlist',
      ctaMethodology: 'See Our Standard',
      tiersTitle: 'Shortlist Sprint White-Label',
      tiersSubtitle: 'A single, powerful solution. A technical validation fee that can be credited toward a follow-on engagement.',
      sprintTitle: 'Shortlist Sprint',
      sprintPrice: '€1,250 / $1,250',
      sprintCandidates: '3-5 senior candidates',
      sprintSla: '72 hours',
      sprintIncludes: [
        'Fee may be credited toward follow-on engagement',
        'Vetted senior candidates',
        'Target SLA of 72 hours for validated briefs',
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
      stage1Title: 'English Communication Screening',
      stage1Desc: 'Submit a 90-second recording demonstrating your experience and communication skills. We evaluate clarity, confidence, and professional delivery.',
      stage2Label: 'Stage 2: Writing Test',
      stage2Title: 'Business Communication',
      stage2Desc: 'Solve a hypothetical case via email under time pressure. We evaluate writing quality, executive tone, and analytical capacity.',
      stage3Label: 'Stage 3: Work Sample',
      stage3Title: 'Real-World Task',
      stage3Desc: 'Una tarea tecnica específica del rol (QA, Soporte, Diseno, Contenido). If you pass the scorecard, you enter the Gold List permanently.',
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
      checklist1: 'English communication proficiency',
      checklist2: 'Proven experience in remote roles',
      checklist3: 'US business hours availability (EST/CST)',
      ctaButton: 'Start Validation',
    },
    methodology: {
      badge: 'Our Method',
      title: 'The Shortlist Quality Standard',
      subtitle: 'Every shortlist candidate is validated by experts, not algorithms. Rigorous testing. Evidence-backed decisions.',
      criteriaTitle: 'How We Validate',
      criteria1Title: 'English Communication Screening',
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
      signalBadge: 'AI Signal Over Noise',
      signalTitle: 'AI Signal Over Noise',
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
    itConsultancies: {
      badge: 'For IT Consultancies',
      title: 'White-Label Developer Shortlists for Spanish IT Consultancies',
      subtitle: 'Accelerate client brief delivery and resolve project overflow with human-reviewed white-label developer shortlists. Designed for 48-72h shortlist cycles with timezone overlap.',
      ctaPilot: 'Request a Validation Pilot',
      ctaMethodology: 'See Our Vetting Standard',
      sectionAudienceTitle: 'Who This Is For',
      sectionAudienceSubtitle: 'Custom sourcing pipelines for software consultancies and systems integrators in Spain.',
      audience1Title: 'White-Label Integration',
      audience1Desc: 'Present our candidate profiles under your own brand. We operate as an invisible sourcing engine behind your client engagements.',
      audience2Title: 'Resolve Project Overflow',
      audience2Desc: 'Don\'t turn down client briefs due to delivery constraints. Get validated LATAM developers matching your project timeline.',
      audience3Title: 'Fast response to client briefs',
      audience3Desc: 'Reduce sourcing cycles to win contracts. Sprints target a 72h shortlist delivery SLA for validated briefs.',
      sectionWhiteLabelTitle: 'White-Label Sourcing Motor',
      sectionWhiteLabelDesc: 'TalentSync360 operates as a white-label partner to accelerate client project delivery without sourcing overhead.',
      bullet1Title: 'Seamless White-Label Presentation',
      bullet1Desc: 'We provide structured scorecards that you can white-label and present directly to your clients as internal capability.',
      bullet2Title: 'Technical scorecards & English checks',
      bullet2Desc: 'Every developer undergoes rigorous technical screening criteria and English communication screening before introduction.',
      bullet3Title: 'Structured feedback loop',
      bullet3Desc: 'We coordinate with your delivery managers to align shortlist parameters and technical skills directly with your client\'s stack.',
      screenTitle: 'Rigorous Vetting Before Delivery',
      screenBullet1: 'Detailed soft-skills behavioral and team alignment evaluations.',
      screenBullet2: 'English communication screening (oral and written proficiency).',
      screenBullet3: 'Technical screening criteria checks reviewed by senior engineers.',
      screenBullet4: 'Final evaluation remains human-reviewed and client-controlled.',
      processTitle: 'The Validation Pilot Workflow',
      processSubtitle: 'High-speed White-label technical recruitment, optimized for consultancy delivery teams.',
      step1Label: '01 Brief Intake',
      step1Title: 'Stack & KPI Mapping',
      step1Desc: 'Define client requirements, tech stack, and role KPIs. Sourcing feasibility is confirmed within 24 hours.',
      step2Label: '02 AI-Assisted Screening',
      step2Title: 'Signal Extraction',
      step2Desc: 'AI-assisted signal extraction and human-reviewed shortlist preparation ensures candidates match your technical vetting criteria.',
      step3Label: '03 White-Label Delivery',
      step3Title: 'Evidence scorecards',
      step3Desc: 'Receive 3 to 5 candidate shortlists with technical scorecards, ready to present as your own talent.',
      ctaTitle: 'Request a Validation Pilot',
      ctaDesc: '€2,500 in Spain/EU or $2,500 in US outbound trials for a 2-brief validation pilot over 30 days. Pilot fee can be credited toward a follow-on retainer or expanded sprint package if both sides continue.',
      ctaButton: 'Book a Pilot Discovery Call',
    },
    whatsapp: {
      buttonLabel: 'Talk to TalentSync360',
      prefilledMessage: 'Hi TalentSync360, I’d like to ask about your LATAM tech talent network.',
      tooltip: 'Open a manual WhatsApp chat session with a TalentSync360 representative',
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
      tagline: 'Shortlists técnicas curadas de LATAM con screening humano, señales técnicas y evaluación de comunicación en inglés.',
      companiesTitle: 'Para Empresas',
      companiesLink1: 'Contratar Talento',
      companiesLink2: 'Metodologia 360',
      talentsTitle: 'Para Talento',
      talentsLink1: 'Validar Perfil',
      talentsLink2: 'Oportunidades',
      resourcesTitle: 'Recursos',
      resourcesLink1: 'Contacto Soporte',
      copyright: 'Todos los derechos reservados.',
      terms: 'Términos de Servicio',
      privacy: 'Política de Privacidad',
    },
    home: {
      heroBadge: 'INFRAESTRUCTURA DE TECH TALENT',
      heroTitle: 'Convertí necesidades de talento técnico en shortlists LATAM listas para decidir.',
      heroSubtitle: 'Ayudamos a consultoras IT, agencias de staff augmentation, software factories, startups y equipos tecnológicos a evaluar y presentar talento con evidencia estructurada, revisión humana y soporte de IA.',
      ctaShortlist: 'Solicitar una shortlist',
      ctaGoldList: 'Ver demo',
      ctaTalent: 'Busco oportunidades',
      heroStat1Value: 'Ciclo de 72h',
      heroStat1Label: 'Plazo de entrega objetivo',
      heroStat2Value: 'Filtro Humano',
      heroStat2Label: 'Proceso de screening riguroso',
      heroStat3Value: 'Marca Blanca',
      heroStat3Label: 'Formato listo para el cliente',
      heroQualifier: 'La entrega objetivo comienza después de que el brief técnico haya sido validado. Los roles altamente especializados pueden requerir de 2 a 5 días hábiles.',

      icp: {
        title: 'Una infraestructura, distintos modelos de contratación',
        cards: [
          { title: 'Consultoras de TI', desc: 'Respondé briefs de clientes con shortlists técnicas estructuradas y listas para presentar.' },
          { title: 'Agencias de Staff Augmentation', desc: 'Acelerá la validación de candidatos y presentá talento LATAM dentro de tu modelo comercial actual.' },
          { title: 'Software Factories', desc: 'Cubrí nuevos proyectos, stacks especializados y picos de demanda sin sobrecargar a tu equipo senior.' },
          { title: 'Startups y Equipos de Producto', desc: 'Sumá capacidad técnica sin crear una operación interna completa de recruiting.' },
          { title: 'Empresas de Contratación Directa', desc: 'Recibí candidatos preevaluados para posiciones internas permanentes o de largo plazo.' }
        ]
      },

      talentPathway: {
        title: '¿Sos desarrollador o profesional tecnológico en LATAM?',
        desc: 'Creá tu perfil, compartí evidencia de tu experiencia y accedé a oportunidades alineadas con tu stack, seniority y disponibilidad.',
        cta: 'Sumarme como talento'
      },

      pain: {
        title: 'El cuello de botella no es encontrar perfiles. Es convertirlos en decisiones confiables.',
        card1Title: 'Carga de screening senior',
        card1Desc: 'Tech Leads, Delivery Managers y equipos de contratación invierten tiempo valioso revisando perfiles sin evidencia estructurada.',
        card2Title: 'Respuesta lenta',
        card2Desc: 'Cuando una necesidad activa tarda demasiado en calificarse, los proyectos, oportunidades comerciales y planes de contratación pierden impulso.',
        card3Title: 'Evidencia difícil de comparar',
        card3Desc: 'CVs, entrevistas y notas llegan en formatos diferentes, lo que dificulta una comparación consistente.',
        card4Title: 'Riesgo de validación',
        card4Desc: 'Avanzar con evidencia débil o incompleta aumenta las entrevistas improductivas, la fricción de onboarding y el riesgo de delivery.',
      },

      sprint: {
        eyebrow: 'Oferta Principal',
        title: 'Un brief activo. Un Sprint enfocado. Una shortlist lista para tu cliente.',
        desc: 'Concentramos la búsqueda y la evaluación en un brief técnico validado para entregar entre 3 y 5 finalistas con evidencia comparable y revisión humana.',
        cta: 'Validar mi brief',
        specsTitle: 'Especificaciones del Sprint',
        specsStatus: 'ESTADO: LISTO',
        items: [
          'Un brief técnico validado',
          'Sourcing y pre-screening en LATAM',
          '3 a 5 finalistas revisados por humanos',
          'Scorecards de candidatos basados en evidencia',
          'Presentación marca blanca para el cliente',
          'Una ronda de feedback estructurada',
          'Entrega objetivo tras validación del brief',
          'Excepción para roles muy especializados'
        ],
      },

      demo: {
        eyebrow: 'DEMO INTERACTIVA',
        title: 'Presentación white-label de candidatos',
        explanation: 'Las consultoras y partners pueden presentar la shortlist bajo su propia marca. Las empresas que contratan directamente la utilizan como un workspace estructurado para decidir.',
        subtitle: 'Experiencia de muestra con datos ficticios de candidatos.',
        workspaceTitle: 'Espacio de Trabajo NovaTech Consulting',
        sampleBrief: 'Ingeniero Senior Node.js / TypeScript',
        briefDetails: 'SaaS B2B · Remoto · Solape con Europa',
        tabInternal: 'Revisión Interna',
        tabClient: 'Presentación al Cliente',
        clientPortal: 'PORTAL DEL CLIENTE',
        activeBrief: 'Brief Activo: Node.js',
        briefContext: 'Contexto del brief',
        availability: 'Disponibilidad',
        communication: 'Comunicación técnica',
        vettingStatus: 'Estado de revisión',
        keyStrength: 'Fortaleza principal',
        internalRisk: '(Indicador de Riesgo Interno)',
        vettingChecklist: 'Lista de control de evidencia',
        vettingEngineer: 'Evaluador: Especialista Senior Backend',
        languageVerification: 'Verificación de Idioma: Audio grabado y test aprobado',
        copyPastePrompt: '(Copiar y pegar para el informe del cliente)',
        readyPrompt: '¿Listo para solicitar el archivo del candidato?',
        clientBrandingActive: 'BRANDING DE CLIENTE APLICADO',
        btnInterview: 'Reservar Entrevista Final',
        embedNote: 'Vista de presentación de muestra bajo la identidad ficticia de NovaTech Consulting.',
        labelRequirement: 'Requisito del Rol',
        labelEvidence: 'Evidencia del Candidato',
        labelRationale: 'Justificación de Match',
        labelGap: 'Brecha Identificada',
        labelNote: 'Nota del Evaluador',
        labelQuestion: 'Pregunta de Entrevista Recomendada',
        loadingDemo: 'Cargando demo...',
        riskLabel: 'Riesgo / Desvío:',
        candidates: [
          {
            name: 'Candidato A.R.',
            country: 'Argentina',
            timezone: 'GMT-3',
            match: 'Encaje alto',
            exp: '6 años Node.js y NestJS',
            comm: 'Señal alta de comunicación técnica',
            avail: '2 semanas',
            strength: 'Arquitecturó sistemas de facturación B2B; experto en type-safety de TypeScript',
            risk: 'Experiencia directa limitada con AWS serverless (principalmente ECS/Docker)',
            status: 'Evidencia técnica revisada',
            rationale: 'El candidato ha construido microservicios escalables en Node.js. Comprensión profunda de comunicación asíncrona.',
            gap: 'Sin uso del framework serverless; necesita un onboarding menor en AWS Lambda.',
            note: 'Comunicación excepcional. Altamente proactivo. El stack presenta una alineación sólida con los requisitos principales de la plataforma B2B.',
            question: '¿Podrías explicar un escenario donde optimizaste una consulta SQL que estaba bloqueando conexiones a la base de datos en Node.js?',
          },
          {
            name: 'Candidato M.S.',
            country: 'Colombia',
            timezone: 'GMT-5',
            match: 'Encaje alto',
            exp: '5 años Node.js, Express y React',
            comm: 'Señal alta de comunicación técnica',
            avail: 'Inmediata',
            strength: 'Perfil full-stack; optimizó consultas de bases de datos SQL reduciendo la latencia un 40%',
            risk: 'Prefiere trabajo full-stack; podría desmotivarse si se limita únicamente a APIs de backend puras',
            status: 'Evidencia técnica revisada',
            rationale: 'Muy buen resolvedor de problemas. Tiene experiencia trabajando con solape de zona horaria europea.',
            gap: 'La optimización de bases de datos es sólida, pero sus patrones de diseño arquitectónico son más junior comparados con Candidato A.R.',
            note: 'Altamente motivado, listo para comenzar de inmediato.',
            question: '¿Cómo manejas la sincronización de estado entre microservicios sin crear un acoplamiento fuerte?',
          },
          {
            name: 'Candidato J.L.',
            country: 'Uruguay',
            timezone: 'GMT-3',
            match: 'Encaje moderado',
            exp: '7 años Backend (Python y Node.js)',
            comm: 'Señal alta de comunicación técnica',
            avail: '4 semanas',
            strength: 'Sólida comprensión de DevOps, configuración de CI/CD, Docker y tuning de performance de PostgreSQL',
            risk: 'Período de preaviso largo (4 semanas)',
            status: 'Evidencia técnica revisada',
            rationale: 'Excelente fit para proyectos que requieren tuning de infraestructura junto con desarrollo de APIs.',
            gap: 'El período de preaviso es de 4 semanas. La experiencia de backend está dividida entre Python y NodeJS.',
            note: 'Perfil muy estable, excelente estructura de código.',
            question: 'Describe cómo configurarías un pipeline de CI/CD para una API de Node.js con testing automatizado.',
          }
        ]
      },

      howItWorks: {
        title: 'Cómo funciona',
        step1Title: '1. Validar el brief',
        step1Desc: 'Define el stack, seniority, contexto del proyecto, zona horaria, requisitos de idioma y no negociables.',
        step2Title: '2. Evaluar y revisar',
        step2Desc: 'Las señales de talento se estructuran con asistencia de IA y son revisadas por un ingeniero senior antes de la entrega.',
        step3Title: '3. Revisá o presentá la shortlist',
        step3Desc: 'Las consultoras y partners pueden utilizar la presentación white-label. Las empresas que contratan directamente reciben un workspace estructurado para decidir.',
      },

      evidence: {
        eyebrow: 'Evidencia Entregable',
        title: 'Qué recibes realmente',
        desc: 'Compilamos evidencia estructurada para cada candidato finalista. En lugar de CVs genéricos, tus directores de delivery reciben un paquete completo de decisión con señales de evaluación reales, lo que te permite presentar capacidades técnicas verificadas a tu cliente final.',
        disclaimer: 'TalentSync360 no toma decisiones automatizadas de contratación, no garantiza coincidencias perfectas ni certifica un nivel específico de inglés. Cada shortlist es revisada por una persona antes de su entrega.',
        items: [
          'Resumen ejecutivo del candidato',
          'Match requisito por requisito',
          'Evidencia técnica (tests de código ejecutables y scorecards)',
          'Señales de comunicación (audios grabados y tareas escritas)',
          'Confirmación de disponibilidad y zona horaria',
          'Riesgos operativos y brechas potenciales identificadas',
          'Notas de revisores humanos y alineación de stack',
          'Preguntas recomendadas para la entrevista final'
        ],
      },

      useCases: {
        eyebrow: 'Aplicaciones Operativas',
        title: 'Dónde aplica TalentSync360',
        items: [
          { title: 'Responder a un brief de cliente urgente', desc: 'Estructurá y revisá una shortlist para un requerimiento activo sin desviar a todo el equipo senior.' },
          { title: 'Cubrir desbordes de entrega', desc: 'Sumá capacidad de evaluación cuando la demanda de proyectos supera temporalmente la capacidad interna de recruiting o screening.' },
          { title: 'Validar candidatos ya reclutados internamente', desc: 'Aplicá una scorecard consistente a candidatos encontrados por recruiters, referidos o canales propios.' },
          { title: 'Ingresar a un stack tecnológico desconocido', desc: 'Ordená la evidencia técnica y las preguntas pendientes cuando buscás un stack que tu equipo no evalúa con frecuencia.' },
          { title: 'Crear una célula de delivery en LATAM', desc: 'Compará candidatos para un equipo LATAM distribuido con criterios comunes de stack, comunicación, disponibilidad y zona horaria.' },
          { title: 'Contratar para un equipo interno de producto o tecnología', desc: 'Acompañá la contratación directa con perfiles preevaluados y evidencia estructurada para posiciones permanentes o de largo plazo.' }
        ]
      },

      secondaryStartup: {
        title: '¿Contratas directamente para tu propio producto?',
        desc: 'TalentSync360 también apoya a startups y empresas tecnológicas que construyen sus propios equipos internos de ingeniería en LATAM.',
        cta: 'Explorar contratación para empresas',
      },

      finalCta: {
        title: '¿Tenés una necesidad activa de talento técnico?',
        desc: 'Validá el rol, el contexto y la viabilidad de la shortlist antes de invertir horas senior en screening.',
        cta: 'Solicitar un Sprint de Shortlist',
      },

      faqTitle: 'Preguntas Frecuentes',
      faqClients: [
        { q: "¿Reemplazan a nuestros reclutadores internos?", a: "No. Actuamos como un motor de aceleración. Tus reclutadores se enfocan en la coordinación final y la relación con el cliente, mientras nosotros manejamos el vetting técnico especializado." },
        { q: "¿Los candidatos se pueden presentar bajo nuestra propia marca?", a: "Sí. Nuestros entregables son totalmente de marca blanca. Suministramos perfiles y scorecards anonimizados que puedes personalizar con tu logo y presentar como capacidad propia." },
        { q: "¿Cuándo comienza el plazo objetivo de 72 horas?", a: "El plazo comienza inmediatamente después de que tu brief técnico ha sido validado y confirmado por nuestros límites de sourcing. Esto asegura que alinear los parámetros de búsqueda antes de arrancar el reloj." },
        { q: "¿Qué pasa si la primera shortlist no es adecuada?", a: "Si los candidatos iniciales no coinciden, revisamos tu feedback estructurado y ejecutamos un sprint de recalibración según el brief acordado, adjusting los parámetros de inmediato." },
        { q: "¿Cómo se revisa la evidencia técnica?", a: "No confiamos en pruebas automatizadas de plataformas masivas. Cada test, muestra de trabajo y audio es revisado y calificado personalmente por un ingeniero senior con experiencia en el stack correspondiente." },
        { q: "¿La IA rechaza o selecciona candidatos automáticamente?", a: "No. La IA se utiliza como soporte de decisiones para la extracción de señales y el mapeo de rúbricas. Todas las decisiones finales de selección y rechazo permanecen estrictamente revisadas por humanos y controladas por un operador." },
        { q: "¿Un Sprint de Shortlist puede ser un servicio continuo?", a: "Sí. Los sprints se pueden programar bajo demanda, o podemos establecer un flujo continuo de sourcing para consultoras con necesidades recurrentes." }
      ],

      faqTalents: [
        { q: "¿Cómo me pagan?", a: "Los clientes te pagan directamente. Ayudamos a configurar el contrato inicial y términos en USD/EUR." },
        { q: "¿Qué tipo de roles están buscando?", a: "El motor de búsqueda destaca nuestra especialización en Consultoría Comercial y Estratégica, Líderes de Talento y Recruiters Senior, y Perfiles Tecnológicos con Visión de Negocio. Mantenemos el énfasis en experiencia comprobable enfocada en Perfiles 360° (reputación, resultados e impacto)." },
        { q: "¿Tiene algún costo para el talento?", a: "No. Nuestros servicios de validación y colocación son 100% gratuitos para profesionales." },
        { q: "¿Cómo es el proceso de selección?", a: "Nota de Voz (Inglés), Test de Escritura y una Tarea Práctica específica del rol." },
        { q: "¿Qué nivel de inglés necesito?", a: "Aunque priorizamos perfiles con fluidez en inglés para mercados internacionales, la comunicación técnica fluida es lo que validamos para asegurar que el fit sea productivo desde el día 1." }
      ],

      solutionModals: {
        whiteLabelTitle: 'Términos de Partner Marca Blanca',
        whiteLabelBody: 'El Motor de TalentSync360 opera como un motor de sourcing invisible para consultoras. Este modelo elimina los costos fijos de reclutamiento y acelera los ciclos de entrega técnica.',
        whiteLabelBullet1: 'Entrega de shortlists curadas en 72 horas para mantener competitividad',
        whiteLabelBullet2: 'Modelo marca blanca: presentación de perfiles como talento propio',
        whiteLabelBullet3: 'Garantía de reemplazo de 90 días incluida sin costo adicional',
        runwayTitle: 'Análisis de Optimización de Sourcing',
        runwayBody: 'TalentSync360 proyecta eficiencia de sourcing y optimización de capacidad técnica a través de integraciones nearshore alineadas con tu zona horaria.',
        runwayBullet1: 'Eficiencia en el sourcing en comparación con los mercados de contratación locales',
        runwayBullet2: 'Sincronía horaria completa (GMT+1/CET | EST/CST) para trabajo en tiempo real',
        runwayBullet3: 'Desarrolladores senior de LATAM con screening de comunicación en inglés',
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
        msgPreloadRunway: 'Solicitud de Análisis de Sourcing y proyección de integración nearshore.',
      },

      // Keep old variables for fallback compatibility
      pipelineTitle: 'Pipeline Operacional TalentSync360',
      pipelineTagline: 'Criterios de screening técnico. Scorecards basados en evidencia.',
      pipelineSub: 'Decisiones basadas en señales técnicas. Cero ruido de CVs.',
      step1Label: '01 Intake',
      step1Title: 'Mapeo de Requerimientos',
      step1Desc: 'Se definen el rol, los KPIs y los parámetros culturales. La confirmación de viabilidad llega en 24 horas.',
      step2Label: '02 Proceso',
      step2Title: 'Screening Técnico y de Inglés',
      step2Desc: 'Ingenieros senior realizan screenings técnicos bajo criterios estrictos. La evaluación de comunicación en inglés asegura la alineación del equipo.',
      step3Label: '03 Output',
      step3Title: 'Entrega de Shortlist',
      step3Desc: 'De 3 a 5 finalistas evaluados con scorecards basados en evidencia, listos para tu proceso de entrevistas.',
      trustTitle: 'Estándar de Validación',
      trust1Value: '72h',
      trust1Label: 'Sprints de Shortlist',
      trust1Desc: 'Sprints diseñados para ciclos de 48-72h con un SLA objetivo de 72h para briefs validados.',
      trust2Value: '360°',
      trust2Label: 'Matriz de Validación',
      trust2Desc: 'Evaluaciones técnicas rigurosas, screening de comunicación y fit cultural.',
      trust3Value: '100%',
      trust3Label: 'Screening Humano',
      trust3Desc: 'Cada candidato es revisado personalmente por ingenieros senior antes de su presentación.',
      ctaTitle: 'Activar el Motor',
      ctaDesc: 'Ingresar requerimientos. Recibir shortlists curadas. Reducir ruido de contratación.',
      ctaButton: 'Solicitar Shortlist',
      talentPoolTitle: 'Mapa de capacidad de sourcing',
      talentPoolSub: 'El motor mapea dinámicamente los parámetros de talento, asociando habilidades y experiencia directamente con tus requerimientos técnicos.',
      engineLoadLabel: 'CARGA DEL MOTOR',
      availableEngineTimeLabel: 'TIEMPO DE MOTOR DISPONIBLE',
      talentGridProfiles: 'perfiles',
      talentGridVetted: 'Validado',
      talentGridSimulated: '* Indicador simulado de carga',
      talentGridDisclaimer: 'Nota: El seguimiento de regiones y recuentos de perfiles son métricas de simulación de la capacidad del motor. TalentSync360 no toma decisiones automatizadas de contratación. La IA asiste en la extracción de señales, mapeo de rúbricas y preparación de shortlists. La evaluación final es revisada por humanos y controlada por el cliente.',
      talentGridSignalMap: 'MAPA DE SEÑALES DE DEMOSTRACIÓN | REGIONES ESCANEADAS: LATAM-1 (ARG, BRA, COL, MEX) | LATAM-2 (CHL, PER, URY)',
      levelSenior: 'Senior',
      levelExpert: 'Experto',
      levelArch: 'Arquitecto',
      solutionSplit: {
        consultancyTitle: 'Para Consultoras de TI de España',
        consultancyDesc: 'Tu socio de marca blanca para acelerar la entrega de proyectos sin sobrecostos de reclutamiento.',
        consultancyBullet1: 'Integración de marca blanca con equipos de desarrollo existentes',
        consultancyBullet2: 'Velocidad en shortlists para resolver desbordes de proyectos rápidamente',
        consultancyBullet3: 'Ingenieros alineados con la zona horaria de tus operaciones',
        consultancyCta: 'Ver Términos de Marca Blanca',
        startupTitle: 'Para Startups de EE. UU. y la UE',
        startupDesc: 'Despliega talento de ingeniería listo para integrarse, alineado con tu zona horaria y objetivos de negocio.',
        startupBullet1: 'Alineación con tu zona horaria para colaboración en tiempo real',
        startupBullet2: 'Technical screening based on criteria',
        startupBullet3: 'Escalamiento flexible de contratos (ajustes en 30 días)',
        startupCta: 'Solicitar Análisis de Sourcing',
      }
    },
    companies: {
      badge: 'Para Empresas',
      title: 'Talento LATAM validado para equipos técnicos.',
      subtitle: 'Shortlists con screening humano, señales técnicas y evaluación de comunicación en inglés.',
      ctaShortlist: 'Solicitar Shortlist',
      ctaMethodology: 'Ver Nuestro Estándar',
      tiersTitle: 'Shortlist Sprint White-Label',
      tiersSubtitle: 'Una estructura de precios simple y clara. El fee del sprint y del piloto se pueden acreditar a un engagement de seguimiento.',
      sprintTitle: 'Shortlist Sprint',
      sprintPrice: '€1.250 / $1.250',
      sprintCandidates: '3-5 candidatos senior',
      sprintSla: '72 horas',
      sprintIncludes: [
        'El fee se puede acreditar a un engagement de seguimiento',
        'Candidatos senior con screening de comunicación y técnico',
        'SLA objetivo de 72 horas para briefs validados',
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
      stage1Title: 'Evaluación de Comunicación en Inglés',
      stage1Desc: 'Envianos una grabacion de 90 segundos demostrando tu experiencia y habilidades de comunicación. Evaluamos claridad, confianza y entrega profesional.',
      stage2Label: 'Etapa 2: Prueba de Escritura',
      stage2Title: 'Comunicacion Empresarial',
      stage2Desc: 'Resuelve un caso hipotetico por email bajo presion de tiempo. Evaluamos calidad de escritura, tono ejecutivo y capacidad analitica.',
      stage3Label: 'Etapa 3: Muestra de Trabajo',
      stage3Title: 'Tarea del Mundo Real',
      stage3Desc: 'Una tarea tecnica específica del rol (QA, Soporte, Diseno, Contenido). If you pass the scorecard, you enter the Gold List permanently.',
      benefitTitle: 'Beneficios para Miembros de la Gold List',
      benefit1Num: '01',
      benefit1Title: 'Exposicion de Alto Nivel',
      benefit1Desc: 'Tu perfil no compite en un mar de CVs. Estas en una shortlist curada que los CEOs ven directamente.',
      benefit2Num: '02',
      benefit2Title: 'Salarios Competitivos (USD/EUR)',
      benefit2Desc: 'Trabajamos exclusivamente con empresas que valoran tu seniority y pagan segun estandares nearshore premium.',
      benefit3Num: '03',
      benefit3Title: 'Feedback de Valor',
      benefit3Desc: 'Incluso si no recibis tu puntuacion en el scorecard para saber exactamente que mejorar.',
      checklistTitle: 'Tenes lo que se necesita?',
      checklist1: 'Nivel fluido de inglés para comunicación profesional',
      checklist2: 'Experiencia comprobable en roles remotos',
      checklist3: 'Disponibilidad horario US (EST/CST)',
      ctaButton: 'Comenzar Validacion',
    },
    methodology: {
      badge: 'Nuestro Metodo',
      title: 'El Estandar de Calidad de Shortlist',
      subtitle: 'Cada candidato de shortlist es validado por expertos, no por algoritmos. Testing riguroso. Decisiones basadas en evidencia.',
      criteriaTitle: 'Como Validamos',
      criteria1Title: 'Evaluación de Comunicación en Inglés',
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
      signalBadge: 'IA Con Criterio, No Al Azar',
      signalTitle: 'IA Con Criterio, No Al Azar',
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
      footer: 'Ultima Actualizacion: Politica de Privacidad',
    },
    itConsultancies: {
      badge: 'Para Consultoras IT',
      title: 'Shortlists técnicos white-label para consultoras IT en España',
      subtitle: 'Entrega más rápido perfiles técnicos revisados para briefs de clientes, sin convertir la IA en una decisión automática de contratación.',
      ctaPilot: 'Solicitar un Piloto de Validación',
      ctaMethodology: 'Ver Nuestro Estándar',
      sectionAudienceTitle: 'Para Quién Es Esto',
      sectionAudienceSubtitle: 'Pipelines de sourcing personalizados para consultoras de software e integradores de sistemas en España.',
      audience1Title: 'Integración Marca Blanca',
      audience1Desc: 'Presenta los perfiles de nuestros candidatos bajo tu propia marca. Operamos como un motor de sourcing invisible detrás de tus proyectos.',
      audience2Title: 'Resolver Desbordes de Proyectos',
      audience2Desc: 'No rechace briefs de clientes debido a limitaciones de entrega. Consigue desarrolladores LATAM validados que coincidan con tu cronograma.',
      audience3Title: 'Respuesta Rápida a Briefs de Clientes',
      audience3Desc: 'Reduce los ciclos de búsqueda para ganar contratos. Los sprints apuntan a un SLA de entrega de shortlist de 72 horas para briefs validados.',
      sectionWhiteLabelTitle: 'Motor de Sourcing Marca Blanca',
      sectionWhiteLabelDesc: 'TalentSync360 opera como un socio de marca blanca para acelerar la entrega de proyectos de clientes sin sobrecostos de reclutamiento.',
      bullet1Title: 'Presentación Marca Blanca Impecable',
      bullet1Desc: 'Proporcionamos scorecards estructurados que puedes personalizar y presentar directamente a tus clientes como capacidad interna.',
      bullet2Title: 'Scorecards Técnicos y Pruebas de Inglés',
      bullet2Desc: 'Cada desarrollador pasa por criterios rigurosos de screening técnico y evaluación de comunicación en inglés antes de su presentación.',
      bullet3Title: 'Feedback Continuo y Estructurado',
      bullet3Desc: 'Nos coordinamos con tus directores de delivery para alinear los parámetros de la shortlist y las habilidades técnicas directamente con el stack del cliente.',
      screenTitle: 'Vetting Riguroso Antes de la Entrega',
      screenBullet1: 'Evaluaciones detalladas de habilidades blandas y alineación de equipos.',
      screenBullet2: 'Screening de comunicación en inglés (fluidez oral y escrita).',
      screenBullet3: 'Screening técnico humano revisado por ingenieros senior.',
      screenBullet4: 'La evaluación final es revisada por humanos y controlada por el cliente.',
      processTitle: 'Flujo de Trabajo del Piloto de Validación',
      processSubtitle: 'Reclutamiento técnico de marca blanca a alta velocidad, optimizado para equipos de entrega de consultoras.',
      step1Label: '01 Brief Intake',
      step1Title: 'Mapeo de Stack y KPIs',
      step1Desc: 'Define los requisitos del cliente, el stack tecnológico y los KPIs del rol. La viabilidad del sourcing se confirma en 24 horas.',
      step2Label: '02 Screening Asistido por IA',
      step2Title: 'Extracción de Señales',
      step2Desc: 'La extracción de señales asistida por IA y la preparación de shortlists revisadas por humanos aseguran que los candidatos cumplan con tus criterios de vetting.',
      step3Label: '03 Entrega Marca Blanca',
      step3Title: 'Scorecards de Evidencia',
      step3Desc: 'Recibe shortlists de 3 a 5 candidatos con scorecards técnicos detallados, listos para presentar como talento propio.',
      ctaTitle: 'Solicitar un Piloto de Validación',
      ctaDesc: '€2.500 en España/UE o $2.500 en pruebas outbound en EE. UU. para un piloto de validación de 2 briefs durante 30 days. El fee del piloto puede acreditarse a un retainer de seguimiento o a un paquete de sprints ampliado si ambas partes continúan.',
      ctaButton: 'Reservar Llamada de Descubrimiento de Piloto',
    },
    whatsapp: {
      buttonLabel: 'Hablar con TalentSync360',
      prefilledMessage: 'Hola TalentSync360, quiero hacer una consulta sobre su red de talento tech LATAM.',
      tooltip: 'Abrir una sesión de chat manual de WhatsApp con un representante de TalentSync360',
    },
  },
};
