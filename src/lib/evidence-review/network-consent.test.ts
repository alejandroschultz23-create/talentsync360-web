import { describe, expect, it } from "vitest";

import {
  assertNetworkConsentValid,
  getNetworkOptInBoundaryStatement,
  getNetworkOptInConsentText,
  NETWORK_OPT_IN_BOUNDARY_STATEMENT,
  NETWORK_OPT_IN_CONSENT_TEXT,
  NETWORK_OPT_IN_CONSENT_VERSION,
} from "./network-consent";
import { optInContent } from "./opt-in-content";

describe("network consent", () => {
  it("provides versioned consent constants adhering to database constraints", () => {
    expect(NETWORK_OPT_IN_CONSENT_VERSION).toBe(
      "talent-network-opt-in-v1-2026-09-15",
    );
    expect(NETWORK_OPT_IN_CONSENT_VERSION.length).toBeGreaterThanOrEqual(1);
    expect(NETWORK_OPT_IN_CONSENT_VERSION.length).toBeLessThanOrEqual(64);

    for (const lang of ["es", "en"] as const) {
      const text = getNetworkOptInConsentText(lang);
      expect(text).toBe(NETWORK_OPT_IN_CONSENT_TEXT[lang]);
      expect(text.trim().length).toBeGreaterThanOrEqual(20);
      expect(text.trim().length).toBeLessThanOrEqual(4000);

      const boundary = getNetworkOptInBoundaryStatement(lang);
      expect(boundary).toBe(NETWORK_OPT_IN_BOUNDARY_STATEMENT[lang]);
      expect(boundary.length).toBeGreaterThan(0);
    }
  });

  it("keeps the official consent snapshot server-owned in both languages", () => {
    expect(NETWORK_OPT_IN_CONSENT_TEXT.es).toBe(
      "Quiero incorporarme a la red de talento de TalentSync360 y autorizo a TalentSync360 a conservar mi perfil confirmado para gestionar mi participación en la red y contactarme sobre oportunidades potencialmente relevantes.",
    );
    expect(NETWORK_OPT_IN_CONSENT_TEXT.en).toBe(
      "I want to join the TalentSync360 Talent Network and authorize TalentSync360 to retain my confirmed profile to manage my network participation and contact me regarding potentially relevant opportunities.",
    );
  });

  it("validates version and text length bounds strictly", () => {
    expect(() =>
      assertNetworkConsentValid("v1", "This is valid text that exceeds twenty characters."),
    ).not.toThrow();

    expect(() =>
      assertNetworkConsentValid("", "This is valid text that exceeds twenty characters."),
    ).toThrow("between 1 and 64 characters");

    expect(() =>
      assertNetworkConsentValid("v1", "Too short"),
    ).toThrow("between 20 and 4000 characters");
  });

  it("ensures boundary statement clearly denies employer presentation authorization", () => {
    expect(NETWORK_OPT_IN_BOUNDARY_STATEMENT.es).toContain(
      "Esta autorización no permite presentar ni compartir tu perfil",
    );
    expect(NETWORK_OPT_IN_BOUNDARY_STATEMENT.en).toContain(
      "This authorization does not permit presenting or sharing your profile",
    );
  });

  it("provides complete, pressure-free Spanish and English decision copy", () => {
    expect(optInContent.es.yesButton).toBe(
      "Sí, quiero incorporarme a TalentSync360.",
    );
    expect(optInContent.es.noButton).toBe(
      "Por ahora no. Solo quería recibir la revisión.",
    );
    expect(optInContent.en.yesButton).toBe(
      "Yes, I want to join TalentSync360.",
    );
    expect(optInContent.en.noButton).toBe(
      "Not for now. I only wanted the review.",
    );

    for (const language of ["es", "en"] as const) {
      const content = optInContent[language];
      expect(content.consentText).toBe(NETWORK_OPT_IN_CONSENT_TEXT[language]);
      expect(content.boundaryStatement).toBe(
        NETWORK_OPT_IN_BOUNDARY_STATEMENT[language],
      );
      expect(content.whatItDoesNotMeanPoints).toHaveLength(4);
      expect(Object.values(content).every((value) => value.length > 0)).toBe(
        true,
      );
    }
  });
});
