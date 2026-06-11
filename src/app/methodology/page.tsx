import React from 'react';
import MethodologyClient from './MethodologyClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Our Vetting Methodology & 360° Fit Matrix | TalentSync360",
  description: "Discover our rigorous curation process. Human vetting, business English screening, and structured candidate scorecards for nearshore developers.",
  alternates: {
    canonical: "https://www.talentsync360.com/methodology",
  },
  openGraph: {
    title: "Our Vetting Methodology & 360° Fit Matrix | TalentSync360",
    description: "Discover our rigorous curation process. Human vetting, business English screening, and structured candidate scorecards for nearshore developers.",
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
