import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";

import { callH3Pilot, H3_PILOT_OPERATIONS, type PilotTransport } from "./client";
import type { IdentityTokenProvider } from "./identity";

const CONFIG = {
  baseUrl: "https://pilot.example.invalid",
  serviceCredential: "APP-CREDENTIAL-VALUE",
  invitationSecret: "invite-secret",
};
const identity: IdentityTokenProvider = { getIdentityToken: async () => "iam-id-token" };

function transportReturning(body: unknown, status = 200): { transport: PilotTransport; calls: unknown[] } {
  const calls: unknown[] = [];
  return {
    calls,
    transport: {
      async post(url, requestBody, headers, timeoutMs) {
        calls.push({ url, requestBody, headers, timeoutMs });
        return { status, body };
      },
    },
  };
}

describe("h3-pilot BFF client", () => {
  it("7. unknown operation blocked without a transport call", async () => {
    const { transport, calls } = transportReturning({ ok: true });
    const result = await callH3Pilot("queryDatabase", { sql: "SELECT 1" }, { config: CONFIG, identityTokenProvider: identity, transport });
    expect(result).toMatchObject({ ok: false, code: "INVALID_REQUEST" });
    expect(calls).toHaveLength(0);
  });

  it("12. missing config fails closed", async () => {
    const result = await callH3Pilot("readPilotStatus", {}, { config: null });
    expect(result).toMatchObject({ ok: false, code: "H3_PILOT_NOT_CONFIGURED" });
  });

  it("CLOUD_RUN_IAM_FROM_PRODUCT_READY=NO: missing IAM token fails closed", async () => {
    const result = await callH3Pilot("readPilotStatus", {}, { config: CONFIG, identityTokenProvider: { getIdentityToken: async () => null } });
    expect(result).toMatchObject({ ok: false, code: "H3_IAM_NOT_CONFIGURED" });
  });

  it("valid call maps success and sends both auth layers", async () => {
    const { transport, calls } = transportReturning({ ok: true, code: "OK", value: { intakeStatus: "ACTIVE" } });
    const result = await callH3Pilot("readPilotStatus", { intakeId: "x" }, { config: CONFIG, identityTokenProvider: identity, transport });
    expect(result.ok).toBe(true);
    expect(result.value).toEqual({ intakeStatus: "ACTIVE" });
    const call = calls[0] as { headers: Record<string, string> };
    expect(call.headers.authorization).toBe("Bearer iam-id-token");
    expect(call.headers["x-hermes-pilot-credential"]).toBe(CONFIG.serviceCredential);
  });

  it("H3 error codes map through", async () => {
    const { transport } = transportReturning({ ok: false, code: "AUTH_REQUIRED" }, 401);
    const result = await callH3Pilot("readPilotStatus", {}, { config: CONFIG, identityTokenProvider: identity, transport });
    expect(result).toMatchObject({ ok: false, code: "AUTH_REQUIRED" });
  });

  it("transport failure fails closed (no Production fallback)", async () => {
    const transport: PilotTransport = { post: vi.fn(async () => { throw new Error("network") }) };
    const result = await callH3Pilot("readPilotStatus", {}, { config: CONFIG, identityTokenProvider: identity, transport });
    expect(result).toMatchObject({ ok: false, code: "H3_PILOT_UNAVAILABLE" });
  });

  it("14/15. result never contains the service credential", async () => {
    const { transport } = transportReturning({ ok: true, code: "OK", value: { note: "ok" } });
    const result = await callH3Pilot("readPilotStatus", {}, { config: CONFIG, identityTokenProvider: identity, transport });
    expect(JSON.stringify(result)).not.toContain(CONFIG.serviceCredential);
  });

  it("13/14. server config uses non-public env names only", () => {
    const src = readFileSync(resolve(import.meta.dirname, "config.ts"), "utf8");
    expect(src).not.toMatch(/NEXT_PUBLIC_/);
    expect(src).toMatch(/H3_TALENT_PILOT_SERVICE_URL/);
    expect(src).toMatch(/H3_TALENT_PILOT_SERVICE_CREDENTIAL/);
  });

  it("allowlist contains no generic SQL/CRUD operation", () => {
    expect(H3_PILOT_OPERATIONS.some((op) => /query|sql|table|repository|generic/i.test(op))).toBe(false);
  });
});
