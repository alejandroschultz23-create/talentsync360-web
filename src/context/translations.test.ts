import { describe, expect, it } from 'vitest';
import { translations, type Language } from './translations';

describe.each<Language>(['en', 'es'])('%s public legal copy', (language) => {
  const { privacy, terms } = translations[language];
  const privacyCopy = privacy.sections.flatMap(({ title, paragraphs }) => [title, ...paragraphs]).join(' ');
  const termsCopy = terms.sections.flatMap(({ title, paragraphs }) => [title, ...paragraphs]).join(' ');

  it('covers the approved sections and fixed release date', () => {
    expect(privacy.sections).toHaveLength(11);
    expect(terms.sections).toHaveLength(10);
    expect(privacy.footer).toContain('2026');
    expect(terms.footer).toContain('2026');
    expect(privacy.footer).toContain(language === 'en' ? 'September 16' : '16 de septiembre');
    expect(terms.footer).toContain(language === 'en' ? 'September 16' : '16 de septiembre');
  });

  it('states separate consent and retention boundaries', () => {
    for (const copy of [privacyCopy, termsCopy]) {
      expect(copy).toContain('REVIEW_CONFIRMED');
      expect(copy).toContain('ACCEPTED');
      expect(copy).toContain('DECLINED');
      expect(copy).toContain('privacy@talentsync360.com');
    }
    for (const period of ['90', '180', '30', '24']) {
      expect(privacyCopy).toContain(period);
    }
    expect(privacyCopy).toContain('reviews@talentsync360.com');
    expect(termsCopy).toContain('reviews@talentsync360.com');
  });

  it('excludes obsolete Privacy and Terms claims', () => {
    expect(`${privacyCopy} ${termsCopy} ${privacy.footer} ${terms.footer}`).not.toMatch(
      /video\/audio|scorecards|resumes|prospective employers|interim policy|April|Gold List|top 1%/i,
    );
  });

  it('provides all required navigation items', () => {
    const { nav } = translations[language];
    expect(nav.companies).toBeTruthy();
    expect(nav.talents).toBeTruthy();
    expect(nav.methodology).toBeTruthy();
    expect(nav.contact).toBeTruthy();
    expect(nav.product).toBeTruthy();
    expect(nav.forCompanies).toBeTruthy();
    expect(nav.forTalent).toBeTruthy();
    expect(nav.partners).toBeTruthy();
    expect(nav.validateRole).toBeTruthy();
  });

  it('provides complete homepage sections and preserves canonical evidence state tokens', () => {
    const { homepage } = translations[language];
    expect(homepage).toBeDefined();
    expect(homepage.hero.eyebrow).toBeTruthy();
    expect(homepage.hero.title).toBeTruthy();
    expect(homepage.hero.ctaBrief).toBeTruthy();
    expect(homepage.hero.ctaValidateRole).toBeTruthy();
    expect(homepage.heroFallback.projects).toBe(language === 'es' ? 'PROYECTOS' : 'PROJECTS');
    expect(homepage.heroFallback.github).toBe('GITHUB');
    expect(homepage.heroFallback.evidenceBrief).toBe(language === 'es' ? 'INFORME DE EVIDENCIA' : 'EVIDENCE BRIEF');
    expect(homepage.heroFallback.decisionReady).toBe(language === 'es' ? 'Listo para decidir' : 'Decision Ready');
    expect(homepage.heroFallback.workExp).toBe(language === 'es' ? 'EXPERIENCIA' : 'WORK EXP');
    expect(homepage.heroFallback.roleContext).toBe(language === 'es' ? 'CONTEXTO DEL ROL' : 'ROLE CONTEXT');
    expect(homepage.problem.title).toBeTruthy();
    expect(homepage.transformation.title).toBeTruthy();
    expect(homepage.framework.title).toBeTruthy();
    expect(homepage.hiringTeams.title).toBeTruthy();
    expect(homepage.roleContextPreview.stepLabel).toBeTruthy();
    expect(homepage.techPros.title).toBeTruthy();
    expect(homepage.candidateReviewPreview.title).toBeTruthy();
    expect(homepage.evidenceStates.title).toBeTruthy();
    expect(homepage.partnerDelivery.title).toBeTruthy();
    expect(homepage.partnerToggle.topLabel).toBeTruthy();
    expect(homepage.deliverable.title).toBeTruthy();
    expect(homepage.finalCta.title).toBeTruthy();
    expect(homepage.modal.badge).toBeTruthy();

    // Verify all 5 canonical evidence states exist in the contract
    const states = homepage.evidenceStates.states;
    expect(states.SUPPORTED).toBeDefined();
    expect(states.PARTIAL).toBeDefined();
    expect(states.UNKNOWN).toBeDefined();
    expect(states.CONFLICT).toBeDefined();
    expect(states.NEEDS_VALIDATION).toBeDefined();
  });

  it('provides complete approved commercial architecture for companies', () => {
    const { companies } = translations[language];
    expect(companies).toBeDefined();

    // 1. Hero
    expect(companies.hero.title).toBeTruthy();
    expect(companies.hero.ctaTrial).toBeTruthy();
    expect(companies.hero.ctaDemo).toBeTruthy();
    expect(companies.hero.ctaViewBrief).toBeTruthy();

    // 2. Product Proof
    expect(companies.productProof.candidateRef).toBe('TS-BRIEF-2026-084');
    expect(companies.productProof.sampleBanner).toBeTruthy();
    expect(companies.productProof.signals.supported.badge).toBe(language === 'es' ? 'RESPALDADO' : 'SUPPORTED');
    expect(companies.productProof.signals.partial.badge).toBe(language === 'es' ? 'PARCIAL' : 'PARTIAL');
    expect(companies.productProof.signals.unknown.badge).toBe(language === 'es' ? 'DESCONOCIDO' : 'UNKNOWN');
    expect(companies.productProof.signals.needsValidation.badge).toBe(language === 'es' ? 'REQUIERE VALIDACIÓN' : 'NEEDS VALIDATION');

    // 3. How it works
    expect(companies.howItWorks.steps).toHaveLength(5);

    // 4. Free Evidence Trial
    expect(companies.freeTrial.price).toBe(language === 'es' ? 'Gratis' : 'Free');
    expect(companies.freeTrial.deliveryWording).toContain(language === 'es' ? 'Confirmamos tu fecha de entrega antes de iniciar la prueba.' : 'We confirm your delivery date before the trial begins.');
    expect(companies.freeTrial.deliveryWording).not.toMatch(/3 business days|3 days|3 días/i);
    expect(companies.freeTrial.supportLine).toBeTruthy();

    // 5. Pricing (Pilot, Shortlist, Custom)
    expect(companies.pricing.pilot.price).toBe(language === 'es' ? 'USD 1.250' : 'USD 1,250');
    expect(companies.pricing.shortlist.price).toBe(language === 'es' ? 'USD 4.500' : 'USD 4,500');
    expect(companies.pricing.shortlist.footnote).toContain(language === 'es' ? 'fee final se ajusta' : 'final fee adjusts');
    expect(companies.pricing.custom.title).toBeTruthy();
    expect(companies.pricing.custom.cta).toBeTruthy();

    // 6. Payment & Integrity
    expect(companies.payment.copy).toContain('USD');
    expect(companies.payment.copy).toMatch(/transfer|wire/i);
    expect(companies.payment.copy).not.toMatch(/account number|beneficiary|facebank|iban|routing/i);

    // 7. Demo
    expect(companies.demo.cta).toBeTruthy();

    // 8. FAQ (14 canonical items)
    expect(companies.faq.items).toHaveLength(14);
    const allAnswers = companies.faq.items.map((i) => i.answer).join(' ');
    expect(allAnswers).toMatch(/optional|opcional/i); // GitHub optional
    expect(allAnswers).not.toMatch(/top 1%|pre-vetted top talent|guaranteed hiring/i);

    // 9. Final CTA
    expect(companies.finalCta.ctaTrial).toBeTruthy();
    expect(companies.finalCta.ctaDemo).toBeTruthy();
  });
});

