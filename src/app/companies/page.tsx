import React from 'react';
import CompaniesClient from './CompaniesClient';
import ServiceSchema from '@/components/ServiceSchema';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "72-Hour Sourcing Sprints for B2B | TalentSync360",
  description: "Scale your engineering team with 72-hour sourcing sprints. Receive vetted LATAM developers with structured candidate scorecards and business English screening.",
  alternates: {
    canonical: "https://www.talentsync360.com/companies",
  },
  openGraph: {
    title: "72-Hour Sourcing Sprints for B2B | TalentSync360",
    description: "Scale your engineering team with 72-hour sourcing sprints. Receive vetted LATAM developers with structured candidate scorecards and business English screening.",
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
