'use client';

import React, { useState } from 'react';
import Section01Hero from '@/components/homepage/Section01Hero';
import Section02Problem from '@/components/homepage/Section02Problem';
import Section03ProductTransformation from '@/components/homepage/Section03ProductTransformation';
import Section04EvidenceContextDecide from '@/components/homepage/Section04EvidenceContextDecide';
import Section05HiringTeams from '@/components/homepage/Section05HiringTeams';
import Section06TechnicalProfessionals from '@/components/homepage/Section06TechnicalProfessionals';
import Section07EvidenceStates from '@/components/homepage/Section07EvidenceStates';
import Section08PartnerDelivery from '@/components/homepage/Section08PartnerDelivery';
import Section09EvidenceBriefPreview from '@/components/homepage/Section09EvidenceBriefPreview';
import Section10FinalCTA from '@/components/homepage/Section10FinalCTA';
import EvidenceBriefModal from '@/components/homepage/EvidenceBriefModal';

export default function HomeClient() {
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);

  const handleOpenBriefModal = () => {
    setIsBriefModalOpen(true);
  };

  const handleCloseBriefModal = () => {
    setIsBriefModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full selection:bg-blue-600/30 selection:text-white">
      {/* 01. HERO */}
      <Section01Hero onOpenBriefModal={handleOpenBriefModal} />

      {/* 02. THE PROBLEM */}
      <Section02Problem />

      {/* 03. PRODUCT TRANSFORMATION */}
      <Section03ProductTransformation />

      {/* 04. EVIDENCE → CONTEXT → DECIDE */}
      <Section04EvidenceContextDecide />

      {/* 05. FOR HIRING TEAMS & RECRUITERS */}
      <Section05HiringTeams />

      {/* 06. FOR TECHNICAL PROFESSIONALS */}
      <Section06TechnicalProfessionals />

      {/* 07. EVIDENCE STATES / METHODOLOGY PREVIEW */}
      <Section07EvidenceStates />

      {/* 08. PARTNER DELIVERY */}
      <Section08PartnerDelivery />

      {/* 09. EVIDENCE BRIEF PREVIEW */}
      <Section09EvidenceBriefPreview onOpenBriefModal={handleOpenBriefModal} />

      {/* 10. FINAL CTA */}
      <Section10FinalCTA onOpenBriefModal={handleOpenBriefModal} />

      {/* Interactive Evidence Brief Modal (Accessible across sections) */}
      <EvidenceBriefModal
        isOpen={isBriefModalOpen}
        onClose={handleCloseBriefModal}
      />
    </div>
  );
}
