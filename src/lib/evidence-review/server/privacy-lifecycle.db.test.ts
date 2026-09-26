import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';

const migrationsDir = join(process.cwd(), 'supabase', 'migrations');
let db: PGlite;

type Seed = { personId: string; submissionId: string; profileId?: string; optInId?: string; tokenId?: string };

async function one<T extends Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T> {
  const result = await db.query<T>(sql, params);
  if (result.rows.length !== 1) throw new Error(`Expected one row: ${sql}`);
  return result.rows[0];
}

async function seedCase(kind: 'PROFILE_FREE' | 'INCOMPLETE_PROFILE' | 'DECLINED' | 'ACCEPTED', daysAgo = 1): Promise<Seed> {
  const at = new Date(Date.now() - daysAgo * 86_400_000).toISOString();
  const email = `${randomUUID()}@example.test`;
  const person = await one<{ id: string }>(
    `insert into public.people(full_name,email,country,"current_role",created_at,updated_at)
     values('Test Professional',$1,'Argentina','Engineer',$2,$2) returning id`, [email, at]);
  const submission = await one<{ id: string }>(
    `insert into public.evidence_review_submissions(
       person_id,evidence_type,evidence_url,individual_contribution,professional_context,
       opportunity_status,professional_intents,review_consent_version,review_consent_text,
       review_consent_at,review_state,coherence_status,coherence_reviewed_at,created_at,updated_at)
     values($1,'PERSONAL_PROJECT','https://example.test/source','Designed and built the sample system.','Private context',
       'REVIEW_ONLY','{}'::public.professional_intent[],'evidence-review-v1-2026-09-14',
       'I authorize this evidence review and related contact.',$2,
       $3,'NOT_ACTIONABLE_YET',$2,$2,$2) returning id`,
    [person.id, at, kind === 'PROFILE_FREE' ? 'NOT_ACTIONABLE_YET'
      : kind === 'INCOMPLETE_PROFILE' ? 'REVIEW_DELIVERED' : 'REVIEW_CONFIRMED']);
  const seed: Seed = { personId: person.id, submissionId: submission.id };
  if (kind === 'PROFILE_FREE') return seed;

  const profile = await one<{ id: string }>(
    `insert into public.evidence_profiles(
       person_id,submission_id,review_version,professional_intent_snapshot,evidence_context_snapshot,
       recommendations,created_at,reviewed_at,delivered_at,confirmed_at)
     values($1,$2,1,'{"role":"Engineer"}'::jsonb,
       '{"source":"https://example.test/source"}'::jsonb,
       '[{"rationale":"Private recommendation"}]'::jsonb,$3,$3,null,null) returning id`,
    [person.id, submission.id, at]);
  seed.profileId = profile.id;
  await db.query(
    `insert into public.evidence_findings(profile_id,finding_status,capability,explanation,evidence_reference,sort_order)
     values($1,'SUPPORTED','Private capability','Private finding','https://example.test/source',0)`, [profile.id]);
  await db.query('update public.evidence_profiles set delivered_at=$2,confirmed_at=$3 where id=$1',
    [profile.id, at, kind === 'INCOMPLETE_PROFILE' ? null : at]);
  const token = await one<{ id: string }>(
    `insert into public.profile_access_tokens(profile_id,token_hash,created_at,expires_at)
     values($1,$2,$3,now() + interval '1 day') returning id`,
    [profile.id, randomUUID().replaceAll('-', '').padEnd(64, '0'), at]);
  seed.tokenId = token.id;
  if (kind === 'INCOMPLETE_PROFILE') return seed;
  const status = kind === 'ACCEPTED' ? 'ACCEPTED' : 'DECLINED';
  const optIn = await one<{ id: string }>(
    `insert into public.talent_opt_ins(
       person_id,profile_id,opt_in_status,offered_at,accepted_at,declined_at,
       network_consent_version,network_consent_text,network_consent_at,created_at)
     values($1,$2,$3::public.opt_in_status,$4,
       case when $3::text='ACCEPTED' then $4::timestamptz else null end,
       case when $3::text='DECLINED' then $4::timestamptz else null end,
       case when $3::text='ACCEPTED' then 'talent-network-opt-in-v1-2026-09-15' else null end,
       case when $3::text='ACCEPTED' then 'I accept voluntary network participation and profile retention.' else null end,
       case when $3::text='ACCEPTED' then $4::timestamptz else null end,$4) returning id`,
    [person.id, profile.id, status, at]);
  seed.optInId = optIn.id;
  return seed;
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
  for (const file of readdirSync(migrationsDir).filter((name) => name.endsWith('.sql')).sort()) {
    await db.exec(readFileSync(join(migrationsDir, file), 'utf8'));
  }
  // Model the broad public-table DML available to the application service key.
  await db.exec('grant select, insert, update, delete on all tables in schema public to service_role');
}, 30_000);

