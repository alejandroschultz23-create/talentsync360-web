import { beforeEach, describe, expect, it } from "vitest";

import {
  hasReasonableCompletionTime,
  hasTriggeredHoneypot,
  isRateLimited,
  MAX_EVIDENCE_REVIEW_BODY_BYTES,
  readLimitedJsonBody,
  resetEvidenceReviewRateLimitForTests,
} from "./anti-abuse";

describe("Evidence Review anti-abuse controls", () => {
  beforeEach(() => resetEvidenceReviewRateLimitForTests());

  it("rejects a populated honeypot and implausibly fast submission", () => {
    const now = new Date("2026-09-14T12:00:10.000Z");
    expect(hasTriggeredHoneypot({ website: "bot.example" })).toBe(true);
    expect(
      hasReasonableCompletionTime({ started_at: now.getTime() - 500 }, now),
    ).toBe(false);
    expect(
      hasReasonableCompletionTime({ started_at: now.getTime() - 5_000 }, now),
    ).toBe(true);
  });

  it("enforces the actual request body size", async () => {
    const request = new Request("http://localhost/api/evidence-review/submissions", {
      method: "POST",
      body: JSON.stringify({ value: "x".repeat(MAX_EVIDENCE_REVIEW_BODY_BYTES) }),
    });
    expect(await readLimitedJsonBody(request)).toEqual({
      success: false,
      reason: "body_too_large",
    });
  });

  it("applies a best-effort per-instance request limit", () => {
    const headers = new Headers({ "x-forwarded-for": "192.0.2.10" });
    const now = new Date("2026-09-14T12:00:00.000Z");
    for (let index = 0; index < 5; index += 1) {
      expect(isRateLimited(headers, now)).toBe(false);
    }
    expect(isRateLimited(headers, now)).toBe(true);
  });
});
