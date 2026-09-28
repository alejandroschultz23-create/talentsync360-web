import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Companies analytics event alignment', () => {
  const companiesClientPath = path.resolve(__dirname, 'CompaniesClient.tsx');
  const fileContent = fs.readFileSync(companiesClientPath, 'utf8');

  it('does NOT contain the legacy event name click_commercial_cta', () => {
    expect(fileContent).not.toContain('click_commercial_cta');
  });

  it('uses canonical companies_cta_click for trackCta helper', () => {
    expect(fileContent).toContain("pushGTMEvent('companies_cta_click', {");
  });

  it('preserves all required parameter contracts', () => {
    // Contract parameters: cta_label, cta_location, destination, language, page_path
    expect(fileContent).toContain('cta_label: label,');
    expect(fileContent).toContain('cta_location: location,');
    expect(fileContent).toContain('destination,');
    expect(fileContent).toContain('language: lang,');
    expect(fileContent).toContain("page_path: '/companies',");
  });

  it('tracks all 5 core commercial CTA types with valid destinations', () => {
    // 1. Free Trial
    expect(fileContent).toContain("'/contact?intent=free-trial'");
    // 2. Demo
    expect(fileContent).toContain("'/contact?intent=demo'");
    // 3. Pilot
    expect(fileContent).toContain("'/contact?intent=pilot'");
    // 4. Shortlist
    expect(fileContent).toContain("'/contact?intent=shortlist'");
    // 5. Ongoing / Partner
    expect(fileContent).toContain("'/contact?intent=ongoing-partner'");
  });
});
