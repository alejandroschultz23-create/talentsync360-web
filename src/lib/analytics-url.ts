const CONTACT_PATH = "/contact";
const UTM_VALUE_PATTERN = /^[A-Za-z0-9._-]{1,100}$/;

export const CONTACT_INTENTS = [
  "free-trial",
  "pilot",
  "shortlist",
  "shortlist-sprint",
  "ongoing-partner",
  "partner-delivery",
  "demo",
  "validate-role",
] as const;

export const CONTACT_UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const CONTACT_INTENT_SET = new Set<string>(CONTACT_INTENTS);
const CONTACT_UTM_KEY_SET = new Set<string>(CONTACT_UTM_KEYS);
const TALENTSYNC_ORIGINS = new Set([
  "https://talentsync360.com",
  "https://www.talentsync360.com",
]);

export type AnalyticsPageContext = {
  page_path: string;
  page_location: string;
  page_referrer?: string;
};

function parseUrl(value: string, baseOrigin: string): URL | null {
  try {
    return new URL(value, baseOrigin);
  } catch {
    return null;
  }
}

function isContactPath(url: URL): boolean {
  return url.pathname === CONTACT_PATH;
}

function isInternalSiteUrl(url: URL, currentOrigin: string): boolean {
  return url.origin === currentOrigin || TALENTSYNC_ORIGINS.has(url.origin);
}

function hasAllowedContactParameters(url: URL): boolean {
  if (url.hash) return false;

  const counts = new Map<string, number>();
  for (const [key, value] of url.searchParams.entries()) {
    const count = (counts.get(key) ?? 0) + 1;
    counts.set(key, count);

    if (key === "intent") {
      if (count > 1 || !CONTACT_INTENT_SET.has(value)) return false;
      continue;
    }

    if (CONTACT_UTM_KEY_SET.has(key)) {
      if (count > 1 || !UTM_VALUE_PATTERN.test(value)) return false;
      continue;
    }

    return false;
  }

  return true;
}

/**
 * Returns a contact URL with intent removed and only approved UTMs retained.
 * Non-contact URLs retain their existing representation so this exception does
 * not widen query-parameter handling globally.
 */
export function sanitizeAnalyticsPage(
  value: string,
  baseOrigin = "https://local.invalid",
): string | null {
  const url = parseUrl(value, baseOrigin);
  if (!url) return null;
  if (!isContactPath(url)) return value;
  if (!hasAllowedContactParameters(url)) return null;

  const sanitized = new URL(url.origin + url.pathname);
  for (const key of CONTACT_UTM_KEYS) {
    const valueForKey = url.searchParams.get(key);
    if (valueForKey !== null) sanitized.searchParams.set(key, valueForKey);
  }

  const isAbsolute = /^[a-z][a-z\d+.-]*:/i.test(value);
  return isAbsolute ? sanitized.toString() : `${sanitized.pathname}${sanitized.search}`;
}

export function sanitizeAnalyticsReferrer(
  value: string | undefined,
  currentOrigin: string,
): string | undefined {
  if (!value) return undefined;
  const url = parseUrl(value, currentOrigin);
  if (!url) return undefined;

  if (isContactPath(url) && isInternalSiteUrl(url, currentOrigin)) {
    return sanitizeAnalyticsPage(value, currentOrigin) ?? undefined;
  }

  return value;
}

export function getAnalyticsPageContext(
  referrerOverride?: string,
): AnalyticsPageContext | null {
  if (typeof window === "undefined") return null;

  const currentOrigin = window.location.origin;
  const pageLocation = sanitizeAnalyticsPage(window.location.href, currentOrigin);
  if (!pageLocation) return null;

  const currentUrl = new URL(window.location.href);
  const pageReferrer = sanitizeAnalyticsReferrer(
    referrerOverride ?? document.referrer,
    currentOrigin,
  );

  return {
    page_path: `${currentUrl.pathname}${new URL(pageLocation, currentOrigin).search}`,
    page_location: pageLocation,
    ...(pageReferrer ? { page_referrer: pageReferrer } : {}),
  };
}
