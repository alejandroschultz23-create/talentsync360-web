export const EVIDENCE_REVIEW_PATH = "/talents/evidence-review";

const LEGACY_CONTACT_TYPES = new Set([
  "b2b",
  "general",
  "white-label",
  "runway",
]);

export function getContactRedirect(tipo: string | undefined) {
  return tipo === "talent" ? EVIDENCE_REVIEW_PATH : null;
}

export function isAllowedLegacyContactType(
  contactType: unknown,
): contactType is "b2b" | "general" | "white-label" | "runway" {
  return typeof contactType === "string" && LEGACY_CONTACT_TYPES.has(contactType);
}
