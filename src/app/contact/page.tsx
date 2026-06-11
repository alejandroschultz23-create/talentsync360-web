import React from 'react';
import ContactClient from './ContactClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact TalentSync360 | Start Your Sourcing Sprint",
  description: "Get in touch with TalentSync360 to hire nearshore developers or join the Gold List. Feasibility confirmation within 24 hours.",
  alternates: {
    canonical: "https://www.talentsync360.com/contact",
  },
  openGraph: {
    title: "Contact TalentSync360 | Start Your Sourcing Sprint",
    description: "Get in touch with TalentSync360 to hire nearshore developers or join the Gold List. Feasibility confirmation within 24 hours.",
    url: "https://www.talentsync360.com/contact",
  }
};

export default function Page() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Contact", item: "/contact" }]} />
      <ContactClient />
    </>
  );
}
