import React from 'react';
import CompaniesClient from './CompaniesClient';
import ServiceSchema from '@/components/ServiceSchema';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Hire Vetted LATAM Tech Talent | B2B Technical Staffing | TalentSync360",
  description: "Hire LATAM tech professionals through human-reviewed shortlists with role-specific technical evidence and opportunity-specific communication requirements.",
  alternates: {
    canonical: "https://www.talentsync360.com/companies",
  },
  openGraph: {
    title: "Hire Vetted LATAM Tech Talent | B2B Technical Staffing | TalentSync360",
    description: "Hire LATAM tech professionals through human-reviewed shortlists with role-specific technical evidence and opportunity-specific communication requirements.",
    url: "https://www.talentsync360.com/companies",
  }
};

export default function Page() {
  return (
    <>
      <ServiceSchema />
      <BreadcrumbSchema items={[{ name: "Companies", item: "/companies" }]} />
      <CompaniesClient />
    </>
  );
}
