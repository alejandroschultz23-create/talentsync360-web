import type { EvidenceReviewLanguage } from "./consent";

export const NETWORK_OPT_IN_CONSENT_VERSION =
  "talent-network-opt-in-v1-2026-09-15" as const;

export const NETWORK_OPT_IN_CONSENT_TEXT: Record<
  EvidenceReviewLanguage,
  string
> = {
  es: "Quiero incorporarme a la red de talento de TalentSync360 y autorizo a TalentSync360 a conservar mi perfil confirmado para gestionar mi participación en la red y contactarme sobre oportunidades potencialmente relevantes.",
  en: "I want to join the TalentSync360 Talent Network and authorize TalentSync360 to retain my confirmed profile to manage my network participation and contact me regarding potentially relevant opportunities.",
};

export const NETWORK_OPT_IN_BOUNDARY_STATEMENT: Record<
  EvidenceReviewLanguage,
  string
> = {
  es: "Esta autorización no permite presentar ni compartir tu perfil con una empresa sin la autorización correspondiente.",
  en: "This authorization does not permit presenting or sharing your profile with a company without the corresponding authorization.",
};

export function getNetworkOptInConsentText(
  language: EvidenceReviewLanguage = "es",
): string {
  const text = NETWORK_OPT_IN_CONSENT_TEXT[language] ?? NETWORK_OPT_IN_CONSENT_TEXT.es;
  assertNetworkConsentValid(NETWORK_OPT_IN_CONSENT_VERSION, text);
  return text;
}

export function getNetworkOptInBoundaryStatement(
  language: EvidenceReviewLanguage = "es",
): string {
  return (
    NETWORK_OPT_IN_BOUNDARY_STATEMENT[language] ??
    NETWORK_OPT_IN_BOUNDARY_STATEMENT.es
  );
}

export function assertNetworkConsentValid(
  version: string,
  text: string,
): void {
  const trimmedVersion = version.trim();
  if (trimmedVersion.length < 1 || trimmedVersion.length > 64) {
    throw new Error(
      `Network consent version length must be between 1 and 64 characters (got ${trimmedVersion.length})`,
    );
  }

  const trimmedText = text.trim();
  if (trimmedText.length < 20 || trimmedText.length > 4000) {
    throw new Error(
      `Network consent text length must be between 20 and 4000 characters (got ${trimmedText.length})`,
    );
  }
}
