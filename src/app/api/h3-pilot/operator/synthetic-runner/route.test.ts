import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { POST } from "./route";

const URL = "http://localhost/api/h3-pilot/operator/synthetic-runner";

function request(headers: Record<string, string>, body: unknown = { synthetic: true }): Request {
  return new Request(URL, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("synthetic runner route (V1_187F)", () => {
  const original = { ...process.env };

  beforeEach(() => {
    process.env.H3_PILOT_OPERATOR_SECRET = "operator-secret";
    delete process.env.H3_TALENT_PILOT_SERVICE_URL;
    delete process.env.H3_TALENT_PILOT_SERVICE_CREDENTIAL;
    delete process.env.H3_PILOT_INVITATION_SECRET;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SECRET_KEY;
  });

  afterEach(() => {
    process.env = { ...original };
  });

  it("1. missing operator auth is blocked (404)", async () => {
    const response = await POST(request({}) as never);
    expect(response.status).toBe(404);
  });

  it("2. wrong operator auth is blocked (404)", async () => {
    const response = await POST(request({ "x-h3-pilot-operator-secret": "nope" }) as never);
    expect(response.status).toBe(404);
  });

  it("4. requires the synthetic flag with valid operator auth", async () => {
    const response = await POST(
      request({ "x-h3-pilot-operator-secret": "operator-secret" }, { synthetic: false }) as never,
    );
    expect(response.status).toBe(400);
    const body = (await response.json()) as { code: string };
    expect(body.code).toBe("SYNTHETIC_FLAG_REQUIRED");
  });

  it("3. never echoes the operator secret and fails closed without config", async () => {
    const response = await POST(request({ "x-h3-pilot-operator-secret": "operator-secret" }) as never);
    const text = await response.text();
    expect(text).not.toContain("operator-secret");
    expect(text).not.toContain("tok-");
    const body = JSON.parse(text) as { ok: boolean; steps: Record<string, { status: string; code?: string }> };
    expect(body.ok).toBe(false);
    expect(body.steps.storage?.code).toBe("PILOT_STORAGE_NOT_CONFIGURED");
  });
});
