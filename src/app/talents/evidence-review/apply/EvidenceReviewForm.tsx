"use client";

import { ChevronDown, Clock3, LockKeyhole, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";

import { useLanguage } from "@/context/LanguageContext";
import { pushEvidenceReviewEvent } from "@/lib/analytics";
import {
  EVIDENCE_REVIEW_ATTRIBUTION_STORAGE_KEY,
  normalizeEvidenceReviewAttribution,
  type EvidenceReviewAttribution,
} from "@/lib/evidence-review/attribution";
import { REVIEW_CONSENT_TEXT } from "@/lib/evidence-review/consent";
import { evidenceReviewContent } from "@/lib/evidence-review/content";
import {
  EVIDENCE_TYPES,
  OPPORTUNITY_STATUSES,
  PROFESSIONAL_INTENTS,
  type EvidenceType,
  type OpportunityStatus,
  type ProfessionalIntent,
} from "@/lib/evidence-review/domain";
import { validatePublicEvidenceReviewPayload } from "@/lib/evidence-review/public-submission";

type FormValues = {
  full_name: string;
  email: string;
  country: string;
  current_role: string;
  evidence_type: EvidenceType | "";
  evidence_url: string;
  individual_contribution: string;
  professional_context: string;
  opportunity_status: OpportunityStatus | "";
  professional_intents: ProfessionalIntent[];
  review_consent_accepted: boolean;
};

const initialValues: FormValues = {
  full_name: "",
  email: "",
  country: "",
  current_role: "",
  evidence_type: "",
  evidence_url: "",
  individual_contribution: "",
  professional_context: "",
  opportunity_status: "",
  professional_intents: [],
  review_consent_accepted: false,
};

const inputClass =
  "min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

function EvidenceReviewFormContent() {
  const { lang } = useLanguage();
  const content = evidenceReviewContent[lang].form;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const [attribution, setAttribution] = useState<EvidenceReviewAttribution>({
    source: "direct",
    campaign: null,
  });
  const [attributionReady, setAttributionReady] = useState(false);

  useEffect(() => {
    const hasQueryAttribution =
      searchParams.has("source") || searchParams.has("campaign");
    let resolved = normalizeEvidenceReviewAttribution({
      source: searchParams.get("source"),
      campaign: searchParams.get("campaign"),
    });

    if (!hasQueryAttribution) {
      try {
        const stored = sessionStorage.getItem(
          EVIDENCE_REVIEW_ATTRIBUTION_STORAGE_KEY,
        );
        if (stored) {
          const parsed = JSON.parse(stored) as Record<string, unknown>;
          resolved = normalizeEvidenceReviewAttribution(parsed);
        }
      } catch {
        resolved = { source: "direct", campaign: null };
      }
    }

    setAttribution(resolved);
    setAttributionReady(true);
    sessionStorage.setItem(
      EVIDENCE_REVIEW_ATTRIBUTION_STORAGE_KEY,
      JSON.stringify(resolved),
    );
  }, [searchParams]);

  useEffect(() => {
    if (!attributionReady) return;
    pushEvidenceReviewEvent("start_evidence_review_form", {
      ...attribution,
      language: lang,
    });
  }, [attribution, attributionReady, lang]);

  const updateValue = <Key extends keyof FormValues>(
    key: Key,
    value: FormValues[Key],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const selectOpportunityStatus = (status: OpportunityStatus) => {
    setValues((current) => ({
      ...current,
      opportunity_status: status,
      professional_intents:
        status === "OPEN" ? current.professional_intents : [],
    }));
    setErrors((current) => {
      const next = { ...current };
      delete next.opportunity_status;
      delete next.professional_intents;
      return next;
    });
  };

  const toggleWorkMode = (mode: ProfessionalIntent) => {
    updateValue(
      "professional_intents",
      values.professional_intents.includes(mode)
        ? values.professional_intents.filter((value) => value !== mode)
        : [...values.professional_intents, mode],
    );
  };

  const errorId = (field: string) =>
    errors[field] ? `${field}-error` : undefined;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setFormError(null);
    const formData = new FormData(event.currentTarget);
    const payload = {
      ...values,
      source: attribution.source,
      campaign: attribution.campaign,
      language: lang,
      started_at: startedAt,
      website: String(formData.get("website") ?? ""),
    };
    const validation = validatePublicEvidenceReviewPayload(payload);

    if (!validation.success) {
      const localizedErrors = Object.fromEntries(
        Object.keys(validation.errors).map((field) => [
          field,
          field === "review_consent"
            ? content.errors.consent
            : content.errors.field,
        ]),
      );
      setErrors(localizedErrors);
      const firstInvalidField = Object.keys(localizedErrors)[0];
      requestAnimationFrame(() => {
        document.getElementById(firstInvalidField)?.focus();
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/evidence-review/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        setFormError(content.errors.submission);
        return;
      }

      pushEvidenceReviewEvent("submit_evidence_review", {
        ...attribution,
        language: lang,
      });
      router.push("/talents/evidence-review/submitted");
    } catch {
      setFormError(content.errors.submission);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <p className="text-xs font-bold tracking-[0.28em] text-blue-400">
            {content.eyebrow}
          </p>
          <h1 className="mt-5 text-4xl font-bold text-white sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-5 text-lg text-slate-400">{content.lead}</p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-800 px-4 py-2 text-sm text-slate-300">
            <Clock3 aria-hidden="true" className="h-4 w-4 text-blue-400" />
            {content.time}
          </p>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit}
          className="space-y-8 rounded-3xl border border-slate-800 bg-slate-900/55 p-5 shadow-2xl sm:p-9"
        >
          <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <input type="hidden" name="source" value={attribution.source} />
          <input type="hidden" name="campaign" value={attribution.campaign ?? ""} />

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label={content.fields.full_name} requiredText={content.required} error={errors.full_name} id="full_name-error">
              <input id="full_name" name="full_name" type="text" autoComplete="name" required maxLength={160} value={values.full_name} onChange={(event) => updateValue("full_name", event.target.value)} aria-invalid={Boolean(errors.full_name)} aria-describedby={errorId("full_name")} className={inputClass} placeholder={content.placeholders.full_name} />
            </Field>
            <Field label={content.fields.email} requiredText={content.required} error={errors.email} id="email-error">
              <input id="email" name="email" type="email" inputMode="email" autoComplete="email" required maxLength={320} value={values.email} onChange={(event) => updateValue("email", event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errorId("email")} className={inputClass} placeholder={content.placeholders.email} />
            </Field>
            <Field label={content.fields.country} requiredText={content.required} error={errors.country} id="country-error">
              <input id="country" name="country" type="text" autoComplete="country-name" required maxLength={100} value={values.country} onChange={(event) => updateValue("country", event.target.value)} aria-invalid={Boolean(errors.country)} aria-describedby={errorId("country")} className={inputClass} placeholder={content.placeholders.country} />
            </Field>
            <Field label={content.fields.current_role} requiredText={content.required} error={errors.current_role} id="current_role-error">
              <input id="current_role" name="current_role" type="text" autoComplete="organization-title" required maxLength={160} value={values.current_role} onChange={(event) => updateValue("current_role", event.target.value)} aria-invalid={Boolean(errors.current_role)} aria-describedby={errorId("current_role")} className={inputClass} placeholder={content.placeholders.current_role} />
            </Field>
          </div>

          <Field label={content.fields.evidence_type} requiredText={content.required} error={errors.evidence_type} id="evidence_type-error">
            <div className="relative">
              <select id="evidence_type" name="evidence_type" required value={values.evidence_type} onChange={(event) => updateValue("evidence_type", event.target.value as EvidenceType | "")} aria-invalid={Boolean(errors.evidence_type)} aria-describedby={errorId("evidence_type")} className={`${inputClass} appearance-none pr-12`}>
                <option value="">—</option>
                {EVIDENCE_TYPES.map((type) => <option key={type} value={type}>{content.evidenceTypes[type]}</option>)}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            </div>
          </Field>

          <Field label={content.fields.evidence_url} optionalText={content.optional} error={errors.evidence_url} id="evidence_url-error">
            <input id="evidence_url" name="evidence_url" type="url" inputMode="url" autoComplete="url" maxLength={2_000} value={values.evidence_url} onChange={(event) => updateValue("evidence_url", event.target.value)} aria-invalid={Boolean(errors.evidence_url)} aria-describedby={errorId("evidence_url")} className={inputClass} placeholder={content.placeholders.evidence_url} />
          </Field>

          <div className="flex gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
            <TriangleAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <p className="text-sm text-amber-100">{content.confidentialWarning}</p>
          </div>

          <Field label={content.fields.individual_contribution} requiredText={content.required} error={errors.individual_contribution} id="individual_contribution-error">
            <textarea id="individual_contribution" name="individual_contribution" rows={6} required minLength={20} maxLength={5_000} value={values.individual_contribution} onChange={(event) => updateValue("individual_contribution", event.target.value)} aria-invalid={Boolean(errors.individual_contribution)} aria-describedby={errorId("individual_contribution")} className={`${inputClass} resize-y`} placeholder={content.placeholders.individual_contribution} />
          </Field>

          <Field label={content.fields.professional_context} optionalText={content.optional} error={errors.professional_context} id="professional_context-error">
            <textarea id="professional_context" name="professional_context" rows={4} maxLength={5_000} value={values.professional_context} onChange={(event) => updateValue("professional_context", event.target.value)} aria-invalid={Boolean(errors.professional_context)} aria-describedby={errorId("professional_context")} className={`${inputClass} resize-y`} placeholder={content.placeholders.professional_context} />
          </Field>

          <fieldset aria-describedby={errors.opportunity_status ? "opportunity_status-error" : undefined}>
            <legend className="text-base font-semibold text-slate-200">
              {content.fields.opportunity_status}
              <span className="ml-2 text-xs font-normal text-blue-400">{content.required}</span>
            </legend>
            <div className="mt-4 space-y-3">
              {OPPORTUNITY_STATUSES.map((status) => (
                <label key={status} className="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border border-slate-700 bg-slate-950/70 p-4 hover:border-slate-500">
                  <input type="radio" name="opportunity_status" value={status} checked={values.opportunity_status === status} onChange={() => selectOpportunityStatus(status)} className="mt-1 h-5 w-5 accent-blue-600" />
                  <span><span className="block font-medium text-slate-100">{content.opportunityStatuses[status]}</span><span className="mt-1 block text-sm text-slate-500">{content.opportunityHelp[status]}</span></span>
                </label>
              ))}
            </div>
            {errors.opportunity_status && <FieldError id="opportunity_status-error" message={content.errors.field} />}
          </fieldset>

          {values.opportunity_status === "OPEN" && (
            <fieldset aria-describedby={errors.professional_intents ? "professional_intents-error" : undefined}>
              <legend className="text-base font-semibold text-slate-200">
                {content.fields.professional_intents}
                <span className="ml-2 text-xs font-normal text-blue-400">{content.required}</span>
              </legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {PROFESSIONAL_INTENTS.map((mode) => (
                  <label key={mode} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 hover:border-slate-500">
                    <input type="checkbox" name="professional_intents" value={mode} checked={values.professional_intents.includes(mode)} onChange={() => toggleWorkMode(mode)} className="h-5 w-5 rounded accent-blue-600" />
                    <span className="text-base text-slate-100">{content.workModes[mode]}</span>
                  </label>
                ))}
              </div>
              {errors.professional_intents && <FieldError id="professional_intents-error" message={content.errors.field} />}
            </fieldset>
          )}

          <div className="rounded-2xl border border-blue-400/20 bg-blue-400/5 p-5">
            <label className="flex cursor-pointer items-start gap-3" htmlFor="review_consent">
              <input id="review_consent" name="review_consent_accepted" type="checkbox" required checked={values.review_consent_accepted} onChange={(event) => updateValue("review_consent_accepted", event.target.checked)} aria-invalid={Boolean(errors.review_consent)} aria-describedby={errors.review_consent ? "review_consent-error review-consent-boundary" : "review-consent-boundary"} className="mt-1 h-5 w-5 shrink-0 rounded accent-blue-600" />
              <span className="text-base leading-7 text-slate-200">{REVIEW_CONSENT_TEXT[lang]}</span>
            </label>
            <p id="review-consent-boundary" className="mt-4 text-sm text-slate-400">{content.consentBoundary}</p>
            {errors.review_consent && <FieldError id="review_consent-error" message={content.errors.consent} />}
            <p className="mt-4 text-sm text-slate-500">
              {content.privacyPrefix}{" "}
              <Link href="/privacy" className="font-medium text-blue-400 underline underline-offset-4 hover:text-blue-300">{content.privacyLink}</Link>.
            </p>
          </div>

          <div aria-live="assertive">
            {formError && (
              <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-100">
                {formError}
              </div>
            )}
          </div>

          <button type="submit" disabled={isSubmitting} className="min-h-12 w-full rounded-xl bg-blue-600 px-6 py-3 text-base font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? content.submitting : content.submit}
          </button>

          <p className="flex items-start justify-center gap-2 text-center text-xs text-slate-500">
            <LockKeyhole aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            {content.consentBoundary}
          </p>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  requiredText,
  optionalText,
  error,
  id,
  children,
}: {
  label: string;
  requiredText?: string;
  optionalText?: string;
  error?: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id.replace(/-error$/, "")} className="mb-2 block text-base font-semibold text-slate-200">
        {label}
        <span className="ml-2 text-xs font-normal text-slate-500">{requiredText ?? optionalText}</span>
      </label>
      {children}
      {error && <FieldError id={id} message={error} />}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message: string }) {
  return <p id={id} className="mt-2 text-sm text-red-300">{message}</p>;
}

export default function EvidenceReviewForm() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <EvidenceReviewFormContent />
    </Suspense>
  );
}
