import React from 'react';
import ContactClient from './ContactClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getContactRedirect } from '@/lib/contact-routing';

export const metadata: Metadata = {
  title: "Contact | Start Your Sourcing Sprint",
  description: "Contact TalentSync360 about nearshore technical sourcing, Shortlist Sprints, or a general inquiry.",
  alternates: {
    canonical: "https://www.talentsync360.com/contact",
  },
  openGraph: {
    title: "Contact TalentSync360 | Start Your Sourcing Sprint",
    description: "Contact TalentSync360 about nearshore technical sourcing, Shortlist Sprints, or a general inquiry.",
    url: "https://www.talentsync360.com/contact",
  }
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string | string[] }>;
}) {
  const params = await searchParams;
  const tipo = Array.isArray(params.tipo) ? params.tipo[0] : params.tipo;
  const contactRedirect = getContactRedirect(tipo);

  if (contactRedirect) {
    redirect(contactRedirect);
  }

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Contact", item: "/contact" }]} />
      <ContactClient />
    </>
  );
}
