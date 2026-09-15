import React from 'react';
import MethodologyClient from './MethodologyClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Evidence-Based Talent Review Methodology",
  description: "See how TalentSync360 combines human review, role-specific technical evidence, and opportunity-specific communication requirements without automated ranking.",
  alternates: {
    canonical: "https://www.talentsync360.com/methodology",
  },
  openGraph: {
    title: "Evidence-Based Talent Review Methodology | TalentSync360",
    description: "See how TalentSync360 combines human review, role-specific technical evidence, and opportunity-specific communication requirements without automated ranking.",
    url: "https://www.talentsync360.com/methodology",
  }
};

export default function Page() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Methodology", item: "/methodology" }]} />
      <MethodologyClient />
    </>
  );
}
