import React from 'react';
import HomeClient from './HomeClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Decision-Ready LATAM Technical Shortlists",
  description: "Get decision-ready LATAM technical shortlists in 72 hours. Our sourcing sprints combine human vetting, business English screening, and a structured 360° Fit Matrix.",
  alternates: {
    canonical: "https://www.talentsync360.com/",
  },
  openGraph: {
    title: "TalentSync360 | Decision-Ready LATAM Technical Shortlists",
    description: "Get decision-ready LATAM technical shortlists in 72 hours. Our sourcing sprints combine human vetting, business English screening, and a structured 360° Fit Matrix.",
    url: "https://www.talentsync360.com/",
  }
};

export default function Page() {
  return <HomeClient />;
}
