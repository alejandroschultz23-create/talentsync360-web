import { describe, expect, it, vi } from "vitest";

import {
  handlePrivateOptInAccept,
  handlePrivateOptInDecline,
  handlePrivateOptInOffer,
  readPrivateOptInState,
} from "./private-optin";

const validToken = "A".repeat(43);

function makeRequest(path: string, options: {
  origin?: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
} = {}) {
  const url = `https://talentsync360.com${path}`;
  const headers = new Headers({
    origin: options.origin ?? "https://talentsync360.com",
    ...(options.headers ?? {}),
  });
  return new Request(url, {
    method: options.method ?? "POST",
    headers,
    body: options.body,
  });
}

describe("handlePrivateOptInOffer", () => {
  it("keeps GET/page loading read-only across direct navigation and refresh", async () => {
    const resolvePrivateOptInAccess = vi.fn().mockResolvedValue({
      eligibility: "ELIGIBLE",
      optIn: null,
    });
    const repository = { resolvePrivateOptInAccess };

    await readPrivateOptInState({ token: validToken, repository });
    await readPrivateOptInState({ token: validToken, repository });

    expect(resolvePrivateOptInAccess).toHaveBeenCalledTimes(2);
    expect(resolvePrivateOptInAccess).toHaveBeenNthCalledWith(1, validToken);
    expect(resolvePrivateOptInAccess).toHaveBeenNthCalledWith(2, validToken);
    expect(Object.keys(repository)).toEqual(["resolvePrivateOptInAccess"]);
  });

  it("rejects cross-origin requests with 403", async () => {
    const req = makeRequest("/talents/evidence-review/profile/opt-in/offer", {
      origin: "https://evil.attacker.com",
    });
    const repo = { offerTalentOptIn: vi.fn() };
    const res = await handlePrivateOptInOffer({ request: req, token: validToken, repository: repo });
    expect(res.status).toBe(403);
    expect(repo.offerTalentOptIn).not.toHaveBeenCalled();
  });

  it("rejects invalid token format with 401", async () => {
    const req = makeRequest("/talents/evidence-review/profile/opt-in/offer");
    const repo = { offerTalentOptIn: vi.fn() };
    const res = await handlePrivateOptInOffer({ request: req, token: "bad-token", repository: repo });
    expect(res.status).toBe(401);
    expect(repo.offerTalentOptIn).not.toHaveBeenCalled();
  });

  it("offers talent opt-in and returns 303 redirect by default", async () => {
    const req = makeRequest("/talents/evidence-review/profile/opt-in/offer");
    const repo = { offerTalentOptIn: vi.fn().mockResolvedValue({ id: "opt-1", opt_in_status: "OFFERED" }) };
    const res = await handlePrivateOptInOffer({ request: req, token: validToken, repository: repo });
    expect(res.status).toBe(303);
    expect(res.headers.get("Location")).toBe("/talents/evidence-review/profile/opt-in");
    expect(repo.offerTalentOptIn).toHaveBeenCalledWith(validToken);
  });

  it("preserves an approved English UI language in the 303 redirect", async () => {
    const req = makeRequest(
      "/talents/evidence-review/profile/opt-in/offer?lang=en",
    );
    const repo = { offerTalentOptIn: vi.fn().mockResolvedValue({}) };
    const res = await handlePrivateOptInOffer({
      request: req,
      token: validToken,
      repository: repo,
    });

    expect(res.status).toBe(303);
    expect(res.headers.get("Location")).toBe(
      "/talents/evidence-review/profile/opt-in?lang=en",
    );
  });

  it("offers talent opt-in and returns JSON when requested via Accept header", async () => {
    const req = makeRequest("/talents/evidence-review/profile/opt-in/offer", {
      headers: { accept: "application/json" },
    });
    const repo = { offerTalentOptIn: vi.fn().mockResolvedValue({ id: "opt-1", opt_in_status: "OFFERED" }) };
    const res = await handlePrivateOptInOffer({ request: req, token: validToken, repository: repo });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({
      ok: true,
      redirect: "/talents/evidence-review/profile/opt-in",
    });
  });

  it("rejects invalid JSON body with 400", async () => {
    const req = makeRequest("/talents/evidence-review/profile/opt-in/offer", {
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ unexpectedField: 123 }),
    });
    const repo = { offerTalentOptIn: vi.fn() };
    const res = await handlePrivateOptInOffer({ request: req, token: validToken, repository: repo });
    expect(res.status).toBe(400);
    expect(repo.offerTalentOptIn).not.toHaveBeenCalled();
  });

  it("rejects non-empty non-JSON and oversized bodies", async () => {
    const repo = { offerTalentOptIn: vi.fn() };
    const nonJson = makeRequest(
      "/talents/evidence-review/profile/opt-in/offer",
      {
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: "profile_id=forbidden",
      },
    );
    const oversized = makeRequest(
      "/talents/evidence-review/profile/opt-in/offer",
      {
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ padding: "x".repeat(4_096) }),
      },
    );

    expect(
      (await handlePrivateOptInOffer({ request: nonJson, token: validToken, repository: repo })).status,
    ).toBe(400);
    expect(
      (await handlePrivateOptInOffer({ request: oversized, token: validToken, repository: repo })).status,
    ).toBe(400);
    expect(repo.offerTalentOptIn).not.toHaveBeenCalled();
  });
});

