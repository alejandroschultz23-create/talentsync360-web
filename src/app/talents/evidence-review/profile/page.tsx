import type { Metadata } from "next";
import { cookies } from "next/headers";

import type { EvidenceReviewLanguage } from "@/lib/evidence-review/consent";
import { privateProfileContent } from "@/lib/evidence-review/private-content";
import { buildPrivateProfileView } from "@/lib/evidence-review/private-profile";
import {
  PRIVATE_ACCESS_COOKIE,
} from "@/lib/evidence-review/server/private-access";
import { EvidenceReviewRepository } from "@/lib/evidence-review/server/repository";

import PrivateProfileActions from "./PrivateProfileActions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Private Professional Evidence Profile",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noarchive: true },
  },
  referrer: "no-referrer",
};

function languageFrom(value: string | string[] | undefined): EvidenceReviewLanguage {
  return value === "es" ? "es" : "en";
}

function PrivateAccessError({ language }: { language: EvidenceReviewLanguage }) {
  const content = privateProfileContent[language];
  return (
    <section className="mx-auto flex min-h-[65vh] max-w-3xl items-center px-6 py-20">
      <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-center shadow-2xl">
        <p className="text-xs font-semibold tracking-[0.22em] text-indigo-300">
          {content.eyebrow}
        </p>
        <h1 className="mt-4 text-3xl text-white">{content.accessInvalid}</h1>
        <p className="mt-4">{content.accessHelp}</p>
      </div>
    </section>
  );
}

export default async function PrivateEvidenceProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string | string[] }>;
}) {
  const query = await searchParams;
  const language = languageFrom(query.lang);
  const content = privateProfileContent[language];
  const token = (await cookies()).get(PRIVATE_ACCESS_COOKIE)?.value;

  if (!token) return <PrivateAccessError language={language} />;

  let access;
  try {
    access = await new EvidenceReviewRepository().resolvePrivateProfileAccess(
      token,
    );
  } catch {
    access = null;
  }
  if (!access) return <PrivateAccessError language={language} />;

  const profile = buildPrivateProfileView(access);
  const actionState = profile.confirmedAt
    ? "confirmed"
    : profile.correctionRequestedAt
      ? "correction_requested"
      : "open";
  const alternateLanguage = language === "es" ? "en" : "es";
  const locale = language === "es" ? "es-AR" : "en-US";

  return (
    <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <header className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl sm:p-9">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-indigo-300">
              {content.eyebrow}
            </p>
            <h1 className="mt-3 text-3xl text-white sm:text-5xl">{profile.fullName}</h1>
            <p className="mt-3 text-lg text-slate-300">
              {profile.currentRole} · {profile.country}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              {content.version} {profile.reviewVersion} · {content.reviewedOn}{" "}
              {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
                new Date(profile.reviewedAt),
              )}
            </p>
          </div>
          <a
            href={`?lang=${alternateLanguage}`}
            className="min-h-11 rounded-xl border border-slate-700 px-4 py-2 text-center text-sm font-semibold text-slate-200 hover:border-indigo-400"
          >
            {content.languageLabel}
          </a>
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-2xl text-white">{content.professionalIntent}</h2>
          <dl className="mt-5 space-y-4">
            <div>
              <dt className="text-sm font-semibold text-slate-400">{content.opportunity}</dt>
              <dd className="mt-1 text-white">
                {content.opportunityStatuses[profile.opportunityStatus]}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-slate-400">{content.workModes}</dt>
              <dd className="mt-1 text-white">
                {profile.workModes.length
                  ? profile.workModes.map((mode) => content.workModeLabels[mode]).join(", ")
                  : "—"}
              </dd>
            </div>
          </dl>
        </article>

        <article className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-2xl text-white">{content.evidenceReviewed}</h2>
          <dl className="mt-5 space-y-4">
            <div>
              <dt className="text-sm font-semibold text-slate-400">{content.evidenceType}</dt>
              <dd className="mt-1 text-white">{content.evidenceTypes[profile.evidenceType]}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-slate-400">{content.contribution}</dt>
              <dd className="mt-1 whitespace-pre-wrap text-slate-200">
                {profile.individualContribution}
              </dd>
            </div>
            {profile.professionalContext ? (
              <div>
                <dt className="text-sm font-semibold text-slate-400">{content.context}</dt>
                <dd className="mt-1 whitespace-pre-wrap text-slate-200">
                  {profile.professionalContext}
                </dd>
              </div>
            ) : null}
          </dl>
          {profile.evidenceUrl ? (
            <a
              href={profile.evidenceUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="mt-5 inline-flex min-h-11 items-center text-indigo-300 underline underline-offset-4"
            >
              {content.evidenceLink}
            </a>
          ) : null}
        </article>
      </div>

      <article className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
        <h2 className="text-2xl text-white">{content.findings}</h2>
        <div className="mt-6 space-y-5">
          {profile.findings.map((finding) => (
            <div key={finding.id} className="rounded-2xl border border-slate-700 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-lg text-white">{finding.capability}</h3>
                <span className="rounded-full border border-slate-600 px-3 py-1 text-xs font-semibold text-slate-200">
                  {content.findingStatuses[finding.finding_status]}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-slate-300">{finding.explanation}</p>
              {finding.evidence_reference ? (
                <p className="mt-3 whitespace-pre-wrap text-sm text-slate-400">
                  <strong>{content.evidenceBasis}:</strong> {finding.evidence_reference}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </article>

      <article className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
        <h2 className="text-2xl text-white">{content.recommendations}</h2>
        {profile.recommendations.length ? (
          <ul className="mt-5 space-y-4">
            {profile.recommendations.map((recommendation) => (
              <li key={`${recommendation.validationArea}:${recommendation.rationale}`}>
                <strong>{recommendation.validationArea}</strong>
                <p>{recommendation.rationale}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4">{content.recommendationsEmpty}</p>
        )}
      </article>

      <aside className="mt-8 rounded-3xl border border-indigo-400/20 bg-indigo-400/10 p-6 sm:p-8">
        <h2 className="text-2xl text-white">{content.transparency}</h2>
        <p className="mt-4 text-slate-200">{content.transparencyBody}</p>
        <p className="mt-3 text-slate-300">{content.disclaimer}</p>
      </aside>

      <div className="mt-8">
        <PrivateProfileActions language={language} state={actionState} />
      </div>
    </section>
  );
}
