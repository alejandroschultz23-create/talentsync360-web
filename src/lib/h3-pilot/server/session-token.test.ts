import { describe, expect, it } from "vitest";

import { createPilotSessionToken, readPilotSessionToken, type PilotSession } from "./session-token";

const SECRET = "unit-test-session-secret";
const session: PilotSession = {
  invitationId: "inv-1",
  participantReference: "P-1",
  expiresAt: 2000,
};

describe("h3-pilot session token", () => {
  it("valid roundtrip returns the session", () => {
    const token = createPilotSessionToken(session, SECRET);
    expect(readPilotSessionToken(token, SECRET, 1000)).toEqual(session);
  });

  it("expired session returns null", () => {
    const token = createPilotSessionToken(session, SECRET);
    expect(readPilotSessionToken(token, SECRET, 3000)).toBeNull();
  });

  it("wrong secret returns null", () => {
    const token = createPilotSessionToken(session, SECRET);
    expect(readPilotSessionToken(token, "other", 1000)).toBeNull();
  });

  it("malformed / tampered returns null", () => {
    expect(readPilotSessionToken("", SECRET, 1000)).toBeNull();
    expect(readPilotSessionToken("a.b", SECRET, 1000)).toBeNull();
    const token = createPilotSessionToken(session, SECRET);
    const tampered = token.slice(0, -2) + (token.endsWith("AA") ? "BB" : "AA");
    expect(readPilotSessionToken(tampered, SECRET, 1000)).toBeNull();
  });
});
