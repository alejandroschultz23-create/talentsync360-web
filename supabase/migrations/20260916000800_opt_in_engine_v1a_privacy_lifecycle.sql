-- R2.3: guarded privacy lifecycle. Existing review/profile mutations remain immutable.

-- Guard functions rely on postgres ownership. Fail before changing anything if
-- a migration runner uses a different role.
do $$
begin
  if current_user <> 'postgres' then
    raise exception 'Privacy lifecycle migration must run as postgres';
  end if;
end;
$$;

create schema if not exists private;
alter schema private owner to postgres;
revoke all on schema private from public, anon, authenticated, service_role;

alter table public.evidence_review_submissions
  add column last_meaningful_activity_at timestamptz;

alter table public.talent_opt_ins
  add column withdrawn_at timestamptz;

alter table public.talent_opt_ins
  add constraint talent_opt_ins_withdrawal_check check (
    withdrawn_at is null or (
      opt_in_status = 'ACCEPTED'
      and accepted_at is not null
      and withdrawn_at >= accepted_at
    )
  );

alter table public.talent_opt_ins drop constraint talent_opt_ins_profile_key;
create unique index talent_opt_ins_current_profile_key
  on public.talent_opt_ins(profile_id) where withdrawn_at is null;
create index talent_opt_ins_declined_due_idx
  on public.talent_opt_ins(declined_at) where opt_in_status = 'DECLINED';
create index talent_opt_ins_withdrawn_due_idx
  on public.talent_opt_ins(withdrawn_at) where withdrawn_at is not null;

-- Only database-owner private procedures can write lifecycle events. These rows contain no
-- professional name, email, profile text, evidence, findings, or recommendations.
create table private.privacy_lifecycle_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null,
  event_type text not null check (event_type in ('ACTIVITY', 'WITHDRAWN', 'CASE_CLOSED')),
  actor_reference text not null check (actor_reference ~ '^[A-Za-z0-9_-]{3,64}$'),
  occurred_at timestamptz not null default now(),
  review_consent_version text,
  review_consent_at timestamptz,
  network_decisions jsonb not null default '[]'::jsonb check (jsonb_typeof(network_decisions) = 'array'),
  closure_reason text check (closure_reason in ('RETENTION_90_DAYS', 'RETENTION_DECLINED_180_DAYS', 'WITHDRAWAL', 'PRIVACY_REQUEST')),
  audit_expires_at timestamptz,
  constraint privacy_lifecycle_closed_shape check (
    (event_type = 'CASE_CLOSED' and closure_reason is not null and audit_expires_at is not null
      and review_consent_version is not null and review_consent_at is not null)
    or (event_type <> 'CASE_CLOSED' and closure_reason is null)
  )
);
create unique index privacy_lifecycle_one_closure_per_case
  on private.privacy_lifecycle_events(case_id) where event_type = 'CASE_CLOSED';
create index privacy_lifecycle_case_occurred_idx
  on private.privacy_lifecycle_events(case_id, occurred_at desc);
create index privacy_lifecycle_expiry_idx
  on private.privacy_lifecycle_events(audit_expires_at)
  where audit_expires_at is not null;
alter table private.privacy_lifecycle_events enable row level security;
alter table private.privacy_lifecycle_events force row level security;
alter table private.privacy_lifecycle_events owner to postgres;
revoke all on private.privacy_lifecycle_events from public, anon, authenticated, service_role;

