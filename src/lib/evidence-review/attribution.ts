import {
  ATTRIBUTION_SOURCES,
  type AttributionSource,
} from "./domain";

const sourceSet = new Set<string>(ATTRIBUTION_SOURCES);
const campaignPattern = /^[a-z0-9][a-z0-9_-]{0,63}$/;

export function normalizeAttributionSource(
  value: unknown,
): AttributionSource {
  if (typeof value !== "string") {
    return "direct";
  }

  const normalized = value.trim().toLowerCase();
  return sourceSet.has(normalized)
    ? (normalized as AttributionSource)
    : "direct";
}

/**
 * Campaigns are trimmed and lowercased. Values outside the bounded safe
 * [a-z0-9_-] format are discarded instead of being stored verbatim.
 */
export function normalizeCampaign(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return campaignPattern.test(normalized) ? normalized : null;
}
