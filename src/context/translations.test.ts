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
});

