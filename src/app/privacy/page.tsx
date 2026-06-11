import React from 'react';
import PrivacyClient from './PrivacyClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacy Policy | TalentSync360",
  description: "Privacy Policy and data protection terms for TalentSync360 users, candidates, and partners.",
  alternates: {
    canonical: "https://www.talentsync360.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy | TalentSync360",
    description: "Privacy Policy and data protection terms for TalentSync360 users, candidates, and partners.",
    url: "https://www.talentsync360.com/privacy",
  }
};

export default function Page() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Privacy Policy", item: "/privacy" }]} />
      <PrivacyClient />
    </>
  );
}
