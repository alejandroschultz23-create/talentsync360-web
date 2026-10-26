import React from 'react';
import NearshoreDevelopersLatamClient from './NearshoreDevelopersLatamClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import ServiceSchema from '@/components/ServiceSchema';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Evaluate Nearshore Developers in LATAM | Candidate Evidence Review",
  description: "Evaluate nearshore developer evidence, role context, and interview questions for technical hiring decisions across LATAM.",
  alternates: {
    canonical: "https://www.talentsync360.com/en/nearshore-developers-latam",
  },
  openGraph: {
    title: "Evaluate Nearshore Developers in LATAM | Candidate Evidence Review | TalentSync360",
    description: "Evaluate nearshore developer evidence, role context, and interview questions for technical hiring decisions across LATAM.",
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
    title: "Evaluate Nearshore Developers in LATAM | Candidate Evidence Review | TalentSync360",
    description: "Evaluate nearshore developer evidence, role context, and interview questions for technical hiring decisions across LATAM.",
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
