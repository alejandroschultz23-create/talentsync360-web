import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { POST } from "./route";

const URL = "http://localhost/api/h3-pilot/operator/invitations";
const AUTH_1 = "a1900000-0001-4000-8000-000000000001";

function request(headers: Record<string, string>, body: unknown): Request {
  return new Request(URL, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("operator invitation route — V1_191 authorization binding", () => {
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

  it("requires operator auth even with a valid binding (404)", async () => {
    const response = await POST(
      request({}, { ownerReference: "PROFESIONAL_A", pilotAuthorizationId: AUTH_1 }) as never,
    );
    expect(response.status).toBe(404);
  });

  it("rejects a one-sided authorization binding (400)", async () => {
    const response = await POST(
      request({ "x-h3-pilot-operator-secret": "operator-secret" }, { ownerReference: "PROFESIONAL_A" }) as never,
    );
    expect(response.status).toBe(400);
    const body = (await response.json()) as { code: string };
    expect(body.code).toBe("INVALID_AUTHORIZATION_BINDING");
  });

  it("accepts a complete binding shape and fails closed without H3 config (503)", async () => {
    const response = await POST(
      request(
        { "x-h3-pilot-operator-secret": "operator-secret" },
        { ownerReference: "PROFESIONAL_A", pilotAuthorizationId: AUTH_1 },
      ) as never,
    );
    expect(response.status).toBe(503);
    const body = (await response.json()) as { code: string };
    expect(body.code).toBe("H3_PILOT_NOT_CONFIGURED");
    expect(JSON.stringify(body)).not.toContain("operator-secret");
  });
});
