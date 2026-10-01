import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

const migrationsDir = join(process.cwd(), "supabase", "migrations", "h3-pilot");
let db: PGlite;

const AUTH_1 = "a1900000-0001-4000-8000-000000000001";
const AUTH_2 = "a1900000-0002-4000-8000-000000000002";
const AUTH_3 = "a1900000-0003-4000-8000-000000000003";

function tokenHash(): string {
  return randomUUID().replaceAll("-", "");
}

async function insert(
  id: string,
  authorizationId: string,
  options: { expiresMs?: number; used?: boolean; revoked?: boolean } = {},
): Promise<void> {
  await db.query(
    "insert into public.pilot_invitations(invitation_id, token_hash, expires_at, pilot_authorization_id, owner_reference) values ($1,$2,$3,$4,$5)",
    [
      id,
      tokenHash(),
      new Date(Date.now() + (options.expiresMs ?? 3_600_000)).toISOString(),
      authorizationId,
      authorizationId,
    ],
  );
}

beforeAll(async () => {
  db = new PGlite();
  const files = readdirSync(migrationsDir).filter((name) => name.endsWith(".sql")).sort();
  for (const file of files) {
    await db.exec(readFileSync(join(migrationsDir, file), "utf8"));
  }
}, 30_000);

beforeEach(async () => {
  await db.exec("truncate public.pilot_invitations");
});

afterAll(async () => {
  if (db) await db.close();
});

describe("V1_191 invitation authorization binding on replayed PostgreSQL schema", () => {
  it("adds the non-authoritative authorization columns", async () => {
    const columns = await db.query<{ column_name: string }>(
      `select column_name from information_schema.columns
        where table_schema = 'public' and table_name = 'pilot_invitations'
          and column_name in ('pilot_authorization_id','owner_reference')`,
    );
    expect(columns.rows.map((row) => row.column_name).sort()).toEqual([
      "owner_reference",
      "pilot_authorization_id",
    ]);
  });

  it("1/2. binds one active invitation per authorization", async () => {
    await insert("inv-a", AUTH_1);
    await insert("inv-b", AUTH_2);
    const active = await db.query<{ n: number }>(
      "select count(*)::int as n from public.pilot_invitations where used_at is null and revoked_at is null",
    );
    expect(active.rows[0]?.n).toBe(2);
  });

  it("3. same authorization cannot hold a second active invitation", async () => {
    await insert("inv-a1", AUTH_1);
    await expect(insert("inv-a2", AUTH_1)).rejects.toThrow(/pilot_invitations_active_authorization_uidx/);
  });

  it("4. a third active invitation is blocked by the pilot cap", async () => {
    await insert("inv-a", AUTH_1);
    await insert("inv-b", AUTH_2);
    await expect(insert("inv-c", AUTH_3)).rejects.toThrow(/PILOT_INVITATION_CAP_REACHED/);
  });

  it("frees a slot when an invitation is consumed", async () => {
    await insert("inv-a", AUTH_1);
    await insert("inv-b", AUTH_2);
    await db.query("update public.pilot_invitations set used_at = now() where invitation_id = 'inv-a'");
    await expect(insert("inv-c", AUTH_3)).resolves.toBeUndefined();
  });

  it("8/9/10/11. consumption is atomic and expiry/revocation are independent", async () => {
    await insert("inv-a", AUTH_1, { expiresMs: -1000 });
    await insert("inv-b", AUTH_2, { revoked: true });
    await insert("inv-c", AUTH_3, {});
    await db.query("update public.pilot_invitations set revoked_at = now() where invitation_id = 'inv-b'");

    const consume = async (id: string) =>
      (
        await db.query<{ ok: boolean }>("select public.consume_pilot_invitation($1, $2) as ok", [
          id,
          new Date().toISOString(),
        ])
      ).rows[0]?.ok;

    expect(await consume("inv-a")).toBe(false);
    expect(await consume("inv-b")).toBe(false);
    expect(await consume("inv-c")).toBe(true);
    expect(await consume("inv-c")).toBe(false);
  });
});
