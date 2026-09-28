'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import PartnerPresentationToggle from './PartnerPresentationToggle';
import { pushGTMEvent } from '@/lib/analytics';
import { useLanguage } from '@/context/LanguageContext';

export default function Section08PartnerDelivery() {
  const { t, lang } = useLanguage();

  const handlePartnerDelivery = () => {
    pushGTMEvent('click_contact', {
      cta_label: 'Explore Partner Delivery',
      cta_location: 'partner_delivery',
      destination: '/contact?intent=partner-delivery',
      language: lang,
      page_path: '/',
    });
  };

  return (
    <section id="partners" className="relative py-20 md:py-28 bg-gradient-to-b from-white via-slate-50/50 to-white border-b border-slate-200/80 text-slate-900 scroll-mt-20 overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[400px] bg-blue-500/[0.03] blur-[130px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 font-mono text-[11px] font-semibold tracking-wider uppercase">
            {t.homepage.partnerDelivery.eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
            {t.homepage.partnerDelivery.title}
          </h2>
          <p className="text-base text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            {t.homepage.partnerDelivery.subtitle}
          </p>
        </div>

        {/* 3 Partner Value Points */}
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-500/30 transition-all space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-950">{t.homepage.partnerDelivery.point1Title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {t.homepage.partnerDelivery.point1Desc}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-500/30 transition-all space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-950">{t.homepage.partnerDelivery.point2Title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {t.homepage.partnerDelivery.point2Desc}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-500/30 transition-all space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-950">{t.homepage.partnerDelivery.point3Title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {t.homepage.partnerDelivery.point3Desc}
            </p>
          </div>
        </div>

        {/* Presentation Toggle Artifact */}
        <div className="mb-12">
          <PartnerPresentationToggle />
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/contact?intent=partner-delivery"
            onClick={handlePartnerDelivery}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold active:scale-98 transition-all"
          >
            <span>{t.homepage.partnerDelivery.ctaPartner}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
