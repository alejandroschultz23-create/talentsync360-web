import React from 'react';
import TermsClient from './TermsClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms of Service | TalentSync360",
  description: "Terms and conditions for accessing the TalentSync360 platform and nearshore hiring services.",
  alternates: {
    canonical: "https://www.talentsync360.com/terms",
  },
  openGraph: {
    title: "Terms of Service | TalentSync360",
    description: "Terms and conditions for accessing the TalentSync360 platform and nearshore hiring services.",
    url: "https://www.talentsync360.com/terms",
  }
};

export default function Page() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Terms of Service", item: "/terms" }]} />
      <TermsClient />
    </>
  );
}
