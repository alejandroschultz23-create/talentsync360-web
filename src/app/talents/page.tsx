import React from 'react';
import TalentsClient from './TalentsClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Professional Evidence Review for LATAM Tech Talent | TalentSync360",
  description: "Share one professional experience and receive a private, structured Evidence Profile showing what the available evidence supports, partially supports, or leaves unknown.",
  alternates: {
    canonical: "https://www.talentsync360.com/talents",
  },
  openGraph: {
    title: "Professional Evidence Review for LATAM Tech Talent | TalentSync360",
    description: "Share one professional experience and receive a private, structured Evidence Profile showing what the available evidence supports, partially supports, or leaves unknown.",
    url: "https://www.talentsync360.com/talents",
  }
};

export default function Page() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Talents", item: "/talents" }]} />
      <TalentsClient />
    </>
  );
}
