'use client';

import React from 'react';
import { FileQuestion, Network, Clock } from 'lucide-react';

export default function Section02Problem() {
  return (
    <section id="problem" className="py-20 md:py-28 bg-white border-b border-slate-200 text-slate-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-600 block">
            THE SCREENING BOTTLENECK
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight leading-tight">
            The bottleneck is not finding profiles. It is turning them into reliable decisions.
          </h2>
        </div>

        {/* 3 Problem Pillars in Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl border border-slate-300/80 bg-slate-50/80 flex flex-col justify-between space-y-4 hover:border-slate-400 transition-colors shadow-sm">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <FileQuestion className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-950">
                CVs tell you what candidates claim.
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                Not what the evidence actually supports. Resumes summarize claims, but rarely reveal the operational context or depth behind them.
              </p>
            </div>
            <div className="pt-2 text-xs font-mono font-medium text-slate-500">
              Unverified self-reporting
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl border border-slate-300/80 bg-slate-50/80 flex flex-col justify-between space-y-4 hover:border-slate-400 transition-colors shadow-sm">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-950">
                Screening produces fragmented signals.
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                CVs, repositories, portfolios and recruiter notes arrive in disjointed formats, making consistent evaluation across candidates difficult.
              </p>
            </div>
            <div className="pt-2 text-xs font-mono font-medium text-slate-500">
              Disparate evaluation criteria
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl border border-slate-300/80 bg-slate-50/80 flex flex-col justify-between space-y-4 hover:border-slate-400 transition-colors shadow-sm">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-950">
                Interviews start with too many unknowns.
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                Teams often spend valuable interview time establishing context that could have been structured beforehand.
              </p>
            </div>
            <div className="pt-2 text-xs font-mono font-medium text-slate-500">
              Expensive engineering drain
            </div>
          </div>
        </div>

        {/* Canonical Transition Statement Banner */}
        <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-slate-900 text-white shadow-lg text-center space-y-2">
          <p className="text-base sm:text-lg font-medium text-slate-100">
            TalentSync360 organizes reviewable evidence before the interview — without pretending to replace it.
          </p>
          <span className="text-xs text-slate-400 font-mono block">
            Decision support before the call. The client interview remains human.
          </span>
        </div>
      </div>
    </section>
  );
}
