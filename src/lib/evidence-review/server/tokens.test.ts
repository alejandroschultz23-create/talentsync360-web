import { Buffer } from "node:buffer";

import { describe, expect, it } from "vitest";

import {
  ACCESS_TOKEN_BYTES,
  generateAccessToken,
  hashAccessToken,
  isAccessTokenUsable,
} from "./tokens";

describe("private profile access tokens", () => {
  it("generates a 256-bit base64url token", () => {
    const token = generateAccessToken();
    expect(Buffer.from(token, "base64url")).toHaveLength(ACCESS_TOKEN_BYTES);
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("generates unique token values", () => {
    const tokens = new Set(Array.from({ length: 100 }, generateAccessToken));
    expect(tokens.size).toBe(100);
  });

  it("hashes deterministically with SHA-256", () => {
    expect(hashAccessToken("abc")).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
    expect(hashAccessToken("abc")).toBe(hashAccessToken("abc"));
  });

  it("creates different hashes for different tokens", () => {
    expect(hashAccessToken("first")).not.toBe(hashAccessToken("second"));
  });

  it("rejects expired and revoked tokens", () => {
    const now = new Date("2026-09-14T12:00:00.000Z");
    expect(
      isAccessTokenUsable(
        { expiresAt: "2026-09-14T12:01:00.000Z", revokedAt: null },
        now,
      ),
    ).toBe(true);
    expect(
      isAccessTokenUsable(
        { expiresAt: "2026-09-14T11:59:00.000Z", revokedAt: null },
        now,
      ),
    ).toBe(false);
    expect(
      isAccessTokenUsable(
        {
          expiresAt: "2026-09-14T12:01:00.000Z",
          revokedAt: "2026-09-14T11:00:00.000Z",
        },
        now,
      ),
    ).toBe(false);
  });
});
