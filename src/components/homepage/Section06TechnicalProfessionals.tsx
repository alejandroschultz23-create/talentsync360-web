'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import CandidateEvidenceReviewPreview from './CandidateEvidenceReviewPreview';
import { pushGTMEvent } from '@/lib/analytics';

export default function Section06TechnicalProfessionals() {
  const handleStartReview = () => {
    pushGTMEvent('click_start_evidence_review', {
      cta_label: 'Start Evidence Review',
      cta_location: 'technical_professionals',
      destination: '/talents/evidence-review',
      language: 'en',
      page_path: '/',
    });
  };

  return (
    <section id="talents" className="relative py-20 md:py-28 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/80 border-b border-slate-200/80 text-slate-900 scroll-mt-20 overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-blue-500/[0.03] blur-[120px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Candidate Value Proposition */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 font-mono text-[11px] font-semibold tracking-wider uppercase">
              FOR LATAM DEVELOPERS
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
              Turn your experience into evidence you can review and own.
            </h2>

            <p className="text-base text-slate-600 font-normal leading-relaxed">
              Your experience is more than a list of keywords. Turn projects, work context and technical signals into evidence you can review and clarify.
            </p>

            {/* 4 Candidate Ownership Points */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-500/30 transition-all flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-950">Share your real engineering work</h4>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal mt-0.5 leading-relaxed">
                    Submit public repositories, project overviews, architectural design summaries, and professional context. GitHub is optional.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-500/30 transition-all flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-950">Receive a private Evidence Review</h4>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal mt-0.5 leading-relaxed">
                    Get a structured readout identifying what your work demonstrably supports, what remains partial, and where your strongest signals lie.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-500/30 transition-all flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-950">Add context and clarify misunderstandings</h4>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal mt-0.5 leading-relaxed">
                    You own your interpretation. Review the structured draft, add technical nuances, and approve how your experience is documented.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-500/30 transition-all flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-950">Control your network visibility</h4>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal mt-0.5 leading-relaxed">
                    Decide privately whether to opt in to the TalentSync360 network for matching opportunities. No public profiles without consent.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Link
                href="/talents/evidence-review"
                onClick={handleStartReview}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/15 active:scale-98 transition-all"
              >
                <span>Start Evidence Review</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Candidate Evidence Review Mock */}
          <div className="lg:col-span-6">
            <CandidateEvidenceReviewPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
