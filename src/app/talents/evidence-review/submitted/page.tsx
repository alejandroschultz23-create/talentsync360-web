import type { Metadata } from "next";

import type { PilotLanguage } from "@/lib/h3-pilot/participant/content";
import { getPilotSession } from "@/lib/h3-pilot/server/pilot-mode";

import EvidenceReviewSubmittedClient from "./EvidenceReviewSubmittedClient";
import PilotStatusPanel from "./PilotStatusPanel";

export const metadata: Metadata = {
  title: "Evidence Review Request Received",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EvidenceReviewSubmittedPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string | string[] }>;
}) {
  const session = await getPilotSession();
  if (session !== null) {
    const query = await searchParams;
    const language: PilotLanguage = query.lang === "en" ? "en" : "es";
    return <PilotStatusPanel language={language} />;
  }
  return <EvidenceReviewSubmittedClient />;
}
