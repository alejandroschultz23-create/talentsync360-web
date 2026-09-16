import { describe, expect, it } from "vitest";

import { REVIEW_CONSENT_TEXT, REVIEW_CONSENT_VERSION } from "./consent";
import { validatePublicEvidenceReviewPayload } from "./public-submission";

const validPayload = {
  full_name: "Synthetic Professional",
  email: "synthetic@example.test",
  country: "Argentina",
  current_role: "Software Engineer",
  evidence_type: "PUBLIC_REPOSITORY",
  evidence_url: "https://example.test/repository",
  individual_contribution:
    "Implemented the service boundary and documented its technical tradeoffs.",
  professional_context: "Synthetic context for unit testing.",
  opportunity_status: "OPEN",
  professional_intents: ["FULL_TIME"],
  source: "referral",
  campaign: "pilot_2026",
  review_consent_accepted: true,
  language: "es",
};

describe("public Evidence Review request mapping", () => {
  it("uses a server-owned purpose-specific consent snapshot", () => {
    const now = new Date("2026-09-14T15:00:00.000Z");
    const result = validatePublicEvidenceReviewPayload(
      {
        ...validPayload,
        reviewConsentText: "untrusted override",
      },
      now,
    );
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.submission.reviewConsentVersion).toBe(
      REVIEW_CONSENT_VERSION,
    );
    expect(result.data.submission.reviewConsentText).toBe(REVIEW_CONSENT_TEXT.es);
    expect(result.data.submission.reviewConsentAt).toBe(now.toISOString());
  });

  it("rejects missing consent and contradictory intent", () => {
    expect(
      validatePublicEvidenceReviewPayload({
        ...validPayload,
        review_consent_accepted: false,
      }).success,
    ).toBe(false);
    expect(
      validatePublicEvidenceReviewPayload({
        ...validPayload,
        opportunity_status: "NOT_LOOKING",
      }).success,
    ).toBe(false);
  });
});
