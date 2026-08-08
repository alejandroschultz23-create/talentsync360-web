import React from 'react';
import CompaniesClient from './CompaniesClient';
import ServiceSchema from '@/components/ServiceSchema';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Hire Vetted LATAM Tech Talent | B2B Technical Staffing | TalentSync360",
  description: "Hire pre-screened LATAM tech professionals through 72-hour shortlists with human screening, technical signals, English communication checks, and candidate scorecards.",
  alternates: {
    canonical: "https://www.talentsync360.com/companies",
  },
  openGraph: {
    title: "Hire Vetted LATAM Tech Talent | B2B Technical Staffing | TalentSync360",
    description: "Hire pre-screened LATAM tech professionals through 72-hour shortlists with human screening, technical signals, English communication checks, and candidate scorecards.",
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
