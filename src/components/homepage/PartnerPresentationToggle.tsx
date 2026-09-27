'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import EvidenceStateBadge from './EvidenceStateBadge';

export default function PartnerPresentationToggle() {
  const [partnerView, setPartnerView] = useState<boolean>(false);

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-100 overflow-hidden text-slate-800 text-left">
      {/* View Switcher Top Bar */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-mono font-semibold uppercase text-slate-500 block">
            Presentation Layer Switcher
          </span>
          <span className="text-[11px] text-amber-700 font-mono font-medium">
            [ ILLUSTRATIVE EXAMPLE · FICTIONAL PARTNER ]
          </span>
        </div>

        {/* Toggle Pills */}
        <div className="flex rounded-lg bg-slate-200/80 p-1 border border-slate-300">
          <button
            onClick={() => setPartnerView(false)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              !partnerView
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            TalentSync360 Standard
          </button>
          <button
            onClick={() => setPartnerView(true)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              partnerView
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Authorized Partner View
          </button>
        </div>
      </div>

      {/* Deliverable Header Layer */}
      <div className="p-6 border-b border-slate-100 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {partnerView ? (
            /* Authorized Partner Presentation Header */
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm tracking-wider">
                NP
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 uppercase tracking-wide block">
                  Nexus Partners Consulting
                </span>
                <span className="text-[11px] font-mono text-emerald-600 font-medium">
                  Verified Candidate Technical File (Authorized White-Label)
                </span>
              </div>
            </div>
          ) : (
            /* TalentSync360 Standard Header */
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm tracking-wider">
                TS
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 uppercase tracking-wide block">
                  TalentSync360 Verified Brief
                </span>
                <span className="text-[11px] font-mono text-blue-600 font-medium">
                  Direct Evidence Assessment Workspace
                </span>
              </div>
            </div>
          )}

          <div className="text-left sm:text-right">
            <span className="text-[11px] font-mono uppercase text-slate-400 block">Candidate Reference</span>
            <span className="text-xs font-mono font-semibold text-slate-700">AR-8821 · LATAM (UTC-3)</span>
          </div>
        </div>
      </div>

      {/* Constant Underlying Candidate Evidence (100% Unchanged) */}
      <div className="p-6 space-y-4 bg-slate-50/30">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/80">
          <span className="font-semibold text-slate-700">Evaluated Role: Senior Backend Engineer</span>
          <EvidenceStateBadge state="SUPPORTED" variant="light" size="sm" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-lg border border-slate-200 bg-white">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Observable Strength</span>
            <p className="text-slate-600">
              High-concurrency Node.js event architecture with PostgreSQL query tuning reducing read latency by 40%.
            </p>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-white">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Surface Unknown</span>
            <p className="text-slate-600">
              No direct production samples for AWS Serverless; primary cloud experience is ECS/Docker.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
          <Check className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Candidate evidence, evaluations, and interview questions remain <strong>100% identical</strong> under both views.
          </span>
        </div>
      </div>
    </div>
  );
}
