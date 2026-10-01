import { describe, expect, it } from "vitest";

import type { SupabaseClient } from "@supabase/supabase-js";

import { createInMemoryInvitationUseStore, validateInvitationToken, createInvitationToken } from "./invitation";
import { createSupabaseInvitationUseStore, CONSUME_INVITATION_RPC } from "./invitation-store";

interface Row {
  used: boolean;
  revoked: boolean;
  expiresAt: number;
}

function fakeSupabase() {
  const rows = new Map<string, Row>();
  const client = {
    async rpc(name: string, args: Record<string, unknown>) {
      if (name !== CONSUME_INVITATION_RPC) return { data: null, error: { message: "unknown rpc" } };
      const id = String(args.p_invitation_id);
      const now = Date.parse(String(args.p_now));
      const row = rows.get(id);
      if (row === undefined) return { data: false, error: null };
      if (row.used || row.revoked || row.expiresAt <= now) return { data: false, error: null };
      row.used = true;
      return { data: true, error: null };
    },
  } as unknown as SupabaseClient;
  return { rows, client };
}

describe("h3-pilot durable invitation store", () => {
  it("1. valid invitation consumed once", async () => {
    const { rows, client } = fakeSupabase();
    rows.set("inv-1", { used: false, revoked: false, expiresAt: 2000 });
    const store = createSupabaseInvitationUseStore(client);
    expect(await store.consume("inv-1", 1000)).toBe(true);
    expect(await store.consume("inv-1", 1000)).toBe(false);
  });

  it("2. concurrent replay consumes exactly once", async () => {
    const { rows, client } = fakeSupabase();
    rows.set("inv-2", { used: false, revoked: false, expiresAt: 2000 });
    const store = createSupabaseInvitationUseStore(client);
    const results = await Promise.all([store.consume("inv-2", 1000), store.consume("inv-2", 1000), store.consume("inv-2", 1000)]);
    expect(results.filter(Boolean)).toHaveLength(1);
  });

  it("3. expired invitation not consumed", async () => {
    const { rows, client } = fakeSupabase();
    rows.set("inv-3", { used: false, revoked: false, expiresAt: 500 });
    const store = createSupabaseInvitationUseStore(client);
    expect(await store.consume("inv-3", 1000)).toBe(false);
  });

  it("4. revoked invitation not consumed", async () => {
    const { rows, client } = fakeSupabase();
    rows.set("inv-4", { used: false, revoked: true, expiresAt: 5000 });
    const store = createSupabaseInvitationUseStore(client);
    expect(await store.consume("inv-4", 1000)).toBe(false);
  });

  it("unknown invitation not consumed", async () => {
    const { client } = fakeSupabase();
    const store = createSupabaseInvitationUseStore(client);
    expect(await store.consume("missing", 1000)).toBe(false);
  });

  it("end-to-end: validateInvitationToken with durable store is single-use", async () => {
    const { rows, client } = fakeSupabase();
    rows.set("inv-5", { used: false, revoked: false, expiresAt: 2000 });
    const store = createSupabaseInvitationUseStore(client);
    const token = createInvitationToken({ invitationId: "inv-5", participantReference: "P-5", expiresAt: 2000 }, "secret");
    const first = await validateInvitationToken(token, "secret", store, 1000);
    const second = await validateInvitationToken(token, "secret", store, 1000);
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(false);
    if (!second.ok) expect(second.code).toBe("REUSED_INVITATION");
  });

  it("in-memory store enforces single-use", async () => {
    const store = createInMemoryInvitationUseStore();
    expect(await store.consume("x", 1)).toBe(true);
    expect(await store.consume("x", 1)).toBe(false);
  });
});
