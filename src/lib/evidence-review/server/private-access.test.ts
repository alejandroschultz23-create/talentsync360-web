import { describe, expect, it, vi } from "vitest";

import {
  exchangePrivateAccessToken,
  PRIVATE_ACCESS_COOKIE,
  PRIVATE_PROFILE_PATH,
  privateAccessCookieOptions,
} from "./private-access";
import { generateAccessToken } from "./tokens";
import type { PrivateProfileAccess } from "./repository";

function mockAccess(expiresInSeconds = 3600): PrivateProfileAccess {
  const expiresAt = new Date(Date.now() + expiresInSeconds * 1_000).toISOString();
  return {
    token: {
      id: "00000000-0000-4000-8000-000000000001",
      profile_id: "00000000-0000-4000-8000-000000000002",
      token_hash: "mockhash",
      expires_at: expiresAt,
      revoked_at: null,
      created_at: new Date().toISOString(),
      last_used_at: null,
    },
    profile: {
      id: "00000000-0000-4000-8000-000000000002",
      person_id: "00000000-0000-4000-8000-000000000003",
      submission_id: "00000000-0000-4000-8000-000000000004",
      review_version: 1,
      professional_intent_snapshot: {},
      evidence_context_snapshot: {},
      recommendations: [],
      supersedes_profile_id: null,
      reviewed_at: new Date().toISOString(),
      delivered_at: new Date().toISOString(),
      confirmed_at: null,
      correction_requested_at: null,
      correction_message: null,
      created_at: new Date().toISOString(),
    },
    submission: {
      id: "00000000-0000-4000-8000-000000000004",
      person_id: "00000000-0000-4000-8000-000000000003",
      opportunity_status: "OPEN",
      professional_intents: ["FREELANCE"],
      source: "direct",
      campaign: null,
      evidence_type: "PUBLIC_REPOSITORY",
      evidence_url: "https://github.com/example/repo",
      individual_contribution: "Core contributor",
      last_meaningful_activity_at: null,
      professional_context: "Enterprise app",
      review_state: "REVIEW_DELIVERED",
      coherence_status: "READY",
      coherence_details: {},
      reviewer_reference: "operator",
      coherence_reviewed_at: new Date().toISOString(),
      review_consent_version: "v1",
      review_consent_text: "consent",
      review_consent_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    person: {
      id: "00000000-0000-4000-8000-000000000003",
      full_name: "Test Professional",
      country: "Argentina",
      current_role: "Lead Engineer",
    },
    findings: [],
  };
}

describe("Private Access Token Exchange and Cookie Architecture", () => {
  const requestUrl = "https://www.talentsync360.com/talents/evidence-review/access/token";

  it("exchanges a valid token for an HttpOnly, Secure, SameSite=Strict cookie and 303 redirect", async () => {
    const rawToken = generateAccessToken();
    const access = mockAccess(7200);
    const resolvePrivateProfileAccess = vi.fn().mockResolvedValue(access);

    const response = await exchangePrivateAccessToken({
      token: rawToken,
      requestUrl,
      repository: { resolvePrivateProfileAccess },
    });

    expect(resolvePrivateProfileAccess).toHaveBeenCalledWith(
      rawToken,
      expect.any(Date),
      true,
    );
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "https://www.talentsync360.com/talents/evidence-review/profile",
    );
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("referrer-policy")).toBe("no-referrer");
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow, noarchive");

    const cookie = response.cookies.get(PRIVATE_ACCESS_COOKIE);
    expect(cookie).toBeDefined();
    expect(cookie?.value).toBe(rawToken);
    expect(cookie?.httpOnly).toBe(true);
    expect(cookie?.secure).toBe(true);
    expect(cookie?.sameSite).toBe("strict");
    expect(cookie?.path).toBe(PRIVATE_PROFILE_PATH);
    expect(cookie?.maxAge).toBeGreaterThan(0);
    expect(cookie?.maxAge).toBeLessThanOrEqual(7200);
  });

  it("redirects with 303 and clears cookie when token format is malformed", async () => {
    const resolvePrivateProfileAccess = vi.fn();
    const response = await exchangePrivateAccessToken({
      token: "short-token",
      requestUrl,
      repository: { resolvePrivateProfileAccess },
    });

    expect(resolvePrivateProfileAccess).not.toHaveBeenCalled();
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "https://www.talentsync360.com/talents/evidence-review/profile",
    );
    const cookie = response.cookies.get(PRIVATE_ACCESS_COOKIE);
    expect(cookie?.maxAge).toBe(0);
  });

  it("redirects with 303 and clears cookie when token is not found or unusable", async () => {
    const rawToken = generateAccessToken();
    const resolvePrivateProfileAccess = vi.fn().mockResolvedValue(null);

    const response = await exchangePrivateAccessToken({
      token: rawToken,
      requestUrl,
      repository: { resolvePrivateProfileAccess },
    });

    expect(resolvePrivateProfileAccess).toHaveBeenCalled();
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "https://www.talentsync360.com/talents/evidence-review/profile",
    );
    const cookie = response.cookies.get(PRIVATE_ACCESS_COOKIE);
    expect(cookie?.maxAge).toBe(0);
  });

  it("handles repository errors gracefully without throwing and clears cookie", async () => {
    const rawToken = generateAccessToken();
    const resolvePrivateProfileAccess = vi
      .fn()
      .mockRejectedValue(new Error("Database connection lost"));

    const response = await exchangePrivateAccessToken({
      token: rawToken,
      requestUrl,
      repository: { resolvePrivateProfileAccess },
    });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "https://www.talentsync360.com/talents/evidence-review/profile",
    );
  });

  it("ensures cookie options enforce strict security properties", () => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 3600 * 1000).toISOString();
    const options = privateAccessCookieOptions(expiresAt, now);

    expect(options.httpOnly).toBe(true);
    expect(options.secure).toBe(true);
    expect(options.sameSite).toBe("strict");
    expect(options.path).toBe("/talents/evidence-review/profile");
    expect(options.priority).toBe("high");
    expect(options.maxAge).toBe(3600);
  });

  it("ensures the redirect response renders no HTML body", async () => {
    const rawToken = generateAccessToken();
    const response = await exchangePrivateAccessToken({
      token: rawToken,
      requestUrl,
      repository: { resolvePrivateProfileAccess: vi.fn().mockResolvedValue(mockAccess()) },
    });

    const bodyText = await response.text();
    expect(bodyText).not.toContain("<html");
    expect(bodyText).not.toContain("<!DOCTYPE");
  });
});
