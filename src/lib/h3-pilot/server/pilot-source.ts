import { randomUUID } from "node:crypto";

/**
 * H3 pilot locator contract (owner decision V1_187A).
 *
 * Two DISTINCT concepts, never conflated:
 *   1. Authorized source identity (goes to H3 `sourceLocator` / EvidenceArtifact.source):
 *        participant-upload://<source-type-slug>/<opaque-source-id>
 *   2. Product private storage location (goes to EvidenceArtifact.contentReference):
 *        product-storage://h3-pilot-evidence/<opaque-object-id>
 *
 * Both are opaque, carry no PII, and are never public/signed URLs or secrets.
 * Product storage location is NEVER treated as source-authorization truth.
 */
export const PRODUCT_PILOT_SOURCE_TYPES = ["CV", "COVER_LETTER"] as const;
export type ProductPilotSourceType = (typeof PRODUCT_PILOT_SOURCE_TYPES)[number];

export const SOURCE_LOCATOR_SCHEME = "participant-upload";
export const CONTENT_REFERENCE_SCHEME = "product-storage://h3-pilot-evidence";

const SOURCE_TYPE_SLUG: Record<ProductPilotSourceType, string> = {
  CV: "cv",
  COVER_LETTER: "cover-letter",
};
const SLUG_SOURCE_TYPE: Record<string, ProductPilotSourceType> = {
  cv: "CV",
  "cover-letter": "COVER_LETTER",
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const STORAGE_OBJECT_ID = /^(?:pilot\/)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PII_PATTERN = /@|\+[0-9]|(?:^|[^a-z])[a-z]{2,}\s[a-z]{2,}(?:$|[^a-z])/i;

export function isProductPilotSourceType(value: unknown): value is ProductPilotSourceType {
  return typeof value === "string" && (PRODUCT_PILOT_SOURCE_TYPES as readonly string[]).includes(value);
}

/** Opaque random source id (UUID). No PII. */
export function createOpaqueSourceId(): string {
  return randomUUID();
}

export function isOpaqueSourceId(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value) && !PII_PATTERN.test(value);
}

/** `participant-upload://<source-type-slug>/<opaque-source-id>` */
export function buildSourceLocator(sourceType: ProductPilotSourceType, opaqueSourceId: string): string {
  if (!isProductPilotSourceType(sourceType)) throw new Error("INVALID_SOURCE_TYPE");
  if (!isOpaqueSourceId(opaqueSourceId)) throw new Error("INVALID_SOURCE_ID");
  return `${SOURCE_LOCATOR_SCHEME}://${SOURCE_TYPE_SLUG[sourceType]}/${opaqueSourceId}`;
}

export function parseSourceLocator(locator: string): { sourceType: ProductPilotSourceType; opaqueSourceId: string } | null {
  const prefix = `${SOURCE_LOCATOR_SCHEME}://`;
  if (!locator.startsWith(prefix)) return null;
  const rest = locator.slice(prefix.length);
  const slash = rest.indexOf("/");
  if (slash <= 0) return null;
  const sourceType = SLUG_SOURCE_TYPE[rest.slice(0, slash)];
  const opaqueSourceId = rest.slice(slash + 1);
  if (sourceType === undefined || !isOpaqueSourceId(opaqueSourceId)) return null;
  return { sourceType, opaqueSourceId };
}

/** `product-storage://h3-pilot-evidence/<opaque-object-id>` */
export function buildContentReference(opaqueObjectId: string): string {
  if (typeof opaqueObjectId !== "string" || !STORAGE_OBJECT_ID.test(opaqueObjectId) || PII_PATTERN.test(opaqueObjectId)) {
    throw new Error("INVALID_STORAGE_OBJECT_ID");
  }
  return `${CONTENT_REFERENCE_SCHEME}/${opaqueObjectId}`;
}

export function isContentReference(value: unknown): value is string {
  if (typeof value !== "string" || !value.startsWith(`${CONTENT_REFERENCE_SCHEME}/`)) return false;
  const objectId = value.slice(CONTENT_REFERENCE_SCHEME.length + 1);
  return STORAGE_OBJECT_ID.test(objectId) && !PII_PATTERN.test(objectId);
}

export function containsPii(value: string): boolean {
  return PII_PATTERN.test(value);
}
