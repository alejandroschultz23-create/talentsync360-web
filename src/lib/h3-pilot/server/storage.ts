import "server-only";

import { randomUUID } from "node:crypto";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Private CV storage for the H3 Preview pilot.
 *
 * - Private bucket only; server-side upload; no public/signed URLs emitted.
 * - Opaque object keys (no participant PII).
 * - Strict content-type allowlist and size limit.
 * - Product owns only the file bytes; H3 remains canonical governance truth.
 */
export const PILOT_FILE_BUCKET = "h3-pilot-evidence";
export const PILOT_LOCATOR_SCHEME = "product-storage";
export const MAX_PILOT_FILE_BYTES = 5 * 1024 * 1024;

/** Only formats the ingestion path can handle for the first pilot. */
export const ALLOWED_PILOT_CONTENT_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export interface PilotFileStorage {
  upload(key: string, bytes: Uint8Array, contentType: string): Promise<{ ok: boolean; code?: string }>;
  remove(key: string): Promise<{ ok: boolean; code?: string }>;
  exists(key: string): Promise<boolean>;
}

export type PilotFileValidation = { readonly ok: true } | { readonly ok: false; readonly code: string };

export function validatePilotFile(input: { contentType: string; byteLength: number }): PilotFileValidation {
  if (!(ALLOWED_PILOT_CONTENT_TYPES as readonly string[]).includes(input.contentType)) {
    return { ok: false, code: "UNSUPPORTED_FILE_TYPE" };
  }
  if (!Number.isInteger(input.byteLength) || input.byteLength <= 0) {
    return { ok: false, code: "EMPTY_FILE" };
  }
  if (input.byteLength > MAX_PILOT_FILE_BYTES) {
    return { ok: false, code: "FILE_TOO_LARGE" };
  }
  return { ok: true };
}

/** Opaque key: `pilot/<uuid>`. Contains no participant PII. */
export function createPilotFileKey(): string {
  return `pilot/${randomUUID()}`;
}

const OPAQUE_KEY = /^pilot\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PII_PATTERN = /@|\+[0-9]|(?:^|[^a-z])[a-z]{2,}\s[a-z]{2,}(?:$|[^a-z])/i;

export function isOpaquePilotFileKey(key: unknown): key is string {
  return typeof key === "string" && OPAQUE_KEY.test(key) && !PII_PATTERN.test(key);
}

export function buildPilotLocator(key: string): string {
  if (!isOpaquePilotFileKey(key)) throw new Error("INVALID_PILOT_FILE_KEY");
  return `${PILOT_LOCATOR_SCHEME}://${PILOT_FILE_BUCKET}/${key}`;
}

export function parsePilotLocator(locator: string): { bucket: string; key: string } | null {
  const prefix = `${PILOT_LOCATOR_SCHEME}://`;
  if (!locator.startsWith(prefix)) return null;
  const rest = locator.slice(prefix.length);
  const slash = rest.indexOf("/");
  if (slash <= 0) return null;
  const bucket = rest.slice(0, slash);
  const key = rest.slice(slash + 1);
  if (bucket !== PILOT_FILE_BUCKET || !isOpaquePilotFileKey(key)) return null;
  return { bucket, key };
}

export function createSupabasePilotFileStorage(
  client: SupabaseClient,
  bucket: string = PILOT_FILE_BUCKET,
): PilotFileStorage {
  return {
    async upload(key, bytes, contentType) {
      if (!isOpaquePilotFileKey(key)) return { ok: false, code: "INVALID_PILOT_FILE_KEY" };
      const { error } = await client.storage.from(bucket).upload(key, bytes, { contentType, upsert: false });
      return error === null ? { ok: true } : { ok: false, code: "UPLOAD_FAILED" };
    },
    async remove(key) {
      if (!isOpaquePilotFileKey(key)) return { ok: false, code: "INVALID_PILOT_FILE_KEY" };
      const { error } = await client.storage.from(bucket).remove([key]);
      return error === null ? { ok: true } : { ok: false, code: "DELETE_FAILED" };
    },
    async exists(key) {
      if (!isOpaquePilotFileKey(key)) return false;
      const name = key.split("/").slice(1).join("/");
      const { data, error } = await client.storage.from(bucket).list("pilot", { search: name });
      if (error !== null) return false;
      return Array.isArray(data) && data.length > 0;
    },
  };
}
