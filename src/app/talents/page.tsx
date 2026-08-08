import React from 'react';
import TalentsClient from './TalentsClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Join the Gold List for LATAM Tech Professionals | TalentSync360",
  description: "Join TalentSync360’s Gold List, build a structured tech profile, and access remote opportunities aligned with your skills, experience, English level, and availability.",
  alternates: {
    canonical: "https://www.talentsync360.com/talents",
  },
  openGraph: {
    title: "Join the Gold List for LATAM Tech Professionals | TalentSync360",
    description: "Join TalentSync360’s Gold List, build a structured tech profile, and access remote opportunities aligned with your skills, experience, English level, and availability.",
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
