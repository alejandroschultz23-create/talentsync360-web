'use client';

import React, { useState } from 'react';
import { Clock, Shield, Check, Cpu } from 'lucide-react';

export default function RoleContextPreview() {
  const [activeTab, setActiveTab] = useState<'sourced' | 'shortlist'>('sourced');

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-100 overflow-hidden text-slate-800">
      {/* Top Banner / Disclaimer */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span>[ PRODUCT INTERFACE PREVIEW · NOT AN ACTIVE FORM ]</span>
        <span className="hidden sm:inline text-blue-600 font-semibold">Step 1: Role Context Definition</span>
      </div>

      {/* Simulator Switcher Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/50">
        <button
          onClick={() => setActiveTab('sourced')}
          className={`flex-1 py-3 px-4 text-xs font-semibold text-center border-b-2 transition-colors ${
            activeTab === 'sourced'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Validate Sourced Talent
        </button>
        <button
          onClick={() => setActiveTab('shortlist')}
          className={`flex-1 py-3 px-4 text-xs font-semibold text-center border-b-2 transition-colors ${
            activeTab === 'shortlist'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Request Evidence Shortlist
        </button>
      </div>

      {/* Role Calibration Mock */}
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Field: Role */}
          <div className="p-3 rounded-lg border border-slate-300/80 bg-slate-50">
            <label className="block text-[11px] font-mono uppercase text-slate-500 font-semibold">Role Title</label>
            <span className="text-sm font-bold text-slate-950 block mt-0.5">Staff Backend Engineer</span>
          </div>

          {/* Field: Seniority */}
          <div className="p-3 rounded-lg border border-slate-300/80 bg-slate-50">
            <label className="block text-[11px] font-mono uppercase text-slate-500 font-semibold">Seniority Level</label>
            <span className="text-sm font-bold text-slate-950 block mt-0.5">Senior / Staff (6+ Years Prod)</span>
          </div>
        </div>

        {/* Core Stack Calibration */}
        <div className="p-4 rounded-xl border border-slate-300/80 bg-slate-50/60 space-y-2">
          <label className="block text-[11px] font-mono uppercase text-slate-600 font-semibold flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span>Target Tech Stack Requirements</span>
          </label>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-semibold">
              Node.js / TypeScript
            </span>
            <span className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-semibold">
              PostgreSQL (Query Opt)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-semibold">
              AWS (ECS / SQS)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-300 text-slate-700 font-mono text-xs font-medium">
              Redis / Caching
            </span>
          </div>
        </div>

        {/* Operating Constraints */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-300/80 bg-white">
            <Clock className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-slate-700">Timezone: <strong>UTC-3 to UTC-5</strong> (4h+ overlap)</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-300/80 bg-white">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-slate-700">Screening: <strong>Human Reviewed</strong></span>
          </div>
        </div>

        {/* Evaluation Output Teaser */}
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium">
            {activeTab === 'sourced'
              ? 'Benchmarking your sourced candidates against this criteria'
              : 'Targeting 3 to 5 human-reviewed LATAM finalists'}
          </span>
          <span className="font-semibold text-blue-600 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            Ready to Calibrate
          </span>
        </div>
      </div>
    </div>
  );
}
