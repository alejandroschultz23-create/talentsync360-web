import { describe, expect, it } from "vitest";

import { sanitizeEvidenceReviewAnalyticsParams } from "@/lib/analytics";

describe("Evidence Review analytics privacy", () => {
  it("allows only normalized source, campaign and language", () => {
    const result = sanitizeEvidenceReviewAnalyticsParams({
      source: "LinkedIn_Organic",
      campaign: "Pilot_2026",
      language: "es",
      name: "Sensitive Name",
      email: "sensitive@example.test",
      country: "Argentina",
      role: "Engineer",
      evidence_url: "https://example.test/private",
      contribution: "Sensitive professional evidence",
      consent_text: "Sensitive consent snapshot",
    } as unknown as Parameters<
      typeof sanitizeEvidenceReviewAnalyticsParams
    >[0]);

    expect(result).toEqual({
      source: "linkedin_organic",
      campaign: "pilot_2026",
      language: "es",
    });
  });
});
