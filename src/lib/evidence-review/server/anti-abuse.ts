import "server-only";

import { createHash } from "node:crypto";

export const MAX_EVIDENCE_REVIEW_BODY_BYTES = 20_000;
export const MIN_EVIDENCE_REVIEW_COMPLETION_MS = 3_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

type RateLimitEntry = { count: number; windowStartedAt: number };
const rateLimitEntries = new Map<string, RateLimitEntry>();

export type RequestBodyResult =
  | { success: true; data: unknown }
  | { success: false; reason: "body_too_large" | "invalid_json" };

export async function readLimitedJsonBody(
  request: Request,
): Promise<RequestBodyResult> {
  const declaredLength = Number(request.headers.get("content-length"));
  if (
    Number.isFinite(declaredLength) &&
    declaredLength > MAX_EVIDENCE_REVIEW_BODY_BYTES
  ) {
    return { success: false, reason: "body_too_large" };
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_EVIDENCE_REVIEW_BODY_BYTES) {
    return { success: false, reason: "body_too_large" };
  }

  try {
    return { success: true, data: JSON.parse(text) as unknown };
  } catch {
    return { success: false, reason: "invalid_json" };
  }
}

export function hasTriggeredHoneypot(input: unknown): boolean {
  if (!input || typeof input !== "object") return false;
  const value = (input as Record<string, unknown>).website;
  return typeof value === "string" && value.trim().length > 0;
}

export function hasReasonableCompletionTime(
  input: unknown,
  now = new Date(),
): boolean {
  if (!input || typeof input !== "object") return false;
  const startedAt = (input as Record<string, unknown>).started_at;
  if (typeof startedAt !== "number" || !Number.isFinite(startedAt)) {
    return false;
  }

  const elapsed = now.getTime() - startedAt;
  return elapsed >= MIN_EVIDENCE_REVIEW_COMPLETION_MS;
}

function requestFingerprint(headers: Headers): string | null {
  const forwarded =
    headers.get("x-vercel-forwarded-for") ??
    headers.get("x-forwarded-for") ??
    headers.get("cf-connecting-ip");
  const address = forwarded?.split(",")[0]?.trim();
  if (!address) return null;

  return createHash("sha256").update(address, "utf8").digest("hex");
}

/** Best-effort per-instance protection; no raw network address is retained. */
export function isRateLimited(headers: Headers, now = new Date()): boolean {
  const fingerprint = requestFingerprint(headers);
  if (!fingerprint) return false;

  const timestamp = now.getTime();
  const existing = rateLimitEntries.get(fingerprint);
  if (!existing || timestamp - existing.windowStartedAt >= RATE_LIMIT_WINDOW_MS) {
    rateLimitEntries.set(fingerprint, { count: 1, windowStartedAt: timestamp });
    return false;
  }

  existing.count += 1;
  return existing.count > RATE_LIMIT_MAX_REQUESTS;
}

export function resetEvidenceReviewRateLimitForTests(): void {
  rateLimitEntries.clear();
}
