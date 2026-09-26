import { describe, expect, it } from "vitest";

import { REVIEW_CONSENT_TEXT } from "./consent";
import { evidenceReviewContent } from "./content";

describe("Evidence Review bilingual content", () => {
  it("contains required Spanish and English acquisition strings", () => {
    expect(evidenceReviewContent.es.landing.title).toContain("Tu experiencia");
    expect(evidenceReviewContent.en.landing.title).toContain("Your experience");
    expect(evidenceReviewContent.es.submitted.title).toBe(
      "Recibimos tu evidencia.",
    );
    expect(evidenceReviewContent.en.submitted.title).toBe(
      "We received your evidence.",
    );
    expect(REVIEW_CONSENT_TEXT.es).toContain("Autorizo");
    expect(REVIEW_CONSENT_TEXT.en).toContain("I authorize");
  });

  it("keeps success and error messages localized", () => {
    expect(evidenceReviewContent.es.form.errors.submission).toContain(
      "No pudimos",
    );
    expect(evidenceReviewContent.en.form.errors.submission).toContain(
      "We could not",
    );
    expect(evidenceReviewContent.es.submitted.body).toContain("verificaremos");
    expect(evidenceReviewContent.en.submitted.body).toContain("verify");
  });

  it("does not introduce exclusivity positioning", () => {
    const serialized = JSON.stringify(evidenceReviewContent).toLowerCase();
    expect(serialized).not.toContain("gold list");
    expect(serialized).not.toContain("top 1%");
    expect(serialized).not.toContain("elite admission");
  });
});
