"use client";

import { useState } from "react";

import type { EvidenceReviewLanguage } from "@/lib/evidence-review/consent";
import { optInContent } from "@/lib/evidence-review/opt-in-content";

export default function OptInDecisionActions({
  language,
}: {
  language: EvidenceReviewLanguage;
}) {
  const content = optInContent[language];
  const [consentChecked, setConsentChecked] = useState(false);
  const [busy, setBusy] = useState<"accept" | "decline" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleDecision(action: "accept" | "decline") {
    setBusy(action);
    setErrorMessage(null);

    try {
      const endpoint =
        action === "accept"
          ? "/talents/evidence-review/profile/opt-in/accept"
          : "/talents/evidence-review/profile/opt-in/decline";

      const payload =
        action === "accept"
          ? { consent: true, language }
          : {};

      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setErrorMessage(content.genericError);
        return;
      }

      window.location.reload();
    } catch {
      setErrorMessage(content.genericError);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-indigo-400/30 bg-slate-900/80 p-5 sm:p-6">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            id="optin-consent-checkbox"
            checked={consentChecked}
            disabled={busy !== null}
            onChange={(e) => setConsentChecked(e.target.checked)}
            className="mt-1 h-5 w-5 rounded border-slate-600 bg-slate-950 text-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50"
          />
          <div className="space-y-2">
            <span className="text-sm font-semibold text-white">
              {content.consentCheckboxLabel}
            </span>
            <p className="text-xs leading-relaxed text-slate-400">
              {content.consentText}
            </p>
            <p className="text-xs font-medium text-amber-200/90">
              {content.boundaryStatement}
            </p>
          </div>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          disabled={!consentChecked || busy !== null}
          onClick={() => void handleDecision("accept")}
          className="min-h-[48px] w-full rounded-xl border border-indigo-400/70 bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-slate-100 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-900 disabled:text-slate-500"
        >
          {busy === "accept" ? content.submitting : content.yesButton}
        </button>

        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void handleDecision("decline")}
          className="min-h-[48px] w-full rounded-xl border border-indigo-400/70 bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-slate-100 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy === "decline" ? content.submitting : content.noButton}
        </button>
      </div>

      <div aria-live="polite" className="min-h-[24px]">
        {errorMessage ? (
          <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-center text-sm text-rose-200">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}
