import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/h3-pilot/server/pilot-mode", () => ({
  setPilotSessionCookie: vi.fn(async () => undefined),
}));

import { createInvitationToken } from "@/lib/h3-pilot/server/invitation";

import { POST } from "./route";

const URL = "http://localhost/api/h3-pilot/enter";
const SECRET = "invite-secret";
const FUTURE = Date.now() + 60_000;

function bodyRequest(body: unknown): Request {
  return new Request(URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("pilot entry route (V1_192)", () => {
  const original = { ...process.env };

  beforeEach(() => {
    process.env.H3_TALENT_PILOT_SERVICE_URL = "https://pilot.invalid";
    process.env.H3_TALENT_PILOT_SERVICE_CREDENTIAL = "cred";
    process.env.H3_PILOT_INVITATION_SECRET = SECRET;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SECRET_KEY;
  });

  afterEach(() => {
    process.env = { ...original };
  });

  it("fails closed when the pilot is not configured", async () => {
    delete process.env.H3_PILOT_INVITATION_SECRET;
    const response = await POST(bodyRequest({ token: "x" }) as never);
    expect(response.status).toBe(503);
  });

  it("consumes a valid invitation exactly once and rejects replay", async () => {
    const token = createInvitationToken(
      { invitationId: "inv-1", participantReference: "PROFESIONAL_A", expiresAt: FUTURE },
      SECRET,
    );
    const first = await POST(bodyRequest({ token }) as never);
    expect(first.status).toBe(200);
    const body = (await first.json()) as { ok: boolean; pilotMode: boolean };
    expect(body).toEqual({ ok: true, pilotMode: true });

    const second = await POST(bodyRequest({ token }) as never);
    expect(second.status).toBe(401);
    const replay = (await second.json()) as { code: string };
    expect(replay.code).toBe("REUSED_INVITATION");
  });

  it("rejects an expired invitation", async () => {
    const expired = createInvitationToken(
      { invitationId: "inv-2", participantReference: "P", expiresAt: Date.now() - 1_000 },
      SECRET,
    );
    const response = await POST(bodyRequest({ token: expired }) as never);
    expect(response.status).toBe(401);
    const body = (await response.json()) as { code: string };
    expect(body.code).toBe("EXPIRED_INVITATION");
  });

  it("never accepts a bearer token from the URL query (log safety)", async () => {
    const token = createInvitationToken(
      { invitationId: "inv-3", participantReference: "P", expiresAt: FUTURE },
      SECRET,
    );
    const response = await POST(
      new Request(`${URL}?token=${encodeURIComponent(token)}`, { method: "POST" }) as never,
    );
    expect(response.status).toBe(401);
  });

  it("never echoes the signing secret or the raw token", async () => {
    const token = createInvitationToken(
      { invitationId: "inv-4", participantReference: "P", expiresAt: FUTURE },
      SECRET,
    );
    const response = await POST(bodyRequest({ token }) as never);
    const text = await response.text();
    expect(text).not.toContain(SECRET);
    expect(text).not.toContain(token);
  });
});
