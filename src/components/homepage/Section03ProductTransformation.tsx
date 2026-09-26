'use client';

import React from 'react';
import { ArrowDown } from 'lucide-react';
import EvidenceStateBadge from './EvidenceStateBadge';

export default function Section03ProductTransformation() {
  return (
    <section id="product-transformation" className="py-20 md:py-28 bg-[#0b0f19] border-b border-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-400 block">
            THE TRANSFORMATION PIPELINE
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            From raw professional experience to structured hiring clarity.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-normal">
            We map verified professional artifacts against specific role requirements to produce actionable evidence states and interview strategies.
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
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Phase 1: Input</span>
                <span className="font-semibold text-slate-100 text-sm">Role Context</span>
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
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Phase 2: Signal Extraction</span>
                <span className="font-semibold text-slate-100 text-sm">Professional Evidence Sources</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs text-slate-400">
              <span className="px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60">Public Repositories</span>
              <span className="px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60">System Architectures</span>
              <span className="px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60">Work Context</span>
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
                  <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 block">Phase 3: Core Evaluation</span>
                  <span className="font-bold text-white text-sm sm:text-base">TalentSync360 Evidence States</span>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400 hidden sm:inline">5 Standard States</span>
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
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Phase 4: Deliverable</span>
                <span className="font-semibold text-slate-100 text-sm">The Evidence Brief</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs text-slate-300">
              <span className="px-2.5 py-1 rounded bg-slate-800">Strengths</span>
              <span className="px-2.5 py-1 rounded bg-slate-800">Gaps</span>
              <span className="px-2.5 py-1 rounded bg-slate-800">Unknowns</span>
              <span className="px-2.5 py-1 rounded bg-slate-800">Interview Questions</span>
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
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 block">Phase 5: Decision Outcome</span>
                <span className="font-semibold text-white text-sm">Human Technical Interview</span>
              </div>
            </div>
            <div className="text-xs text-slate-400 font-sans">
              Conducted directly by your hiring team with structured confidence
            </div>
          </div>
        </div>

        {/* Operational Standard Footnote */}
        <div className="mt-12 text-center text-xs text-slate-400 font-normal">
          <span>AI assists evidence extraction and structuring. Final outputs remain under human review.</span>
        </div>
      </div>
    </section>
  );
}
