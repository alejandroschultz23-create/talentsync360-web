"use client";

import { CheckCircle2, LogOut, ShieldAlert, Trash2, UserMinus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import type { PilotLanguage } from "@/lib/h3-pilot/participant/content";
import { pilotContent } from "@/lib/h3-pilot/participant/content";

interface PilotParticipantStateView {
  stage: string;
  hasSubmission: boolean;
  presentationStatus: string | null;
  label: string;
  optInEligible: boolean;
  canRevokeOptIn: boolean;
  draftDecisionOpen: boolean;
  draft: unknown | null;
  cleanupPending: boolean;
  canWithdraw: boolean;
  canRequestRemoval: boolean;
  talentNetworkDeclined: boolean;
}

function draftText(draft: unknown): string {
  if (typeof draft === "string") return draft;
  if (draft !== null && typeof draft === "object") {
    const record = draft as Record<string, unknown>;
    for (const key of ["content", "summary", "draft", "text"]) {
      const value = record[key];
      if (typeof value === "string" && value.length > 0) return value;
    }
    return JSON.stringify(record, null, 2);
  }
  return "";
}

export default function PilotStatusPanel({ language }: { language: PilotLanguage }) {
  const content = pilotContent[language];
  const [state, setState] = useState<PilotParticipantStateView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [correction, setCorrection] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch(`/api/h3-pilot/participant/state?lang=${language}`, {
        headers: { accept: "application/json" },
      });
      if (!response.ok) {
        setError(content.genericError);
        return;
      }
      const body = (await response.json()) as { ok: boolean; state?: PilotParticipantStateView };
      if (!body.ok || !body.state) {
        setError(content.genericError);
        return;
      }
      setState(body.state);
    } catch {
      setError(content.genericError);
    }
  }, [language, content.genericError]);

  useEffect(() => {
    void load();
  }, [load]);

  async function post(path: string, body: Record<string, unknown>, confirmMessage?: string) {
    if (confirmMessage !== undefined && !window.confirm(confirmMessage)) return;
    setBusy(true);
    setNotice(null);
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        setNotice(content.genericError);
        return;
      }
      await load();
    } catch {
      setNotice(content.genericError);
    } finally {
      setBusy(false);
    }
  }

  if (state === null) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <p className="text-slate-300">{error ?? content.submitting}</p>
        </div>
      </section>
    );
  }

  if (state.hasSubmission === false) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <p className="text-xs font-bold tracking-[0.28em] text-blue-400">{content.statusTitle}</p>
          <p className="mt-4 text-slate-300">{content.accessInvalid}</p>
          <Link
            href="/talents/evidence-review/apply"
            className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500"
          >
            {content.startCta}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <header className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl">
        <p className="text-xs font-bold tracking-[0.28em] text-blue-400">{content.statusTitle}</p>
        <h1 data-testid="pilot-status-label" className="mt-4 text-3xl font-bold text-white">
          {state.label}
        </h1>
        <p className="mt-3 text-sm text-slate-400">{content.statusBody}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-4 rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-slate-500"
        >
          {content.refresh}
        </button>
      </header>

      {state.cleanupPending && (
        <div className="mt-6 flex gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5">
          <ShieldAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
          <p className="text-sm text-amber-100">{content.removalPending}</p>
        </div>
      )}

      {state.draftDecisionOpen && (
        <article className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-2xl font-bold text-white">{content.draftTitle}</h2>
          <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-200">
            {draftText(state.draft)}
          </pre>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => void post("/api/h3-pilot/participant/draft", { decision: "CONFIRM" })}
              className="min-h-11 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
            >
              {content.draftConfirm}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                void post("/api/h3-pilot/participant/draft", {
                  decision: "REQUEST_CORRECTION",
                  correctionMessage: correction,
                })
              }
              className="min-h-11 rounded-xl border border-amber-400 px-5 py-3 font-semibold text-amber-100 hover:bg-amber-400/10 disabled:opacity-60"
            >
              {content.draftCorrection}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                void post(
                  "/api/h3-pilot/participant/draft",
                  { decision: "REJECT" },
                  content.rejectConfirm,
                )
              }
              className="min-h-11 rounded-xl border border-red-400 px-5 py-3 font-semibold text-red-100 hover:bg-red-400/10 disabled:opacity-60"
            >
              {content.draftReject}
            </button>
          </div>
          <label htmlFor="pilot-correction" className="mt-6 block font-semibold text-white">
            {content.correctionLabel}
          </label>
          <textarea
            id="pilot-correction"
            value={correction}
            maxLength={2_000}
            onChange={(event) => setCorrection(event.target.value)}
            placeholder={content.correctionPlaceholder}
            className="mt-3 min-h-28 w-full resize-y rounded-xl border border-slate-600 bg-slate-950 p-4 text-base text-white outline-none focus:border-blue-400"
          />
          <p className="mt-2 text-xs text-slate-400">{content.correctionHelp}</p>
        </article>
      )}

      {state.optInEligible && (
        <article className="mt-6 rounded-3xl border border-indigo-400/30 bg-indigo-500/10 p-6">
          <h2 className="text-2xl font-bold text-white">{content.optInTitle}</h2>
          <p className="mt-3 text-sm text-slate-200">{content.optInBody}</p>
          <div className="mt-5 flex flex-wrap gap-4">
            <button
              type="button"
              disabled={busy}
              onClick={() => void post("/api/h3-pilot/participant/opt-in", { action: "JOIN", language })}
              className="min-h-11 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {content.optInJoin}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void post("/api/h3-pilot/participant/opt-in", { action: "DECLINE", language })}
              className="min-h-11 rounded-xl border border-slate-600 px-5 py-3 font-semibold text-slate-200 hover:border-slate-400 disabled:opacity-60"
            >
              {content.optInDecline}
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-400">{content.optInNote}</p>
        </article>
      )}

      <article className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {state.canWithdraw && (
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                void post("/api/h3-pilot/participant/lifecycle", { action: "WITHDRAW" })
              }
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-amber-400/40 px-5 py-3 font-semibold text-amber-100 hover:bg-amber-400/10 disabled:opacity-60"
            >
              <LogOut aria-hidden="true" className="h-5 w-5" />
              {content.withdraw}
            </button>
          )}
          {state.canRevokeOptIn && (
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                void post("/api/h3-pilot/participant/lifecycle", { action: "REVOKE_OPT_IN" })
              }
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-600 px-5 py-3 font-semibold text-slate-200 hover:border-slate-400 disabled:opacity-60"
            >
              <UserMinus aria-hidden="true" className="h-5 w-5" />
              {content.revokeOptIn}
            </button>
          )}
          {state.canRequestRemoval && (
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                void post("/api/h3-pilot/participant/lifecycle", { action: "REMOVAL" })
              }
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-400/40 px-5 py-3 font-semibold text-red-100 hover:bg-red-400/10 disabled:opacity-60"
            >
              <Trash2 aria-hidden="true" className="h-5 w-5" />
              {content.removal}
            </button>
          )}
        </div>
        <p className="mt-4 text-xs text-slate-400">{content.withdrawNote}</p>
        <p className="mt-2 text-xs text-slate-400">{content.revokeNote}</p>
        <p className="mt-2 text-xs text-slate-400">{content.removalNote}</p>
      </article>

      {notice && (
        <p aria-live="polite" className="mt-4 flex items-center gap-2 text-sm text-slate-300">
          <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-emerald-400" />
          {notice}
        </p>
      )}
      {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
    </section>
  );
}
