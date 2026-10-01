"use client";

import { CheckCircle2, LockKeyhole, ShieldCheck, TriangleAlert } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import {
  PILOT_CONSENT_ITEMS,
  pilotContent,
  pilotSubmitErrorMessage,
  type PilotLanguage,
} from "@/lib/h3-pilot/participant/content";
import {
  PILOT_CONSENT_ACKNOWLEDGEMENT_KEYS,
  PILOT_POLICY_VERSION,
  type PilotConsentAcknowledgementKey,
} from "@/lib/h3-pilot/participant/policy";

const inputClass =
  "min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

export default function PilotApplyForm({ language }: { language: PilotLanguage }) {
  const content = pilotContent[language];
  const router = useRouter();
  const [acknowledgements, setAcknowledgements] = useState<
    Partial<Record<PilotConsentAcknowledgementKey, boolean>>
  >({});
  const [identity, setIdentity] = useState(false);
  const [cv, setCv] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const toggle = (key: PilotConsentAcknowledgementKey, value: boolean) => {
    setAcknowledgements((current) => ({ ...current, [key]: value }));
  };

  const allAcknowledged = PILOT_CONSENT_ACKNOWLEDGEMENT_KEYS.every(
    (key) => acknowledgements[key] === true,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!allAcknowledged) {
      setError(content.consentRequired);
      return;
    }
    if (cv === null) {
      setError(content.cvRequired);
      return;
    }
    if (identity !== true) {
      setError(content.identityRequired);
      return;
    }

    setBusy(true);
    try {
      const form = new FormData();
      for (const key of PILOT_CONSENT_ACKNOWLEDGEMENT_KEYS) {
        form.set(`ack_${key}`, acknowledgements[key] === true ? "true" : "false");
      }
      form.set("identity_confirmed", "true");
      form.set("cv", cv);
      if (coverLetter !== null) form.set("cover_letter", coverLetter);

      const response = await fetch("/api/h3-pilot/participant/submission", {
        method: "POST",
        body: form,
      });
      if (!response.ok) {
        let code: string | null = null;
        try {
          const body = (await response.json()) as { code?: unknown };
          if (typeof body.code === "string") code = body.code;
        } catch {
          code = null;
        }
        setError(pilotSubmitErrorMessage(language, code));
        return;
      }
      router.push("/talents/evidence-review/submitted");
    } catch {
      setError(content.genericError);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10">
          <p className="text-xs font-bold tracking-[0.28em] text-blue-400">{content.eyebrow}</p>
          <h1 className="mt-5 text-4xl font-bold text-white sm:text-5xl">{content.title}</h1>
          <p className="mt-5 text-lg text-slate-400">{content.lead}</p>
          <div className="mt-6 flex gap-3 rounded-2xl border border-blue-400/20 bg-blue-400/5 p-4">
            <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" />
            <p className="text-sm text-blue-100">{content.previewNotice}</p>
          </div>
        </header>

        <form noValidate onSubmit={handleSubmit} className="space-y-8 rounded-3xl border border-slate-800 bg-slate-900/55 p-5 shadow-2xl sm:p-9">
          <fieldset>
            <legend className="text-xl font-bold text-white">{content.consentTitle}</legend>
            <p className="mt-3 text-sm text-slate-400">{content.consentIntro}</p>
            <p className="mt-2 text-xs text-slate-500">
              {content.policyVersionLabel}: <span className="font-mono">{PILOT_POLICY_VERSION}</span>
            </p>
            <div className="mt-5 space-y-3">
              {PILOT_CONSENT_ITEMS.map((item) => (
                <label
                  key={item.key}
                  className="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border border-slate-700 bg-slate-950/70 p-4 hover:border-slate-500"
                >
                  <input
                    type="checkbox"
                    name={`ack_${item.key}`}
                    checked={acknowledgements[item.key] === true}
                    onChange={(event) => toggle(item.key, event.target.checked)}
                    className="mt-1 h-5 w-5 shrink-0 rounded accent-blue-600"
                  />
                  <span className="text-sm text-slate-100">{language === "es" ? item.es : item.en}</span>
                </label>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-400">{content.consentBoundary}</p>
          </fieldset>

          <fieldset className="space-y-5">
            <legend className="text-xl font-bold text-white">{content.sourcesTitle}</legend>
            <p className="text-sm text-slate-400">{content.fileFormats}</p>
            <div>
              <label htmlFor="cv" className="mb-2 block text-base font-semibold text-slate-200">
                {content.cvLabel}
                <span className="ml-2 text-xs text-blue-400">*</span>
              </label>
              <input
                id="cv"
                name="cv"
                type="file"
                required
                accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(event) => setCv(event.target.files?.[0] ?? null)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="cover_letter" className="mb-2 block text-base font-semibold text-slate-200">
                {content.coverLetterLabel}
                <span className="ml-2 text-xs text-slate-500">({content.fileFormats})</span>
              </label>
              <input
                id="cover_letter"
                name="cover_letter"
                type="file"
                accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(event) => setCoverLetter(event.target.files?.[0] ?? null)}
                className={inputClass}
              />
            </div>
            <div className="flex gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
              <TriangleAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
              <p className="text-sm text-amber-100">{content.previewNotice}</p>
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xl font-bold text-white">{content.identityTitle}</legend>
            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-700 bg-slate-950/70 p-4">
              <input
                type="checkbox"
                id="identity_confirmed"
                name="identity_confirmed"
                checked={identity}
                onChange={(event) => setIdentity(event.target.checked)}
                className="mt-1 h-5 w-5 shrink-0 rounded accent-blue-600"
              />
              <span className="text-base font-semibold text-slate-100">{content.identityCheckbox}</span>
            </label>
          </fieldset>

          <div aria-live="assertive">
            {error && (
              <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-100">
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={busy}
            className="min-h-12 w-full rounded-xl bg-blue-600 px-6 py-3 text-base font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? content.submitting : content.submit}
          </button>

          <p className="flex items-start justify-center gap-2 text-center text-xs text-slate-500">
            <LockKeyhole aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            {content.consentBoundary}
          </p>
          <CheckCircle2 aria-hidden="true" className="mx-auto h-5 w-5 text-emerald-400" />
        </form>
      </div>
    </section>
  );
}
