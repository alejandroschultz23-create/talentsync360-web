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
});