-- A service-role UPDATE cannot manufacture a withdrawal or erase consent
-- history. The trusted flags are honored only inside postgres-owned private procedures.
create function public.protect_talent_opt_in_history()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_case_id uuid;
begin
  select p.submission_id into v_case_id
  from public.evidence_profiles p
  where p.id = old.profile_id;

  if tg_op = 'DELETE' then
    if current_user <> 'postgres'
      or current_setting('app.privacy_closure_case', true) is distinct from v_case_id::text then
      raise exception 'Opt-in history can be deleted only by privacy case closure' using errcode = '23514';
    end if;
    return old;
  end if;

  if old.opt_in_status in ('ACCEPTED', 'DECLINED') and (
    new.person_id is distinct from old.person_id
    or new.profile_id is distinct from old.profile_id
    or new.opt_in_status is distinct from old.opt_in_status
    or new.offered_at is distinct from old.offered_at
    or new.accepted_at is distinct from old.accepted_at
    or new.declined_at is distinct from old.declined_at
    or new.network_consent_version is distinct from old.network_consent_version
    or new.network_consent_text is distinct from old.network_consent_text
    or new.network_consent_at is distinct from old.network_consent_at
  ) then
    raise exception 'Decided opt-in history is immutable' using errcode = '23514';
  end if;

  if new.withdrawn_at is distinct from old.withdrawn_at and (
    old.opt_in_status <> 'ACCEPTED'
    or old.withdrawn_at is not null
    or new.withdrawn_at is null
    or current_user <> 'postgres'
    or current_setting('app.privacy_withdrawal_case', true) is distinct from v_case_id::text
  ) then
    raise exception 'Withdrawal requires the guarded operator operation' using errcode = '23514';
  end if;
  return new;
end;
$$;
create trigger talent_opt_ins_protect_history
before update or delete on public.talent_opt_ins
for each row execute function public.protect_talent_opt_in_history();

-- Normal delivered-profile immutability is unchanged. Only a matching case
-- deletion inside the postgres-owned private closure procedure can pass these guards.
create or replace function public.protect_delivered_profile()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    if old.delivered_at is not null and (
      current_user <> 'postgres'
      or current_setting('app.privacy_closure_case', true) is distinct from old.submission_id::text
    ) then
      raise exception 'Delivered evidence profiles cannot be deleted' using errcode = '23514';
    end if;
    return old;
  end if;

  if old.delivered_at is not null and (
    new.person_id is distinct from old.person_id
    or new.submission_id is distinct from old.submission_id
    or new.review_version is distinct from old.review_version
    or new.professional_intent_snapshot is distinct from old.professional_intent_snapshot
    or new.evidence_context_snapshot is distinct from old.evidence_context_snapshot
    or new.recommendations is distinct from old.recommendations
    or new.supersedes_profile_id is distinct from old.supersedes_profile_id
    or new.reviewed_at is distinct from old.reviewed_at
    or new.delivered_at is distinct from old.delivered_at
  ) then
    raise exception 'Delivered evidence profile content is immutable' using errcode = '23514';
  end if;
  return new;
end;
$$;

create or replace function public.protect_delivered_profile_findings()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_profile public.evidence_profiles;
begin
  select * into v_profile from public.evidence_profiles
  where id = case when tg_op = 'DELETE' then old.profile_id else new.profile_id end;
  if v_profile.delivered_at is not null and (
    tg_op <> 'DELETE'
    or current_user <> 'postgres'
    or current_setting('app.privacy_closure_case', true) is distinct from v_profile.submission_id::text
  ) then
    raise exception 'Findings for a delivered profile are immutable' using errcode = '23514';
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create function private.record_privacy_case_activity(p_submission_id uuid, p_actor_reference text)
returns timestamptz
language plpgsql security definer set search_path = ''
as $$
declare
  v_now timestamptz := now();
begin
  if p_actor_reference !~ '^[A-Za-z0-9_-]{3,64}$' then
    raise exception 'Actor must be a non-email operator identifier' using errcode = '23514';
  end if;
  update public.evidence_review_submissions
  set last_meaningful_activity_at = v_now
  where id = p_submission_id;
  if not found then
    raise exception 'Open case not found' using errcode = 'P0002';
  end if;
  insert into private.privacy_lifecycle_events(case_id, event_type, actor_reference, occurred_at)
  values (p_submission_id, 'ACTIVITY', p_actor_reference, v_now);
  return v_now;
end;
$$;

create function private.withdraw_talent_network(p_submission_id uuid, p_actor_reference text)
returns public.talent_opt_ins
language plpgsql security definer set search_path = ''
as $$
declare
  v_opt_in public.talent_opt_ins;
  v_now timestamptz := now();
