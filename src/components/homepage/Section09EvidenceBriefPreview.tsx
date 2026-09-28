'use client';

import React from 'react';
import { FileText, ShieldCheck, MapPin, Calendar, Compass, ExternalLink } from 'lucide-react';
import EvidenceStateBadge from './EvidenceStateBadge';
import { pushGTMEvent } from '@/lib/analytics';
import { useLanguage } from '@/context/LanguageContext';

interface Section09EvidenceBriefPreviewProps {
  onOpenBriefModal: () => void;
}

export default function Section09EvidenceBriefPreview({ onOpenBriefModal }: Section09EvidenceBriefPreviewProps) {
  const { t } = useLanguage();

  const handleOpenBriefHeader = () => {
    pushGTMEvent('click_see_evidence_brief', {
      cta_label: 'Full Interactive View',
      cta_location: 'evidence_brief_preview_header',
      page_path: '/',
    });
    onOpenBriefModal();
  };

  const handleOpenBriefFooter = () => {
    pushGTMEvent('click_see_evidence_brief', {
      cta_label: 'See an Evidence Brief',
      cta_location: 'evidence_brief_preview_footer',
      page_path: '/',
    });
    onOpenBriefModal();
  };

  return (
    <section id="evidence-brief" className="py-20 md:py-28 bg-[#030712] border-b border-slate-900 text-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-400 block">
            {t.homepage.deliverable.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            {t.homepage.deliverable.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal">
            {t.homepage.deliverable.subtitle}
          </p>
        </div>

        {/* High-Fidelity Tangible Brief Artifact Card */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden text-left space-y-6">
          {/* Top Bar with Reference & Status */}
          <div className="px-6 py-4 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                {t.homepage.deliverable.candidateRef}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t.homepage.deliverable.humanReviewComplete}
              </span>
              <button
                onClick={handleOpenBriefHeader}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono transition-colors"
              >
                <span>{t.homepage.deliverable.fullInteractiveView}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Synthetic Data Label Banner */}
          <div className="px-6 py-2 bg-amber-500/10 border-b border-amber-500/20 text-[11px] font-mono text-amber-300">
            {t.homepage.deliverable.syntheticBanner}
          </div>

          <div className="p-6 space-y-6">
            {/* Role Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">{t.homepage.deliverable.targetRoleLabel}</span>
                <h3 className="text-xl font-bold text-white">{t.homepage.deliverable.targetRoleValue}</h3>
                <span className="text-xs text-slate-400 font-normal">{t.homepage.deliverable.stackLabel}</span>
              </div>
              <div className="text-left sm:text-right text-xs font-mono text-slate-400 space-y-1">
                <div className="flex items-center sm:justify-end gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t.homepage.deliverable.locationLabel}</span>
                </div>
                <div className="flex items-center sm:justify-end gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t.homepage.deliverable.availabilityLabel}</span>
                </div>
              </div>
            </div>

            {/* 3-Column Evidence Signals Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/50 border border-emerald-500/25 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold uppercase text-emerald-400">{t.homepage.deliverable.strengthsTitle}</span>
                  <EvidenceStateBadge state="SUPPORTED" size="sm" />
                </div>
                <p className="text-slate-300 leading-relaxed font-normal">
                  {t.homepage.deliverable.strengthsDesc}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/50 border border-amber-500/25 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold uppercase text-amber-400">{t.homepage.deliverable.gapsTitle}</span>
                  <EvidenceStateBadge state="PARTIAL" size="sm" />
                </div>
                <p className="text-slate-300 leading-relaxed font-normal">
                  {t.homepage.deliverable.gapsDesc}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-700/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold uppercase text-slate-400">{t.homepage.deliverable.unknownsTitle}</span>
                  <EvidenceStateBadge state="UNKNOWN" size="sm" />
                </div>
                <p className="text-slate-400 leading-relaxed font-normal">
                  {t.homepage.deliverable.unknownsDesc}
                </p>
              </div>
            </div>

            {/* Live Interview Validation Prompt Preview */}
            <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/30 flex items-start gap-3 text-xs">
              <Compass className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold uppercase text-violet-300">
                    {t.homepage.deliverable.validationPromptLabel}
                  </span>
                  <EvidenceStateBadge state="NEEDS_VALIDATION" size="sm" />
                </div>
                <p className="text-slate-200 italic leading-relaxed">
                  {t.homepage.deliverable.validationPromptText}
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="px-6 py-4 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {t.homepage.deliverable.footerNote}
            </span>
            <button
              onClick={handleOpenBriefFooter}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-98"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.homepage.deliverable.ctaBrief}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
