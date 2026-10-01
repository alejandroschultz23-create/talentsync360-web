import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { pilotContent, type PilotLanguage } from "@/lib/h3-pilot/participant/content";

/** Server-rendered invited-pilot landing (V1_187B). No client trust. */
export default function PilotLanding({ language }: { language: PilotLanguage }) {
  const content = pilotContent[language];
  return (
    <div className="overflow-hidden bg-slate-950">
      <section className="relative border-b border-white/5 px-4 pb-24 pt-24 sm:px-6 lg:pb-32 lg:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.17),transparent_42%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-4xl">
            <p className="mb-6 text-xs font-bold tracking-[0.28em] text-blue-400">{content.eyebrow}</p>
            <h1 className="max-w-4xl text-4xl font-bold tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
              {content.title}
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">{content.lead}</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/talents/evidence-review/apply"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-bold text-white transition hover:bg-blue-500"
              >
                {content.startCta}
                <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </Link>
              <Link
                href="/talents/evidence-review/submitted"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-700 px-6 py-3 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
              >
                {content.statusTitle}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex gap-3 rounded-2xl border border-blue-400/20 bg-blue-400/5 p-5">
            <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" />
            <p className="text-sm font-medium text-blue-100">{content.previewNotice}</p>
          </div>
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {content.explanationPoints.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/55 p-5 text-sm text-slate-300"
              >
                <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
