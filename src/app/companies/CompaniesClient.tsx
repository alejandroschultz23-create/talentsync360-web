'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  ShieldCheck,
  Calendar,
  Check,
  ChevronDown,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { pushGTMEvent } from '@/lib/analytics';
import EvidenceBriefModal from '@/components/homepage/EvidenceBriefModal';
import EvidenceStateBadge from '@/components/homepage/EvidenceStateBadge';

export default function CompaniesClient() {
  const { t, lang } = useLanguage();
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const c = t.companies;
  const isEs = lang === 'es';

  // Analytics Helpers
  const trackCta = (label: string, location: string, destination: string) => {
    pushGTMEvent('click_commercial_cta', {
      cta_label: label,
      cta_location: location,
      destination,
      language: lang,
      page_path: '/companies',
    });
  };

  const handleOpenBriefModal = (location: string) => {
    pushGTMEvent('click_see_evidence_brief', {
      cta_label: c.hero.ctaViewBrief,
      cta_location: location,
      destination: 'evidence_brief_modal',
      language: lang,
      page_path: '/companies',
    });
    setIsBriefModalOpen(true);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="flex flex-col bg-[#020617] text-slate-100 min-h-screen">
      {/* ==========================================================================
          SECTION 1: HERO
          ========================================================================== */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 border-b border-slate-900 overflow-hidden">
        {/* Subtle Ambient Backing */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block text-xs font-mono font-bold tracking-widest text-blue-400 uppercase mb-4 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
            {c.hero.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.15] mb-6 max-w-3xl sm:max-w-4xl mx-auto [text-wrap:balance]">
            {c.hero.title}
          </h1>
          <div className="text-base sm:text-lg text-slate-300 max-w-2xl sm:max-w-3xl mx-auto space-y-2.5 leading-relaxed [text-wrap:pretty]">
            <p>{c.hero.subtitle1}</p>
            <p className="text-slate-400 font-medium">{c.hero.subtitle2}</p>
          </div>

          {/* CTA Group */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact?intent=free-trial"
              onClick={() => trackCta(c.hero.ctaTrial, 'companies_hero_primary', '/contact?intent=free-trial')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base transition-all shadow-lg shadow-blue-600/25 active:scale-[0.98] text-center"
            >
              {c.hero.ctaTrial}
            </Link>
            <Link
              href="/contact?intent=demo"
              onClick={() => trackCta(c.hero.ctaDemo, 'companies_hero_secondary', '/contact?intent=demo')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-base transition-all text-center"
            >
              {c.hero.ctaDemo}
            </Link>
          </div>

          {/* Text Link */}
          <div className="mt-6">
            <button
              onClick={() => handleOpenBriefModal('companies_hero_text_link')}
              className="inline-flex items-center gap-1.5 text-sm font-mono text-blue-400 hover:text-blue-300 transition-colors focus:outline-none focus:underline"
            >
              <span>{c.hero.ctaViewBrief}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          SECTION 2: EVIDENCE BRIEF PRODUCT PROOF
          ========================================================================== */}
      <section id="evidence-brief-proof" className="py-20 md:py-28 bg-[#030712] border-b border-slate-900 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-400 block">
              {c.productProof.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              {c.productProof.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              {c.productProof.subtitle}
            </p>
          </div>

          {/* High-Fidelity Tangible Brief Artifact Card */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden">
            {/* Top Bar with Reference & Status */}
            <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                  {c.productProof.candidateRef}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {c.productProof.humanReviewVerified}
                </span>
                <button
                  onClick={() => handleOpenBriefModal('product_proof_header')}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono transition-colors"
                >
                  <span>{c.productProof.fullInteractiveView}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Synthetic Data Label Banner */}
            <div className="px-6 py-2 bg-amber-500/10 border-b border-amber-500/20 text-[11px] font-mono text-amber-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>{c.productProof.sampleBanner}</span>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {/* Role Context Header */}
              <div className="pb-6 border-b border-slate-800">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  {c.productProof.targetRoleLabel}
                </span>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                  {c.productProof.targetRoleValue}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  <span className="text-slate-500 font-semibold">{c.productProof.sourcesLabel}: </span>
                  {c.productProof.sourcesValue}
                </p>
              </div>

              {/* 4 Signals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. SUPPORTED */}
                <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <EvidenceStateBadge state="SUPPORTED" size="sm" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200">
                    {c.productProof.signals.supported.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {c.productProof.signals.supported.detail}
                  </p>
                </div>

                {/* 2. PARTIAL */}
                <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <EvidenceStateBadge state="PARTIAL" size="sm" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200">
                    {c.productProof.signals.partial.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {c.productProof.signals.partial.detail}
                  </p>
                </div>

                {/* 3. UNKNOWN */}
                <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <EvidenceStateBadge state="UNKNOWN" size="sm" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200">
                    {c.productProof.signals.unknown.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {c.productProof.signals.unknown.detail}
                  </p>
                </div>

                {/* 4. NEEDS VALIDATION */}
                <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <EvidenceStateBadge state="NEEDS_VALIDATION" size="sm" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200">
                    {c.productProof.signals.needsValidation.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {c.productProof.signals.needsValidation.detail}
                  </p>
                </div>
              </div>

              {/* Prepared Interview Prompt */}
              <div className="p-4 sm:p-5 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-semibold block">
                  {c.productProof.validationPromptLabel}
                </span>
                <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                  {c.productProof.validationPromptText}
                </p>
              </div>

              {/* Footer Open Modal Action */}
              <div className="pt-2 text-center">
                <button
                  onClick={() => handleOpenBriefModal('product_proof_footer_button')}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>{c.productProof.openModalCta}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          SECTION 3: HOW EVIDENCE REVIEW WORKS
          ========================================================================== */}
      <section className="py-20 md:py-28 bg-[#020617] border-b border-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-400 block">
              {c.howItWorks.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              {c.howItWorks.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              {c.howItWorks.subtitle}
            </p>
          </div>

          {/* 5-Step Process Flow */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {c.howItWorks.steps.map((step) => (
              <div
                key={step.number}
                className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block text-xs font-mono font-bold text-blue-400 mb-3 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                    {step.number}
                  </span>
                  <h3 className="text-sm font-bold text-white mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================================
          SECTION 4: FREE EVIDENCE TRIAL
          ========================================================================== */}
      <section id="free-trial" className="py-20 md:py-28 bg-[#0B1120] border-b border-slate-900 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-950 border border-blue-500/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            {/* Ambient Radial Highlight */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Unified Header & Context */}
            <div className="relative z-10 mb-8 pb-8 border-b border-slate-800">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-block text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  {c.freeTrial.eyebrow}
                </span>
                <span className="inline-flex items-center text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
                  {c.freeTrial.price}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-snug mb-3 max-w-3xl [text-wrap:balance]">
                {c.freeTrial.title}
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mb-3 [text-wrap:pretty]">
                {c.freeTrial.coreSummary}
              </p>

              <p className="text-xs text-slate-400 font-mono">
                {c.freeTrial.supportLine}
              </p>
            </div>

            {/* Delivery Commitment Notice */}
            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 mb-8 flex items-center gap-3">
              <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
              <p className="text-xs sm:text-sm text-blue-200 font-medium">
                {c.freeTrial.deliveryWording}
              </p>
            </div>

            {/* Scope Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {c.freeTrial.scopePoints.map((point) => (
                <div key={point} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {/* Trial CTA */}
            <div className="text-center md:text-left">
              <Link
                href="/contact?intent=free-trial"
                onClick={() => trackCta(c.freeTrial.cta, 'free_trial_card', '/contact?intent=free-trial')}
                className="inline-block w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base transition-all shadow-lg shadow-blue-600/25 active:scale-[0.98] text-center"
              >
                {c.freeTrial.cta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          SECTION 5: PAID OFFERS / PRICING
          ========================================================================== */}
      <section id="pricing" className="py-20 md:py-28 bg-[#020617] border-b border-slate-900 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-400 block">
              {c.pricing.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              {c.pricing.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              {c.pricing.subtitle}
            </p>
          </div>

          {/* Two Primary Paid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* CARD 1: EVIDENCE REVIEW PILOT */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <span className="text-[11px] font-mono font-bold tracking-wider text-blue-400 uppercase block mb-2">
                  {c.pricing.pilot.tag}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">
                  {c.pricing.pilot.title}
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  {c.pricing.pilot.audience}
                </p>

                <div className="mb-6 pb-6 border-b border-slate-800">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-mono font-bold text-white">
                      {c.pricing.pilot.price}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {c.pricing.pilot.period}
                    </span>
                  </div>
                </div>

                {/* Scope points */}
                <ul className="space-y-3 mb-8">
                  {c.pricing.pilot.scopePoints.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Link
                  href="/contact?intent=pilot"
                  onClick={() => trackCta(c.pricing.pilot.cta, 'pricing_pilot_card', '/contact?intent=pilot')}
                  className="block w-full text-center px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700/80 transition-all active:scale-[0.98]"
                >
                  {c.pricing.pilot.cta}
                </Link>
              </div>
            </div>

            {/* CARD 2: EVIDENCE-BACKED SHORTLIST */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-blue-500/40 flex flex-col justify-between shadow-xl shadow-blue-500/5">
              <div>
                <span className="text-[11px] font-mono font-bold tracking-wider text-blue-400 uppercase block mb-2">
                  {c.pricing.shortlist.tag}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">
                  {c.pricing.shortlist.title}
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  {c.pricing.shortlist.audience}
                </p>

                <div className="mb-6 pb-6 border-b border-slate-800">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-mono font-bold text-white">
                      {c.pricing.shortlist.price}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {c.pricing.shortlist.period}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 italic font-sans">
                    {c.pricing.shortlist.footnote}
                  </p>
                </div>

                {/* Scope points */}
                <ul className="space-y-3 mb-8">
                  {c.pricing.shortlist.scopePoints.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Link
                  href="/contact?intent=shortlist"
                  onClick={() => trackCta(c.pricing.shortlist.cta, 'pricing_shortlist_card', '/contact?intent=shortlist')}
                  className="block w-full text-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                >
                  {c.pricing.shortlist.cta}
                </Link>
              </div>
            </div>
          </div>

          {/* CUSTOM BAND */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase block mb-1">
                {c.pricing.custom.tag}
              </span>
              <h3 className="text-xl font-bold text-white mb-2">
                {c.pricing.custom.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {c.pricing.custom.copy}
              </p>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <Link
                href="/contact?intent=ongoing-partner"
                onClick={() => trackCta(c.pricing.custom.cta, 'pricing_custom_band', '/contact?intent=ongoing-partner')}
                className="block md:inline-block w-full text-center px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors"
              >
                {c.pricing.custom.cta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          SECTION 6: PAYMENT / HOW ENGAGEMENTS WORK
          ========================================================================== */}
      <section className="py-20 md:py-24 bg-[#030712] border-b border-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-400 block">
              {c.payment.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {c.payment.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {c.payment.copy}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {c.payment.pillars.map((pillar) => (
              <div key={pillar.title} className="p-5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="w-2 h-2 rounded-full bg-blue-400 block mb-3" />
                <h3 className="text-xs font-bold font-mono text-white mb-2 uppercase tracking-wide">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================================
          SECTION 7: DEMO / TALK TO US
          ========================================================================== */}
      <section className="py-20 md:py-24 bg-[#020617] border-b border-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-400 block">
              {c.demo.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              {c.demo.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {c.demo.body}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact?intent=demo"
                onClick={() => trackCta(c.demo.cta, 'demo_section_primary', '/contact?intent=demo')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
              >
                {c.demo.cta}
              </Link>
              <a
                href="https://calendly.com/alejandroschultz23/ts360-discovery-con-empresas-30-min"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCta('Direct Calendly', 'demo_section_calendly', 'calendly')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-800 font-semibold text-sm transition-colors"
              >
                {isEs ? 'Abrir Calendario Directo' : 'Open Direct Calendar'}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          SECTION 8: FAQ (14 CANONICAL QUESTIONS)
          ========================================================================== */}
      <section id="faq" className="py-20 md:py-28 bg-[#030712] border-b border-slate-900 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-400 block">
              {c.faq.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              {c.faq.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              {c.faq.subtitle}
            </p>
          </div>

          <div className="space-y-3">
            {c.faq.items.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={item.question}
                  className="rounded-xl bg-slate-950 border border-slate-800/90 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <span className="text-sm sm:text-base font-semibold text-slate-200">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 border-t border-slate-900 text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================================================
          SECTION 9: FINAL CTA
          ========================================================================== */}
      <section className="py-24 md:py-32 bg-[#020617] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-400 block">
            {c.finalCta.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-2xl mx-auto">
            {c.finalCta.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            {c.finalCta.subtitle}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact?intent=free-trial"
              onClick={() => trackCta(c.finalCta.ctaTrial, 'final_cta_primary', '/contact?intent=free-trial')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base transition-all shadow-lg shadow-blue-600/25 active:scale-[0.98]"
            >
              {c.finalCta.ctaTrial}
            </Link>
            <Link
              href="/contact?intent=demo"
              onClick={() => trackCta(c.finalCta.ctaDemo, 'final_cta_secondary', '/contact?intent=demo')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-base transition-all"
            >
              {c.finalCta.ctaDemo}
            </Link>
          </div>

          <p className="text-xs text-slate-500 font-mono mt-4">
            {c.finalCta.footnote}
          </p>
        </div>
      </section>

      {/* Interactive Evidence Brief Modal */}
      <EvidenceBriefModal
        isOpen={isBriefModalOpen}
        onClose={() => setIsBriefModalOpen(false)}
      />
    </div>
  );
}
