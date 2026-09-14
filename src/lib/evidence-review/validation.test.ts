import { describe, expect, it } from "vitest";

import { evidenceReviewSubmissionSchema } from "./validation";

const validInput = {
  fullName: "Synthetic Person",
  email: "synthetic@example.test",
  country: "Argentina",
  currentRole: "Software Engineer",
  evidenceType: "PUBLIC_REPOSITORY" as const,
  evidenceUrl: "https://example.test/evidence",
  individualContribution:
    "Implemented the API contract and documented the technical tradeoffs.",
  professionalContext: "Synthetic context for validation only.",
  opportunityStatus: "OPEN" as const,
  professionalIntents: ["FULL_TIME" as const],
  source: "referral",
  campaign: "pilot_2026",
  reviewConsentVersion: "v1",
  reviewConsentText:
    "I consent to TalentSync360 reviewing this submitted evidence.",
  reviewConsentAt: "2026-09-14T12:00:00.000Z",
};

describe("Evidence Review submission validation", () => {
  it("accepts all required fields", () => {
    expect(evidenceReviewSubmissionSchema.parse(validInput)).toMatchObject({
      email: "synthetic@example.test",
      source: "referral",
      campaign: "pilot_2026",
    });
  });

  it("rejects missing required fields and malformed email", () => {
    const missingName = { ...validInput, fullName: "" };
    const malformedEmail = { ...validInput, email: "not-an-email" };
    expect(evidenceReviewSubmissionSchema.safeParse(missingName).success).toBe(
      false,
    );
    expect(
      evidenceReviewSubmissionSchema.safeParse(malformedEmail).success,
    ).toBe(false);
  });

  it("allows an omitted evidence URL", () => {
    const withoutUrl: Record<string, unknown> = { ...validInput };
    delete withoutUrl.evidenceUrl;
    expect(evidenceReviewSubmissionSchema.safeParse(withoutUrl).success).toBe(
      true,
    );
  });

  it("allows private professional experience without a URL", () => {
    const input = {
      ...validInput,
      evidenceType: "PRIVATE_PROFESSIONAL_EXPERIENCE" as const,
      evidenceUrl: undefined,
    };
    expect(evidenceReviewSubmissionSchema.safeParse(input).success).toBe(true);
  });

  it("rejects non-http evidence URL protocols", () => {
    const input = { ...validInput, evidenceUrl: "file:///private/evidence" };
    expect(evidenceReviewSubmissionSchema.safeParse(input).success).toBe(false);
  });

  it("rejects contradictory opportunity status and work modes", () => {
    expect(
      evidenceReviewSubmissionSchema.safeParse({
        ...validInput,
        opportunityStatus: "NOT_LOOKING",
      }).success,
    ).toBe(false);
    expect(
      evidenceReviewSubmissionSchema.safeParse({
        ...validInput,
        professionalIntents: [],
      }).success,
    ).toBe(false);
  });

  it("rejects missing review consent", () => {
    const withoutConsent: Record<string, unknown> = { ...validInput };
    delete withoutConsent.reviewConsentText;
    expect(
      evidenceReviewSubmissionSchema.safeParse(withoutConsent).success,
    ).toBe(false);
  });
});
