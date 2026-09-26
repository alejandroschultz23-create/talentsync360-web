'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import PartnerPresentationToggle from './PartnerPresentationToggle';

export default function Section08PartnerDelivery() {
  return (
    <section className="py-20 md:py-28 bg-white border-b border-slate-200 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-600 block">
            PARTNER & CONSULTANCY DELIVERY
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
            Built for recruiting partners too.
          </h2>
          <p className="text-base text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Need to present candidates under your own client relationship? TalentSync360 supports authorized white-label delivery for recruiting agencies, consultancies and staffing partners.
          </p>
        </div>

        {/* 3 Partner Value Points */}
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900">Authorized White-Label Briefs</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Present candidate briefs under your brand once candidate data-sharing consent is established.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900">Evidence-Backed Submissions</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Back your client submissions with structured technical evidence that technical buyers immediately respect.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900">Focused Technical Depth</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Deliver consistent technical depth without consuming your internal senior engineering capacity.
            </p>
          </div>
        </div>

        {/* Presentation Toggle Artifact */}
        <div className="mb-12">
          <PartnerPresentationToggle />
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/contact?intent=partner-delivery"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold active:scale-98 transition-all"
          >
            <span>Explore Partner Delivery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
