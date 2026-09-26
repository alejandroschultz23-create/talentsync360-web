'use client';

import React, { useState } from 'react';
import { FileCheck, Edit3, Shield, Eye, Lock, CheckCircle2, GitBranch } from 'lucide-react';
import EvidenceStateBadge from './EvidenceStateBadge';

export default function CandidateEvidenceReviewPreview() {
  const [optInActive, setOptInActive] = useState<boolean>(false);
  const [clarificationOpen, setClarificationOpen] = useState<boolean>(false);

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-100 overflow-hidden text-slate-800 text-left">
      {/* Top Bar / Header */}
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-blue-600" />
          <span className="font-mono font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
            Professional Evidence Profile (Draft)
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-medium border border-blue-200">
          Private to Candidate
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Source-Neutral Evidence Input Inventory */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-mono uppercase text-slate-400 font-medium block">
            Submitted Professional Evidence Sources
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Project Architecture & Data Flow Overview</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Engineering Production Responsibilities</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>High-Load Concurrency Case Writeup</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center gap-2 text-slate-700">
              <GitBranch className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Public Repository (Optional / Attached)</span>
            </div>
          </div>
        </div>

        {/* Structured Interpretation Preview */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">Demonstrated Engineering Signal</span>
            <EvidenceStateBadge state="SUPPORTED" variant="light" size="sm" />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            &ldquo;Candidate demonstrably owned the event-streaming consumer pipeline architecture in Go, handling sustained traffic of 12,000 req/sec with documented zero-loss failover.&rdquo;
          </p>

          {/* Interactive Candidate Clarification Drawer */}
          {clarificationOpen ? (
            <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/50 space-y-2 transition-all">
              <span className="text-[11px] font-semibold text-blue-900 block">Candidate Context Note Added:</span>
              <p className="text-xs text-blue-800 italic">
                &ldquo;Added clarification: The cluster failover was verified under staging load tests; production incident logs are retained by previous employer under NDA.&rdquo;
              </p>
              <button
                onClick={() => setClarificationOpen(false)}
                className="text-[10px] text-blue-600 font-semibold underline hover:text-blue-800"
              >
                Hide note
              </button>
            </div>
          ) : (
            <button
              onClick={() => setClarificationOpen(true)}
              className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Add Candidate Context / Clarification</span>
            </button>
          )}
        </div>

        {/* Candidate Ownership & Privacy Controls */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Talent Network Visibility</span>
            </span>
            <p className="text-slate-500 text-[11px]">
              {optInActive
                ? 'Profile active for matching roles. Zero public indexation.'
                : 'Private review mode. Profile is not visible to hiring teams.'}
            </p>
          </div>

          <button
            onClick={() => setOptInActive(!optInActive)}
            className={`px-4 py-2 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-all ${
              optInActive
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {optInActive ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Opted-In to Matches</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Private Review Only (Toggle)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
