'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import CandidateEvidenceReviewPreview from './CandidateEvidenceReviewPreview';

export default function Section06TechnicalProfessionals() {
  return (
    <section className="py-20 md:py-28 bg-[#f8fafc] border-b border-slate-200 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Candidate Value Proposition */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-600 block">
              FOR LATAM DEVELOPERS
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              Turn your experience into evidence you can review and own.
            </h2>

            <p className="text-base text-slate-600 font-normal leading-relaxed">
              Your experience is more than a list of keywords. Turn projects, work context and technical signals into evidence you can review and clarify.
            </p>

            {/* 4 Candidate Ownership Points */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Share your real engineering work</h4>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal mt-0.5">
                    Submit public repositories, project overviews, architectural design summaries, and professional context. GitHub is optional.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Receive a private Evidence Review</h4>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal mt-0.5">
                    Get a structured readout identifying what your work demonstrably supports, what remains partial, and where your strongest signals lie.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Add context and clarify misunderstandings</h4>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal mt-0.5">
                    You own your interpretation. Review the structured draft, add technical nuances, and approve how your experience is documented.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Control your network visibility</h4>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal mt-0.5">
                    Decide privately whether to opt in to the TalentSync360 network for matching opportunities. No public profiles without consent.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Link
                href="/talents/evidence-review"
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
