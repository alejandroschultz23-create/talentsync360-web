import type { Metadata } from "next";

import type { PilotLanguage } from "@/lib/h3-pilot/participant/content";
import { getPilotSession } from "@/lib/h3-pilot/server/pilot-mode";

import EvidenceReviewForm from "./EvidenceReviewForm";
import PilotApplyForm from "./PilotApplyForm";

export const metadata: Metadata = {
  title: "Request a Professional Evidence Review",
  description: "Share one concrete professional experience for structured review.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EvidenceReviewApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string | string[] }>;
}) {
  const session = await getPilotSession();
  if (session !== null) {
    const query = await searchParams;
    const language: PilotLanguage = query.lang === "en" ? "en" : "es";
    return <PilotApplyForm language={language} />;
  }
  return <EvidenceReviewForm />;
}
