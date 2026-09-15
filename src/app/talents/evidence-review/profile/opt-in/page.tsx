import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import type { EvidenceReviewLanguage } from "@/lib/evidence-review/consent";
import { optInContent } from "@/lib/evidence-review/opt-in-content";
import {
  PRIVATE_ACCESS_COOKIE,
  PRIVATE_PROFILE_PATH,
} from "@/lib/evidence-review/server/private-access";
import { readPrivateOptInState } from "@/lib/evidence-review/server/private-optin";
import { EvidenceReviewRepository } from "@/lib/evidence-review/server/repository";
import OptInDecisionActions from "./OptInDecisionActions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Talent Network Decision | TalentSync360",
  referrer: "no-referrer",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
    },
  },
};

export default async function PrivateOptInPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const language: EvidenceReviewLanguage = params.lang === "en" ? "en" : "es";
  const alternateLanguage: EvidenceReviewLanguage = language === "en" ? "es" : "en";
  const content = optInContent[language];

  const cookieStore = await cookies();
  const token = cookieStore.get(PRIVATE_ACCESS_COOKIE)?.value;

  const repository = new EvidenceReviewRepository();
  const resolved = await readPrivateOptInState({ token, repository }).catch(
    () => null,
  );

  if (!resolved) {
    return (
      <section className="mx-auto flex min-h-[65vh] max-w-3xl items-center px-6 py-20">
        <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-center shadow-2xl">
          <p className="text-xs font-semibold tracking-[0.22em] text-indigo-300">
            {content.headerBadge}
          </p>
          <h1 className="mt-4 text-3xl text-white">
            {language === "es"
              ? "Este enlace de acceso privado ya no es válido."
              : "This private access link is no longer valid."}
          </h1>
          <p className="mt-4 text-slate-300">
            {language === "es"
              ? "Solicitá un nuevo enlace a TalentSync360 si aún necesitás acceder."
              : "Request a new link from TalentSync360 if you still need access."}
          </p>
        </div>
      </section>
    );
  }

  if (resolved.eligibility === "NOT_CONFIRMED") {
    redirect(PRIVATE_PROFILE_PATH);
  }

  const optInStatus = resolved.optIn?.opt_in_status ?? "NOT_OFFERED";

  // Terminal ACCEPTED
  if (optInStatus === "ACCEPTED") {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <header className="rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-8 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              {content.headerBadge}
            </span>
            <Link
              href={`?lang=${alternateLanguage}`}
              className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-indigo-400"
            >
              {content.languageLabel}
            </Link>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-white">
            {content.terminalAcceptedTitle}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-200">
            {content.terminalAcceptedBody}
          </p>
          <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-900/20 p-5 text-sm leading-relaxed text-emerald-100">
            {content.terminalAcceptedNote}
          </div>
          <div className="mt-8">
            <Link
              href={PRIVATE_PROFILE_PATH}
              className="inline-flex min-h-[44px] items-center rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700"
            >
              ← {content.backToProfile}
            </Link>
          </div>
        </header>
      </section>
    );
  }

  // Terminal DECLINED
  if (optInStatus === "DECLINED") {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <header className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
              {content.headerBadge}
            </span>
            <Link
              href={`?lang=${alternateLanguage}`}
              className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-indigo-400"
            >
              {content.languageLabel}
            </Link>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-white">
            {content.terminalDeclinedTitle}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-200">
            {content.terminalDeclinedBody}
          </p>
          <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-800/40 p-5 text-sm leading-relaxed text-slate-300">
            {content.terminalDeclinedNote}
          </div>
          <div className="mt-8">
            <Link
              href={PRIVATE_PROFILE_PATH}
              className="inline-flex min-h-[44px] items-center rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700"
            >
              ← {content.backToProfile}
            </Link>
          </div>
        </header>
      </section>
    );
  }

  // Gateway (NOT_OFFERED) - Strictly read-only on GET!
  if (optInStatus === "NOT_OFFERED") {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
              {content.headerBadge}
            </span>
            <Link
              href={`?lang=${alternateLanguage}`}
              className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-indigo-400"
            >
              {content.languageLabel}
            </Link>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-white">
            {content.notOfferedTitle}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            {content.notOfferedBody}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <form
              action={`/talents/evidence-review/profile/opt-in/offer?lang=${language}`}
              method="POST"
            >
              <button
                type="submit"
                className="min-h-[48px] rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-400"
              >
                {content.startOfferButton}
              </button>
            </form>
            <Link
              href={PRIVATE_PROFILE_PATH}
              className="inline-flex min-h-[48px] items-center rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 hover:border-slate-500"
            >
              {content.backToProfile}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Active decision state (OFFERED)
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <header className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
            {content.headerBadge}
          </span>
          <Link
            href={`?lang=${alternateLanguage}`}
            className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-indigo-400"
          >
            {content.languageLabel}
          </Link>
        </div>
        <h1 className="mt-6 text-3xl font-bold text-white">
          {content.headerTitle}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-slate-300">
          {content.headerSubtitle}
        </p>
      </header>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <article className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold text-white">
            {content.whatItMeansTitle}
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
            {content.whatItMeansPoints.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold text-white">
            {content.whatItDoesNotMeanTitle}
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
            {content.whatItDoesNotMeanPoints.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <OptInDecisionActions language={language} />

      <footer className="mt-12 text-center">
        <Link
          href={PRIVATE_PROFILE_PATH}
          className="inline-flex min-h-[44px] items-center text-sm font-semibold text-indigo-300 hover:text-indigo-200 underline underline-offset-4"
        >
          ← {content.backToProfile}
        </Link>
      </footer>
    </section>
  );
}
