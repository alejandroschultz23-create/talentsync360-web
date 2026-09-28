'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import { pushGTMEvent } from '@/lib/analytics';
import { useLanguage } from '@/context/LanguageContext';

interface Section10FinalCTAProps {
  onOpenBriefModal: () => void;
}

export default function Section10FinalCTA({ onOpenBriefModal }: Section10FinalCTAProps) {
  const { t, lang } = useLanguage();

  const handleValidateRole = () => {
    pushGTMEvent('click_contact', {
      cta_label: 'Validate a Role',
      cta_location: 'final_cta',
      destination: '/contact?intent=validate-role',
      language: lang,
      page_path: '/',
    });
  };

  const handleOpenBrief = () => {
    pushGTMEvent('click_see_evidence_brief', {
      cta_label: 'See an Evidence Brief',
      cta_location: 'final_cta',
      page_path: '/',
    });
    onOpenBriefModal();
  };

  return (
    <section id="final-cta" className="py-24 md:py-32 bg-[#030712] relative overflow-hidden text-white border-t border-slate-900 scroll-mt-20">
      {/* Background ambient depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none -z-0" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        <div className="space-y-4">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-400 block">
            {t.homepage.finalCta.eyebrow}
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-3xl mx-auto">
            {t.homepage.finalCta.title}
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            {t.homepage.finalCta.subtitle}
          </p>
        </div>

        {/* Dual Buyer CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/contact?intent=validate-role"
            onClick={handleValidateRole}
            className="w-full sm:w-auto h-12 px-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 active:scale-98 transition-all"
          >
            <span>{t.homepage.finalCta.ctaValidateRole}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={handleOpenBrief}
            className="w-full sm:w-auto h-12 px-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>{t.homepage.finalCta.ctaBrief}</span>
          </button>
        </div>

        <p className="text-xs text-slate-500 font-normal pt-4">
          {t.homepage.finalCta.footnote}
        </p>
      </div>
    </section>
  );
}
