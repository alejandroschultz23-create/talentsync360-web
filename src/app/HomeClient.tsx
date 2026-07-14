'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Hero from '@/components/Hero';
import ICPSection from '@/components/ICPSection';
import ConsultancyPain from '@/components/ConsultancyPain';
import ShortlistSprint from '@/components/ShortlistSprint';
import WhiteLabelDemo from '@/components/WhiteLabelDemo';
import HowItWorks from '@/components/HowItWorks';
import DeliverableEvidence from '@/components/DeliverableEvidence';
import ConsultancyUseCases from '@/components/ConsultancyUseCases';
import TalentPathway from '@/components/TalentPathway';
import FAQAccordion from '@/components/FAQAccordion';
import FinalCTA from '@/components/FinalCTA';

export default function HomeClient() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col bg-slate-950">
      {/* 2. Hero Section */}
      <Hero />

      {/* 2.5. ICP Section */}
      <ICPSection />

      {/* 3. Consultancy Pain Section */}
      <ConsultancyPain />

      {/* 4. Shortlist Sprint Section */}
      <ShortlistSprint />

      {/* 5. Interactive White-Label Demo */}
      <WhiteLabelDemo />

      {/* 6. How It Works Section */}
      <HowItWorks />

      {/* 7. Deliverable Evidence Section */}
      <DeliverableEvidence />

      {/* 8. Consultancy Use Cases Grid */}
      <ConsultancyUseCases />

      {/* 9.5. Talent Pathway Section */}
      <TalentPathway />

      {/* 10. FAQ Accordion */}
      <FAQAccordion title={t.home.faqTitle} items={t.home.faqClients} />

      {/* 11. Final CTA Banner */}
      <FinalCTA />
    </div>
  );
}
