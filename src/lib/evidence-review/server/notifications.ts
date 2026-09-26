import "server-only";

import { Resend } from "resend";

import type { EvidenceReviewLanguage } from "../consent";

export type EvidenceReviewNotificationStatus = "sent" | "skipped" | "failed";

export async function sendEvidenceReviewReceivedEmail(input: {
  email: string;
  language: EvidenceReviewLanguage;
}): Promise<EvidenceReviewNotificationStatus> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EVIDENCE_REVIEW_FROM_EMAIL;

  if (!apiKey || !from) {
    return "skipped";
  }

  const isSpanish = input.language === "es";
  const subject = isSpanish
    ? "Recibimos tu solicitud de Evidence Review"
    : "We received your Evidence Review request";
  const text = isSpanish
    ? "Recibimos tu solicitud. Primero verificaremos que tengamos suficiente contexto para realizar una revisión útil. Si necesitamos aclarar algo, te contactaremos."
    : "We received your request. We will first verify that we have enough context to perform a useful review. If anything needs clarification, we will contact you.";

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: input.email,
      subject,
      text,
    });
    return result.error ? "failed" : "sent";
  } catch {
    return "failed";
  }
}

export async function sendEvidenceProfileReadyEmail(input: {
  email: string;
  language: EvidenceReviewLanguage;
  accessUrl: string;
}): Promise<EvidenceReviewNotificationStatus> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EVIDENCE_REVIEW_FROM_EMAIL;

  if (!apiKey || !from) {
    return "skipped";
  }

  const isSpanish = input.language === "es";
  const subject = isSpanish
    ? "Tu Professional Evidence Profile está listo"
    : "Your Professional Evidence Profile is ready";
  const text = isSpanish
    ? `Tu Professional Evidence Profile privado está listo. Abrilo mediante este enlace seguro:\n\n${input.accessUrl}\n\nEl enlace es privado y tiene vencimiento. No lo reenvíes.`
    : `Your private Professional Evidence Profile is ready. Open it using this secure link:\n\n${input.accessUrl}\n\nThe link is private and expires. Do not forward it.`;

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: input.email,
      subject,
      text,
    });
    return result.error ? "failed" : "sent";
  } catch {
    return "failed";
  }
}
