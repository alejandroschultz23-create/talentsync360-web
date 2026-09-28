'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import EvidenceStateBadge, { EvidenceState } from './EvidenceStateBadge';
import { useLanguage } from '@/context/LanguageContext';

export default function Section07EvidenceStates() {
  const { t } = useLanguage();
  const [selectedState, setSelectedState] = useState<EvidenceState>('UNKNOWN');
  const activeDetail = t.homepage.evidenceStates.states[selectedState];

  return (
    <section id="evidence-states" className="py-20 md:py-28 bg-[#0b0f19] border-b border-slate-900 text-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-400 block">
            {t.homepage.evidenceStates.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            {t.homepage.evidenceStates.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-normal">
            {t.homepage.evidenceStates.subtitle}
          </p>
        </div>

        {/* 5 States Horizontal Selector Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {(['SUPPORTED', 'PARTIAL', 'UNKNOWN', 'CONFLICT', 'NEEDS_VALIDATION'] as EvidenceState[]).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`p-1 rounded-lg transition-all ${
                selectedState === st
                  ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0b0f19] scale-105'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <EvidenceStateBadge state={st} size="md" />
            </button>
          ))}
        </div>

        {/* Interactive Active State Deep-Dive Panel */}
        <div className="max-w-3xl mx-auto p-6 md:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl text-left space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">{t.homepage.evidenceStates.activeStateLabel}</span>
              <h3 className="text-lg font-bold text-white">{activeDetail.title}</h3>
            </div>
            <EvidenceStateBadge state={selectedState} size="lg" />
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                {t.homepage.evidenceStates.labelSemantic}
              </span>
              <p className="text-sm text-slate-200 font-normal leading-relaxed">
                {activeDetail.definition}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 block">
                {t.homepage.evidenceStates.labelScenario}
              </span>
              <p className="text-xs sm:text-sm text-slate-300 italic">
                &ldquo;{activeDetail.exampleContext}&rdquo;
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 block">
                {t.homepage.evidenceStates.labelImpact}
              </span>
              <p className="text-xs sm:text-sm text-slate-300">
                {activeDetail.interviewAction}
              </p>
            </div>
          </div>

          {/* Epistemic Callout */}
          <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-500/20 text-xs text-blue-300 font-mono">
            {t.homepage.evidenceStates.epistemicCallout}
          </div>
        </div>

        {/* Link to Methodology */}
        <div className="mt-12 text-center">
          <Link
            href="/methodology"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors group"
          >
            <span>{t.homepage.evidenceStates.methodologyLink}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
