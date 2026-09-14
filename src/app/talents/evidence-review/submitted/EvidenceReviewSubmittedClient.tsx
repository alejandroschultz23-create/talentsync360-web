"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { useLanguage } from "@/context/LanguageContext";
import { evidenceReviewContent } from "@/lib/evidence-review/content";

export default function EvidenceReviewSubmittedClient() {
  const { lang } = useLanguage();
  const content = evidenceReviewContent[lang].submitted;

  return (
    <section className="px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-3xl rounded-3xl border border-emerald-400/20 bg-slate-900/60 p-7 text-center shadow-2xl sm:p-12">
        <CheckCircle2 aria-hidden="true" className="mx-auto h-14 w-14 text-emerald-400" />
        <p className="mt-7 text-xs font-bold tracking-[0.28em] text-emerald-400">
          {content.eyebrow}
        </p>
        <h1 className="mt-5 text-4xl font-bold text-white sm:text-5xl">
          {content.title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">{content.body}</p>
        <p className="mx-auto mt-5 max-w-2xl text-sm text-slate-500">{content.next}</p>
        <Link
          href="/"
          className="mt-9 inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-200 hover:border-slate-500 hover:bg-slate-800"
        >
          {content.home}
        </Link>
      </div>
    </section>
  );
}