describe("handlePrivateOptInAccept", () => {
  it("rejects cross-origin requests with 403", async () => {
    const req = makeRequest("/talents/evidence-review/profile/opt-in/accept", {
      origin: "https://evil.attacker.com",
    });
    const repo = { acceptTalentOptIn: vi.fn() };
    const res = await handlePrivateOptInAccept({ request: req, token: validToken, repository: repo });
    expect(res.status).toBe(403);
  });

  it("requires affirmative consent = true", async () => {
    const req = makeRequest("/talents/evidence-review/profile/opt-in/accept", {
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ consent: false }),
    });
    const repo = { acceptTalentOptIn: vi.fn() };
    const res = await handlePrivateOptInAccept({ request: req, token: validToken, repository: repo });
    expect(res.status).toBe(400);
  });

  it("rejects client-provided consent text or version", async () => {
    const req = makeRequest("/talents/evidence-review/profile/opt-in/accept", {
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        consent: true,
        language: "es",
        network_consent_text: "client-controlled",
      }),
    });
    const repo = { acceptTalentOptIn: vi.fn() };
    const res = await handlePrivateOptInAccept({
      request: req,
      token: validToken,
      repository: repo,
    });

    expect(res.status).toBe(400);
    expect(repo.acceptTalentOptIn).not.toHaveBeenCalled();
  });

  it("accepts valid consent and transitions to ACCEPTED", async () => {
    const req = makeRequest("/talents/evidence-review/profile/opt-in/accept", {
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ consent: true, language: "es" }),
    });
    const repo = { acceptTalentOptIn: vi.fn().mockResolvedValue({ id: "opt-1", opt_in_status: "ACCEPTED" }) };
    const res = await handlePrivateOptInAccept({ request: req, token: validToken, repository: repo });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true });
    expect(repo.acceptTalentOptIn).toHaveBeenCalledWith(validToken, "es");
  });

  it("returns 409 when repository rejects (e.g. wrong review state or already terminal)", async () => {
    const req = makeRequest("/talents/evidence-review/profile/opt-in/accept", {
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ consent: true }),
    });
    const repo = { acceptTalentOptIn: vi.fn().mockRejectedValue(new Error("wrong state")) };
    const res = await handlePrivateOptInAccept({ request: req, token: validToken, repository: repo });
    expect(res.status).toBe(409);
  });
});

describe("handlePrivateOptInDecline", () => {
  it("rejects cross-origin requests with 403", async () => {
    const req = makeRequest("/talents/evidence-review/profile/opt-in/decline", {
      origin: "https://evil.attacker.com",
    });
    const repo = { declineTalentOptIn: vi.fn() };
    const res = await handlePrivateOptInDecline({ request: req, token: validToken, repository: repo });
    expect(res.status).toBe(403);
  });

  it("accepts decline and transitions to DECLINED", async () => {
    const req = makeRequest("/talents/evidence-review/profile/opt-in/decline", {
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    const repo = { declineTalentOptIn: vi.fn().mockResolvedValue({ id: "opt-1", opt_in_status: "DECLINED" }) };
    const res = await handlePrivateOptInDecline({ request: req, token: validToken, repository: repo });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true });
    expect(repo.declineTalentOptIn).toHaveBeenCalledWith(validToken);
  });

  it("rejects non-empty non-JSON decline bodies", async () => {
    const req = makeRequest(
      "/talents/evidence-review/profile/opt-in/decline",
      {
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: "profile_id=forbidden",
      },
    );
    const repo = { declineTalentOptIn: vi.fn() };
    const res = await handlePrivateOptInDecline({
      request: req,
      token: validToken,
      repository: repo,
    });

    expect(res.status).toBe(400);
    expect(repo.declineTalentOptIn).not.toHaveBeenCalled();
  });

  it("returns 409 when repository rejects (e.g. not confirmed)", async () => {
    const req = makeRequest("/talents/evidence-review/profile/opt-in/decline");
    const repo = { declineTalentOptIn: vi.fn().mockRejectedValue(new Error("not confirmed")) };
    const res = await handlePrivateOptInDecline({ request: req, token: validToken, repository: repo });
    expect(res.status).toBe(409);
  });
});
