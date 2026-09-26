'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, FileCheck, Target, CheckCircle2 } from 'lucide-react';

export default function Section04EvidenceContextDecide() {
  return (
    <section id="framework" className="py-20 md:py-28 bg-[#f8fafc] border-b border-slate-200 text-slate-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-600 block">
            THE FRAMEWORK
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight leading-tight">
            Evidence → Context → Decide.
          </h2>
          <p className="text-sm sm:text-base text-slate-700 max-w-2xl mx-auto font-normal">
            A repeatable 3-step decision support method that grounds technical recruiting in observable evidence rather than subjective impressions.
          </p>
        </div>

        {/* 3-Step Editorial Columns with Large Numerals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Step 01: Evidence */}
          <div className="p-8 rounded-2xl bg-white border border-slate-300/80 shadow-sm flex flex-col justify-between space-y-6 hover:border-slate-400 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-mono font-bold text-slate-400">01</span>
                <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-semibold uppercase">
                  Evidence
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-950">
                Understand what the professional can actually support.
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                CVs, GitHub code, project architectures, production work samples, and candidate disclosures are distilled into structured, observable technical signals.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-600 font-mono">
              <FileCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Multi-source extraction</span>
            </div>
          </div>

          {/* Step 02: Context */}
          <div className="p-8 rounded-2xl bg-white border border-slate-300/80 shadow-sm flex flex-col justify-between space-y-6 hover:border-slate-400 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-mono font-bold text-slate-400">02</span>
                <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-semibold uppercase">
                  Context
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-950">
                Evaluate evidence against a real role.
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                The same engineer can be exceptionally strong for a greenfield distributed system and incomplete for a monolithic legacy migration. TalentSync360 evaluates talent strictly against your validated role context.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-600 font-mono">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              <span>Role-specific calibration</span>
            </div>
          </div>

          {/* Step 03: Decide */}
          <div className="p-8 rounded-2xl bg-white border border-slate-300/80 shadow-sm flex flex-col justify-between space-y-6 hover:border-slate-400 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-mono font-bold text-slate-400">03</span>
                <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-semibold uppercase">
                  Decide
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-950">
                Enter the interview knowing what matters.
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                Receive confirmed strengths, calibrated gaps, verified unknowns, and pointed technical questions. The hiring decision remains 100% human.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-600 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Human decision support</span>
            </div>
          </div>
        </div>

        {/* Link to Methodology */}
        <div className="text-center">
          <Link
            href="/methodology"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
          >
            <span>See how our 360° methodology works</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
