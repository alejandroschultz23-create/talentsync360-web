'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import RoleContextPreview from './RoleContextPreview';
import { pushGTMEvent } from '@/lib/analytics';
import { useLanguage } from '@/context/LanguageContext';

export default function Section05HiringTeams() {
  const { t, lang } = useLanguage();

  const handleValidateRole = () => {
    pushGTMEvent('click_contact', {
      cta_label: 'Validate a Role',
      cta_location: 'hiring_teams',
      destination: '/contact?intent=validate-role',
      language: lang,
      page_path: '/',
    });
  };

  return (
    <section id="companies" className="relative py-20 md:py-28 bg-gradient-to-b from-white via-slate-50/50 to-white border-b border-slate-200/80 text-slate-900 scroll-mt-20 overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-500/[0.03] blur-[120px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Buyer Copy & Actions */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 font-mono text-[11px] font-semibold tracking-wider uppercase">
              {t.homepage.hiringTeams.eyebrow}
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
              {t.homepage.hiringTeams.title}
            </h2>

            <p className="text-base text-slate-600 font-normal leading-relaxed">
              {t.homepage.hiringTeams.subtitle}
            </p>

            {/* 4 Value Points */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-500/30 transition-all flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-950">{t.homepage.hiringTeams.point1Title}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal mt-0.5 leading-relaxed">
                    {t.homepage.hiringTeams.point1Desc}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-500/30 transition-all flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-950">{t.homepage.hiringTeams.point2Title}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal mt-0.5 leading-relaxed">
                    {t.homepage.hiringTeams.point2Desc}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-500/30 transition-all flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-950">{t.homepage.hiringTeams.point3Title}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal mt-0.5 leading-relaxed">
                    {t.homepage.hiringTeams.point3Desc}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-500/30 transition-all flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-950">{t.homepage.hiringTeams.point4Title}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal mt-0.5 leading-relaxed">
                    {t.homepage.hiringTeams.point4Desc}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Link
                href="/contact?intent=validate-role"
                onClick={handleValidateRole}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/15 active:scale-98 transition-all"
              >
                <span>{t.homepage.hiringTeams.ctaValidateRole}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Role Context Interface Preview */}
          <div className="lg:col-span-6">
            <RoleContextPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
