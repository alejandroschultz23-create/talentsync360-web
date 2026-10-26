import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { translations, type Language } from '@/context/translations';
import CandidateEvidenceReviewPreview from './CandidateEvidenceReviewPreview';
import PartnerPresentationToggle from './PartnerPresentationToggle';
import RoleContextPreview from './RoleContextPreview';
import EvidenceBriefModal from './EvidenceBriefModal';
import Section09EvidenceBriefPreview from './Section09EvidenceBriefPreview';
import CompaniesClient from '@/app/companies/CompaniesClient';

const locale = vi.hoisted(() => ({ language: 'en' as 'en' | 'es' }));
vi.mock('@/context/LanguageContext', async () => {
  const { translations } = await import('@/context/translations');
  return { useLanguage: () => ({ lang: locale.language, t: translations[locale.language] }) };
});

function visibleText(markup: string) {
  return markup.replace(/<[^>]*>/g, ' ').replace(/&#x27;/g, "'").replace(/&amp;/g, '&');
}

describe.each<Language>(['en', 'es'])('%s demonstration integrity', (language) => {
  beforeEach(() => { locale.language = language; });

  it('renders the simulation notice and employer-sharing boundary next to the membership control', () => {
    const markup = renderToStaticMarkup(createElement(CandidateEvidenceReviewPreview));
    const text = visibleText(markup);
    const copy = translations[language].homepage.candidateReviewPreview;
    expect(text).toContain(copy.demoNotice);
    expect(text).toContain(copy.sharingBoundary);
    expect(text).toContain(copy.optInTogglePrivate);
    expect(markup).toContain('aria-describedby="candidate-demo-sharing-boundary"');
    expect(markup).toContain('aria-pressed="false"');
    expect(text).not.toMatch(/actively matched|emparejamiento|Visibility|Visibilidad/);
  });

  it('labels the partner toggle as a fictional branding simulation', () => {
    const text = visibleText(renderToStaticMarkup(createElement(PartnerPresentationToggle)));
    const copy = translations[language].homepage;
    expect(text).toContain(copy.partnerToggle.topLabel);
    expect(text).toContain(copy.partnerToggle.disclaimer);
    expect(text).toContain('TalentSync360 Evidence Brief');
    expect(text).not.toContain('Verified Brief');
    expect(text).toContain(copy.deliverable.targetRoleValue);
    expect(copy.partnerToggle.evaluatedRole).toBe(copy.deliverable.targetRoleValue);
  });

  it('keeps the role simulation consistent with its Node.js stack', () => {
    const text = visibleText(renderToStaticMarkup(createElement(RoleContextPreview)));
    expect(text).toContain(translations[language].homepage.roleContextPreview.topNotice);
    expect(text).toContain('Node.js / TypeScript');
    expect(translations[language].homepage.roleContextPreview.valRoleTitle).toContain('Node.js');
    expect(text).not.toContain('Go /');
  });

  it('uses one AR-8821 role in the homepage preview, partner view and modal', () => {
    const expectedRole = translations[language].homepage.deliverable.targetRoleValue;
    const preview = visibleText(renderToStaticMarkup(createElement(Section09EvidenceBriefPreview, {
      onOpenBriefModal: () => {},
    })));
    const modalMarkup = renderToStaticMarkup(createElement(EvidenceBriefModal, {
      isOpen: true, onClose: () => {},
    }));
    expect(preview).toContain(expectedRole);
    expect(visibleText(modalMarkup)).toContain(expectedRole);
    expect(preview).toContain('AR-8821');
    expect(modalMarkup).toContain('AR-8821');
    expect(modalMarkup).toContain('id="brief-modal-title"');
    expect(modalMarkup).not.toContain('hidden sm:inline-block');
  });

  it('distinguishes the companies card from the separate AR-8821 modal sample', () => {
    const copy = translations[language].companies.productProof;
    const companies = visibleText(renderToStaticMarkup(createElement(CompaniesClient)));
    expect(companies).toContain('TS-BRIEF-2026-084');
    expect(companies).toContain(copy.fullInteractiveView);
    expect(companies).toContain(copy.openModalCta);
    const modal = visibleText(renderToStaticMarkup(createElement(EvidenceBriefModal, {
      isOpen: true, onClose: () => {}, sampleContextNotice: copy.modalContextNotice,
    })));
    expect(modal).toContain(copy.modalContextNotice);
    expect(modal).toContain('AR-8821');
    expect(modal).toContain(translations[language].homepage.modal.syntheticDisclaimer);
  });
});
