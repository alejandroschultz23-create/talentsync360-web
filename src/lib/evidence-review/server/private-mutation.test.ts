import { describe, expect, it, vi } from "vitest";

import { handlePrivateProfileMutation } from "./private-access";
import { generateAccessToken } from "./tokens";

function createMockRequest(options: {
  url?: string;
  origin?: string;
  body?: unknown;
  contentType?: string;
}): Request {
  const url = options.url ?? "https://www.talentsync360.com/talents/evidence-review/profile/confirm";
  const origin = options.origin ?? "https://www.talentsync360.com";
  const contentType = options.contentType ?? "application/json";
  const bodyText = typeof options.body === "string" ? options.body : JSON.stringify(options.body ?? {});

  return new Request(url, {
    method: "POST",
    headers: {
      origin,
      "content-type": contentType,
      "content-length": String(Buffer.byteLength(bodyText, "utf8")),
    },
    body: bodyText,
  });
}

describe("Private Profile Mutation Handlers (Confirm and Correction)", () => {
  const validToken = generateAccessToken();

  describe("Confirm Mutation", () => {
    it("confirms profile successfully for valid token and same-origin request", async () => {
      const confirmPrivateProfile = vi.fn().mockResolvedValue({});
      const request = createMockRequest({ body: {} });

      const response = await handlePrivateProfileMutation({
        request,
        token: validToken,
        action: "confirm",
        repository: { confirmPrivateProfile, requestPrivateProfileCorrection: vi.fn() },
      });

      expect(confirmPrivateProfile).toHaveBeenCalledWith(validToken);
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toEqual({ ok: true });
      expect(response.headers.get("cache-control")).toBe("private, no-store");
      expect(response.headers.get("referrer-policy")).toBe("no-referrer");
      expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow, noarchive");
    });

    it("rejects cross-origin requests with 403", async () => {
      const confirmPrivateProfile = vi.fn();
      const request = createMockRequest({
        origin: "https://attacker.example.com",
        body: {},
      });

      const response = await handlePrivateProfileMutation({
        request,
        token: validToken,
        action: "confirm",
        repository: { confirmPrivateProfile, requestPrivateProfileCorrection: vi.fn() },
      });

      expect(confirmPrivateProfile).not.toHaveBeenCalled();
      expect(response.status).toBe(403);
      const json = await response.json();
      expect(json.ok).toBe(false);
    });

    it("rejects invalid or missing cookie token with 401", async () => {
      const confirmPrivateProfile = vi.fn();
      const request = createMockRequest({ body: {} });

      const response = await handlePrivateProfileMutation({
        request,
        token: "invalid-token",
        action: "confirm",
        repository: { confirmPrivateProfile, requestPrivateProfileCorrection: vi.fn() },
      });

      expect(confirmPrivateProfile).not.toHaveBeenCalled();
      expect(response.status).toBe(401);
    });

    it("rejects requests exceeding 4,096 bytes body limit with 400", async () => {
      const confirmPrivateProfile = vi.fn();
      const hugeObject = { pad: "x".repeat(5_000) };
      const request = createMockRequest({ body: hugeObject });

      const response = await handlePrivateProfileMutation({
        request,
        token: validToken,
        action: "confirm",
        repository: { confirmPrivateProfile, requestPrivateProfileCorrection: vi.fn() },
      });

      expect(confirmPrivateProfile).not.toHaveBeenCalled();
      expect(response.status).toBe(400);
    });

    it("rejects unexpected fields in confirm body with 400 (strict schema)", async () => {
      const confirmPrivateProfile = vi.fn();
      const request = createMockRequest({ body: { unexpected: "field" } });

      const response = await handlePrivateProfileMutation({
        request,
        token: validToken,
        action: "confirm",
        repository: { confirmPrivateProfile, requestPrivateProfileCorrection: vi.fn() },
      });

      expect(confirmPrivateProfile).not.toHaveBeenCalled();
      expect(response.status).toBe(400);
    });

    it("returns 409 generic error when repository throws (e.g. wrong review state)", async () => {
      const confirmPrivateProfile = vi.fn().mockRejectedValue(new Error("State conflict"));
      const request = createMockRequest({ body: {} });

      const response = await handlePrivateProfileMutation({
        request,
        token: validToken,
        action: "confirm",
        repository: { confirmPrivateProfile, requestPrivateProfileCorrection: vi.fn() },
      });

      expect(response.status).toBe(409);
      const json = await response.json();
      expect(json.error).toBe("Unable to complete request");
    });
  });

  describe("Correction Mutation", () => {
    const correctionUrl = "https://www.talentsync360.com/talents/evidence-review/profile/correction";

    it("requests correction successfully with valid message", async () => {
      const requestPrivateProfileCorrection = vi.fn().mockResolvedValue({});
      const request = createMockRequest({
        url: correctionUrl,
        body: { correction_message: "Please adjust the cloud depth finding to reflect my recent GCP certification." },
      });

      const response = await handlePrivateProfileMutation({
        request,
        token: validToken,
        action: "correction",
        repository: { confirmPrivateProfile: vi.fn(), requestPrivateProfileCorrection },
      });

      expect(requestPrivateProfileCorrection).toHaveBeenCalledWith(
        validToken,
        "Please adjust the cloud depth finding to reflect my recent GCP certification.",
      );
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.ok).toBe(true);
    });

    it("rejects empty correction message with 400", async () => {
      const requestPrivateProfileCorrection = vi.fn();
      const request = createMockRequest({
        url: correctionUrl,
        body: { correction_message: "" },
      });

      const response = await handlePrivateProfileMutation({
        request,
        token: validToken,
        action: "correction",
        repository: { confirmPrivateProfile: vi.fn(), requestPrivateProfileCorrection },
      });

      expect(requestPrivateProfileCorrection).not.toHaveBeenCalled();
      expect(response.status).toBe(400);
    });

    it("rejects whitespace-only correction message with 400", async () => {
      const requestPrivateProfileCorrection = vi.fn();
      const request = createMockRequest({
        url: correctionUrl,
        body: { correction_message: "   \n\t  " },
      });

      const response = await handlePrivateProfileMutation({
        request,
        token: validToken,
        action: "correction",
        repository: { confirmPrivateProfile: vi.fn(), requestPrivateProfileCorrection },
      });

      expect(requestPrivateProfileCorrection).not.toHaveBeenCalled();
      expect(response.status).toBe(400);
    });

    it("rejects correction message exceeding 2,000 characters with 400", async () => {
      const requestPrivateProfileCorrection = vi.fn();
      const request = createMockRequest({
        url: correctionUrl,
        body: { correction_message: "a".repeat(2_001) },
      });

      const response = await handlePrivateProfileMutation({
        request,
        token: validToken,
        action: "correction",
        repository: { confirmPrivateProfile: vi.fn(), requestPrivateProfileCorrection },
      });

      expect(requestPrivateProfileCorrection).not.toHaveBeenCalled();
      expect(response.status).toBe(400);
    });
  });
});
