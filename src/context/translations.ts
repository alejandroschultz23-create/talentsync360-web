export type Language = 'en' | 'es';

export interface HomepageTranslations {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    supportLine: string;
    ctaBrief: string;
    ctaValidateRole: string;
    candidateEyebrow: string;
    candidateAction: string;
  };
  problem: {
    eyebrow: string;
    title: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar1Tag: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar2Tag: string;
    pillar3Title: string;
    pillar3Desc: string;
    pillar3Tag: string;
    bannerText: string;
    bannerSubtext: string;
  };
  transformation: {
    eyebrow: string;
    title: string;
    subtitle: string;
    phase1Eyebrow: string;
    phase1Title: string;
    phase2Eyebrow: string;
    phase2Title: string;
    phase2Tag1: string;
    phase2Tag2: string;
    phase2Tag3: string;
    phase3Eyebrow: string;
    phase3Title: string;
    phase3Badge: string;
    phase4Eyebrow: string;
    phase4Title: string;
    phase4Tag1: string;
    phase4Tag2: string;
    phase4Tag3: string;
    phase4Tag4: string;
    phase5Eyebrow: string;
    phase5Title: string;
    phase5Desc: string;
    footnote: string;
  };
  framework: {
    eyebrow: string;
    title: string;
    subtitle: string;
    step1Tag: string;
    step1Title: string;
    step1Desc: string;
    step1Footer: string;
    step2Tag: string;
    step2Title: string;
    step2Desc: string;
    step2Footer: string;
    step3Tag: string;
    step3Title: string;
    step3Desc: string;
    step3Footer: string;
    methodologyLink: string;
  };
  hiringTeams: {
    eyebrow: string;
    title: string;
    subtitle: string;
    point1Title: string;
    point1Desc: string;
    point2Title: string;
    point2Desc: string;
    point3Title: string;
    point3Desc: string;
    point4Title: string;
    point4Desc: string;
    ctaValidateRole: string;
  };
  roleContextPreview: {
    topNotice: string;
    stepLabel: string;
    tabSourced: string;
    tabShortlist: string;
    labelRoleTitle: string;
    valRoleTitle: string;
    labelSeniority: string;
    valSeniority: string;
    labelStack: string;
    timezone: string;
    screening: string;
    teaserSourced: string;
    teaserShortlist: string;
    readyStatus: string;
  };
  techPros: {
    eyebrow: string;
    title: string;
    subtitle: string;
    point1Title: string;
    point1Desc: string;
    point2Title: string;
    point2Desc: string;
    point3Title: string;
    point3Desc: string;
    point4Title: string;
    point4Desc: string;
    ctaStartReview: string;
  };
  candidateReviewPreview: {
    title: string;
    badge: string;
    sourcesTitle: string;
    src1: string;
    src2: string;
    src3: string;
    src4: string;
    demonstratedSignal: string;
    signalQuote: string;
    clarificationHeader: string;
    clarificationQuote: string;
    hideNote: string;
    addClarification: string;
    networkVisibility: string;
    optInDescriptionActive: string;
    optInDescriptionPrivate: string;
    optInToggleActive: string;
    optInTogglePrivate: string;
  };
  evidenceStates: {
    eyebrow: string;
    title: string;
    subtitle: string;
    activeStateLabel: string;
    labelSemantic: string;
    labelScenario: string;
    labelImpact: string;
    epistemicCallout: string;
    methodologyLink: string;
    states: {
      SUPPORTED: {
        title: string;
        definition: string;
        exampleContext: string;
        interviewAction: string;
      };
      PARTIAL: {
        title: string;
        definition: string;
        exampleContext: string;
        interviewAction: string;
      };
      UNKNOWN: {
        title: string;
        definition: string;
        exampleContext: string;
        interviewAction: string;
      };
      CONFLICT: {
        title: string;
        definition: string;
        exampleContext: string;
        interviewAction: string;
      };
      NEEDS_VALIDATION: {
        title: string;
        definition: string;
        exampleContext: string;
        interviewAction: string;
      };
    };
  };
  partnerDelivery: {
    eyebrow: string;
    title: string;
    subtitle: string;
    point1Title: string;
    point1Desc: string;
    point2Title: string;
    point2Desc: string;
    point3Title: string;
    point3Desc: string;
    ctaPartner: string;
  };
  partnerToggle: {
    topLabel: string;
    disclaimer: string;
    tabStandard: string;
    tabPartner: string;
    standardSubtitle: string;
    partnerSubtitle: string;
    candidateRefLabel: string;
    evaluatedRole: string;
    observableStrengthLabel: string;
    observableStrengthDesc: string;
    surfaceUnknownLabel: string;
    surfaceUnknownDesc: string;
  };
  deliverable: {
    eyebrow: string;
    title: string;
    subtitle: string;
    candidateRef: string;
    humanReviewComplete: string;
    fullInteractiveView: string;
    syntheticBanner: string;
    targetRoleLabel: string;
    targetRoleValue: string;
    stackLabel: string;
    locationLabel: string;
    availabilityLabel: string;
    strengthsTitle: string;
    strengthsDesc: string;
    gapsTitle: string;
    gapsDesc: string;
    unknownsTitle: string;
    unknownsDesc: string;
    validationPromptLabel: string;
    validationPromptText: string;
    footerNote: string;
    ctaBrief: string;
  };
  finalCta: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaValidateRole: string;
    ctaBrief: string;
    footnote: string;
  };
  modal: {
    badge: string;
    ref: string;
    closeLabel: string;
    syntheticDisclaimer: string;
    syntheticSubtext: string;
    targetRoleLabel: string;
    locationZoneLabel: string;
    locationZoneValue: string;
    availabilityLabel: string;
    availabilityValue: string;
    verificationStatusLabel: string;
    verificationStatusValue: string;
    validatedContextTitle: string;
    coreStackLabel: string;
    operationalContextLabel: string;
    operationalContextValue: string;
    strengthsTitle: string;
    strengthsItems: string[];
    gapsTitle: string;
    gapsItems: string[];
    unknownsTitle: string;
    unknownsItems: string[];
    unknownsNote: string;
    priorityQuestionsTitle: string;
    q1Title: string;
    q1Quote: string;
    q1Target: string;
    q2Title: string;
    q2Quote: string;
    q2Target: string;
    footerNote: string;
    closeButton: string;
    ctaValidateRole: string;
  };
}

