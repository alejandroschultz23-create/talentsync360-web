import type { Metadata } from "next";

import EvidenceReviewSubmittedClient from "./EvidenceReviewSubmittedClient";

export const metadata: Metadata = {
  title: "Evidence Review Request Received",
  robots: { index: false, follow: false },
};

export default function EvidenceReviewSubmittedPage() {
  return <EvidenceReviewSubmittedClient />;
}
