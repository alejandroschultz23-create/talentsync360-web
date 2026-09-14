"use client";

import {
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  FileSearch,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";

import { useLanguage } from "@/context/LanguageContext";
import { pushEvidenceReviewEvent } from "@/lib/analytics";
import {
  buildEvidenceReviewApplyHref,
  EVIDENCE_REVIEW_ATTRIBUTION_STORAGE_KEY,
  normalizeEvidenceReviewAttribution,
} from "@/lib/evidence-review/attribution";
import { evidenceReviewContent } from "@/lib/evidence-review/content";

function EvidenceReviewLandingContent() {
  const { lang } = useLanguage();
  const content = evidenceReviewContent[lang];
  const searchParams = useSearchParams();
  const attribution = useMemo(
    () =>
      normalizeEvidenceReviewAttribution({
        source: searchParams.get("source"),
        campaign: searchParams.get("campaign"),
      }),
    [searchParams],
  );
  const applyHref = buildEvidenceReviewApplyHref(attribution);

  useEffect(() => {
    sessionStorage.setItem(
      EVIDENCE_REVIEW_ATTRIBUTION_STORAGE_KEY,
      JSON.stringify(attribution),
    );
    pushEvidenceReviewEvent("view_evidence_review", {
      ...attribution,
      language: lang,
    });
  }, [attribution, lang]);

  const trackStart = () => {
    pushEvidenceReviewEvent("click_start_evidence_review", {
      ...attribution,
      language: lang,
    });
  };

  return (
    <div className="overflow-hidden bg-slate-950">
      <section className="relative border-b border-white/5 px-4 pb-24 pt-24 sm:px-6 lg:pb-32 lg:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.17),transparent_42%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-4xl">
            <p className="mb-6 text-xs font-bold tracking-[0.28em] text-blue-400">
              {content.landing.eyebrow}
            </p>
            <h1 className="max-w-4xl text-4xl font-bold tracking-[-0.045em] text-white sm:text-5xl lg:text-7xl">
              {content.landing.title}
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
              {content.landing.lead}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href={applyHref}
                onClick={trackStart}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-bold text-white transition hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
              >
                {content.landing.primaryCta}
                <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </Link>
              <a
                href="#como-funciona"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-700 px-6 py-3 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
              >
                {content.landing.secondaryCta}
              </a>
            </div>
            <p className="mt-5 text-sm text-slate-500">{content.landing.time}</p>
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-400">
              <FileSearch aria-hidden="true" className="h-5 w-5" />
              EVIDENCE, NOT ASSUMPTIONS
            </p>
            <h2 className="text-3xl font-bold text-white sm:text-5xl">
              {content.landing.notCvTitle}
            </h2>
            <p className="mt-6 text-lg text-slate-400">{content.landing.notCvBody}</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {content.landing.dimensions.map((dimension) => (
              <article
                key={dimension.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/55 p-6"
              >
                <h3 className="text-xl font-bold text-slate-100">{dimension.title}</h3>
                <p className="mt-3 text-base text-slate-400">{dimension.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 flex gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 text-amber-100">
            <CircleHelp aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm text-amber-100">{content.landing.unknownRule}</p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-slate-900/35 px-4 py-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-3xl font-bold text-white sm:text-5xl">
              {content.landing.shareTitle}
            </h2>
            <p className="mt-6 text-lg text-slate-400">{content.landing.shareBody}</p>
          </div>
          <div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {content.landing.shareExamples.map((example) => (
                <li
                  key={example}
                  className="flex min-h-20 items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300"
                >
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  {example}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex gap-3 rounded-xl border border-red-400/20 bg-red-400/5 p-4">
              <TriangleAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
              <p className="text-sm font-medium text-red-100">{content.landing.warning}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="scroll-mt-24 px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-white sm:text-5xl">
            {content.landing.howTitle}
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {content.landing.steps.map((step) => (
              <article key={step.number} className="border-t border-blue-500/40 pt-5">
                <p className="font-mono text-sm text-blue-400">{step.number}</p>
                <h3 className="mt-4 text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-3 text-sm text-slate-400">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-blue-950/20 px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <ShieldCheck aria-hidden="true" className="h-10 w-10 text-blue-400" />
              <h2 className="mt-6 text-3xl font-bold text-white sm:text-5xl">
                {content.landing.trustTitle}
              </h2>
              <p className="mt-6 text-lg text-slate-300">{content.landing.trustLead}</p>
            </div>
            <ul className="space-y-4">
              {content.landing.trustItems.map((item) => (
                <li key={item} className="flex gap-3 text-base text-slate-300">
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-4 py-24 text-center sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-white sm:text-5xl">
            {content.landing.closingTitle}
          </h2>
          <p className="mt-5 text-lg text-slate-400">{content.landing.closingBody}</p>
          <Link
            href={applyHref}
            onClick={trackStart}
            className="mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-base font-bold text-white transition hover:bg-blue-500"
          >
            {content.landing.primaryCta}
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function EvidenceReviewLandingClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <EvidenceReviewLandingContent />
    </Suspense>
  );
}
