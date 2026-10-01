import { describe, expect, it } from "vitest";

import {
  createInMemoryInvitationUseStore,
  createInvitationToken,
  validateInvitationToken,
  type InvitationRecord,
} from "./invitation";

const SECRET = "unit-test-invitation-secret";
const record: InvitationRecord = {
  invitationId: "inv-1",
  participantReference: "P-1",
  expiresAt: 2000,
};
const now = 1000;

describe("h3-pilot invitation", () => {
  it("2/3. valid invitation accepted; single-use enforced", async () => {
    const store = createInMemoryInvitationUseStore();
    const token = createInvitationToken(record, SECRET);
    const first = await validateInvitationToken(token, SECRET, store, now);
    expect(first.ok).toBe(true);
    if (first.ok) expect(first.record.invitationId).toBe("inv-1");
    const second = await validateInvitationToken(token, SECRET, store, now);
    expect(second.ok).toBe(false);
    if (!second.ok) expect(second.code).toBe("REUSED_INVITATION");
  });

  it("expired invitation blocked", async () => {
    const store = createInMemoryInvitationUseStore();
    const token = createInvitationToken(record, SECRET);
    const result = await validateInvitationToken(token, SECRET, store, 3000);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("EXPIRED_INVITATION");
  });

  it("bad signature / wrong secret blocked", async () => {
    const store = createInMemoryInvitationUseStore();
    const token = createInvitationToken(record, SECRET);
    const result = await validateInvitationToken(token, "other-secret", store, now);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("INVALID_INVITATION");
  });

  it("malformed token blocked", async () => {
    const store = createInMemoryInvitationUseStore();
    for (const bad of ["", "not-a-token", "a.b.c", null, 42]) {
      const result = await validateInvitationToken(bad, SECRET, store, now);
      expect(result.ok).toBe(false);
    }
  });

  it("tampered payload blocked", async () => {
    const store = createInMemoryInvitationUseStore();
    const token = createInvitationToken(record, SECRET);
    const [payloadB64] = token.split(".");
    const tampered = `${Buffer.from(
      JSON.stringify({ ...record, expiresAt: 999999999 }),
      "utf8",
    ).toString("base64url")}.${token.split(".")[1]}`;
    const result = await validateInvitationToken(tampered, SECRET, store, now);
    expect(result.ok).toBe(false);
    void payloadB64;
  });
});
