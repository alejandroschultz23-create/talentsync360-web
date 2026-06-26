import React from 'react';
import ItConsultanciesSpainClient from './ItConsultanciesSpainClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import ServiceSchema from '@/components/ServiceSchema';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "White-Label Developer Shortlists for Spanish IT Consultancies | TalentSync360",
  description: "Accelerate client brief delivery and resolve project overflow with human-reviewed white-label developer shortlists. Target SLAs & evidence-backed scorecards.",
  alternates: {
    canonical: "https://www.talentsync360.com/en/it-consultancies-spain",
  },
  openGraph: {
    title: "White-Label Developer Shortlists for Spanish IT Consultancies | TalentSync360",
    description: "Accelerate client brief delivery and resolve project overflow with human-reviewed white-label developer shortlists. Target SLAs & evidence-backed scorecards.",
    url: "https://www.talentsync360.com/en/it-consultancies-spain",
    siteName: "TalentSync360",
    images: [
      {
        url: "https://www.talentsync360.com/logo_oficial.png",
        width: 1200,
        height: 630,
        alt: "TalentSync360",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "White-Label Developer Shortlists for Spanish IT Consultancies | TalentSync360",
    description: "Accelerate client brief delivery and resolve project overflow with human-reviewed white-label developer shortlists. Target SLAs & evidence-backed scorecards.",
    images: ["https://www.talentsync360.com/logo_oficial.png"],
  }
};

export default function Page() {
  return (
    <>
      <ServiceSchema />
      <BreadcrumbSchema 
        items={[
          { name: "IT Consultancies Spain", item: "/en/it-consultancies-spain" }
        ]} 
      />
      <ItConsultanciesSpainClient />
    </>
  );
}
