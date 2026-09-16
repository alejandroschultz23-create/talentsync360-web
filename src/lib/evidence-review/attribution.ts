import {
  ATTRIBUTION_SOURCES,
  type AttributionSource,
} from "./domain";

const sourceSet = new Set<string>(ATTRIBUTION_SOURCES);
const campaignPattern = /^[a-z0-9][a-z0-9_-]{0,63}$/;

export const EVIDENCE_REVIEW_ATTRIBUTION_STORAGE_KEY =
  "ts360-evidence-review-attribution";

export type EvidenceReviewAttribution = {
  source: AttributionSource;
  campaign: string | null;
};

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

export function normalizeEvidenceReviewAttribution(input: {
  source?: unknown;
  campaign?: unknown;
}): EvidenceReviewAttribution {
  return {
    source: normalizeAttributionSource(input.source),
    campaign: normalizeCampaign(input.campaign),
  };
}

export function buildEvidenceReviewApplyHref(
  attribution: EvidenceReviewAttribution,
): string {
  const parameters = new URLSearchParams({ source: attribution.source });
  if (attribution.campaign) {
    parameters.set("campaign", attribution.campaign);
  }

  return `/talents/evidence-review/apply?${parameters.toString()}`;
}
