"use client";

import { Analytics } from "@vercel/analytics/react";
import { usePathname } from "next/navigation";

import {
  isPrivateEvidenceReviewPath,
  isPrivateEvidenceReviewUrl,
} from "@/lib/evidence-review/private-routes";

export default function VercelAnalytics() {
  const pathname = usePathname();
  if (isPrivateEvidenceReviewPath(pathname)) return null;

  return (
    <Analytics
      beforeSend={(event) =>
        isPrivateEvidenceReviewUrl(event.url) ? null : event
      }
    />
  );
}
