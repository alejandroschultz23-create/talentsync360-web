'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Hero from '@/components/Hero';
import SolutionSplit from '@/components/SolutionSplit';
import TalentGrid from '@/components/TalentGrid';
import FAQSchema from '@/components/FAQSchema';
import FAQAccordion from '@/components/FAQAccordion';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col bg-slate-950">
      {/* JSON-LD Schema */}
      <FAQSchema />

      {/* 
        MISSION COMPONENT 1: HERO
        "Curated Nearshore Shortlists in 72 Hours"
      */}
      <Hero />

      {/* 
        MISSION COMPONENT 2: SOLUTIONS
        Spanish IT Consultancies vs US/EU Startups
      */}
      <SolutionSplit />

      {/* 
        MISSION COMPONENT 3: TALENT GRID
        Dynamic skills tracking (React, AI, Go)
      */}
      <TalentGrid />

      {/* 
        TRUST SECTION: PIPELINE
        Based on "01 Intake", "02 Process", "03 Output"
      */}
      <section className="bg-slate-950 py-24 border-t border-slate-900">
        <div className="max-w-base">
          <div className="mb-20">
            <span className="text-indigo-500 font-mono text-xs uppercase tracking-widest mb-4 block">
              {t.home.pipelineTagline}
            </span>
            <h2 className="text-3xl font-bold text-white mb-6">
              {t.home.pipelineTitle}
            </h2>
            <p className="text-slate-400 max-w-2xl">
              {t.home.pipelineSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-2xl">
              <div className="text-indigo-500 font-mono mb-6">01</div>
              <h3 className="text-xl font-bold text-white mb-4">{t.home.step1Title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{t.home.step1Desc}</p>
            </div>
            {/* Step 2 */}
            <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-2xl">
              <div className="text-indigo-500 font-mono mb-6">02</div>
              <h3 className="text-xl font-bold text-white mb-4">{t.home.step2Title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{t.home.step2Desc}</p>
            </div>
            {/* Step 3 */}
            <div className="p-8 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
              <div className="text-indigo-500 font-mono mb-6">03</div>
              <h3 className="text-xl font-bold text-white mb-4">{t.home.step3Title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{t.home.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ COMPONENT */}
      <FAQAccordion title={t.home.faqTitle} items={t.home.faqClients} />

      {/* FINAL CTA SECTION */}
      <section className="py-32 bg-slate-950 border-t border-slate-900 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-hero leading-tight mb-8 text-premium-gradient">
            {t.home.ctaTitle}
          </h2>
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
            {t.home.ctaDesc}
          </p>
          <Link 
            href="/contact" 
            className="inline-block px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xl transition-all shadow-2xl shadow-indigo-600/20 active:scale-95"
          >
            {t.home.ctaButton}
          </Link>
        </div>
      </section>
    </div>
  );
}
