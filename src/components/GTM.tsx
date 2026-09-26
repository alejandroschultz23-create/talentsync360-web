"use client";

import { GoogleTagManager } from '@next/third-parties/google';
import { usePathname } from 'next/navigation';

import { isPrivateEvidenceReviewPath } from '@/lib/evidence-review/private-routes';

export default function GTM() {
  const pathname = usePathname();
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-WSBC22RX';

  if (!gtmId || isPrivateEvidenceReviewPath(pathname)) return null;

  return <GoogleTagManager gtmId={gtmId} />;
}
