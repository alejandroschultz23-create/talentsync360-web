import React from 'react';
import HomeClient from './HomeClient';
import FAQSchema from '@/components/FAQSchema';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "White-Label LATAM Technical Shortlists for IT Consultancies | TalentSync360",
  description: "Scale your agency with white-label, human-reviewed LATAM developer shortlists. Our sourcing sprints deliver technically screened, decision-ready finalists under your own brand.",
  alternates: {
    canonical: "https://www.talentsync360.com/",
  },
  openGraph: {
    title: "White-Label LATAM Developer Shortlists for IT Consultancies | TalentSync360",
    description: "Scale your agency with white-label, human-reviewed LATAM developer shortlists. Our sourcing sprints deliver technically screened, decision-ready finalists under your own brand.",
    url: "https://www.talentsync360.com/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "White-Label LATAM Developer Shortlists for IT Consultancies | TalentSync360",
    description: "Scale your agency with white-label, human-reviewed LATAM developer shortlists. Our sourcing sprints deliver technically screened, decision-ready finalists under your own brand.",
  }
};

export default function Page() {
  return (
    <>
      <FAQSchema />
      <HomeClient />
    </>
  );
}