begin
  if p_actor_reference !~ '^[A-Za-z0-9_-]{3,64}$' then
    raise exception 'Actor must be a non-email operator identifier' using errcode = '23514';
  end if;
  perform 1 from public.evidence_review_submissions where id = p_submission_id for update;
  if not found then raise exception 'Open case not found' using errcode = 'P0002'; end if;

  select oi.* into v_opt_in
  from public.talent_opt_ins oi
  join public.evidence_profiles p on p.id = oi.profile_id
  where p.submission_id = p_submission_id
    and oi.opt_in_status = 'ACCEPTED' and oi.withdrawn_at is null
  for update of oi;
  if not found then
    raise exception 'No active accepted Talent Network participation for case' using errcode = '23514';
  end if;

  perform set_config('app.privacy_withdrawal_case', p_submission_id::text, true);
  update public.talent_opt_ins set withdrawn_at = v_now where id = v_opt_in.id
  returning * into v_opt_in;
  perform set_config('app.privacy_withdrawal_case', '', true);

  update public.profile_access_tokens t set revoked_at = v_now
  where t.profile_id in (select id from public.evidence_profiles where submission_id = p_submission_id)
    and t.revoked_at is null;
  insert into private.privacy_lifecycle_events(
    case_id, event_type, actor_reference, occurred_at,
    network_decisions
  ) values (
    p_submission_id, 'WITHDRAWN', p_actor_reference, v_now,
    jsonb_build_array(jsonb_build_object(
      'consent_version', v_opt_in.network_consent_version,
      'accepted_at', v_opt_in.accepted_at,
      'withdrawn_at', v_opt_in.withdrawn_at
    ))
  );
  return v_opt_in;
end;
$$;

-- Read-only pilot queue. Due dates are computed from persisted meaningful
-- activity, decline, or withdrawal timestamps; no scheduler is installed.
create function private.privacy_retention_queue(p_limit integer default 100)
returns table (
  submission_id uuid,
  category text,
  review_state public.review_state,
  last_activity_at timestamptz,
  due_at timestamptz,
  is_due boolean
)
language plpgsql security definer set search_path = ''
as $$
begin
  if p_limit not between 1 and 100 then
    raise exception 'Limit must be between 1 and 100' using errcode = '23514';
  end if;
  return query
  with cases as (
    select s.id, s.review_state,
      greatest(s.updated_at, coalesce(s.last_meaningful_activity_at, s.created_at)) as activity_at,
      (select max(oi.declined_at) from public.talent_opt_ins oi
       join public.evidence_profiles p on p.id = oi.profile_id
       where p.submission_id = s.id and oi.opt_in_status = 'DECLINED') as declined_at,
      (select max(oi.withdrawn_at) from public.talent_opt_ins oi
       join public.evidence_profiles p on p.id = oi.profile_id
       where p.submission_id = s.id) as withdrawn_at,
      exists(select 1 from public.talent_opt_ins oi
        join public.evidence_profiles p on p.id = oi.profile_id
        where p.submission_id = s.id and oi.opt_in_status = 'ACCEPTED' and oi.withdrawn_at is null) as active
    from public.evidence_review_submissions s
  ), candidates as (
    select c.id, c.review_state, c.activity_at,
      case when c.active then null
           when c.withdrawn_at is not null then 'WITHDRAWAL'
           when c.declined_at is not null then 'RETENTION_DECLINED_180_DAYS'
           when c.review_state <> 'REVIEW_CONFIRMED' then 'RETENTION_90_DAYS'
           else null end as reason,
      case when c.active then null
           when c.withdrawn_at is not null then c.withdrawn_at + interval '30 days'
           when c.declined_at is not null then c.declined_at + interval '180 days'
           when c.review_state <> 'REVIEW_CONFIRMED' then c.activity_at + interval '90 days'
           else null end as deadline
    from cases c
  )
  select c.id, c.reason, c.review_state, c.activity_at, c.deadline,
    c.deadline <= now()
  from candidates c where c.reason is not null
  order by c.deadline, c.id limit p_limit;
end;
$$;

create function private.preview_privacy_case_closure(p_submission_id uuid, p_reason text)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  v_submission public.evidence_review_submissions;
  v_profile_count integer;
  v_active boolean;
  v_declined_at timestamptz;
  v_withdrawn_at timestamptz;
  v_open_decision boolean;
  v_last_activity timestamptz;
  v_due_at timestamptz;
  v_allowed boolean := false;
