import React from 'react';
import HomeClient from './HomeClient';
import FAQSchema from '@/components/FAQSchema';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Evidence-Backed LATAM Technical Hiring | TalentSync360",
  description: "Evaluate LATAM technical talent with role-specific evidence, human review, strengths, gaps, unknowns and interview-ready insights.",
  alternates: {
    canonical: "https://www.talentsync360.com/",
  },
  openGraph: {
    title: "Evidence-Backed LATAM Technical Hiring | TalentSync360",
    description: "Evaluate LATAM technical talent with role-specific evidence, human review, strengths, gaps, unknowns and interview-ready insights.",
    url: "https://www.talentsync360.com/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Evidence-Backed LATAM Technical Hiring | TalentSync360",
    description: "Evaluate LATAM technical talent with role-specific evidence, human review, strengths, gaps, unknowns and interview-ready insights.",
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
