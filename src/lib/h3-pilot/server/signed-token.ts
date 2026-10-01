import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Minimal signed-token helper (HMAC-SHA256, base64url). Used for private pilot
 * invitation tokens and the server-side pilot session cookie. Pure, no I/O.
 *
 * The secret is never logged or returned. Comparison is timing-safe.
 */
export function signJson(payload: unknown, secret: string): string {
  const payloadB64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = createHmac("sha256", secret).update(payloadB64).digest("base64url");
  return `${payloadB64}.${signature}`;
}

export function verifyJson(token: unknown, secret: string): unknown | null {
  if (typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, signature] = parts;
  if (typeof payloadB64 !== "string" || typeof signature !== "string" || payloadB64.length === 0) {
    return null;
  }
  const expected = createHmac("sha256", secret).update(payloadB64).digest("base64url");
  const providedBytes = Buffer.from(signature);
  const expectedBytes = Buffer.from(expected);
  if (providedBytes.length !== expectedBytes.length) return null;
  if (!timingSafeEqual(providedBytes, expectedBytes)) return null;
  try {
    return JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as unknown;
  } catch {
    return null;
  }
}
