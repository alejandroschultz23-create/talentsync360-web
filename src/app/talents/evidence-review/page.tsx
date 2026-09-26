import type { Metadata } from "next";

import BreadcrumbSchema from "@/components/BreadcrumbSchema";

import EvidenceReviewLandingClient from "./EvidenceReviewLandingClient";

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

export default function EvidenceReviewLandingPage() {
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
