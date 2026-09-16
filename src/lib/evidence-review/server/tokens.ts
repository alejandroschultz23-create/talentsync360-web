import "server-only";

import { createHash, randomBytes } from "node:crypto";

export const ACCESS_TOKEN_BYTES = 32;
export const ACCESS_TOKEN_CHARACTERS = 43;
const ACCESS_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export type TokenLifecycle = {
  expiresAt: string | Date;
  revokedAt: string | Date | null;
};

export function generateAccessToken(): string {
  return randomBytes(ACCESS_TOKEN_BYTES).toString("base64url");
}

export function hashAccessToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function isValidAccessTokenFormat(token: unknown): token is string {
  if (typeof token !== "string" || !ACCESS_TOKEN_PATTERN.test(token)) {
    return false;
  }

  return Buffer.from(token, "base64url").byteLength === ACCESS_TOKEN_BYTES;
}

export function buildPrivateAccessUrl(baseUrl: string, token: string): string {
  if (!isValidAccessTokenFormat(token)) {
    throw new Error("Access token format is invalid");
  }

  const url = new URL(baseUrl);
  url.pathname = `/talents/evidence-review/access/${encodeURIComponent(token)}`;
  url.search = "";
  url.hash = "";
  return url.toString();
}

export function isAccessTokenUsable(
  lifecycle: TokenLifecycle,
  now = new Date(),
): boolean {
  if (lifecycle.revokedAt !== null) {
    return false;
  }

  return new Date(lifecycle.expiresAt).getTime() > now.getTime();
}
