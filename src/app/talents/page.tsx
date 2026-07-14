import React from 'react';
import TalentsClient from './TalentsClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Talent Opportunities for LATAM Professionals | TalentSync360",
  description: "Build a structured technology talent profile and access opportunities aligned with your skills, experience, language and availability. English is assessed only when a role requires it.",
  alternates: {
    canonical: "https://www.talentsync360.com/talents",
  },
  openGraph: {
    title: "Talent Opportunities for LATAM Professionals | TalentSync360",
    description: "Build a structured technology talent profile and access opportunities aligned with your skills, experience, language and availability. English is assessed only when a role requires it.",
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