begin
  select * into v_submission from public.evidence_review_submissions where id = p_submission_id;
  if not found then
    return jsonb_build_object('exists', false, 'eligible', false, 'submission_id', p_submission_id);
  end if;
  select count(*) into v_profile_count from public.evidence_profiles where submission_id = p_submission_id;
  select exists(select 1 from public.talent_opt_ins oi
    join public.evidence_profiles p on p.id = oi.profile_id
    where p.submission_id = p_submission_id
      and oi.opt_in_status = 'ACCEPTED' and oi.withdrawn_at is null) into v_active;
  select max(oi.declined_at), max(oi.withdrawn_at)
    into v_declined_at, v_withdrawn_at
  from public.talent_opt_ins oi
  join public.evidence_profiles p on p.id = oi.profile_id
  where p.submission_id = p_submission_id;
  select exists(select 1 from public.talent_opt_ins oi
    join public.evidence_profiles p on p.id = oi.profile_id
    where p.submission_id = p_submission_id and oi.withdrawn_at is null
      and oi.opt_in_status in ('NOT_OFFERED', 'OFFERED')) into v_open_decision;
  v_last_activity := greatest(v_submission.updated_at,
    coalesce(v_submission.last_meaningful_activity_at, v_submission.created_at));

  if p_reason = 'RETENTION_90_DAYS' then
    v_due_at := v_last_activity + interval '90 days';
    v_allowed := v_submission.review_state <> 'REVIEW_CONFIRMED'
      and not v_active and now() >= v_due_at;
  elsif p_reason = 'RETENTION_DECLINED_180_DAYS' then
    v_due_at := v_declined_at + interval '180 days';
    v_allowed := v_submission.review_state = 'REVIEW_CONFIRMED'
      and v_declined_at is not null and v_withdrawn_at is null
      and not v_active and not v_open_decision and now() >= v_due_at;
  elsif p_reason = 'WITHDRAWAL' then
    v_due_at := v_withdrawn_at + interval '30 days';
    v_allowed := v_withdrawn_at is not null and not v_active and not v_open_decision;
  elsif p_reason = 'PRIVACY_REQUEST' then
    v_allowed := not v_active;
  else
    raise exception 'Unsupported closure reason' using errcode = '23514';
  end if;
  return jsonb_build_object(
    'exists', true, 'eligible', v_allowed, 'submission_id', p_submission_id,
    'reason', p_reason, 'review_state', v_submission.review_state,
    'active_network', v_active, 'profile_count', v_profile_count,
    'last_meaningful_activity_at', v_last_activity, 'due_at', v_due_at,
    'expires_by', case when p_reason = 'WITHDRAWAL' then v_due_at else null end
  );
end;
$$;

create function private.close_privacy_case(
  p_submission_id uuid,
  p_actor_reference text,
  p_reason text,
  p_confirm_submission_id uuid
)
returns private.privacy_lifecycle_events
language plpgsql security definer set search_path = ''
as $$
declare
  v_submission public.evidence_review_submissions;
  v_profile record;
  v_profile_ids uuid[];
  v_opt_in_ids uuid[];
  v_token_ids uuid[];
  v_decisions jsonb;
  v_preview jsonb;
  v_event private.privacy_lifecycle_events;
  v_now timestamptz := now();
