import type { Metadata } from "next";

import EvidenceReviewForm from "./EvidenceReviewForm";

export const metadata: Metadata = {
  title: "Request a Professional Evidence Review",
  description: "Share one concrete professional experience for structured review.",
  robots: { index: false, follow: false },
};

export default function EvidenceReviewApplyPage() {
  return <EvidenceReviewForm />;
}
