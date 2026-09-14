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
