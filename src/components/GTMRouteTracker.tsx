'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, Suspense } from 'react';
import { pushGTMEvent } from '@/lib/analytics';
import { useLanguage } from '@/context/LanguageContext';

function RouteTrackerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { lang } = useLanguage();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    const queryString = searchParams?.toString();
    const currentPath = queryString ? `${pathname}?${queryString}` : pathname;

    // Avoid dispatching duplicate virtual_page_view for identical path
    if (lastTrackedPath.current === currentPath) {
      return;
    }

    lastTrackedPath.current = currentPath;

    pushGTMEvent('virtual_page_view', {
      page_path: currentPath,
      page_location: typeof window !== 'undefined' ? window.location.href : '',
      language: lang,
    });
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
