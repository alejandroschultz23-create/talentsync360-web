import React from 'react';
import CompaniesClient from './CompaniesClient';
import ServiceSchema from '@/components/ServiceSchema';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Technical Candidate Evidence Review for LATAM Hiring",
  description: "Review candidate evidence and role context before technical interviews for LATAM hiring decisions.",
  alternates: {
    canonical: "https://www.talentsync360.com/companies",
  },
  openGraph: {
    title: "Technical Candidate Evidence Review for LATAM Hiring | TalentSync360",
    description: "Review candidate evidence and role context before technical interviews for LATAM hiring decisions.",
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
