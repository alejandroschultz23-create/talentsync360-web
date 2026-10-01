import type { Metadata } from "next";

import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { pilotContent, type PilotLanguage } from "@/lib/h3-pilot/participant/content";
import { getPilotSession } from "@/lib/h3-pilot/server/pilot-mode";

import EvidenceReviewLandingClient from "./EvidenceReviewLandingClient";
import PilotLanding from "./PilotLanding";

export const metadata: Metadata = {
  title: "Professional Evidence Review for LATAM Technology Professionals",
  description:
    "Share one professional experience and receive a structured reading of the strengths, partial evidence and unknowns it can demonstrate.",
  alternates: {
    canonical: "https://www.talentsync360.com/talents/evidence-review",
  },
  openGraph: {
    title: "Professional Evidence Review | TalentSync360",
    description:
      "Show us something you built. Receive a structured reading of what your experience can genuinely demonstrate.",
    url: "https://www.talentsync360.com/talents/evidence-review",
  },
};

export const dynamic = "force-dynamic";

export default async function EvidenceReviewLandingPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string | string[] }>;
}) {
  const session = await getPilotSession();

  if (session !== null) {
    const query = await searchParams;
    const language: PilotLanguage = query.lang === "en" ? "en" : "es";
    return (
      <>
        <BreadcrumbSchema
          items={[
            { name: "Talents", item: "/talents" },
            { name: pilotContent[language].title, item: "/talents/evidence-review" },
          ]}
        />
        <PilotLanding language={language} />
      </>
    );
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Talents", item: "/talents" },
          { name: "Professional Evidence Review", item: "/talents/evidence-review" },
        ]}
      />
      <EvidenceReviewLandingClient />
    </>
  );
}
