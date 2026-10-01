import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { POST } from "./route";

const URL = "http://localhost/api/h3-pilot/operator/invitations";

function request(headers: Record<string, string>, body: unknown = { participantReference: "P-1" }): Request {
  return new Request(URL, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("operator invitation route (V1_187A)", () => {
  const original = { ...process.env };

  beforeEach(() => {
    process.env.H3_PILOT_OPERATOR_SECRET = "operator-secret";
    delete process.env.H3_TALENT_PILOT_SERVICE_URL;
    delete process.env.H3_TALENT_PILOT_SERVICE_CREDENTIAL;
    delete process.env.H3_PILOT_INVITATION_SECRET;
  });

  afterEach(() => {
    process.env = { ...original };
  });

  it("2. missing operator auth is blocked (404)", async () => {
    const response = await POST(request({}) as never);
    expect(response.status).toBe(404);
  });

  it("1. wrong operator auth is blocked (404)", async () => {
    const response = await POST(request({ "x-h3-pilot-operator-secret": "nope" }) as never);
    expect(response.status).toBe(404);
  });

  it("fails closed when the H3 pilot is not configured even with valid operator auth", async () => {
    const response = await POST(request({ "x-h3-pilot-operator-secret": "operator-secret" }) as never);
    expect(response.status).toBe(503);
    const body = (await response.json()) as { ok: boolean; code: string };
    expect(body.ok).toBe(false);
    expect(body.code).toBe("H3_PILOT_NOT_CONFIGURED");
  });

  it("17. never echoes the operator secret", async () => {
    const response = await POST(request({ "x-h3-pilot-operator-secret": "operator-secret" }) as never);
    const text = await response.text();
    expect(text).not.toContain("operator-secret");
  });
});
