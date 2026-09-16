import { beforeEach, describe, expect, it, vi } from "vitest";

import type { EvidenceReviewSubmission } from "../database.types";
import { resetEvidenceReviewRateLimitForTests } from "./anti-abuse";
import {
  processEvidenceReviewSubmission,
  type SubmissionHandlerDependencies,
} from "./submission-handler";

const now = new Date("2026-09-14T12:00:10.000Z");
const validPayload = {
  full_name: "Synthetic Professional",
  email: "synthetic@example.test",
  country: "Argentina",
  current_role: "Software Engineer",
  evidence_type: "PRIVATE_PROFESSIONAL_EXPERIENCE",
  evidence_url: "",
  individual_contribution:
    "Implemented a synthetic service boundary for a unit-test scenario.",
  professional_context: "Synthetic context only.",
  opportunity_status: "REVIEW_ONLY",
  professional_intents: [],
  source: "direct",
  campaign: null,
  review_consent_accepted: true,
  language: "en",
  started_at: now.getTime() - 5_000,
  website: "",
};

const persistedSubmission = {
  id: "00000000-0000-0000-0000-000000000001",
} as EvidenceReviewSubmission;

function request(payload: unknown, address = "192.0.2.1") {
  return new Request("http://localhost/api/evidence-review/submissions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": address,
    },
    body: JSON.stringify(payload),
  });
}

function dependencies(
  overrides: Partial<SubmissionHandlerDependencies> = {},
): SubmissionHandlerDependencies {
  return {
    repository: {
      createSubmission: vi.fn().mockResolvedValue(persistedSubmission),
    },
    notify: vi.fn().mockResolvedValue("sent"),
    now: () => now,
    ...overrides,
  };
}

describe("POST /api/evidence-review/submissions", () => {
  beforeEach(() => resetEvidenceReviewRateLimitForTests());

  it("returns success only after durable repository persistence", async () => {
    const deps = dependencies();
    const response = await processEvidenceReviewSubmission(
      request(validPayload),
      deps,
    );

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ ok: true });
    expect(deps.repository.createSubmission).toHaveBeenCalledOnce();
    expect(deps.notify).toHaveBeenCalledOnce();
    expect(
      vi.mocked(deps.repository.createSubmission).mock.invocationCallOrder[0],
    ).toBeLessThan(vi.mocked(deps.notify).mock.invocationCallOrder[0]);
  });

  it("rejects validation failures before persistence", async () => {
    const deps = dependencies();
    const response = await processEvidenceReviewSubmission(
      request({ ...validPayload, email: "invalid" }),
      deps,
    );
    expect(response.status).toBe(400);
    expect(deps.repository.createSubmission).not.toHaveBeenCalled();
    expect(deps.notify).not.toHaveBeenCalled();
  });

  it("keeps durable success when the receipt email fails", async () => {
    const deps = dependencies({
      notify: vi.fn().mockRejectedValue(new Error("synthetic email failure")),
    });
    const response = await processEvidenceReviewSubmission(
      request(validPayload),
      deps,
    );
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ ok: true });
    expect(deps.repository.createSubmission).toHaveBeenCalledOnce();
  });

  it("returns the same neutral response for new and existing identities", async () => {
    const newIdentity = dependencies();
    const existingIdentity = dependencies();
    const first = await processEvidenceReviewSubmission(
      request(validPayload, "192.0.2.2"),
      newIdentity,
    );
    const second = await processEvidenceReviewSubmission(
      request(validPayload, "192.0.2.3"),
      existingIdentity,
    );
    expect(await first.json()).toEqual({ ok: true });
    expect(await second.json()).toEqual({ ok: true });
  });

  it("rejects the honeypot without touching persistence", async () => {
    const deps = dependencies();
    const response = await processEvidenceReviewSubmission(
      request({ ...validPayload, website: "https://bot.example" }),
      deps,
    );
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ ok: false });
    expect(deps.repository.createSubmission).not.toHaveBeenCalled();
  });
});
