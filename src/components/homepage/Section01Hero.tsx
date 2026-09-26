'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import HeroGlobe from './HeroGlobe';

interface Section01HeroProps {
  onOpenBriefModal: () => void;
}

export default function Section01Hero({ onOpenBriefModal }: Section01HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#030712] pt-24 pb-20 md:pt-32 md:pb-28 border-b border-slate-900">
      {/* Background radial blue ambient depth */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-slate-800/20 blur-[100px] rounded-full pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Core Positioning Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 font-mono text-[11px] sm:text-xs font-semibold tracking-widest uppercase">
              <span>EVIDENCE-BACKED TECHNICAL RECRUITING</span>
            </div>

            {/* Display H1 */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-white tracking-tight leading-[1.15]">
              Know why a technical candidate deserves an interview.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
              TalentSync360 turns professional experience, projects, work evidence and role context into structured candidate briefs — with strengths, gaps, unknowns and questions worth validating in the interview.
            </p>

            {/* Support Line (Neutral Slate Accent Dot) */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-normal">
              <span className="w-2 h-2 rounded-full bg-blue-500/80 shrink-0" aria-hidden="true" />
              <span>AI-assisted. Human-reviewed. Built for LATAM technical hiring.</span>
            </div>

            {/* CTA Group */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                onClick={onOpenBriefModal}
                className="h-11 px-6 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-98 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>See an Evidence Brief</span>
              </button>

              <Link
                href="/contact?intent=validate-role"
                className="h-11 px-6 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 active:scale-98 transition-all"
              >
                <span>Validate a Role</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Tertiary Candidate Text CTA */}
            <div className="pt-2">
              <Link
                href="/talents/evidence-review"
                className="text-xs sm:text-sm text-slate-400 hover:text-slate-200 font-medium inline-flex items-center gap-1.5 group transition-colors"
              >
                <span>I’m a tech professional</span>
                <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform">→ Review my evidence</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive 3D World */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <HeroGlobe />
          </div>
        </div>
      </div>
    </section>
  );
}
