'use client';

import React from 'react';
import { ArrowDown } from 'lucide-react';
import EvidenceStateBadge from './EvidenceStateBadge';
import { useLanguage } from '@/context/LanguageContext';

export default function Section03ProductTransformation() {
  const { t } = useLanguage();

  return (
    <section id="product-transformation" className="py-20 md:py-28 bg-[#0b0f19] border-b border-slate-900 text-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-400 block">
            {t.homepage.transformation.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            {t.homepage.transformation.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-normal">
            {t.homepage.transformation.subtitle}
          </p>
        </div>

        {/* 5-Stage Transformation Pipeline Container */}
        <div className="max-w-3xl mx-auto space-y-4 relative">
          {/* Stage 1: Role Context */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-mono text-xs font-bold">
                01
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">{t.homepage.transformation.phase1Eyebrow}</span>
                <span className="font-semibold text-slate-100 text-sm">{t.homepage.transformation.phase1Title}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300">Sr. Backend Engineer</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300">Node.js</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300">PostgreSQL</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300">AWS</span>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-slate-600" />
          </div>

          {/* Stage 2: Professional Evidence */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-mono text-xs font-bold">
                02
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">{t.homepage.transformation.phase2Eyebrow}</span>
                <span className="font-semibold text-slate-100 text-sm">{t.homepage.transformation.phase2Title}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs text-slate-400">
              <span className="px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60">{t.homepage.transformation.phase2Tag1}</span>
              <span className="px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60">{t.homepage.transformation.phase2Tag2}</span>
              <span className="px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60">{t.homepage.transformation.phase2Tag3}</span>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-slate-600" />
          </div>

          {/* Stage 3: TalentSync360 Evidence States */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-blue-500/30 shadow-xl shadow-blue-500/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-mono text-xs font-bold">
                  03
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 block">{t.homepage.transformation.phase3Eyebrow}</span>
                  <span className="font-bold text-white text-sm sm:text-base">{t.homepage.transformation.phase3Title}</span>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400 hidden sm:inline">{t.homepage.transformation.phase3Badge}</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <EvidenceStateBadge state="SUPPORTED" size="sm" />
              <EvidenceStateBadge state="PARTIAL" size="sm" />
              <EvidenceStateBadge state="UNKNOWN" size="sm" />
              <EvidenceStateBadge state="CONFLICT" size="sm" />
              <EvidenceStateBadge state="NEEDS_VALIDATION" size="sm" />
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-slate-600" />
          </div>

          {/* Stage 4: Evidence Brief */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-mono text-xs font-bold">
                04
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">{t.homepage.transformation.phase4Eyebrow}</span>
                <span className="font-semibold text-slate-100 text-sm">{t.homepage.transformation.phase4Title}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs text-slate-300">
              <span className="px-2.5 py-1 rounded bg-slate-800">{t.homepage.transformation.phase4Tag1}</span>
              <span className="px-2.5 py-1 rounded bg-slate-800">{t.homepage.transformation.phase4Tag2}</span>
              <span className="px-2.5 py-1 rounded bg-slate-800">{t.homepage.transformation.phase4Tag3}</span>
              <span className="px-2.5 py-1 rounded bg-slate-800">{t.homepage.transformation.phase4Tag4}</span>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-slate-600" />
          </div>

          {/* Stage 5: Human Interview */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold">
                05
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 block">{t.homepage.transformation.phase5Eyebrow}</span>
                <span className="font-semibold text-white text-sm">{t.homepage.transformation.phase5Title}</span>
              </div>
            </div>
            <div className="text-xs text-slate-400 font-sans">
              {t.homepage.transformation.phase5Desc}
            </div>
          </div>
        </div>

        {/* Operational Standard Footnote */}
        <div className="mt-12 text-center text-xs text-slate-400 font-normal">
          <span>{t.homepage.transformation.footnote}</span>
        </div>
      </div>
    </section>
  );
}
