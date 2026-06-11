import React from 'react';
import TalentsClient from './TalentsClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Join the Gold List | Global Opportunities for LATAM Tech Talent",
  description: "Get validated for elite remote roles. Pass our business English screening and role-specific vetting to enter the TalentSync360 360° Fit Matrix.",
  alternates: {
    canonical: "https://www.talentsync360.com/talents",
  },
  openGraph: {
    title: "Join the Gold List | Global Opportunities for LATAM Tech Talent",
    description: "Get validated for elite remote roles. Pass our business English screening and role-specific vetting to enter the TalentSync360 360° Fit Matrix.",
    url: "https://www.talentsync360.com/talents",
  }
};

export default function Page() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Talents", item: "/talents" }]} />
      <TalentsClient />
    </>
  );
}
