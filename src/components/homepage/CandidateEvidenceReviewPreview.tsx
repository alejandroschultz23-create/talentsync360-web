'use client';

import React, { useState } from 'react';
import { FileCheck, Edit3, Shield, Eye, Lock, CheckCircle2, GitBranch } from 'lucide-react';
import EvidenceStateBadge from './EvidenceStateBadge';
import { useLanguage } from '@/context/LanguageContext';

export default function CandidateEvidenceReviewPreview() {
  const { t } = useLanguage();
  const [optInActive, setOptInActive] = useState<boolean>(false);
  const [clarificationOpen, setClarificationOpen] = useState<boolean>(false);

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-100 overflow-hidden text-slate-800 text-left">
      {/* Top Bar / Header */}
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-blue-600" />
          <span className="font-mono font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
            {t.homepage.candidateReviewPreview.title}
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-medium border border-blue-200">
          {t.homepage.candidateReviewPreview.badge}
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Source-Neutral Evidence Input Inventory */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-mono uppercase text-slate-500 font-semibold block">
            {t.homepage.candidateReviewPreview.sourcesTitle}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg border border-slate-300/80 bg-slate-50 flex items-center gap-2 text-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{t.homepage.candidateReviewPreview.src1}</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-300/80 bg-slate-50 flex items-center gap-2 text-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{t.homepage.candidateReviewPreview.src2}</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-300/80 bg-slate-50 flex items-center gap-2 text-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{t.homepage.candidateReviewPreview.src3}</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-300/80 bg-slate-50 flex items-center gap-2 text-slate-800">
              <GitBranch className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{t.homepage.candidateReviewPreview.src4}</span>
            </div>
          </div>
        </div>

        {/* Structured Interpretation Preview */}
        <div className="p-4 rounded-xl border border-slate-300/80 bg-slate-50/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">{t.homepage.candidateReviewPreview.demonstratedSignal}</span>
            <EvidenceStateBadge state="SUPPORTED" variant="light" size="sm" />
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-normal">
            {t.homepage.candidateReviewPreview.signalQuote}
          </p>

          {/* Interactive Candidate Clarification Drawer */}
          {clarificationOpen ? (
            <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/50 space-y-2 transition-all">
              <span className="text-[11px] font-semibold text-blue-900 block">{t.homepage.candidateReviewPreview.clarificationHeader}</span>
              <p className="text-xs text-blue-800 italic">
                {t.homepage.candidateReviewPreview.clarificationQuote}
              </p>
              <button
                onClick={() => setClarificationOpen(false)}
                className="text-[10px] text-blue-600 font-semibold underline hover:text-blue-800"
              >
                {t.homepage.candidateReviewPreview.hideNote}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setClarificationOpen(true)}
              className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t.homepage.candidateReviewPreview.addClarification}</span>
            </button>
          )}
        </div>

        {/* Candidate Ownership & Privacy Controls */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>{t.homepage.candidateReviewPreview.networkVisibility}</span>
            </span>
            <p className="text-slate-500 text-[11px]">
              {optInActive
                ? t.homepage.candidateReviewPreview.optInDescriptionActive
                : t.homepage.candidateReviewPreview.optInDescriptionPrivate}
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
                <span>{t.homepage.candidateReviewPreview.optInToggleActive}</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>{t.homepage.candidateReviewPreview.optInTogglePrivate}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
