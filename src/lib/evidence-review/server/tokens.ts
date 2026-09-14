import "server-only";

import { createHash, randomBytes } from "node:crypto";

export const ACCESS_TOKEN_BYTES = 32;

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

export function isAccessTokenUsable(
  lifecycle: TokenLifecycle,
  now = new Date(),
): boolean {
  if (lifecycle.revokedAt !== null) {
    return false;
  }

  return new Date(lifecycle.expiresAt).getTime() > now.getTime();
}
