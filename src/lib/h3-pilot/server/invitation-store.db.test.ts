import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const migrationsDir = join(process.cwd(), "supabase", "migrations", "h3-pilot");
let db: PGlite;

async function consume(invitationId: string, now: Date): Promise<boolean> {
  const result = await db.query<{ ok: boolean }>(
    "select public.consume_pilot_invitation($1, $2) as ok",
    [invitationId, now.toISOString()],
  );
  return result.rows[0].ok === true;
}

function hash(): string {
  return randomUUID().replaceAll("-", "");
}

beforeAll(async () => {
  db = new PGlite();
  const files = readdirSync(migrationsDir).filter((name) => name.endsWith(".sql")).sort();
  for (const file of files) {
    await db.exec(readFileSync(join(migrationsDir, file), "utf8"));
  }
}, 30_000);

afterAll(async () => {
  if (db) await db.close();
});

describe("h3-pilot durable invitation store on replayed PostgreSQL schema", () => {
  it("creates the non-authoritative invitation table and atomic consume function", async () => {
    const table = await db.query<{ t: string | null }>(
      "select to_regclass('public.pilot_invitations')::text as t",
    );
    const fn = await db.query<{ proname: string }>(
      `select p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'public' and p.proname = 'consume_pilot_invitation'`,
    );
    expect(table.rows[0].t).toBe("pilot_invitations");
    expect(fn.rows.map((row) => row.proname)).toEqual(["consume_pilot_invitation"]);
  });

  it("consumes an unused invitation exactly once", async () => {
    const id = `inv-${randomUUID()}`;
    const now = new Date();
    await db.query(
      "insert into public.pilot_invitations(invitation_id, token_hash, expires_at) values ($1,$2,$3)",
      [id, hash(), new Date(Date.now() + 3_600_000).toISOString()],
    );
    expect(await consume(id, now)).toBe(true);
    expect(await consume(id, now)).toBe(false);
  });

  it("rejects expired, revoked, and unknown invitations", async () => {
    const expired = `exp-${randomUUID()}`;
    const revoked = `rev-${randomUUID()}`;
    await db.query(
      "insert into public.pilot_invitations(invitation_id, token_hash, expires_at) values ($1,$2,$3),($4,$5,$6)",
      [
        expired,
        hash(),
        new Date(Date.now() - 3_600_000).toISOString(),
        revoked,
        hash(),
        new Date(Date.now() + 3_600_000).toISOString(),
      ],
    );
    await db.query("update public.pilot_invitations set revoked_at = now() where invitation_id = $1", [revoked]);
    const now = new Date();
    expect(await consume(expired, now)).toBe(false);
    expect(await consume(revoked, now)).toBe(false);
    expect(await consume(`missing-${randomUUID()}`, now)).toBe(false);
  });

  it("keeps concurrent replay single-use", async () => {
    const id = `con-${randomUUID()}`;
    await db.query(
      "insert into public.pilot_invitations(invitation_id, token_hash, expires_at) values ($1,$2,$3)",
      [id, hash(), new Date(Date.now() + 3_600_000).toISOString()],
    );
    const now = new Date();
    const results = await Promise.all([consume(id, now), consume(id, now), consume(id, now)]);
    expect(results.filter(Boolean)).toHaveLength(1);
  });
});
