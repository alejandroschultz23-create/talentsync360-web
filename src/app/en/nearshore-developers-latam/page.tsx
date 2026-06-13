import React from 'react';
import NearshoreDevelopersLatamClient from './NearshoreDevelopersLatamClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import ServiceSchema from '@/components/ServiceSchema';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "LATAM Nearshore Developers | Technical Sourcing Sprints | TalentSync360",
  description: "Access senior software engineers in LATAM in your timezone. 72-hour sourcing sprints with human vetting, English communication screening, and candidate scorecards.",
  alternates: {
    canonical: "https://www.talentsync360.com/en/nearshore-developers-latam",
  },
  openGraph: {
    title: "LATAM Nearshore Developers | Technical Sourcing Sprints | TalentSync360",
    description: "Access senior software engineers in LATAM in your timezone. 72-hour sourcing sprints with human vetting, English communication screening, and candidate scorecards.",
    url: "https://www.talentsync360.com/en/nearshore-developers-latam",
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
    title: "LATAM Nearshore Developers | Technical Sourcing Sprints | TalentSync360",
    description: "Access senior software engineers in LATAM in your timezone. 72-hour sourcing sprints with human vetting, English communication screening, and candidate scorecards.",
    images: ["https://www.talentsync360.com/logo_oficial.png"],
  }
};

export default function Page() {
  return (
    <>
      <ServiceSchema />
      <BreadcrumbSchema 
        items={[
          { name: "Nearshore Developers LATAM", item: "/en/nearshore-developers-latam" }
        ]} 
      />
      <NearshoreDevelopersLatamClient />
    </>
  );
}