afterAll(async () => { if (db) await db.close(); });

describe('migration 008 privacy lifecycle on replayed PostgreSQL schema', () => {
  it('keeps exactly seven public product tables and the audit table private', async () => {
    const tables = await db.query<{ tablename: string }>(
      "select tablename from pg_tables where schemaname='public' order by tablename");
    expect(tables.rows.map((row) => row.tablename)).toEqual([
      'evidence_findings', 'evidence_profiles', 'evidence_review_submissions',
      'people', 'profile_access_tokens', 'talent_opt_ins', 'workflow_events',
    ]);
    expect((await one<{ audit_table: string | null }>(
      "select to_regclass('private.privacy_lifecycle_events')::text as audit_table")).audit_table)
      .toBe('private.privacy_lifecycle_events');
    const publicProcedures = await db.query<{ proname: string }>(
      `select p.proname from pg_proc p join pg_namespace n on n.oid=p.pronamespace
       where n.nspname='public' and p.proname in
         ('record_privacy_case_activity','withdraw_talent_network','privacy_retention_queue',
          'preview_privacy_case_closure','close_privacy_case')`);
    expect(publicProcedures.rows).toEqual([]);
  });

  it('sets postgres ownership and fixed search paths for private definer procedures', async () => {
    const schema = await one<{ owner: string }>(
      "select pg_get_userbyid(nspowner) as owner from pg_namespace where nspname='private'");
    const audit = await one<{ owner: string }>(
      "select pg_get_userbyid(relowner) as owner from pg_class where oid='private.privacy_lifecycle_events'::regclass");
    expect(schema.owner).toBe('postgres');
    expect(audit.owner).toBe('postgres');
    const procedures = await db.query<{ proname: string; owner: string; prosecdef: boolean; proconfig: string[] }>(
      `select p.proname, pg_get_userbyid(p.proowner) as owner, p.prosecdef, p.proconfig
       from pg_proc p join pg_namespace n on n.oid=p.pronamespace
       where n.nspname='private' order by p.proname`);
    expect(procedures.rows).toHaveLength(5);
    for (const procedure of procedures.rows) {
      expect(procedure.owner).toBe('postgres');
      expect(procedure.prosecdef).toBe(true);
      expect(procedure.proconfig).toContain('search_path=""');
    }
  });

  it('denies anon, authenticated, and service_role every private audit privilege', async () => {
    for (const role of ['anon', 'authenticated', 'service_role']) {
      const grants = await one<{ schema_usage: boolean; select_ok: boolean; insert_ok: boolean;
        update_ok: boolean; delete_ok: boolean; closure_ok: boolean; withdrawal_ok: boolean }>(
        `select has_schema_privilege($1, 'private', 'USAGE') as schema_usage,
          has_table_privilege($1, 'private.privacy_lifecycle_events', 'SELECT') as select_ok,
          has_table_privilege($1, 'private.privacy_lifecycle_events', 'INSERT') as insert_ok,
          has_table_privilege($1, 'private.privacy_lifecycle_events', 'UPDATE') as update_ok,
          has_table_privilege($1, 'private.privacy_lifecycle_events', 'DELETE') as delete_ok,
          has_function_privilege($1, 'private.close_privacy_case(uuid,text,text,uuid)', 'EXECUTE') as closure_ok,
          has_function_privilege($1, 'private.withdraw_talent_network(uuid,text)', 'EXECUTE') as withdrawal_ok`,
        [role]);
      expect(Object.values(grants)).toEqual(Array(7).fill(false));
      for (const signature of [
        'private.record_privacy_case_activity(uuid,text)',
        'private.privacy_retention_queue(integer)',
        'private.preview_privacy_case_closure(uuid,text)',
      ]) {
        expect((await one<{ allowed: boolean }>(
          "select has_function_privilege($1,$2,'EXECUTE') as allowed", [role, signature])).allowed)
          .toBe(false);
      }
      await db.exec(`set role ${role}`);
      try {
        await expect(db.query('select * from private.close_privacy_case($1,$2,$3,$1)',
          [randomUUID(), 'operator_1', 'PRIVACY_REQUEST'])).rejects.toThrow(/permission denied/);
        await expect(db.query('select * from private.withdraw_talent_network($1,$2)',
          [randomUUID(), 'operator_1'])).rejects.toThrow(/permission denied/);
      } finally {
        await db.exec('reset role');
      }
    }
  });

  it('does not let service_role insert, update, or delete private audit history', async () => {
    const seed = await seedCase('PROFILE_FREE');
    await db.exec('set role service_role');
    try {
      await expect(db.query(`insert into private.privacy_lifecycle_events
        (case_id,event_type,actor_reference) values($1,'ACTIVITY','operator_1')`,
      [seed.submissionId])).rejects.toThrow(/permission denied/);
      await expect(db.query(`update private.privacy_lifecycle_events
        set actor_reference='operator_2' where case_id=$1`,
      [seed.submissionId])).rejects.toThrow(/permission denied/);
      await expect(db.query('delete from private.privacy_lifecycle_events where case_id=$1',
        [seed.submissionId])).rejects.toThrow(/permission denied/);
    } finally {
      await db.exec('reset role');
    }
  });

  it('keeps ordinary delivered-profile updates and deletions immutable', async () => {
    const seed = await seedCase('DECLINED');
    await expect(db.query(`update public.evidence_profiles set recommendations='[]'::jsonb where id=$1`, [seed.profileId]))
      .rejects.toThrow(/immutable/);
    await expect(db.query('delete from public.evidence_profiles where id=$1', [seed.profileId]))
      .rejects.toThrow(/cannot be deleted/);
    await expect(db.query('delete from public.evidence_findings where profile_id=$1', [seed.profileId]))
      .rejects.toThrow(/immutable/);
    await expect(db.query("update public.evidence_findings set explanation='changed' where profile_id=$1", [seed.profileId]))
      .rejects.toThrow(/immutable/);
  });

  it('does not let the ordinary service role bypass closure guards', async () => {
    const seed = await seedCase('ACCEPTED');
    await db.exec('set role service_role');
    try {
      await db.exec(`select set_config('app.privacy_closure_case', '${seed.submissionId}', false)`);
      await expect(db.query('delete from public.evidence_profiles where id=$1', [seed.profileId]))
        .rejects.toThrow(/cannot be deleted/);
      await expect(db.query('update public.talent_opt_ins set withdrawn_at=now() where id=$1', [seed.optInId]))
        .rejects.toThrow(/guarded operator operation/);
    } finally {
      await db.exec("select set_config('app.privacy_closure_case', '', false)");
      await db.exec('reset role');
    }
  });

  it('withdraws accepted participation, records time and audit, and revokes links', async () => {
    const seed = await seedCase('ACCEPTED');
    const withdrawn = await one<{ accepted_at: string; withdrawn_at: string }>(
      'select accepted_at,withdrawn_at from private.withdraw_talent_network($1,$2)',
      [seed.submissionId, 'operator_1']);
    expect(withdrawn.accepted_at).toBeTruthy();
    expect(withdrawn.withdrawn_at).toBeTruthy();
    expect((await one<{ count: number }>(
      `select count(*)::int as count from public.talent_opt_ins
       where id=$1 and opt_in_status='ACCEPTED' and withdrawn_at is null`, [seed.optInId])).count).toBe(0);
    expect((await one<{ count: number }>(
      `select count(*)::int as count from private.privacy_lifecycle_events
       where case_id=$1 and event_type='WITHDRAWN'`, [seed.submissionId])).count).toBe(1);
    expect((await one<{ revoked_at: string }>(
      'select revoked_at from public.profile_access_tokens where id=$1', [seed.tokenId])).revoked_at).toBeTruthy();
    await expect(db.query('select * from private.withdraw_talent_network($1,$2)',
      [seed.submissionId, 'operator_1'])).rejects.toThrow(/No active accepted/);
  });

  it('requires a fresh opt-in row and decision for re-entry', async () => {
    const seed = await seedCase('ACCEPTED');
    await db.query('select * from private.withdraw_talent_network($1,$2)', [seed.submissionId, 'operator_1']);
    const fresh = await one<{ id: string }>(
      `insert into public.talent_opt_ins(person_id,profile_id) values($1,$2) returning id`,
      [seed.personId, seed.profileId]);
    expect(fresh.id).not.toBe(seed.optInId);
    expect((await one<{ count: number }>(
      `select count(*)::int as count from public.talent_opt_ins
       where profile_id=$1 and opt_in_status='ACCEPTED' and withdrawn_at is null`, [seed.profileId])).count).toBe(0);
    await expect(db.query('insert into public.talent_opt_ins(person_id,profile_id) values($1,$2)',
      [seed.personId, seed.profileId])).rejects.toThrow(/unique/);
    await db.query(`select * from public.transition_talent_opt_in($1,'OFFERED')`, [fresh.id]);
    await db.query(`select * from public.transition_talent_opt_in($1,'ACCEPTED',$2,$3,now())`,
      [fresh.id, 'talent-network-opt-in-v1-2026-09-15',
        'I make a new voluntary decision to join the network.']);
    expect((await one<{ count: number }>(
      `select count(*)::int as count from public.talent_opt_ins where profile_id=$1`, [seed.profileId])).count).toBe(2);
  });

  it('closes a due profile-free case and rejects an early one', async () => {
    const early = await seedCase('PROFILE_FREE', 1);
    await expect(db.query('select * from private.close_privacy_case($1,$2,$3,$1)',
      [early.submissionId, 'operator_1', 'RETENTION_90_DAYS'])).rejects.toThrow(/not eligible/);
    const due = await seedCase('PROFILE_FREE', 91);
    const preview = await one<{ preview_privacy_case_closure: { eligible: boolean } }>(
      'select private.preview_privacy_case_closure($1,$2)', [due.submissionId, 'RETENTION_90_DAYS']);
    expect(preview.preview_privacy_case_closure.eligible).toBe(true);
    await db.query('select * from private.close_privacy_case($1,$2,$3,$1)',
      [due.submissionId, 'operator_1', 'RETENTION_90_DAYS']);
    expect((await one<{ count: number }>(
      'select count(*)::int as count from public.evidence_review_submissions where id=$1', [due.submissionId])).count).toBe(0);
  });

  it('honors an earlier privacy deletion request for an incomplete profile', async () => {
    const seed = await seedCase('INCOMPLETE_PROFILE', 1);
    await db.query('select * from private.close_privacy_case($1,$2,$3,$1)',
      [seed.submissionId, 'operator_1', 'PRIVACY_REQUEST']);
    expect((await one<{ count: number }>(
      'select count(*)::int as count from public.evidence_profiles where id=$1', [seed.profileId])).count).toBe(0);
    const audit = await one<{ closure_reason: string }>(
      `select closure_reason from private.privacy_lifecycle_events
       where case_id=$1 and event_type='CASE_CLOSED'`, [seed.submissionId]);
    expect(audit.closure_reason).toBe('PRIVACY_REQUEST');
  });

  it('queues and closes an incomplete review with a delivered but unconfirmed profile after 90 days', async () => {
    const seed = await seedCase('INCOMPLETE_PROFILE', 91);
    const queue = await db.query<{ submission_id: string; category: string; is_due: boolean }>(
      'select * from private.privacy_retention_queue() where submission_id=$1', [seed.submissionId]);
    expect(queue.rows).toMatchObject([{ submission_id: seed.submissionId,
      category: 'RETENTION_90_DAYS', is_due: true }]);
    await db.query('select * from private.close_privacy_case($1,$2,$3,$1)',
      [seed.submissionId, 'operator_1', 'RETENTION_90_DAYS']);
    expect((await one<{ count: number }>(
      'select count(*)::int as count from public.evidence_profiles where id=$1', [seed.profileId])).count).toBe(0);
  });

  it('closes a declined case after 180 days and removes all case content', async () => {
    const seed = await seedCase('DECLINED', 181);
    await db.query('select * from private.close_privacy_case($1,$2,$3,$1)',
      [seed.submissionId, 'operator_1', 'RETENTION_DECLINED_180_DAYS']);
    for (const [table, column, id] of [
      ['people', 'id', seed.personId],
      ['evidence_review_submissions', 'id', seed.submissionId],
      ['evidence_profiles', 'id', seed.profileId],
      ['evidence_findings', 'profile_id', seed.profileId],
      ['talent_opt_ins', 'id', seed.optInId],
      ['profile_access_tokens', 'id', seed.tokenId],
    ] as const) {
      expect((await one<{ count: number }>(
        `select count(*)::int as count from public.${table} where ${column}=$1`, [id])).count).toBe(0);
    }
    expect((await one<{ count: number }>(
      'select count(*)::int as count from public.workflow_events where entity_id=$1',
      [seed.submissionId])).count).toBe(0);
    const audit = await one<{ event_type: string; network_decisions: unknown; audit_expires_at: string }>(
      `select event_type,network_decisions,audit_expires_at from private.privacy_lifecycle_events
       where case_id=$1`, [seed.submissionId]);
    expect(audit.event_type).toBe('CASE_CLOSED');
    expect(JSON.stringify(audit)).not.toMatch(/source|finding|recommendation|@example\.test|Private context/i);
    expect(audit.audit_expires_at).toBeTruthy();
    await expect(db.query('select * from private.close_privacy_case($1,$2,$3,$1)',
      [seed.submissionId, 'operator_1', 'RETENTION_DECLINED_180_DAYS']))
      .rejects.toThrow(/already closed/);
  });

  it('closes a withdrawn case but refuses an active accepted case', async () => {
    const active = await seedCase('ACCEPTED');
    await expect(db.query('select * from private.close_privacy_case($1,$2,$3,$1)',
      [active.submissionId, 'operator_1', 'PRIVACY_REQUEST'])).rejects.toThrow(/not eligible/);
    await db.query('select * from private.withdraw_talent_network($1,$2)',
      [active.submissionId, 'operator_1']);
    await db.query('select * from private.close_privacy_case($1,$2,$3,$1)',
      [active.submissionId, 'operator_1', 'WITHDRAWAL']);
    const events = await db.query<{ event_type: string }>(
      'select event_type from private.privacy_lifecycle_events where case_id=$1 order by occurred_at',
      [active.submissionId]);
    expect(events.rows.map((row) => row.event_type)).toEqual(['WITHDRAWN', 'CASE_CLOSED']);
  });

  it('validates actor, reason, confirmation, and meaningful activity', async () => {
    const seed = await seedCase('PROFILE_FREE', 91);
    await expect(db.query('select * from private.close_privacy_case($1,$2,$3,$4)',
      [seed.submissionId, 'operator_1', 'RETENTION_90_DAYS', randomUUID()]))
      .rejects.toThrow(/matching confirmation/);
    await expect(db.query('select * from private.close_privacy_case($1,$2,$3,$1)',
      [seed.submissionId, 'name@example.test', 'RETENTION_90_DAYS']))
      .rejects.toThrow(/non-email actor/);
    await expect(db.query('select private.preview_privacy_case_closure($1,$2)',
      [seed.submissionId, 'INVALID'])).rejects.toThrow(/Unsupported closure reason/);
    await db.query('select private.record_privacy_case_activity($1,$2)',
      [seed.submissionId, 'operator_1']);
    await expect(db.query('select * from private.close_privacy_case($1,$2,$3,$1)',
      [seed.submissionId, 'operator_1', 'RETENTION_90_DAYS']))
      .rejects.toThrow(/not eligible/);
  });
});