begin
  if p_actor_reference !~ '^[A-Za-z0-9_-]{3,64}$'
    or p_submission_id is distinct from p_confirm_submission_id then
    raise exception 'Closure requires a non-email actor and matching confirmation ID' using errcode = '23514';
  end if;
  select * into v_submission from public.evidence_review_submissions
  where id = p_submission_id for update;
  if not found then
    raise exception 'Case not found or already closed' using errcode = 'P0002';
  end if;
  perform 1 from public.talent_opt_ins oi
    join public.evidence_profiles p on p.id = oi.profile_id
    where p.submission_id = p_submission_id for update of oi;
  v_preview := private.preview_privacy_case_closure(p_submission_id, p_reason);
  if (v_preview ->> 'eligible')::boolean is distinct from true then
    raise exception 'Case is not eligible for this closure reason' using errcode = '23514';
  end if;

  select coalesce(array_agg(id), '{}'::uuid[]) into v_profile_ids
  from public.evidence_profiles where submission_id = p_submission_id;
  select coalesce(array_agg(oi.id), '{}'::uuid[]),
    coalesce(jsonb_agg(jsonb_build_object(
      'status', oi.opt_in_status, 'offered_at', oi.offered_at,
      'accepted_at', oi.accepted_at, 'declined_at', oi.declined_at,
      'withdrawn_at', oi.withdrawn_at,
      'consent_version', oi.network_consent_version,
      'consent_at', oi.network_consent_at
    ) order by oi.created_at, oi.id), '[]'::jsonb)
    into v_opt_in_ids, v_decisions
  from public.talent_opt_ins oi where oi.profile_id = any(v_profile_ids);
  select coalesce(array_agg(id), '{}'::uuid[]) into v_token_ids
  from public.profile_access_tokens where profile_id = any(v_profile_ids);

  -- The event is inserted first so all destructive work rolls back if it fails.
  insert into private.privacy_lifecycle_events(
    case_id, event_type, actor_reference, occurred_at,
    review_consent_version, review_consent_at, network_decisions,
    closure_reason, audit_expires_at
  ) values (
    p_submission_id, 'CASE_CLOSED', p_actor_reference, v_now,
    v_submission.review_consent_version, v_submission.review_consent_at,
    v_decisions, p_reason, v_now + interval '24 months'
  ) returning * into v_event;
  update private.privacy_lifecycle_events
    set audit_expires_at = v_event.audit_expires_at
    where case_id = p_submission_id and event_type = 'WITHDRAWN';
  delete from private.privacy_lifecycle_events
    where case_id = p_submission_id and event_type = 'ACTIVITY';

  -- Remove the older, unconstrained workflow log for every deleted entity.
  delete from public.workflow_events where
    (entity_type = 'SUBMISSION' and entity_id = p_submission_id)
    or (entity_type = 'PROFILE' and entity_id = any(v_profile_ids))
    or (entity_type = 'OPT_IN' and entity_id = any(v_opt_in_ids))
    or (entity_type = 'ACCESS_TOKEN' and entity_id = any(v_token_ids));

  perform set_config('app.privacy_closure_case', p_submission_id::text, true);
  delete from public.profile_access_tokens where id = any(v_token_ids);
  delete from public.talent_opt_ins where id = any(v_opt_in_ids);
  delete from public.evidence_findings where profile_id = any(v_profile_ids);
  -- Superseding versions reference earlier versions; delete newest first.
  for v_profile in
    select id from public.evidence_profiles
    where submission_id = p_submission_id order by review_version desc
  loop
    delete from public.evidence_profiles where id = v_profile.id;
  end loop;
  perform set_config('app.privacy_closure_case', '', true);
  delete from public.evidence_review_submissions where id = p_submission_id;
  if not exists(select 1 from public.evidence_review_submissions where person_id = v_submission.person_id)
    and not exists(select 1 from public.evidence_profiles where person_id = v_submission.person_id)
  then
    delete from public.workflow_events
      where entity_type = 'PERSON' and entity_id = v_submission.person_id;
    delete from public.people where id = v_submission.person_id;
  end if;
  return v_event;
end;
$$;

alter function public.protect_talent_opt_in_history() owner to postgres;
alter function private.record_privacy_case_activity(uuid, text) owner to postgres;
alter function private.withdraw_talent_network(uuid, text) owner to postgres;
alter function private.privacy_retention_queue(integer) owner to postgres;
alter function private.preview_privacy_case_closure(uuid, text) owner to postgres;
alter function private.close_privacy_case(uuid, text, text, uuid) owner to postgres;

revoke all on function public.protect_talent_opt_in_history() from public, anon, authenticated, service_role;
revoke all on function private.record_privacy_case_activity(uuid, text) from public, anon, authenticated, service_role;
revoke all on function private.withdraw_talent_network(uuid, text) from public, anon, authenticated, service_role;
revoke all on function private.privacy_retention_queue(integer) from public, anon, authenticated, service_role;
revoke all on function private.preview_privacy_case_closure(uuid, text) from public, anon, authenticated, service_role;
revoke all on function private.close_privacy_case(uuid, text, text, uuid) from public, anon, authenticated, service_role;
