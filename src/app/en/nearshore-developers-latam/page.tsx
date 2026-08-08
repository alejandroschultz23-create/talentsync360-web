import React from 'react';
import NearshoreDevelopersLatamClient from './NearshoreDevelopersLatamClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import ServiceSchema from '@/components/ServiceSchema';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Hire Nearshore Developers in LATAM | Vetted Tech Talent | TalentSync360",
  description: "Access vetted LATAM developers and technical profiles through nearshore shortlists with timezone alignment, human screening, English communication checks, and technical scorecards.",
  alternates: {
    canonical: "https://www.talentsync360.com/en/nearshore-developers-latam",
  },
  openGraph: {
    title: "Hire Nearshore Developers in LATAM | Vetted Tech Talent | TalentSync360",
    description: "Access vetted LATAM developers and technical profiles through nearshore shortlists with timezone alignment, human screening, English communication checks, and technical scorecards.",
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
    title: "Hire Nearshore Developers in LATAM | Vetted Tech Talent | TalentSync360",
    description: "Access vetted LATAM developers and technical profiles through nearshore shortlists with timezone alignment, human screening, English communication checks, and technical scorecards.",
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
