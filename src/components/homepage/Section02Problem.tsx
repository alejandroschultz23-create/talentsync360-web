'use client';

import React from 'react';
import { FileQuestion, Network, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Section02Problem() {
  const { t } = useLanguage();

  return (
    <section id="problem" className="relative py-20 md:py-28 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 border-b border-slate-200/80 text-slate-900 scroll-mt-20 overflow-hidden">
      {/* Subtle ambient lighting for warmth & luminous depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[320px] bg-blue-500/[0.035] blur-[110px] pointer-events-none -z-0" />
      <div className="absolute bottom-0 right-12 w-[400px] h-[250px] bg-indigo-500/[0.025] blur-[90px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 font-mono text-[11px] font-semibold tracking-wider uppercase">
            {t.homepage.problem.eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
            {t.homepage.problem.title}
          </h2>
        </div>

        {/* 3 Problem Pillars in Elevated Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Pillar 1 */}
          <div className="group relative p-7 rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] hover:shadow-[0_12px_28px_-6px_rgba(15,23,42,0.1)] hover:border-blue-500/35 transition-all duration-300 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
                <FileQuestion className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 leading-snug">
                {t.homepage.problem.pillar1Title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {t.homepage.problem.pillar1Desc}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-mono font-medium text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80" />
              <span>{t.homepage.problem.pillar1Tag}</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="group relative p-7 rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] hover:shadow-[0_12px_28px_-6px_rgba(15,23,42,0.1)] hover:border-blue-500/35 transition-all duration-300 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 leading-snug">
                {t.homepage.problem.pillar2Title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {t.homepage.problem.pillar2Desc}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-mono font-medium text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/80" />
              <span>{t.homepage.problem.pillar2Tag}</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="group relative p-7 rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] hover:shadow-[0_12px_28px_-6px_rgba(15,23,42,0.1)] hover:border-blue-500/35 transition-all duration-300 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 leading-snug">
                {t.homepage.problem.pillar3Title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {t.homepage.problem.pillar3Desc}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-mono font-medium text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500/80" />
              <span>{t.homepage.problem.pillar3Tag}</span>
            </div>
          </div>
        </div>

        {/* Canonical Transition Statement Banner */}
        <div className="relative max-w-3xl mx-auto p-7 rounded-2xl bg-slate-950 text-white shadow-xl shadow-slate-950/10 text-center space-y-2 border border-slate-800 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
          <p className="text-base sm:text-lg font-medium text-slate-100">
            {t.homepage.problem.bannerText}
          </p>
          <span className="text-xs text-slate-400 font-mono block">
            {t.homepage.problem.bannerSubtext}
          </span>
        </div>
      </div>
    </section>
  );
}
