"use client";

import { FormEvent, useState } from "react";

import type { EvidenceReviewLanguage } from "@/lib/evidence-review/consent";
import { privateProfileContent } from "@/lib/evidence-review/private-content";

type ActionState = "open" | "confirmed" | "correction_requested";

export default function PrivateProfileActions({
  language,
  state,
}: {
  language: EvidenceReviewLanguage;
  state: ActionState;
}) {
  const content = privateProfileContent[language];
  const [busy, setBusy] = useState<"confirm" | "correction" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (state === "confirmed") {
    return (
      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5 text-emerald-100">
        {content.confirmed}
      </div>
    );
  }

  if (state === "correction_requested") {
    return (
      <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-5">
        <p className="font-semibold text-amber-100">{content.correctionRequested}</p>
        <p className="mt-2 text-sm text-slate-300">{content.correctionRequestedBody}</p>
      </div>
    );
  }

  async function submit(path: string, body: object, action: "confirm" | "correction") {
    setBusy(action);
    setMessage(null);
    try {
      const response = await fetch(path, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        setMessage(content.genericError);
        return;
      }
      setMessage(
        action === "confirm" ? content.confirmSuccess : content.correctionSuccess,
      );
      window.location.reload();
    } catch {
      setMessage(content.genericError);
    } finally {
      setBusy(null);
    }
  }

  async function requestCorrection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const correctionMessage = String(form.get("correction_message") ?? "");
    await submit(
      "/talents/evidence-review/profile/correction",
      { correction_message: correctionMessage },
      "correction",
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() =>
            void submit(
              "/talents/evidence-review/profile/confirm",
              {},
              "confirm",
            )
          }
          className="min-h-11 w-full rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy === "confirm" ? content.submitting : content.confirm}
        </button>
      </div>

      <form
        onSubmit={requestCorrection}
        className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5"
      >
        <label htmlFor="correction_message" className="font-semibold text-white">
          {content.correctionLabel}
        </label>
        <textarea
          id="correction_message"
          name="correction_message"
          required
          minLength={1}
          maxLength={2_000}
          disabled={busy !== null}
          aria-describedby="correction-help"
          placeholder={content.correctionPlaceholder}
          className="mt-3 min-h-32 w-full resize-y rounded-xl border border-slate-600 bg-slate-950 p-4 text-base text-white outline-none focus:border-indigo-400 disabled:opacity-60"
        />
        <p id="correction-help" className="mt-2 text-xs text-slate-400">
          {content.correctionHelp}
        </p>
        <button
          type="submit"
          disabled={busy !== null}
          className="mt-4 min-h-11 w-full rounded-xl border border-indigo-400 px-5 py-3 font-semibold text-indigo-100 transition hover:bg-indigo-400/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy === "correction" ? content.submitting : content.correction}
        </button>
      </form>

      <p aria-live="polite" className="text-sm text-slate-300 lg:col-span-2">
        {message}
      </p>
    </div>
  );
}
