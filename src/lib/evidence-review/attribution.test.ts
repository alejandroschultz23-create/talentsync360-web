import { describe, expect, it } from "vitest";

import {
  buildEvidenceReviewApplyHref,
  normalizeAttributionSource,
  normalizeCampaign,
  normalizeEvidenceReviewAttribution,
} from "./attribution";

describe("source attribution", () => {
  it("preserves a valid source after safe normalization", () => {
    expect(normalizeAttributionSource(" LinkedIn_Organic ")).toBe(
      "linkedin_organic",
    );
  });

  it("normalizes invalid or absent sources to direct", () => {
    expect(normalizeAttributionSource("untrusted-source")).toBe("direct");
    expect(normalizeAttributionSource(undefined)).toBe("direct");
  });

  it("normalizes safe campaigns and discards invalid campaigns", () => {
    expect(normalizeCampaign(" Launch_2026 ")).toBe("launch_2026");
    expect(normalizeCampaign("has spaces")).toBeNull();
    expect(normalizeCampaign("x".repeat(65))).toBeNull();
  });

  it("preserves normalized source query parameters when navigating to apply", () => {
    const attribution = normalizeEvidenceReviewAttribution({
      source: "linkedin_organic",
      campaign: "Launch_2026",
    });
    expect(buildEvidenceReviewApplyHref(attribution)).toBe(
      "/talents/evidence-review/apply?source=linkedin_organic&campaign=launch_2026",
    );
  });
});
