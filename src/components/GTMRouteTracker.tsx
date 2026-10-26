'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, Suspense } from 'react';
import { pushGTMEvent } from '@/lib/analytics';
import { getAnalyticsPageContext } from '@/lib/analytics-url';
import { useLanguage } from '@/context/LanguageContext';
import { isPrivateEvidenceReviewPath } from '@/lib/evidence-review/private-routes';

function RouteTrackerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { lang } = useLanguage();
  const lastTrackedPath = useRef<string | null>(null);
  const lastTrackedLocation = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || isPrivateEvidenceReviewPath(pathname)) return;

    const pageContext = getAnalyticsPageContext(lastTrackedLocation.current ?? undefined);
    if (!pageContext) return;

    const currentPath = pageContext.page_path;

    // Avoid dispatching duplicate virtual_page_view for identical path
    if (lastTrackedPath.current === currentPath) {
      return;
    }

    lastTrackedPath.current = currentPath;

    pushGTMEvent('virtual_page_view', {
      page_path: currentPath,
      page_location: pageContext.page_location,
      page_referrer: pageContext.page_referrer,
      language: lang,
    });
    lastTrackedLocation.current = pageContext.page_location;
  }, [pathname, searchParams, lang]);

  return null;
}

export default function GTMRouteTracker() {
  return (
    <Suspense fallback={null}>
      <RouteTrackerContent />
    </Suspense>
  );
}