export interface Translations {
  nav: {
    companies: string;
    talents: string;
    methodology: string;
    contact: string;
    contactShort: string;
    product: string;
    forCompanies: string;
    forTalent: string;
    partners: string;
    validateRole: string;
  };
  homepage: HomepageTranslations;
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
    languageClarification: string;
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
    subtitle: string;
    subtitleGeneral: string;
    labelFirstName: string;
    labelLastName: string;
    labelEmail: string;
    labelRole: string;
    optionB2B: string;
    optionGeneral: string;
    labelMessage: string;
    placeholderFirstName: string;
    placeholderLastName: string;
    placeholderEmail: string;
    placeholderMessage: string;
    buttonSubmit: string;
    privacyNote: string;
    directLabel: string;
    ctaButton: string;
  };
  terms: {
    title: string;
    intro: string;
    sections: { title: string; paragraphs: string[] }[];
    footer: string;
  };
  privacy: {
    title: string;
    intro: string;
    sections: { title: string; paragraphs: string[] }[];
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
      product: 'Product',
      forCompanies: 'For Companies',
      forTalent: 'For Talent',
      partners: 'Partners',
      validateRole: 'Validate a Role',
    },
    homepage: {
      hero: {
        eyebrow: "EVIDENCE-BACKED TECHNICAL RECRUITING",
        title: "Know why a technical candidate deserves an interview.",
        subtitle: "TalentSync360 turns professional experience, projects, work evidence and role context into structured candidate briefs — with strengths, gaps, unknowns and questions worth validating in the interview.",
        supportLine: "AI-assisted. Human-reviewed. Built for LATAM technical hiring.",
        ctaBrief: "See an Evidence Brief",
        ctaValidateRole: "Validate a Role",
        candidateEyebrow: "I’m a tech professional",
        candidateAction: "Review my evidence",
      },
      problem: {
        eyebrow: "THE SCREENING BREAKDOWN",
        title: "The hiring bottleneck is not sourcing. It is trusting what happens before the technical interview.",
        pillar1Title: "Resumes make claims, not evidence",
        pillar1Desc: "Keyword-optimized CVs create false-positive shortlists and force senior engineers to spend valuable time acting as first-line screening filters.",
        pillar1Tag: "High screening tax",
        pillar2Title: "Recruiting agency black boxes",
        pillar2Desc: "Standard agencies forward unverified profiles without disclosing where observable evidence stops and candidate self-reporting begins.",
        pillar2Tag: "Unverified confidence",
        pillar3Title: "Engineering time lost to baseline mismatches",
        pillar3Desc: "Interviews are squandered uncovering missing prerequisites that could have been identified, contextualized, and surfaced before scheduling.",
        pillar3Tag: "Costly engineering drag",
        bannerText: "TalentSync360 does not replace the technical interview.",
        bannerSubtext: "We make sure only candidates with clear evidence and contextual fit reach it.",
      },
      transformation: {
        eyebrow: "HOW SCREENING ACTUALLY TRANSFORMS",
        title: "From keyword search to structured technical evidence",
        subtitle: "A deliberate, five-step transition from ambiguous candidate claims to calibrated hiring decisions.",
        phase1Eyebrow: "Phase 1 · Sourcing & Profile Intake",
        phase1Title: "Experience claims & CV data",
        phase2Eyebrow: "Phase 2 · Extraction & Parsing",
        phase2Title: "AI signal extraction",
        phase2Tag1: "Stack & Architecture Extraction",
        phase2Tag2: "Code & Production Footprint",
        phase2Tag3: "Scale & Complexity Signals",
        phase3Eyebrow: "Phase 3 · Human Engineering Review",
        phase3Title: "Expert verification & sanity checks",
        phase3Badge: "Human in the Loop",
        phase4Eyebrow: "Phase 4 · Evidence State Mapping",
        phase4Title: "Epistemic calibration",
        phase4Tag1: "SUPPORTED",
        phase4Tag2: "PARTIAL",
        phase4Tag3: "UNKNOWN",
        phase4Tag4: "NEEDS VALIDATION",
        phase5Eyebrow: "Phase 5 · Decision Artifact Delivery",
        phase5Title: "Candidate Evidence Brief",
        phase5Desc: "Delivered in 48-72h. Complete with strengths, validated gaps, surfaced unknowns, and exact technical interview questions.",
        footnote: "Every brief is calibrated against your specific role context, architecture, and team delivery constraints.",
      },
      framework: {
        eyebrow: "THE EVALUATION FRAMEWORK",
        title: "Three steps to interview-ready clarity",
        subtitle: "A transparent methodology designed to give engineering leaders complete confidence in every candidate submission.",
        step1Tag: "Step 01",
        step1Title: "Gather Technical Evidence",
        step1Desc: "We extract verifiable signals from past projects, architecture decisions, code contributions, and technical delivery context — not just claims on a PDF resume.",
        step1Footer: "Verifiable artifacts & source-backed signals",
        step2Tag: "Step 02",
        step2Title: "Calibrate to Role Context",
        step2Desc: "Every candidate is evaluated against your specific technical stack, timezone overlap, seniority requirements, and actual delivery expectations.",
        step2Footer: "Target stack, timezone & seniority alignment",
        step3Tag: "Step 03",
        step3Title: "Deliver Decision Artifacts",
        step3Desc: "You receive a complete Candidate Evidence Brief detailing clear strengths, identified gaps, surfaced unknowns, and recommended interview questions.",
        step3Footer: "Decision-ready brief with explicit interview actions",
        methodologyLink: "Explore the full 360° Evaluation Methodology",
      },
      hiringTeams: {
        eyebrow: "FOR HIRING TEAMS & TECH LEADERS",
        title: "Stop discovering baseline gaps in the technical interview.",
        subtitle: "Protect engineering bandwidth by evaluating candidates against objective evidence before your team ever gets on a call.",
        point1Title: "Zero blind interviews",
        point1Desc: "Know precisely where each candidate has proven depth and where evidence is incomplete before scheduling.",
        point2Title: "Respect senior engineering time",
        point2Desc: "Free up senior developers and engineering leaders to focus on deep technical fit rather than resume fact-checking.",
        point3Title: "Actionable interview questions",
        point3Desc: "Receive tailored questions specifically targeted to probe surfaced unknowns and calibrated gaps.",
        point4Title: "Calibrated for LATAM delivery",
        point4Desc: "Screened for real-world English communication, timezone overlap, and autonomous distributed execution.",
        ctaValidateRole: "Validate a Role with Our Team",
      },
      roleContextPreview: {
        topNotice: "Live Role Context Alignment Prototype",
        stepLabel: "STEP 1: DEFINE ROLE CONTEXT",
        tabSourced: "Direct Sourced Candidate",
        tabShortlist: "Request TS360 Shortlist",
        labelRoleTitle: "Target Role:",
        valRoleTitle: "Senior Backend Engineer (Go / Distributed)",
        labelSeniority: "Target Seniority:",
        valSeniority: "Senior (5+ yrs) · High Autonomy",
        labelStack: "Required Core Stack:",
        timezone: "Timezone Overlap: US Eastern / Pacific (min 4h)",
        screening: "Communication Screening: Fluent Technical English Required",
        teaserSourced: "Submit an existing candidate profile or CV for rigorous evidence validation against this role context.",
        teaserShortlist: "Request a curated, evidence-backed LATAM shortlist matched to these requirements delivered in 48-72h.",
        readyStatus: "Decision Ready",
      },
      techPros: {
        eyebrow: "FOR TECHNICAL PROFESSIONALS",
        title: "Your work is more than keywords on a resume.",
        subtitle: "Showcase real architecture decisions, production experience, and engineering depth through a private, candidate-controlled evidence review.",
        point1Title: "Evidence-first presentation",
        point1Desc: "Let your real projects, architecture decisions, and code speak louder than algorithmic CV keyword filters.",
        point2Title: "Private & candidate-controlled",
        point2Desc: "Review and curate your evidence profile privately. You decide when and where your profile is presented to hiring teams.",
        point3Title: "Fair, transparent evaluation",
        point3Desc: "Understand exactly how your experience is mapped to role requirements with clear, objective criteria.",
        point4Title: "High-impact LATAM opportunities",
        point4Desc: "Connect with top-tier international teams looking for deep technical ability, autonomous ownership, and strong delivery.",
        ctaStartReview: "Start Candidate Evidence Review",
      },
      candidateReviewPreview: {
        title: "Professional Evidence Profile (Draft)",
        badge: "Private to Candidate",
        sourcesTitle: "Submitted Professional Evidence Sources",
        src1: "Project Architecture & Data Flow Overview",
        src2: "Engineering Production Responsibilities",
        src3: "High-Load Concurrency Case Writeup",
        src4: "Public Repository (Optional / Attached)",
        demonstratedSignal: "Demonstrated Engineering Signal",
        signalQuote: "“Candidate demonstrably owned the event-streaming consumer pipeline architecture in Go, handling sustained traffic of 12,000 req/sec with documented zero-loss failover.”",
        clarificationHeader: "Candidate Context Note Added:",
        clarificationQuote: "“Added clarification: The cluster failover was verified under staging load tests; production incident logs are retained by previous employer under NDA.”",
        hideNote: "Hide note",
        addClarification: "Add Candidate Context / Clarification",
        networkVisibility: "Talent Network Visibility",
        optInDescriptionActive: "Profile is actively matched to relevant technical briefs.",
        optInDescriptionPrivate: "Private review mode. Profile is not visible to hiring teams.",
        optInToggleActive: "Opted-In to Matches",
        optInTogglePrivate: "Private Review Only (Toggle)",
      },
      evidenceStates: {
        eyebrow: "EPISTEMIC CALIBRATION",
        title: "The Five Canonical Evidence States",
        subtitle: "We classify every claim into explicit evidence states. If something is unknown, we say it is unknown.",
        activeStateLabel: "ACTIVE STATE",
        labelSemantic: "Semantic Definition",
        labelScenario: "Concrete Engineering Scenario",
        labelImpact: "Interview Validation Impact",
        epistemicCallout: "Epistemic honesty: We never guess or assume. An unverified claim is marked UNKNOWN or NEEDS VALIDATION, giving your interviewers targeted questions rather than false confidence.",
        methodologyLink: "Learn more about our five-state contract in the methodology",
        states: {
          SUPPORTED: {
            title: "Supported by Direct Evidence",
            definition: "The candidate provided verifiable documentation, production artifacts, architecture decisions, or clear delivery context confirming the skill or experience.",
            exampleContext: "Production Go service handling Kafka streaming pipeline verified via system design documentation and technical delivery walkthrough.",
            interviewAction: "Validate depth, architecture edge cases, and personal ownership rather than baseline competence.",
          },
          PARTIAL: {
            title: "Partially Supported",
            definition: "Direct evidence confirms related experience or adjacent tooling, but observable artifacts do not cover the full depth or scale demanded by the role.",
            exampleContext: "Strong single-node PostgreSQL optimization documented, but multi-region distributed sharding experience is absent from observable artifacts.",
            interviewAction: "Probe willingness and capability to scale beyond past single-node architecture into distributed patterns.",
          },
          UNKNOWN: {
            title: "Surface Unknown",
            definition: "No observable evidence exists in the candidate submission to support or dispute this requirement. It has not been observed and must not be assumed.",
            exampleContext: "Kubernetes Custom Resource Definition (CRD) creation was not mentioned or demonstrated in any submitted materials.",
            interviewAction: "Directly ask whether the candidate has hands-on production experience with CRDs or if training is required.",
          },
          CONFLICT: {
            title: "Contradictory / Discrepancy Found",
            definition: "Submitted artifacts or external records present conflicting timelines, incompatible role responsibilities, or contradictory technical claims.",
            exampleContext: "Resume claims 3 years of Kubernetes cluster administration, but chronological project records show full-time dedication to frontend Vue.js applications during that period.",
            interviewAction: "Address the specific discrepancy directly with the candidate before proceeding with technical evaluation.",
          },
          NEEDS_VALIDATION: {
            title: "Needs Live Validation",
            definition: "The candidate claims relevant depth, but verification requires interactive exploration, live code explanation, or real-time problem-solving.",
            exampleContext: "Candidate claims deep knowledge of zero-downtime database migrations, but artifacts do not reveal the exact locking strategy or rollback scripts.",
            interviewAction: "Use our tailored interview question prompt to evaluate live handling of locking thresholds and schema rollback plans.",
          },
        },
      },
      partnerDelivery: {
        eyebrow: "FOR RECRUITING & DELIVERY PARTNERS",
        title: "Deliver evidence-backed shortlists to your own clients.",
        subtitle: "Equip your agency or consultancy with structured candidate evaluation briefs that build instant client trust and accelerate placement velocity.",
        point1Title: "White-label decision briefs",
        point1Desc: "Deliver professional Candidate Evidence Briefs under your own brand to position your team as a high-rigor talent partner.",
        point2Title: "Drastically cut client drop-off",
        point2Desc: "Hiring managers trust structured evidence. Eliminating resume hype reduces client rejection rates and shortens feedback loops.",
        point3Title: "Differentiate your delivery model",
        point3Desc: "Move beyond keyword pitching and unvetted candidate PDFs to offer structured, epistemic decision support.",
        ctaPartner: "Partner With TalentSync360",
      },
      partnerToggle: {
        topLabel: "INTERACTIVE PRESENTATION PREVIEW",
        disclaimer: "See how TalentSync360 transforms standard agency submissions into structured client-ready evidence briefs.",
        tabStandard: "Standard Agency Forward",
        tabPartner: "TalentSync360 Partner Delivery",
        standardSubtitle: "Generic resume forwarding with unverified claims and no calibrated decision support.",
        partnerSubtitle: "Calibrated candidate brief with verified strengths, surfaced gaps, and tailored interview probes.",
        candidateRefLabel: "Candidate Reference",
        evaluatedRole: "Senior Distributed Systems Engineer (Go / Kafka)",
        observableStrengthLabel: "Observable Strengths",
        observableStrengthDesc: "Verifiable production Go microservices handling Kafka event streaming at scale.",
        surfaceUnknownLabel: "Calibrated Unknowns",
        surfaceUnknownDesc: "Multi-region failover not observed in artifacts; flagged for live validation.",
      },
      deliverable: {
        eyebrow: "THE CORE DELIVERABLE",
        title: "The Candidate Evidence Brief",
        subtitle: "A structured, transparent evaluation artifact designed to help engineering leaders make immediate, high-confidence interview decisions.",
        candidateRef: "REF: AR-8821",
        humanReviewComplete: "Human Technical Review Complete",
        fullInteractiveView: "Open Full Brief",
        syntheticBanner: "ILLUSTRATIVE CANDIDATE BRIEF · SYNTHETIC SAMPLE",
        targetRoleLabel: "Target Role:",
        targetRoleValue: "Senior Backend Engineer (Go / Distributed Systems)",
        stackLabel: "Core Stack: Go · Kafka · Kubernetes · PostgreSQL",
        locationLabel: "LATAM (UTC-3 / Argentina)",
        availabilityLabel: "Available in 2 Weeks",
        strengthsTitle: "Strengths",
        strengthsDesc: "Documented production experience building and maintaining asynchronous messaging pipelines with Go.",
        gapsTitle: "Calibrated Gaps",
        gapsDesc: "Limited observable experience with multi-region cluster failover; past architecture focused on single-region deployments.",
        unknownsTitle: "Surface Unknowns",
        unknownsDesc: "No observable artifacts demonstrating direct familiarity with Kubernetes CRD development.",
        validationPromptLabel: "Recommended Interview Validation Question:",
        validationPromptText: "“What criteria did you use to set partition limits and consumer backpressure thresholds in your message queue implementation?”",
        footerNote: "Inspect complete evaluation format in interactive modal",
        ctaBrief: "See an Evidence Brief",
      },
      finalCta: {
        eyebrow: "GET STARTED",
        title: "Bring a real role. See what the evidence actually supports.",
        subtitle: "Stop spending valuable interview hours discovering unvetted baseline gaps. Validate candidates you already have or request an evidence-backed LATAM shortlist.",
        ctaValidateRole: "Validate a Role",
        ctaBrief: "See an Evidence Brief",
        footnote: "Human-reviewed technical qualification for distributed LATAM hiring.",
      },
      modal: {
        badge: "CANDIDATE EVIDENCE BRIEF",
        ref: "REF: AR-8821",
        closeLabel: "Close Evidence Brief Modal",
        syntheticDisclaimer: "[ ILLUSTRATIVE SAMPLE — FICTIONAL CANDIDATE DATA ]",
        syntheticSubtext: "Demonstrates structured decision support format",
        targetRoleLabel: "Target Role",
        locationZoneLabel: "Location & Zone",
        locationZoneValue: "LATAM (UTC-3 / Argentina)",
        availabilityLabel: "Availability",
        availabilityValue: "2 Weeks Notice",
        verificationStatusLabel: "Verification Status",
        verificationStatusValue: "Human-Reviewed · Validated",
        validatedContextTitle: "Validated Context & Technical Scope",
        coreStackLabel: "Core Stack & Frameworks:",
        operationalContextLabel: "Operational Context:",
        operationalContextValue: "High-throughput event streaming, microservices architectures, distributed tracing, Kubernetes-orchestrated workloads.",
        strengthsTitle: "Demonstrated Strengths",
        strengthsItems: ["Led migration of synchronous HTTP service to event-driven Go microservice architecture handling 12,000 req/sec.", "Documented zero-loss partition failover and consumer backpressure handling in Kafka clusters.", "Direct experience profiling Go goroutine memory leaks and pprof optimization in containerized production."],
        gapsTitle: "Calibrated Gaps",
        gapsItems: ["Past infrastructure experience focused on single-region cloud deployments; limited direct exposure to multi-region global failover.", "Limited exposure to custom Kubernetes Operator development using Kubebuilder / Operator SDK."],
        unknownsTitle: "Surface Unknowns",
        unknownsItems: ["Level of direct ownership in production incident response / on-call rotation not detailed in submitted documentation.", "Depth of experience with Cassandra / distributed NoSQL storage engines unobserved."],
        unknownsNote: "Surface unknowns represent unobserved areas, not confirmed weaknesses. They should be addressed during the technical interview.",
        priorityQuestionsTitle: "Priority Interview Probes",
        q1Title: "Kafka Partitioning & Backpressure Probing",
        q1Quote: "“In your high-throughput Go microservice, how did your consumer group handle sudden message lag spikes, and what metric drove your rebalance strategy?”",
        q1Target: "Target signal: Tests whether candidate understands real-world distributed backpressure vs theoretical architecture.",
        q2Title: "Operational Resiliency & Failure Modes",
        q2Quote: "“Walk us through a production incident where a service degraded unexpectedly. How did you triage the issue, and what post-mortem action did you personally lead?”",
        q2Target: "Target signal: Validates ownership level and maturity during unexpected infrastructure failures.",
        footerNote: "Sample generated for demonstration purposes. Real candidate briefs are customized to your specific architecture and role requirements.",
        closeButton: "Close Preview",
        ctaValidateRole: "Validate a Role with This Format",
      },
    },
    footer: {
      tagline: 'Curated LATAM technical shortlists with human review, technical evidence, and communication checks when required by the role.',
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
          'Structured candidate evidence profiles',
          'White-label client presentation when separately authorized',
          'One structured feedback round',
          'Target delivery after brief validation',
          'Specialized-role exception'
        ],
      },

      demo: {
        eyebrow: 'INTERACTIVE DEMO',
        title: 'White-label candidate presentation',
        explanation: 'Consultancies and partners can use the workspace for separately authorized presentations. Direct employers use it as structured decision support.',
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
        step3Desc: 'Consultancies and partners can use the white-label presentation after the professional-sharing boundary is satisfied. Direct employers receive a structured decision workspace.',
      },

      evidence: {
        eyebrow: 'Deliverable Evidence',
        title: 'What you actually receive',
        desc: 'We compile structured evidence for every finalist candidate. Instead of generic CVs, delivery managers receive a decision package that separates supported signals, partial support, unknowns, and remaining validation points for any authorized client presentation.',
        disclaimer: 'TalentSync360 does not make automated hiring decisions, guarantee perfect matches or certify a specific English level. Every shortlist is reviewed by a human before delivery.',
        items: [
          'Candidate executive summary',
          'Requirement-by-requirement match',
          'Technical evidence and structured reviewer observations',
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
          { title: 'Validating candidates already sourced internally', desc: 'Apply consistent, role-specific evidence criteria to candidates already found through recruiters, referrals or existing channels.' },
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
        { q: "Do you replace our internal recruiters?", a: "No. We act as a decision support engine. Your recruiters focus on final coordination and client relations, while we turn candidate work samples into structured evidence briefs." },
        { q: "Can candidates be presented under our own brand?", a: "The service supports white-label presentation after the relevant professional-sharing authorization has been confirmed. Network membership alone does not authorize presentation." },
        { q: "How is technical evidence reviewed?", a: "No automated ranking determines the result. Work samples are reviewed by a human against the criteria relevant to the role and opportunity." },
        { q: "Does AI automatically reject or select candidates?", a: "No. AI is used as decision support for signal extraction and rubric mapping. All final selection and rejection decisions remain strictly human-reviewed and operator-controlled." },
        { q: "What happens if candidate evidence does not match the role?", a: "If initial candidate evidence does not match your role requirements, we review your structured feedback and recalibrate our evidence search parameters immediately." },
        { q: "How are candidate strengths, gaps, and unknowns categorized?", a: "TalentSync360 categorizes signals into five canonical states: SUPPORTED, PARTIAL, UNKNOWN, CONFLICT, and NEEDS VALIDATION. Missing evidence is non-punitive and identifies what still needs to be explored in the interview." }
      ],

      faqTalents: [
        { q: "What do I receive?", a: "A private, structured Evidence Profile that distinguishes supported evidence, partial evidence, unknowns, and points that need clarification." },
        { q: "Do I need a public GitHub repository?", a: "No. You can share a public work sample or describe a private professional experience without disclosing confidential code or client information." },
        { q: "Does the Evidence Review guarantee an interview or job?", a: "No. It is not a certification, ranking, employment guarantee, or interview guarantee." },
        { q: "Do I join the Talent Network automatically?", a: "No. After confirming your Evidence Profile, you decide separately whether you want to join the TalentSync360 Talent Network." },
        { q: "Is English required?", a: "No. English is not a universal requirement for the Evidence Review or Talent Network participation. A specific opportunity may require communication in English or another language." }
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
        runwayBullet3: 'Senior LATAM developers with role-specific communication review when required',
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
      pipelineTagline: 'Role-specific technical criteria. Structured evidence profiles.',
      pipelineSub: 'Decisions based on technical signals. Zero resume noise.',
      step1Label: '01 Intake',
      step1Title: 'Requirement Mapping',
      step1Desc: 'Role, KPIs, and cultural parameters are defined. Feasibility confirmation arrives within 24 hours.',
      step2Label: '02 Process',
      step2Title: 'Role-Specific Technical & Communication Review',
      step2Desc: 'Senior engineers review technical evidence against role-specific criteria. Communication is evaluated in the language required by the opportunity.',
      step3Label: '03 Output',
      step3Title: 'Shortlist Delivery',
      step3Desc: '3–5 human-reviewed finalists arrive with structured evidence profiles for your interview process.',
      trustTitle: 'Vetting Standard',
      trust1Value: '72h',
      trust1Label: 'Shortlist Sprints',
      trust1Desc: 'Sprints designed for 48-72h shortlist cycles with a 72h target SLA for validated briefs.',
      trust2Value: '360°',
      trust2Label: 'Vetting Matrix',
      trust2Desc: 'Role-specific technical evidence, communication requirements, and professional-context observations.',
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
      title: 'Hire vetted LATAM tech talent with decision-ready shortlists.',
      subtitle: 'Scale your technical team with curated candidate shortlists delivered in 72 hours. Human-reviewed LATAM professionals with technical evidence and communication requirements evaluated for the specific opportunity.',
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
      badge: 'Professional Evidence Review',
      title: 'Show us something you did. We’ll show you what your experience can actually demonstrate.',
      subtitle: 'Share one concrete professional experience and receive a private, structured reading of the evidence it provides.',
      subtitleAccent: 'No universal score. No certification. No job or interview guarantee.',
      ctaApply: 'Request my Evidence Review',
      processTitle: 'From your evidence to your decision',
      processSubtitle: 'A purpose-specific review followed by choices that remain yours.',
      languageClarification: 'English is not a universal requirement for the Evidence Review or Talent Network participation. Communication requirements depend on each opportunity and are assessed only when relevant to that role.',
      stage1Label: '01 · EVIDENCE REVIEW',
      stage1Title: 'Share one experience',
      stage1Desc: 'Describe something you did and your individual contribution. GitHub and public code are optional, and confidential material should never be shared.',
      stage2Label: '02 · PRIVATE PROFILE',
      stage2Title: 'Review your structured profile',
      stage2Desc: 'Receive a private Evidence Profile that distinguishes what is supported, partially supported, unknown, or needs clarification. You can confirm it or request a correction.',
      stage3Label: '03 · YOUR DECISION',
      stage3Title: 'Choose what happens next',
      stage3Desc: 'After confirming the review, you decide separately whether to join the Talent Network. Membership never authorizes employer presentation or profile sharing.',
      benefitTitle: 'What the Evidence Review gives you',
      benefit1Num: '01',
      benefit1Title: 'Supported evidence',
      benefit1Desc: 'A clear view of the capabilities the available evidence can reasonably support.',
      benefit2Num: '02',
      benefit2Title: 'Visible uncertainty',
      benefit2Desc: 'Partial evidence and unknowns stay explicit. An unknown is not treated as a weakness or skill gap.',
      benefit3Num: '03',
      benefit3Title: 'Recommended next validation',
      benefit3Desc: 'Practical next questions justified by the reviewed evidence, without turning them into a negative score.',
      checklistTitle: 'What you need to begin',
      checklist1: 'One concrete professional, personal, open-source, or academic experience',
      checklist2: 'A clear description of your individual contribution',
      checklist3: 'No confidential code, client information, or private material',
      ctaButton: 'Request my Evidence Review',
    },
    methodology: {
      badge: 'Our Method',
      title: 'The Shortlist Quality Standard',
      subtitle: 'Every shortlist decision remains human-reviewed and grounded in evidence relevant to the role.',
      criteriaTitle: 'How We Validate',
      criteria1Title: 'Opportunity-Specific Communication',
      criteria1Desc: 'Communication is reviewed in the language required by the opportunity. English is assessed only when the role requires it.',
      criteria2Title: 'Role-Specific Technical Test',
      criteria2Desc: 'A real-world task or relevant experience is reviewed against explicit criteria mapped to the role.',
      criteria3Title: 'Human Professional-Context Review',
      criteria3Desc: 'Human review documents professional communication and relevant context without assigning a universal culture-fit score.',
      deliverablesTitle: 'What You Receive',
      deliverablesSubtitle: 'With every shortlist candidate.',
      deliverable1: '360° Profile per finalist candidate',
      deliverable2: 'Observed communication signals when relevant to the opportunity',
      deliverable3: 'Technical test results + raw work evidence',
      deliverable4: 'Professional-context observations from human review',
      deliverable5: 'Recommended next validation + known constraints',
      signalBadge: 'AI Signal Over Noise',
      signalTitle: 'AI Signal Over Noise',
      signalDesc: 'Evidence is separated into supported signals, partial support, unknowns, and points requiring clarification. AI may assist signal extraction, but it does not rank or make final hiring decisions.',
      signalResult: 'You hire faster. You decide with evidence. You reduce churn.',
    },
    contact: {
      title: 'Get in Touch',
      subtitle: 'Tell us about the role you need to fill. We typically confirm feasibility and initial candidate signal within 24 hours.',
      subtitleGeneral: 'Have a question or need more information? We are here to help.',
      labelFirstName: 'First Name *',
      labelLastName: 'Last Name *',
      labelEmail: 'Work Email *',
      labelRole: 'I am looking for...',
      optionB2B: 'Hiring nearshore talent (B2B)',
      optionGeneral: 'General inquiry',
      labelMessage: 'Message / Role Requirements *',
      placeholderFirstName: 'Your first name',
      placeholderLastName: 'Your last name',
      placeholderEmail: 'email@company.com',
      placeholderMessage: 'Briefly describe the role, required skills, and specific KPIs...',
      buttonSubmit: 'Request Shortlist',
      privacyNote: 'By submitting this form, you agree to our privacy policy and data processing terms.',
      directLabel: 'Direct Access',
      ctaButton: 'Book a 15-min Alignment Call',
    },
    terms: {
      title: 'Terms of Service',
      intro: 'These terms describe the current TalentSync360 services and the choices available to professionals. By using the website or requesting a service, you agree to the applicable terms.',
      sections: [
        { title: '1. Services', paragraphs: ['TalentSync360 offers a voluntary Professional Evidence Review and, after review confirmation, a separate voluntary Talent Network invitation. Employer presentation is a third, separate capability and is not implemented in v1A. Other sourcing and recruitment services do not change these professional authorization boundaries.'] },
        { title: '2. Professional Evidence Review', paragraphs: ['You may submit a concrete professional experience and relevant evidence or references for a private review. A résumé or public code repository is not required. The review may produce a private Professional Evidence Profile that distinguishes supported, partially supported, unknown, and clarification-needed information. UNKNOWN does not mean GAP. English is not a universal review requirement; communication requirements depend on a specific opportunity.'] },
        { title: '3. Accuracy of information', paragraphs: ['Provide information you are authorized to share and describe your individual contribution accurately. Do not submit confidential code, client data, or material belonging to others without permission. Material inaccuracies may pause the review while we seek clarification.'] },
        { title: '4. Correction and confirmation', paragraphs: ['You may confirm the private profile or request a correction. Talent Network membership is offered only after the review is confirmed (REVIEW_CONFIRMED). A request for correction does not by itself enroll you in the network.'] },
        { title: '5. Talent Network', paragraphs: ['Joining is a separate choice. ACCEPTED authorizes TalentSync360 to retain your confirmed profile and contact you about potentially relevant opportunities. It does not authorize presenting, sharing, sending, or publishing your profile to an employer. DECLINED is not a negative signal or ranking. You may withdraw; opportunity outreach and use stop immediately, technical closure may take up to 30 days, and future re-entry requires a new opt-in.'] },
        { title: '6. No guarantee', paragraphs: ['A review, confirmed profile, or Talent Network participation does not guarantee an interview, placement, employment, hiring, or presentation to an employer.'] },
        { title: '7. Private access and security', paragraphs: ['Private profile and access links are confidential and revocable. Keep them secure and do not share another person’s link or attempt to access a profile without authorization.'] },
        { title: '8. Permitted and prohibited use', paragraphs: ['Use the website and services lawfully and for their intended purposes. Do not impersonate others, submit misleading evidence, interfere with service operation, or attempt unauthorized access.'] },
        { title: '9. Privacy', paragraphs: ['The Privacy Policy explains the information we process, retention periods, and how to request access, correction, withdrawal, or deletion. Send privacy requests to privacy@talentsync360.com. Evidence Review questions may be sent to reviews@talentsync360.com.'] },
        { title: '10. Evolution of the service', paragraphs: ['We may update the service and these terms prospectively. Any future employer presentation would require a separate authorization before it could occur; that capability is not implemented in v1A. The terms applicable to a new capability will be explained before you choose whether to use it.'] },
      ],
      footer: 'Effective date: September 16, 2026.',
    },
    privacy: {
      title: 'Privacy Policy',
      intro: 'This policy explains how TalentSync360 handles information in its current professional services and website. Professional Evidence Review is voluntary. The review, Talent Network membership, and employer presentation are three separate layers.',
      sections: [
        { title: '1. Scope and purpose', paragraphs: ['This policy covers website inquiries, Professional Evidence Review, private Professional Evidence Profiles, and voluntary Talent Network participation. Employer presentation is a future separate capability and is not implemented in v1A.'] },
        { title: '2. Information we collect', paragraphs: ['We collect contact details and inquiry content you provide, along with the professional experience, individual contribution, evidence descriptions, and optional references you submit for review. We also process review and correction history, profile confirmation, Talent Network decisions, and limited service and access records needed to administer the case and protect private access. A résumé, public repository, or language recording is not required for Evidence Review.'] },
        { title: '3. How we use information', paragraphs: ['We use this information to respond to inquiries, conduct and justify the requested review, prepare and administer a private profile, handle confirmation or correction, maintain secure access, and manage retention and privacy requests. Only after you separately accept Talent Network membership may we retain the confirmed profile for network participation and contact you about potentially relevant opportunities.'] },
        { title: '4. Talent Network and employer presentation', paragraphs: ['Talent Network is offered only after REVIEW_CONFIRMED. ACCEPTED authorizes retention of the confirmed profile and opportunity contact. It does not authorize TalentSync360 to present, share, send, or publish the profile or review findings to an employer. DECLINED is not a negative signal or ranking. Any future employer presentation would require a separate authorization; it is not implemented in v1A.'] },
        { title: '5. Technology and service providers', paragraphs: ['We use infrastructure and service providers such as Supabase, Vercel, and Resend to store data, operate the website and private service, and deliver communications. They process information as needed to provide those services. We do not treat their operational access as authorization to present a professional to an employer.'] },
        { title: '6. Private Evidence Profile and access', paragraphs: ['The review may produce a private Professional Evidence Profile. You may confirm it or request correction. The profile distinguishes supported, partially supported, unknown, and clarification-needed information; UNKNOWN does not mean GAP. Private profile and access links are confidential and revocable.'] },
        { title: '7. Source evidence', paragraphs: ['We retain only source evidence and references needed to perform, justify, and administer the review during the applicable case lifecycle. Evidence URLs and context follow that lifecycle. We do not systematically archive external repositories, code, websites, or artifacts. Submission alone does not permit reuse for other professionals, marketing, training, or employer sharing. The minimal post-closure audit trail does not retain source evidence URLs or content.'] },
        { title: '8. Retention', paragraphs: ['Abandoned, incomplete, or NOT_ACTIONABLE_YET Evidence Review submissions are retained for 90 days from the last meaningful activity, then closed, deleted, or anonymized according to policy.', 'A completed and confirmed Evidence Profile with Talent Network DECLINED is retained for 180 days from DECLINED, unless deletion is requested earlier. With Talent Network ACCEPTED, we retain the confirmed profile while voluntary participation remains active.', 'If you withdraw from Talent Network, opportunity outreach and use stop immediately. Technical closure may take up to 30 days. Future re-entry requires a new opt-in.', 'A minimal audit trail is retained for 24 months from definitive case closure. It is limited to minimal consent, lifecycle, and closure metadata. It excludes the professional profile, source evidence, findings, recommendations, and, where avoidable, email or name. It is not used for sourcing, marketing, or reactivation.'] },
        { title: '9. Access, correction, withdrawal, and deletion', paragraphs: ['You can request access to or correction of your information, withdraw from Talent Network, or request deletion by writing to privacy@talentsync360.com. We review and handle these requests under the applicable lifecycle and retention policy.'] },
        { title: '10. Automation and AI assistance', paragraphs: ['AI and automation may assist operational or analytical tasks, with human review of the Evidence Review process. They do not automatically enroll a professional in Talent Network or authorize employer presentation. In the current v1A process, irreversible privacy actions require human review. English testing is not universal; any communication requirement depends on a specific opportunity.'] },
        { title: '11. Contact', paragraphs: ['For privacy requests, contact privacy@talentsync360.com. For Evidence Review questions, contact reviews@talentsync360.com.'] },
      ],
      footer: 'Last updated: September 16, 2026.',
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
      bullet1Desc: 'We prepare structured evidence profiles for authorized client presentations after the professional-sharing boundary is satisfied.',
      bullet2Title: 'Role-Specific Technical & Communication Review',
      bullet2Desc: 'Technical evidence and communication requirements are reviewed for the specific opportunity before any authorized introduction.',
      bullet3Title: 'Structured feedback loop',
      bullet3Desc: 'We coordinate with your delivery managers to align shortlist parameters and technical skills directly with your client\'s stack.',
      screenTitle: 'Rigorous Vetting Before Delivery',
      screenBullet1: 'Detailed soft-skills behavioral and team alignment evaluations.',
      screenBullet2: 'Communication review in the language required by the specific opportunity.',
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
      step3Title: 'Structured evidence profiles',
      step3Desc: 'Receive a shortlist of 3 to 5 candidates with role-specific evidence profiles for any separately authorized presentation.',
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
      product: 'Producto',
      forCompanies: 'Para Empresas',
      forTalent: 'Para Talento',
      partners: 'Partners',
      validateRole: 'Validar un Rol',
    },
    homepage: {
      hero: {
        eyebrow: "RECLUTAMIENTO TÉCNICO BASADO EN EVIDENCIA",
        title: "Descubrí con certeza por qué un candidato técnico merece una entrevista.",
        subtitle: "TalentSync360 transforma la experiencia profesional, proyectos, evidencia de trabajo y contexto del rol en candidate briefs estructurados — con fortalezas, brechas, incertidumbres y preguntas clave para la entrevista técnica.",
        supportLine: "Asistido por IA. Revisado por ingenieros. Diseñado para contratación técnica en LATAM.",
        ctaBrief: "Ver un Evidence Brief",
        ctaValidateRole: "Validar un Rol",
        candidateEyebrow: "Soy un profesional de tecnología",
        candidateAction: "Revisar mi evidencia",
      },
      problem: {
        eyebrow: "LA FALLA EN EL SCREENING TRADICIONAL",
        title: "El cuello de botella no es encontrar perfiles. Es confiar en lo que sucede antes de la entrevista técnica.",
        pillar1Title: "Los currículums hacen promesas, no presentan evidencia",
        pillar1Desc: "Los CVs optimizados para palabras clave saturan de falsos positivos y obligan a los desarrolladores senior a perder tiempo valioso filtrando postulantes.",
        pillar1Tag: "Alto costo de filtrado",
        pillar2Title: "La caja negra de las agencias de recruiting",
        pillar2Desc: "Las agencias convencionales envían perfiles sin verificar, sin transparentar dónde termina la evidencia comprobable y dónde empieza la autodeclaración del candidato.",
        pillar2Tag: "Confianza no verificada",
        pillar3Title: "Tiempo técnico desperdiciado en descalificaciones básicas",
        pillar3Desc: "Se malgastan entrevistas descubriendo requisitos ausentes que podrían haberse identificado, contextualizado y visibilizado antes de agendar la llamada.",
        pillar3Tag: "Arrastre técnico costoso",
        bannerText: "TalentSync360 no reemplaza la entrevista técnica.",
        bannerSubtext: "Aseguramos que solo los candidatos con evidencia comprobada y ajuste real al contexto lleguen a ella.",
      },
      transformation: {
        eyebrow: "CÓMO SE TRANSFORMA EL SCREENING TÉCNICO",
        title: "De la búsqueda por palabras clave a la evidencia técnica estructurada",
        subtitle: "Una transición deliberada de 5 etapas: de afirmaciones ambiguas en un PDF a decisiones de contratación calibradas.",
        phase1Eyebrow: "Etapa 1 · Sourcing e Ingesta de Perfiles",
        phase1Title: "Declaraciones de experiencia y datos de CV",
        phase2Eyebrow: "Etapa 2 · Extracción y Procesamiento",
        phase2Title: "Extracción de señales asistida por IA",
        phase2Tag1: "Extracción de Stack y Arquitectura",
        phase2Tag2: "Código y Huella en Producción",
        phase2Tag3: "Señales de Escala y Complejidad",
        phase3Eyebrow: "Etapa 3 · Revisión Técnica por Ingenieros",
        phase3Title: "Verificación experta y control de consistencia",
        phase3Badge: "Revisión Humana Activa",
        phase4Eyebrow: "Etapa 4 · Clasificación de Estados de Evidencia",
        phase4Title: "Calibración epistémica",
        phase4Tag1: "SUPPORTED",
        phase4Tag2: "PARTIAL",
        phase4Tag3: "UNKNOWN",
        phase4Tag4: "NEEDS VALIDATION",
        phase5Eyebrow: "Etapa 5 · Entrega del Artefacto de Decisión",
        phase5Title: "Candidate Evidence Brief",
        phase5Desc: "Entregado en 48-72h. Completo con fortalezas demostradas, brechas calibradas, aspectos no observados y preguntas técnicas exactas para la entrevista.",
        footnote: "Cada brief se calibra según el contexto técnico, la arquitectura y las restricciones de entrega de tu equipo.",
      },
      framework: {
        eyebrow: "EL MARCO DE EVALUACIÓN",
        title: "Tres pasos hacia una total claridad previa a la entrevista",
        subtitle: "Una metodología transparente diseñada para que los líderes de ingeniería tengan máxima certeza en cada postulación recibida.",
        step1Tag: "Paso 01",
        step1Title: "Recolectar Evidencia Técnica",
        step1Desc: "Extraemos señales verificables de proyectos anteriores, decisiones de arquitectura, contribuciones de código y contexto de entrega — no meras afirmaciones en un PDF.",
        step1Footer: "Artefactos verificables y señales respaldadas en fuentes",
        step2Tag: "Paso 02",
        step2Title: "Calibrar con el Contexto del Rol",
        step2Desc: "Cada perfil se evalúa contrastándolo con tu stack tecnológico específico, solapamiento de zona horaria, seniority real y expectativas de entrega.",
        step2Footer: "Alineación de stack objetivo, zona horaria y seniority",
        step3Tag: "Paso 03",
        step3Title: "Entregar Artefactos de Decisión",
        step3Desc: "Recibes un Candidate Evidence Brief exhaustivo con fortalezas claras, brechas identificadas, aspectos desconocidos y preguntas recomendadas para la entrevista.",
        step3Footer: "Brief listo para decidir con acciones concretas para la entrevista",
        methodologyLink: "Explora la Metodología de Evaluación 360° completa",
      },
      hiringTeams: {
        eyebrow: "PARA EQUIPOS DE SELECCIÓN Y LÍDERES TÉCNICOS",
        title: "Dejá de descubrir brechas básicas durante la entrevista técnica.",
        subtitle: "Protegé el tiempo de tus ingenieros evaluando a los candidatos con evidencia objetiva antes de que tu equipo coordine una llamada.",
        point1Title: "Cero entrevistas a ciegas",
        point1Desc: "Sabé exactamente en qué áreas cada candidato tiene solidez demostrada y dónde la evidencia está incompleta antes de agendar.",
        point2Title: "Respeto por el tiempo de los seniors",
        point2Desc: "Liberá a tus desarrolladores senior y tech leads para que se enfoquen en el encaje técnico profundo en lugar de chequear datos de un CV.",
        point3Title: "Preguntas de entrevista accionables",
        point3Desc: "Recibí preguntas personalizadas formuladas específicamente para indagar en las áreas no observadas y brechas calibradas.",
        point4Title: "Calibrado para entregas en LATAM",
        point4Desc: "Filtro riguroso en comunicación en inglés profesional, solapamiento de horario laboral y ejecución autónoma en remoto.",
        ctaValidateRole: "Validar un Rol con Nuestro Equipo",
      },
      roleContextPreview: {
        topNotice: "Prototipo Interactivo de Contexto de Rol",
        stepLabel: "PASO 1: DEFINIR CONTEXTO DEL ROL",
        tabSourced: "Candidato Preseleccionado Directo",
        tabShortlist: "Solicitar Shortlist TS360",
        labelRoleTitle: "Rol Objetivo:",
        valRoleTitle: "Senior Backend Engineer (Go / Distribuido)",
        labelSeniority: "Seniority Requerido:",
        valSeniority: "Senior (5+ años) · Alta Autonomía",
        labelStack: "Stack Principal Requerido:",
        timezone: "Solapamiento de Horario: EE. UU. Este / Pacífico (mín. 4h)",
        screening: "Evaluación de Comunicación: Inglés Técnico Fluido Requerido",
        teaserSourced: "Envía un perfil o CV existente para una rigurosa validación de evidencia frente al contexto de este rol.",
        teaserShortlist: "Solicita una shortlist curada y respaldada en evidencia en LATAM alineada a estos requisitos, entregada en 48-72h.",
        readyStatus: "Listo para Decidir",
      },
      techPros: {
        eyebrow: "PARA PROFESIONALES DE TECNOLOGÍA",
        title: "Tu trabajo es mucho más que palabras clave en un currículum.",
        subtitle: "Destacá decisiones reales de arquitectura, experiencia en producción y profundidad técnica mediante una revisión de evidencia privada y controlada por vos.",
        point1Title: "Presentación centrada en evidencia",
        point1Desc: "Dejá que tus proyectos reales, decisiones técnicas y código hablen con más fuerza que los filtros algorítmicos de CVs.",
        point2Title: "Privado y controlado por el candidato",
        point2Desc: "Revisá y gestioná tu perfil de evidencia en privado. Vos decidís cuándo y hacia qué equipos de contratación compartir tu perfil.",
        point3Title: "Evaluación justa y transparente",
        point3Desc: "Comprendé con precisión cómo se contrasta tu experiencia frente a los requerimientos de la posición, con criterios objetivos y claros.",
        point4Title: "Oportunidades de alto impacto en LATAM",
        point4Desc: "Conectá con equipos internacionales de primer nivel que buscan talento con alta capacidad técnica, autonomía y enfoque de entrega.",
        ctaStartReview: "Iniciar Revisión de Evidencia",
      },
      candidateReviewPreview: {
        title: "Perfil Profesional de Evidencia (Borrador)",
        badge: "Privado para el Candidato",
        sourcesTitle: "Fuentes de Evidencia Profesional Presentadas",
        src1: "Arquitectura del Proyecto y Flujo de Datos",
        src2: "Responsabilidades de Ingeniería en Producción",
        src3: "Caso Técnico de Alta Concurrencia",
        src4: "Repositorio Público (Opcional / Adjunto)",
        demonstratedSignal: "Señal de Ingeniería Demostrada",
        signalQuote: "“El candidato demostró liderazgo en el diseño del pipeline de streaming con Go, gestionando un tráfico continuo de 12.000 req/seg con tolerancia a fallas documentada y sin pérdida de datos.”",
        clarificationHeader: "Nota de Contexto del Candidato Añadida:",
        clarificationQuote: "“Aclaración agregada: La tolerancia a fallas del clúster se comprobó en pruebas de carga en staging; los incidentes de producción están bajo NDA con el empleador anterior.”",
        hideNote: "Ocultar nota",
        addClarification: "Agregar Contexto / Aclaración del Candidato",
        networkVisibility: "Visibilidad en la Red de Talento",
        optInDescriptionActive: "El perfil participa activamente en el emparejamiento con búsquedas técnicas relevantes.",
        optInDescriptionPrivate: "Modo de revisión privado. El perfil no es visible para equipos de contratación.",
        optInToggleActive: "Activado para Oportunidades",
        optInTogglePrivate: "Solo Revisión Privada (Alternar)",
      },
      evidenceStates: {
        eyebrow: "CALIBRACIÓN EPISTÉMICA",
        title: "Los Cinco Estados Canónicos de Evidencia",
        subtitle: "Clasificamos cada afirmación en estados explícitos de evidencia. Si algo no se observa, decimos con honestidad que es desconocido.",
        activeStateLabel: "ESTADO ACTIVO",
        labelSemantic: "Definición Semántica",
        labelScenario: "Escenario Técnico Concreto",
        labelImpact: "Impacto en la Entrevista Técnica",
        epistemicCallout: "Honestidad epistémica: Nunca adivinamos ni asumimos. Cualquier afirmación no verificada se clasifica como UNKNOWN o NEEDS VALIDATION, brindando preguntas precisas a los entrevistadores en lugar de una falsa certeza.",
        methodologyLink: "Conocé más sobre nuestro contrato de cinco estados en la metodología",
        states: {
          SUPPORTED: {
            title: "Respaldado por Evidencia Directa",
            definition: "El candidato aportó documentación verificable, artefactos en producción, decisiones arquitectónicas o contexto operativo claro que acredita la habilidad requerida.",
            exampleContext: "Servicio en Go en producción conectado a un pipeline de Kafka, validado mediante documentación de arquitectura y recorrido de entrega técnica.",
            interviewAction: "Validar profundidad técnica, casos borde y nivel de autoría personal en lugar de limitarse a indagar competencias básicas.",
          },
          PARTIAL: {
            title: "Parcialmente Respaldado",
            definition: "Existe evidencia directa de experiencia afín o herramientas adyacentes, pero los artefactos observables no alcanzan la escala o profundidad exigidas por el rol.",
            exampleContext: "Optimización comprobada en PostgreSQL mononodo, pero sin evidencia observable de sharding distribuido multirregión.",
            interviewAction: "Explorar disposición y capacidad para escalar desde patrones de un solo nodo hacia arquitecturas distribuidas.",
          },
          UNKNOWN: {
            title: "Aspecto No Observado",
            definition: "No existe evidencia observable en la postulación que confirme o refute este requisito. Al no haber sido observado, no se asume bajo ninguna circunstancia.",
            exampleContext: "No se menciona ni demuestra experiencia en el desarrollo de Custom Resource Definitions (CRDs) en Kubernetes.",
            interviewAction: "Consultar de forma directa si cuenta con experiencia práctica en producción con CRDs o si requiere capacitación.",
          },
          CONFLICT: {
            title: "Contradicción / Discrepancia Detectada",
            definition: "Los artefactos o registros cronológicos presentan incongruencias en las fechas, responsabilidades incompatibles o afirmaciones técnicas opuestas.",
            exampleContext: "El CV declara 3 años administrando clústeres de Kubernetes, pero los repositorios y cronología muestran dedicación exclusiva a frontend en Vue.js durante ese período.",
            interviewAction: "Esclarecer la inconsistencia directamente con el candidato antes de continuar con la evaluación técnica.",
          },
          NEEDS_VALIDATION: {
            title: "Requiere Validación en Vivo",
            definition: "El candidato afirma tener la experiencia requerida, pero corroborarla exige una exploración interactiva, explicación de código o resolución técnica en directo.",
            exampleContext: "Declara dominio de migraciones sin tiempo de inactividad (zero-downtime), pero la documentación no expone la estrategia de bloqueos ni los scripts de rollback.",
            interviewAction: "Utilizar la pregunta sugerida para evaluar en tiempo real la gestión de bloqueos y el plan de contingencia ante fallos.",
          },
        },
      },
      partnerDelivery: {
        eyebrow: "PARA PARTNERS DE RECLUTAMIENTO Y DELIVERY",
        title: "Entregá shortlists con evidencia técnica a tus propios clientes.",
        subtitle: "Equipá a tu agencia o consultora con briefs estructurados que generan confianza inmediata y aceleran el cierre de contrataciones.",
        point1Title: "Decision briefs marca blanca",
        point1Desc: "Presentá Candidate Evidence Briefs profesionales con tu propia marca para posicionar a tu equipo como un partner de alto estándar técnico.",
        point2Title: "Reducción drástica del rechazo de perfiles",
        point2Desc: "Los líderes técnicos confían en la evidencia estructurada. Eliminar las exageraciones del CV reduce los descartes y acorta los tiempos de feedback.",
        point3Title: "Diferenciá tu modelo de servicio",
        point3Desc: "Superá el envío tradicional de currículums en PDF sin validar y ofrecé un soporte epistémico basado en hechos observables.",
        ctaPartner: "Asociate con TalentSync360",
      },
      partnerToggle: {
        topLabel: "VISTA PREVIA DE PRESENTACIÓN INTERACTIVA",
        disclaimer: "Observá cómo TalentSync360 transforma las postulaciones comunes de agencias en briefs técnicos estructurados listos para el cliente.",
        tabStandard: "Envío Típico de Agencia",
        tabPartner: "Entrega Partner TalentSync360",
        standardSubtitle: "Envío de currículum genérico con afirmaciones no verificadas y sin soporte calibrado para la decisión.",
        partnerSubtitle: "Candidate brief calibrado con fortalezas confirmadas, brechas identificadas y preguntas sugeridas.",
        candidateRefLabel: "Referencia del Candidato",
        evaluatedRole: "Senior Distributed Systems Engineer (Go / Kafka)",
        observableStrengthLabel: "Fortalezas Observables",
        observableStrengthDesc: "Microservicios en Go en producción verificados, procesando eventos de Kafka a escala.",
        surfaceUnknownLabel: "Incertidumbres Calibradas",
        surfaceUnknownDesc: "Tolerancia a fallas multirregión no observada en artefactos; marcada para validación en vivo.",
      },
      deliverable: {
        eyebrow: "EL ENTREGABLE PRINCIPAL",
        title: "El Candidate Evidence Brief",
        subtitle: "Un informe de evaluación estructurado y transparente diseñado para que los líderes de ingeniería tomen decisiones de entrevista con total confianza.",
        candidateRef: "REF: AR-8821",
        humanReviewComplete: "Revisión Técnica por Ingenieros Finalizada",
        fullInteractiveView: "Abrir Brief Completo",
        syntheticBanner: "CANDIDATE BRIEF ILUSTRATIVO · MUESTRA SINTÉTICA",
        targetRoleLabel: "Rol Objetivo:",
        targetRoleValue: "Senior Backend Engineer (Go / Sistemas Distribuidos)",
        stackLabel: "Stack Principal: Go · Kafka · Kubernetes · PostgreSQL",
        locationLabel: "LATAM (UTC-3 / Argentina)",
        availabilityLabel: "Disponible en 2 semanas",
        strengthsTitle: "Fortalezas",
        strengthsDesc: "Experiencia documentada en producción construyendo y manteniendo pipelines de mensajería asincrónica en Go.",
        gapsTitle: "Brechas Calibradas",
        gapsDesc: "Experiencia observable limitada en tolerancia a fallas en clústeres multirregión; trayectoria previa enfocada en una sola región.",
        unknownsTitle: "Aspectos No Observados",
        unknownsDesc: "Sin artefactos observables que acrediten experiencia directa en desarrollo de CRDs en Kubernetes.",
        validationPromptLabel: "Pregunta de Validación Sugerida para la Entrevista:",
        validationPromptText: "“¿Qué criterios aplicaste para definir los límites de partición y los umbrales de contrapresión (backpressure) en tu implementación de mensajería?”",
        footerNote: "Inspecciona el formato de evaluación completo en el modal interactivo",
        ctaBrief: "Ver un Evidence Brief",
      },
      finalCta: {
        eyebrow: "COMENZAR AHORA",
        title: "Traé una búsqueda real. Mirá lo que la evidencia respalda concretamente.",
        subtitle: "Dejá de perder horas de entrevista descubriendo brechas técnicas básicas. Validá los candidatos que ya tenés o solicitá una shortlist en LATAM basada en evidencia.",
        ctaValidateRole: "Validar un Rol",
        ctaBrief: "Ver un Evidence Brief",
        footnote: "Calificación técnica revisada por ingenieros para contrataciones distribuidas en LATAM.",
      },
      modal: {
        badge: "CANDIDATE EVIDENCE BRIEF",
        ref: "REF: AR-8821",
        closeLabel: "Cerrar modal de Evidence Brief",
        syntheticDisclaimer: "[ MUESTRA ILUSTRATIVA — DATOS DE CANDIDATO FICTICIO ]",
        syntheticSubtext: "Demuestra el formato de soporte estructurado para la toma de decisiones",
        targetRoleLabel: "Rol Objetivo",
        locationZoneLabel: "Ubicación y Zona",
        locationZoneValue: "LATAM (UTC-3 / Argentina)",
        availabilityLabel: "Disponibilidad",
        availabilityValue: "Preaviso de 2 semanas",
        verificationStatusLabel: "Estado de Verificación",
        verificationStatusValue: "Revisado por Ingenieros · Validado",
        validatedContextTitle: "Contexto Validado y Alcance Técnico",
        coreStackLabel: "Stack Principal y Frameworks:",
        operationalContextLabel: "Contexto Operativo:",
        operationalContextValue: "Streaming de eventos de alto rendimiento, arquitectura de microservicios, trazabilidad distribuida y cargas de trabajo en Kubernetes.",
        strengthsTitle: "Fortalezas Demostradas",
        strengthsItems: ["Lideró la migración de un servicio HTTP sincrónico a una arquitectura de microservicios en Go orientada a eventos manejando 12.000 req/seg.", "Tolerancia a fallas sin pérdida de datos en particiones y control de contrapresión documentados en clústeres de Kafka.", "Experiencia directa en diagnóstico de fugas de memoria en goroutines y optimización con pprof en contenedores de producción."],
        gapsTitle: "Brechas Calibradas",
        gapsItems: ["Trayectoria de infraestructura enfocada en despliegues cloud en una sola región; exposición directa limitada a arquitecturas globales multirregión.", "Exposición limitada al desarrollo de Kubernetes Operators personalizados con Kubebuilder / Operator SDK."],
        unknownsTitle: "Aspectos No Observados",
        unknownsItems: ["Nivel de participación directa en guardias (on-call) y respuesta ante incidentes en producción no especificado en el material presentado.", "Profundidad de conocimiento en Cassandra o motores de almacenamiento NoSQL distribuidos no observada."],
        unknownsNote: "Los aspectos no observados reflejan áreas no evaluadas en el material recibido, no debilidades demostradas. Se sugiere indagarlos en la entrevista técnica.",
        priorityQuestionsTitle: "Preguntas Prioritarias para la Entrevista",
        q1Title: "Indagación sobre Particionado de Kafka y Contrapresión",
        q1Quote: "“En tu microservicio de alta demanda en Go, ¿cómo manejaba el grupo de consumidores los picos repentinos de retraso (lag) y qué métrica determinaba la estrategia de rebalanceo?”",
        q1Target: "Señal buscada: Evalúa si el candidato comprende los desafíos reales de contrapresión distribuida frente a esquemas puramente teóricos.",
        q2Title: "Resiliencia Operativa y Modos de Falla",
        q2Quote: "“Relatanos un incidente en producción donde un servicio se degradó de forma inesperada. ¿Cómo diagnosticaste la causa raíz y qué acción correctiva lideraste personalmente en el post-mortem?”",
        q2Target: "Señal buscada: Valida el nivel de responsabilidad, liderazgo y madurez técnica ante fallas imprevistas de infraestructura.",
        footerNote: "Muestra generada con fines ilustrativos. Los briefs reales de candidatos se calibran con la arquitectura y requerimientos específicos de tu búsqueda.",
        closeButton: "Cerrar Vista Previa",
        ctaValidateRole: "Validar un Rol con Este Formato",
      },
    },
    footer: {
      tagline: 'Shortlists técnicas curadas de LATAM con revisión humana, evidencia técnica y comunicación evaluada cuando el rol lo requiere.',
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
          'Perfiles de evidencia estructurados por candidato',
          'Presentación marca blanca al cliente cuando exista autorización separada',
          'Una ronda de feedback estructurada',
          'Entrega objetivo tras validación del brief',
          'Excepción para roles muy especializados'
        ],
      },

      demo: {
        eyebrow: 'DEMO INTERACTIVA',
        title: 'Presentación white-label de candidatos',
        explanation: 'Las consultoras y partners pueden usar el workspace para presentaciones autorizadas por separado. Las empresas que contratan directamente lo usan como apoyo estructurado para decidir.',
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
        step3Desc: 'Las consultoras y partners pueden usar la presentación white-label una vez satisfecha la autorización correspondiente del profesional. Las empresas reciben un workspace estructurado para decidir.',
      },

      evidence: {
        eyebrow: 'Evidencia Entregable',
        title: 'Qué recibís realmente',
        desc: 'Compilamos evidencia estructurada para cada candidato finalista. En lugar de CVs genéricos, delivery recibe un paquete que separa señales respaldadas, respaldo parcial, aspectos desconocidos y validaciones pendientes para cualquier presentación autorizada al cliente.',
        disclaimer: 'TalentSync360 no toma decisiones automatizadas de contratación, no garantiza coincidencias perfectas ni certifica un nivel específico de inglés. Cada shortlist es revisada por una persona antes de su entrega.',
        items: [
          'Resumen ejecutivo del candidato',
          'Match requisito por requisito',
          'Evidencia técnica y observaciones estructuradas del revisor',
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
          { title: 'Validar candidatos ya reclutados internamente', desc: 'Aplicá criterios de evidencia consistentes y específicos del rol a candidatos encontrados por recruiters, referidos o canales propios.' },
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
        { q: "¿Reemplazan a nuestros reclutadores internos?", a: "No. Actuamos como un motor de soporte de decisiones. Tus reclutadores se enfocan en la coordinación final y la relación con el cliente, mientras nosotros transformamos muestras de trabajo en briefs de evidencia estructurados." },
        { q: "¿Los candidatos se pueden presentar bajo nuestra propia marca?", a: "El servicio admite presentación white-label una vez confirmada la autorización correspondiente del profesional. La membresía en la red por sí sola no autoriza la presentación." },
        { q: "¿Cómo se revisa la evidencia técnica?", a: "Ningún ranking automático determina el resultado. Las muestras de trabajo son revisadas por una persona según los criterios relevantes para el rol y la oportunidad." },
        { q: "¿La IA rechaza o selecciona candidatos automáticamente?", a: "No. La IA se utiliza como soporte de decisiones para la extracción de señales y el mapeo de rúbricas. Todas las decisiones finales de selección y rechazo permanecen estrictamente revisadas por humanos y controladas por un operador." },
        { q: "¿Qué pasa si la evidencia del candidato no coincide con el rol?", a: "Si la evidencia inicial no coincide con los requisitos del puesto, revisamos tu feedback estructurado y recalibramos los parámetros de búsqueda de inmediato." },
        { q: "¿Cómo se categorizan las fortalezas, brechas y aspectos desconocidos?", a: "TalentSync360 categoriza las señales en cinco estados canónicos: SUPPORTED, PARTIAL, UNKNOWN, CONFLICT y NEEDS VALIDATION. La falta de evidencia no es punitiva e identifica lo que aún debe explorarse en la entrevista." }
      ],

      faqTalents: [
        { q: "¿Qué recibo?", a: "Un Evidence Profile privado y estructurado que distingue evidencia respaldada, evidencia parcial, aspectos desconocidos y puntos que necesitan aclaración." },
        { q: "¿Necesito un repositorio público en GitHub?", a: "No. Podés compartir una muestra pública o describir una experiencia profesional privada sin revelar código confidencial ni información de clientes." },
        { q: "¿La Evidence Review garantiza una entrevista o un trabajo?", a: "No. No es una certificación, ranking, garantía de empleo ni garantía de entrevista." },
        { q: "¿Entro automáticamente a la red de talento?", a: "No. Después de confirmar tu Evidence Profile, decidís por separado si querés incorporarte a la red de talento de TalentSync360." },
        { q: "¿El inglés es obligatorio?", a: "No. El inglés no es un requisito universal para la Evidence Review ni para participar en la red. Una oportunidad específica puede requerir comunicación en inglés u otro idioma." }
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
        runwayBullet3: 'Desarrolladores senior de LATAM con revisión de comunicación según el rol cuando corresponda',
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
      pipelineTagline: 'Criterios técnicos específicos del rol. Perfiles de evidencia estructurados.',
      pipelineSub: 'Decisiones basadas en señales técnicas. Cero ruido de CVs.',
      step1Label: '01 Intake',
      step1Title: 'Mapeo de Requerimientos',
      step1Desc: 'Se definen el rol, los KPIs y los parámetros culturales. La confirmación de viabilidad llega en 24 horas.',
      step2Label: '02 Proceso',
      step2Title: 'Revisión Técnica y de Comunicación Según el Rol',
      step2Desc: 'Ingenieros senior revisan evidencia técnica con criterios específicos del rol. La comunicación se evalúa en el idioma requerido por la oportunidad.',
      step3Label: '03 Output',
      step3Title: 'Entrega de Shortlist',
      step3Desc: 'De 3 a 5 finalistas revisados por personas con perfiles de evidencia estructurados para tu proceso de entrevistas.',
      trustTitle: 'Estándar de Validación',
      trust1Value: '72h',
      trust1Label: 'Sprints de Shortlist',
      trust1Desc: 'Sprints diseñados para ciclos de 48-72h con un SLA objetivo de 72h para briefs validados.',
      trust2Value: '360°',
      trust2Label: 'Matriz de Validación',
      trust2Desc: 'Evidencia técnica específica del rol, requisitos de comunicación y observaciones de contexto profesional.',
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
      subtitle: 'Shortlists con revisión humana, evidencia técnica y requisitos de comunicación evaluados para cada oportunidad específica.',
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
      badge: 'Professional Evidence Review',
      title: 'Mostranos algo que hiciste. Te devolvemos una lectura estructurada de lo que tu experiencia realmente permite demostrar.',
      subtitle: 'Compartí una experiencia profesional concreta y recibí una lectura privada y estructurada de la evidencia que aporta.',
      subtitleAccent: 'Sin puntaje universal. Sin certificación. Sin garantía de trabajo ni entrevista.',
      ctaApply: 'Solicitar mi Evidence Review',
      processTitle: 'De tu evidencia a tu decisión',
      processSubtitle: 'Una revisión con un propósito específico, seguida de decisiones que siguen siendo tuyas.',
      languageClarification: 'El inglés no es un requisito universal para la Evidence Review ni para participar en la red de talento. Los requisitos de comunicación dependen de cada oportunidad y se evalúan solo cuando son relevantes para ese rol.',
      stage1Label: '01 · EVIDENCE REVIEW',
      stage1Title: 'Compartí una experiencia',
      stage1Desc: 'Describí algo que hiciste y tu contribución individual. GitHub y el código público son opcionales; nunca compartas material confidencial.',
      stage2Label: '02 · PERFIL PRIVADO',
      stage2Title: 'Revisá tu perfil estructurado',
      stage2Desc: 'Recibí un Evidence Profile privado que distingue qué está respaldado, parcialmente respaldado, desconocido o necesita aclaración. Podés confirmarlo o pedir una corrección.',
      stage3Label: '03 · TU DECISIÓN',
      stage3Title: 'Elegí qué pasa después',
      stage3Desc: 'Después de confirmar la revisión, decidís por separado si querés incorporarte a la red de talento. La membresía nunca autoriza presentar ni compartir tu perfil con empresas.',
      benefitTitle: 'Qué te aporta la Evidence Review',
      benefit1Num: '01',
      benefit1Title: 'Evidencia respaldada',
      benefit1Desc: 'Una lectura clara de las capacidades que la evidencia disponible permite respaldar responsablemente.',
      benefit2Num: '02',
      benefit2Title: 'Incertidumbre visible',
      benefit2Desc: 'La evidencia parcial y los aspectos desconocidos quedan explícitos. Algo desconocido no se trata como debilidad ni brecha.',
      benefit3Num: '03',
      benefit3Title: 'Próxima validación recomendada',
      benefit3Desc: 'Próximas preguntas prácticas justificadas por la evidencia revisada, sin convertirlas en un puntaje negativo.',
      checklistTitle: 'Qué necesitás para empezar',
      checklist1: 'Una experiencia profesional, personal, open source o académica concreta',
      checklist2: 'Una descripción clara de tu contribución individual',
      checklist3: 'Ningún código confidencial, dato de clientes ni material privado',
      ctaButton: 'Solicitar mi Evidence Review',
    },
    methodology: {
      badge: 'Nuestro Método',
      title: 'El Estándar de Calidad de Shortlist',
      subtitle: 'Cada decisión de shortlist mantiene revisión humana y se basa en evidencia relevante para el rol.',
      criteriaTitle: 'Cómo Validamos',
      criteria1Title: 'Comunicación Según la Oportunidad',
      criteria1Desc: 'La comunicación se revisa en el idioma requerido por la oportunidad. El inglés se evalúa solo cuando el rol lo requiere.',
      criteria2Title: 'Validación Técnica Específica del Rol',
      criteria2Desc: 'Una experiencia o tarea relevante se revisa según criterios explícitos vinculados con el rol.',
      criteria3Title: 'Revisión Humana del Contexto Profesional',
      criteria3Desc: 'La revisión humana documenta comunicación profesional y contexto relevante sin asignar un puntaje universal de encaje cultural.',
      deliverablesTitle: 'Lo que Recibís',
      deliverablesSubtitle: 'Con cada candidato de la shortlist.',
      deliverable1: 'Perfil 360 por candidato finalista',
      deliverable2: 'Señales de comunicación observadas cuando son relevantes para la oportunidad',
      deliverable3: 'Resultados de test tecnico + evidencia cruda del trabajo',
      deliverable4: 'Observaciones de contexto profesional con revisión humana',
      deliverable5: 'Próxima validación recomendada + restricciones conocidas',
      signalBadge: 'IA Con Criterio, No Al Azar',
      signalTitle: 'IA Con Criterio, No Al Azar',
      signalDesc: 'La evidencia se separa en señales respaldadas, respaldo parcial, aspectos desconocidos y puntos que requieren aclaración. La IA puede asistir la extracción de señales, pero no rankea ni toma decisiones finales de contratación.',
      signalResult: 'Contratas mas rapido. Decidis con evidencia. Reducis la rotacion.',
    },
    contact: {
      title: 'Ponete en Contacto',
      subtitle: 'Contanos sobre el rol que necesitas cubrir. Tipicamente confirmamos viabilidad y senal inicial de candidato en 24 horas.',
      subtitleGeneral: 'Tenes alguna pregunta o necesitás mas informacion? Estamos aca para ayudarte.',
      labelFirstName: 'Nombre *',
      labelLastName: 'Apellido *',
      labelEmail: 'Email de Trabajo *',
      labelRole: 'Estoy buscando...',
      optionB2B: 'Contratar talento nearshore (B2B)',
      optionGeneral: 'Consulta general',
      labelMessage: 'Mensaje / Requerimientos del Rol *',
      placeholderFirstName: 'Tu nombre',
      placeholderLastName: 'Tu apellido',
      placeholderEmail: 'email@tuempresa.com',
      placeholderMessage: 'Describi brevemente el rol, habilidades requeridas y KPIs especificos...',
      buttonSubmit: 'Solicitar Shortlist',
      privacyNote: 'Al enviar este formulario, aceptas nuestra politica de privacidad y terminos de procesamiento de datos.',
      directLabel: 'Acceso Directo',
      ctaButton: 'Reservar Llamada de Alineacion de 15 min',
    },
    terms: {
      title: 'Términos y Condiciones',
      intro: 'Estos términos describen los servicios actuales de TalentSync360 y las decisiones disponibles para los profesionales. Al usar el sitio web o solicitar un servicio, aceptás los términos aplicables.',
      sections: [
        { title: '1. Servicios', paragraphs: ['TalentSync360 ofrece una Revisión de Evidencia Profesional voluntaria y, después de confirmar la revisión, una invitación separada y voluntaria a la Red de Talento. La presentación ante empresas es una tercera capacidad separada que no está implementada en v1A. Otros servicios de sourcing y reclutamiento no modifican estos límites de autorización del profesional.'] },
        { title: '2. Revisión de Evidencia Profesional', paragraphs: ['Podés compartir una experiencia profesional concreta y evidencia o referencias relevantes para una revisión privada. No se exige un currículum ni un repositorio público de código. La revisión puede producir un Perfil de Evidencia Profesional privado que distingue información respaldada, parcialmente respaldada, desconocida y que requiere aclaración. UNKNOWN no significa GAP. El inglés no es un requisito universal de la revisión; los requisitos de comunicación dependen de cada oportunidad.'] },
        { title: '3. Exactitud de la información', paragraphs: ['Proporcioná información que estés autorizado a compartir y describí con precisión tu contribución individual. No envíes código confidencial, datos de clientes ni material de terceros sin permiso. Las inexactitudes importantes pueden pausar la revisión mientras solicitamos una aclaración.'] },
        { title: '4. Corrección y confirmación', paragraphs: ['Podés confirmar el perfil privado o solicitar una corrección. La incorporación a la Red de Talento se ofrece solo después de que la revisión esté confirmada (REVIEW_CONFIRMED). Solicitar una corrección no te incorpora por sí solo a la red.'] },
        { title: '5. Red de Talento', paragraphs: ['Incorporarte es una decisión separada. ACCEPTED autoriza a TalentSync360 a conservar tu perfil confirmado y contactarte por oportunidades potencialmente relevantes. No autoriza a presentar, compartir, enviar ni publicar tu perfil ante una empresa. DECLINED no es una señal negativa ni una clasificación. Podés retirarte: cesan de inmediato el contacto y el uso para oportunidades, el cierre técnico puede demorar hasta 30 días y un futuro reingreso requiere una nueva aceptación.'] },
        { title: '6. Sin garantía', paragraphs: ['Una revisión, un perfil confirmado o la participación en la Red de Talento no garantizan entrevistas, colocación, empleo, contratación ni presentación ante una empresa.'] },
        { title: '7. Acceso privado y seguridad', paragraphs: ['Los enlaces privados al perfil y de acceso son confidenciales y revocables. Protegelos y no compartas enlaces de otra persona ni intentes acceder a un perfil sin autorización.'] },
        { title: '8. Uso permitido y prohibido', paragraphs: ['Usá el sitio web y los servicios de forma lícita y para sus fines previstos. No suplantes a otras personas, no envíes evidencia engañosa, no interfieras con el funcionamiento del servicio ni intentes acceder sin autorización.'] },
        { title: '9. Privacidad', paragraphs: ['La Política de Privacidad explica qué información tratamos, los plazos de conservación y cómo solicitar acceso, corrección, retiro o eliminación. Enviá solicitudes de privacidad a privacy@talentsync360.com. Para consultas sobre la revisión, escribí a reviews@talentsync360.com.'] },
        { title: '10. Evolución del servicio', paragraphs: ['Podemos actualizar el servicio y estos términos hacia adelante. Cualquier futura presentación ante empresas requeriría una autorización separada antes de realizarse; esa capacidad no está implementada en v1A. Explicaremos los términos de una nueva capacidad antes de que decidas si querés usarla.'] },
      ],
      footer: 'Fecha de vigencia: 16 de septiembre de 2026.',
    },
    privacy: {
      title: 'Política de Privacidad',
      intro: 'Esta política explica cómo TalentSync360 trata la información en sus servicios profesionales actuales y en el sitio web. La Revisión de Evidencia Profesional es voluntaria. La revisión, la Red de Talento y la presentación ante empresas son tres capas separadas.',
      sections: [
        { title: '1. Alcance y finalidad', paragraphs: ['Esta política cubre las consultas del sitio web, la Revisión de Evidencia Profesional, los Perfiles de Evidencia Profesional privados y la participación voluntaria en la Red de Talento. La presentación ante empresas es una futura capacidad separada que no está implementada en v1A.'] },
        { title: '2. Información que recopilamos', paragraphs: ['Recopilamos los datos de contacto y el contenido de consultas que nos proporcionás, además de la experiencia profesional, la contribución individual, las descripciones de evidencia y las referencias opcionales que enviás para revisión. También tratamos el historial de revisión y corrección, la confirmación del perfil, las decisiones sobre la Red de Talento y los registros limitados de servicio y acceso necesarios para administrar el caso y proteger el acceso privado. La revisión no exige currículum, repositorio público ni grabación para evaluar idiomas.'] },
        { title: '3. Cómo usamos la información', paragraphs: ['Usamos esta información para responder consultas, realizar y fundamentar la revisión solicitada, preparar y administrar un perfil privado, gestionar la confirmación o corrección, mantener el acceso seguro y atender la conservación de datos y las solicitudes de privacidad. Solo después de que aceptes por separado la Red de Talento podemos conservar el perfil confirmado para tu participación en la red y contactarte por oportunidades potencialmente relevantes.'] },
        { title: '4. Red de Talento y presentación ante empresas', paragraphs: ['La Red de Talento se ofrece solo después de REVIEW_CONFIRMED. ACCEPTED autoriza a conservar el perfil confirmado y a contactarte por oportunidades. No autoriza a TalentSync360 a presentar, compartir, enviar ni publicar el perfil o los hallazgos de la revisión ante una empresa. DECLINED no es una señal negativa ni una clasificación. Cualquier presentación futura ante empresas requeriría una autorización separada; no está implementada en v1A.'] },
        { title: '5. Tecnología y proveedores de servicios', paragraphs: ['Usamos proveedores de infraestructura y servicios como Supabase, Vercel y Resend para almacenar datos, operar el sitio web y el servicio privado, y enviar comunicaciones. Tratan la información según sea necesario para prestar esos servicios. Su acceso operativo no constituye una autorización para presentar a un profesional ante una empresa.'] },
        { title: '6. Perfil de Evidencia privado y acceso', paragraphs: ['La revisión puede producir un Perfil de Evidencia Profesional privado. Podés confirmarlo o solicitar una corrección. El perfil distingue información respaldada, parcialmente respaldada, desconocida y que requiere aclaración; UNKNOWN no significa GAP. Los enlaces privados al perfil y de acceso son confidenciales y revocables.'] },
        { title: '7. Evidencia de origen', paragraphs: ['Conservamos solo la evidencia y las referencias necesarias para realizar, fundamentar y administrar la revisión durante el ciclo de vida aplicable al caso. Las URL de evidencia y su contexto siguen ese ciclo. No archivamos sistemáticamente repositorios externos, código, sitios web ni otros materiales. El solo envío no permite reutilizar la evidencia para otros profesionales, marketing, entrenamiento ni compartirla con empresas. El registro mínimo posterior al cierre no conserva URL ni contenido de la evidencia de origen.'] },
        { title: '8. Conservación', paragraphs: ['Las solicitudes de Revisión de Evidencia abandonadas, incompletas o NOT_ACTIONABLE_YET se conservan durante 90 días desde la última actividad significativa; luego se cierran, eliminan o anonimizan según la política.', 'Un Perfil de Evidencia completado y confirmado con la Red de Talento en estado DECLINED se conserva durante 180 días desde DECLINED, salvo que se solicite su eliminación antes. Con la Red de Talento en estado ACCEPTED, conservamos el perfil confirmado mientras la participación voluntaria siga activa.', 'Si te retirás de la Red de Talento, cesan de inmediato el contacto y el uso para oportunidades. El cierre técnico puede demorar hasta 30 días. Un futuro reingreso requiere una nueva aceptación.', 'Conservamos un registro mínimo de auditoría durante 24 meses desde el cierre definitivo del caso. Se limita a metadatos mínimos de consentimiento, ciclo de vida y cierre. Excluye el perfil profesional, la evidencia de origen, los hallazgos, las recomendaciones y, cuando sea evitable, el correo electrónico o el nombre. No se utiliza para sourcing, marketing ni reactivación.'] },
        { title: '9. Acceso, corrección, retiro y eliminación', paragraphs: ['Podés solicitar acceso a tu información o su corrección, retirarte de la Red de Talento o solicitar la eliminación escribiendo a privacy@talentsync360.com. Revisamos y gestionamos estas solicitudes según el ciclo de vida y la política de conservación aplicables.'] },
        { title: '10. Automatización y asistencia de IA', paragraphs: ['La IA y la automatización pueden asistir tareas operativas o analíticas, con revisión humana del proceso de Revisión de Evidencia. No incorporan automáticamente a un profesional a la Red de Talento ni autorizan su presentación ante empresas. En el proceso actual de v1A, las acciones de privacidad irreversibles requieren revisión humana. La evaluación de inglés no es universal; los requisitos de comunicación dependen de cada oportunidad específica.'] },
        { title: '11. Contacto', paragraphs: ['Para solicitudes de privacidad, escribí a privacy@talentsync360.com. Para consultas sobre la Revisión de Evidencia, escribí a reviews@talentsync360.com.'] },
      ],
      footer: 'Última actualización: 16 de septiembre de 2026.',
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
      bullet1Desc: 'Preparamos perfiles de evidencia estructurados para presentaciones autorizadas al cliente una vez satisfecha la autorización correspondiente del profesional.',
      bullet2Title: 'Revisión Técnica y de Comunicación Según el Rol',
      bullet2Desc: 'La evidencia técnica y los requisitos de comunicación se revisan para la oportunidad específica antes de cualquier presentación autorizada.',
      bullet3Title: 'Feedback Continuo y Estructurado',
      bullet3Desc: 'Nos coordinamos con tus directores de delivery para alinear los parámetros de la shortlist y las habilidades técnicas directamente con el stack del cliente.',
      screenTitle: 'Vetting Riguroso Antes de la Entrega',
      screenBullet1: 'Evaluaciones detalladas de habilidades blandas y alineación de equipos.',
      screenBullet2: 'Revisión de comunicación en el idioma requerido por la oportunidad específica.',
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
      step3Title: 'Perfiles de Evidencia Estructurados',
      step3Desc: 'Recibí una shortlist de 3 a 5 candidatos con perfiles de evidencia específicos del rol para cualquier presentación autorizada por separado.',
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
