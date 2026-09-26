-- OPT-IN ENGINE v1A foundation: seven tables, server-only access.

create type public.evidence_type as enum (
  'PUBLIC_REPOSITORY',
  'PERSONAL_PROJECT',
  'PROFESSIONAL_PROJECT',
  'OPEN_SOURCE_CONTRIBUTION',
  'TECHNICAL_ARTIFACT',
  'PRIVATE_PROFESSIONAL_EXPERIENCE',
  'OTHER'
);

create type public.opportunity_status as enum (
  'OPEN',
  'REVIEW_ONLY',
  'NOT_LOOKING'
);

create type public.professional_intent as enum (
  'FULL_TIME',
  'FREELANCE',
  'CONTRACT',
  'PART_TIME'
);

create type public.attribution_source as enum (
  'linkedin_manual_discovery',
  'pyar',
  'python_colombia',
  'linkedin_organic',
  'referral',
  'direct',
  'github_discovery',
  'huggingface_discovery'
);

create type public.review_state as enum (
  'SUBMITTED',
  'CLARIFICATION_NEEDED',
  'NOT_ACTIONABLE_YET',
  'READY_FOR_REVIEW',
  'REVIEW_IN_PROGRESS',
  'REVIEW_DELIVERED',
  'CORRECTION_REQUESTED',
  'REVIEW_CONFIRMED'
);

create type public.coherence_status as enum (
  'PENDING',
  'READY',
  'CLARIFICATION_NEEDED',
  'NOT_ACTIONABLE_YET'
);

create type public.finding_status as enum (
  'SUPPORTED',
  'PARTIAL',
  'UNKNOWN',
  'NEEDS_CLARIFICATION'
);

create type public.opt_in_status as enum (
  'NOT_OFFERED',
  'OFFERED',
  'ACCEPTED',
  'DECLINED'
);

create type public.workflow_entity_type as enum (
  'PERSON',
  'SUBMISSION',
  'PROFILE',
  'OPT_IN',
  'ACCESS_TOKEN'
);

create type public.workflow_event_type as enum (
  'SUBMISSION_CREATED',
  'REVIEW_STATE_CHANGED',
  'COHERENCE_REVIEWED',
  'PROFILE_VERSION_CREATED',
  'PROFILE_DELIVERED',
  'CORRECTION_REQUESTED',
  'PROFILE_CONFIRMED',
  'OPT_IN_OFFERED',
  'OPT_IN_ACCEPTED',
  'OPT_IN_DECLINED',
  'ACCESS_TOKEN_CREATED',
  'ACCESS_TOKEN_REVOKED',
  'WORK_RECORDED'
);

create table public.people (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  email_normalized text generated always as (lower(btrim(email))) stored,
  country text not null,
  "current_role" text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint people_full_name_check check (char_length(btrim(full_name)) between 2 and 160),
  constraint people_email_check check (
    char_length(btrim(email)) between 3 and 320
    and position('@' in email) > 1
  ),
  constraint people_country_check check (char_length(btrim(country)) between 2 and 100),
  constraint people_current_role_check check (char_length(btrim("current_role")) between 2 and 160),
  constraint people_email_normalized_key unique (email_normalized)
);

create table public.evidence_review_submissions (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.people(id) on delete restrict,
  evidence_type public.evidence_type not null,
  evidence_url text,
  individual_contribution text not null,
  professional_context text,
  opportunity_status public.opportunity_status not null,
  professional_intents public.professional_intent[] not null default '{}',
  source public.attribution_source not null default 'direct',
  campaign text,
  review_consent_version text not null,
  review_consent_text text not null,
  review_consent_at timestamptz not null,
  review_state public.review_state not null default 'SUBMITTED',
  coherence_status public.coherence_status not null default 'PENDING',
  coherence_details jsonb not null default '{}'::jsonb,
  reviewer_reference text,
  coherence_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint evidence_review_submissions_url_check check (
    evidence_url is null
    or evidence_url ~* '^https?://'
  ),
  constraint evidence_review_submissions_contribution_check check (
    char_length(btrim(individual_contribution)) between 20 and 5000
  ),
  constraint evidence_review_submissions_context_check check (
    professional_context is null
    or char_length(btrim(professional_context)) between 1 and 5000
  ),
  constraint evidence_review_submissions_intent_check check (
    (opportunity_status = 'OPEN' and cardinality(professional_intents) between 1 and 4)
    or (opportunity_status in ('REVIEW_ONLY', 'NOT_LOOKING') and cardinality(professional_intents) = 0)
  ),
  constraint evidence_review_submissions_unique_intents_check check (
    cardinality(array_positions(professional_intents, 'FULL_TIME')) <= 1
    and cardinality(array_positions(professional_intents, 'FREELANCE')) <= 1
    and cardinality(array_positions(professional_intents, 'CONTRACT')) <= 1
    and cardinality(array_positions(professional_intents, 'PART_TIME')) <= 1
  ),
  constraint evidence_review_submissions_campaign_check check (
    campaign is null
    or campaign ~ '^[a-z0-9][a-z0-9_-]{0,63}$'
  ),
  constraint evidence_review_submissions_consent_version_check check (
    char_length(btrim(review_consent_version)) between 1 and 64
  ),
  constraint evidence_review_submissions_consent_text_check check (
    char_length(btrim(review_consent_text)) between 20 and 4000
  ),
  constraint evidence_review_submissions_coherence_details_check check (
    jsonb_typeof(coherence_details) = 'object'
  ),
  constraint evidence_review_submissions_reviewer_check check (
    reviewer_reference is null
    or char_length(btrim(reviewer_reference)) between 1 and 160
  ),
  constraint evidence_review_submissions_coherence_timing_check check (
    (coherence_status = 'PENDING' and coherence_reviewed_at is null)
    or (coherence_status <> 'PENDING' and coherence_reviewed_at is not null)
  )
);

create table public.evidence_profiles (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.people(id) on delete restrict,
  submission_id uuid not null references public.evidence_review_submissions(id) on delete restrict,
  review_version integer not null,
  professional_intent_snapshot jsonb not null,
  evidence_context_snapshot jsonb not null,
  recommendations jsonb not null default '[]'::jsonb,
  supersedes_profile_id uuid references public.evidence_profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  delivered_at timestamptz,
  confirmed_at timestamptz,
  correction_requested_at timestamptz,
  correction_message text,
  constraint evidence_profiles_review_version_check check (review_version > 0),
  constraint evidence_profiles_intent_snapshot_check check (
    jsonb_typeof(professional_intent_snapshot) = 'object'
  ),
  constraint evidence_profiles_context_snapshot_check check (
    jsonb_typeof(evidence_context_snapshot) = 'object'
  ),
  constraint evidence_profiles_recommendations_check check (
    jsonb_typeof(recommendations) = 'array'
  ),
  constraint evidence_profiles_correction_check check (
    (correction_requested_at is null and correction_message is null)
    or (
      correction_requested_at is not null
      and char_length(btrim(correction_message)) between 1 and 5000
    )
  ),
  constraint evidence_profiles_delivery_order_check check (
    delivered_at is null
    or (reviewed_at is not null and delivered_at >= reviewed_at)
  ),
  constraint evidence_profiles_confirmation_order_check check (
    confirmed_at is null
    or (delivered_at is not null and confirmed_at >= delivered_at)
  ),
  constraint evidence_profiles_correction_order_check check (
    correction_requested_at is null
    or (delivered_at is not null and correction_requested_at >= delivered_at)
  ),
  constraint evidence_profiles_submission_version_key unique (submission_id, review_version),
  constraint evidence_profiles_id_person_key unique (id, person_id),
  constraint evidence_profiles_no_self_supersession_check check (supersedes_profile_id is distinct from id)
);

create table public.evidence_findings (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.evidence_profiles(id) on delete cascade,
  finding_status public.finding_status not null,
  capability text not null,
  explanation text not null,
  evidence_reference text,
  sort_order integer not null,
  created_at timestamptz not null default now(),
  constraint evidence_findings_capability_check check (char_length(btrim(capability)) between 1 and 160),
  constraint evidence_findings_explanation_check check (char_length(btrim(explanation)) between 1 and 5000),
  constraint evidence_findings_reference_check check (
    evidence_reference is null
    or char_length(btrim(evidence_reference)) between 1 and 2000
  ),
  constraint evidence_findings_sort_order_check check (sort_order >= 0),
  constraint evidence_findings_profile_sort_key unique (profile_id, sort_order)
);

create table public.talent_opt_ins (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.people(id) on delete restrict,
  profile_id uuid not null,
  opt_in_status public.opt_in_status not null default 'NOT_OFFERED',
  offered_at timestamptz,
  accepted_at timestamptz,
  declined_at timestamptz,
  network_consent_version text,
  network_consent_text text,
  network_consent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint talent_opt_ins_profile_person_fkey
    foreign key (profile_id, person_id)
    references public.evidence_profiles(id, person_id)
    on delete restrict,
  constraint talent_opt_ins_profile_key unique (profile_id),
  constraint talent_opt_ins_consent_version_check check (
    network_consent_version is null
    or char_length(btrim(network_consent_version)) between 1 and 64
  ),
  constraint talent_opt_ins_consent_text_check check (
    network_consent_text is null
    or char_length(btrim(network_consent_text)) between 20 and 4000
  ),
  constraint talent_opt_ins_state_fields_check check (
    (
      opt_in_status = 'NOT_OFFERED'
      and offered_at is null
      and accepted_at is null
      and declined_at is null
      and network_consent_version is null
      and network_consent_text is null
      and network_consent_at is null
    )
    or (
      opt_in_status = 'OFFERED'
      and offered_at is not null
      and accepted_at is null
      and declined_at is null
      and network_consent_version is null
      and network_consent_text is null
      and network_consent_at is null
    )
    or (
      opt_in_status = 'ACCEPTED'
      and offered_at is not null
      and accepted_at is not null
      and declined_at is null
      and network_consent_version is not null
      and network_consent_text is not null
      and network_consent_at is not null
    )
    or (
      opt_in_status = 'DECLINED'
      and offered_at is not null
      and accepted_at is null
      and declined_at is not null
      and network_consent_version is null
      and network_consent_text is null
      and network_consent_at is null
    )
  )
);

create table public.profile_access_tokens (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.evidence_profiles(id) on delete restrict,
  token_hash text not null,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  last_used_at timestamptz,
  created_at timestamptz not null default now(),
  constraint profile_access_tokens_hash_key unique (token_hash),
  constraint profile_access_tokens_hash_check check (token_hash ~ '^[0-9a-f]{64}$'),
  constraint profile_access_tokens_expiry_check check (expires_at > created_at),
  constraint profile_access_tokens_revocation_check check (
    revoked_at is null or revoked_at >= created_at
  ),
  constraint profile_access_tokens_last_used_check check (
    last_used_at is null or last_used_at >= created_at
  )
);

create table public.workflow_events (
  id uuid primary key default gen_random_uuid(),
  entity_type public.workflow_entity_type not null,
  entity_id uuid not null,
  event_type public.workflow_event_type not null,
  actor_reference text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  constraint workflow_events_actor_check check (
    actor_reference is null
    or char_length(btrim(actor_reference)) between 1 and 160
  ),
  constraint workflow_events_metadata_check check (jsonb_typeof(metadata) = 'object')
);

create index evidence_review_submissions_person_idx
  on public.evidence_review_submissions(person_id);
create index evidence_review_submissions_state_created_idx
  on public.evidence_review_submissions(review_state, created_at);
create index evidence_review_submissions_source_campaign_idx
  on public.evidence_review_submissions(source, campaign);
create index evidence_profiles_person_created_idx
  on public.evidence_profiles(person_id, created_at desc);
create index evidence_profiles_submission_latest_idx
  on public.evidence_profiles(submission_id, review_version desc);
create index evidence_findings_profile_idx
  on public.evidence_findings(profile_id);
create index talent_opt_ins_person_idx
  on public.talent_opt_ins(person_id);
create index talent_opt_ins_status_idx
  on public.talent_opt_ins(opt_in_status);
create index profile_access_tokens_profile_idx
  on public.profile_access_tokens(profile_id);
create index profile_access_tokens_active_expiry_idx
  on public.profile_access_tokens(expires_at)
  where revoked_at is null;
create index workflow_events_entity_occurred_idx
  on public.workflow_events(entity_type, entity_id, occurred_at desc);
create index workflow_events_type_occurred_idx
  on public.workflow_events(event_type, occurred_at desc);

create function public.set_v1a_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger people_set_updated_at
before update on public.people
for each row execute function public.set_v1a_updated_at();

create trigger evidence_review_submissions_set_updated_at
before update on public.evidence_review_submissions
for each row execute function public.set_v1a_updated_at();

create trigger talent_opt_ins_set_updated_at
before update on public.talent_opt_ins
for each row execute function public.set_v1a_updated_at();

create function public.enforce_review_state_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_allowed boolean := false;
begin
  if new.review_state is not distinct from old.review_state then
    return new;
  end if;

  v_allowed := case old.review_state
    when 'SUBMITTED' then new.review_state in ('READY_FOR_REVIEW', 'CLARIFICATION_NEEDED', 'NOT_ACTIONABLE_YET')
    when 'CLARIFICATION_NEEDED' then new.review_state in ('READY_FOR_REVIEW', 'NOT_ACTIONABLE_YET')
    when 'READY_FOR_REVIEW' then new.review_state = 'REVIEW_IN_PROGRESS'
    when 'REVIEW_IN_PROGRESS' then new.review_state = 'REVIEW_DELIVERED'
    when 'REVIEW_DELIVERED' then new.review_state in ('REVIEW_CONFIRMED', 'CORRECTION_REQUESTED')
    when 'CORRECTION_REQUESTED' then new.review_state = 'REVIEW_IN_PROGRESS'
    else false
  end;

  if not v_allowed then
    raise exception 'Invalid review transition: % -> %', old.review_state, new.review_state
      using errcode = '23514';
  end if;

  if new.review_state = 'REVIEW_DELIVERED' and not exists (
    select 1
    from public.evidence_profiles p
    where p.submission_id = new.id and p.delivered_at is not null
  ) then
    raise exception 'REVIEW_DELIVERED requires a delivered profile'
      using errcode = '23514';
  end if;

  if new.review_state = 'CORRECTION_REQUESTED' and not exists (
    select 1
    from public.evidence_profiles p
    where p.submission_id = new.id and p.correction_requested_at is not null
  ) then
    raise exception 'CORRECTION_REQUESTED requires a profile correction request'
      using errcode = '23514';
  end if;

  if new.review_state = 'REVIEW_CONFIRMED' and not exists (
    select 1
    from public.evidence_profiles p
    where p.submission_id = new.id and p.confirmed_at is not null
  ) then
    raise exception 'REVIEW_CONFIRMED requires a confirmed profile'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger evidence_review_submissions_enforce_transition
before update of review_state on public.evidence_review_submissions
for each row execute function public.enforce_review_state_transition();

create function public.enforce_opt_in_state_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_allowed boolean := false;
begin
  if new.opt_in_status is not distinct from old.opt_in_status then
    return new;
  end if;

  v_allowed := case old.opt_in_status
    when 'NOT_OFFERED' then new.opt_in_status = 'OFFERED'
    when 'OFFERED' then new.opt_in_status in ('ACCEPTED', 'DECLINED')
    else false
  end;

  if not v_allowed then
    raise exception 'Invalid opt-in transition: % -> %', old.opt_in_status, new.opt_in_status
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger talent_opt_ins_enforce_transition
before update of opt_in_status on public.talent_opt_ins
for each row execute function public.enforce_opt_in_state_transition();

create function public.protect_delivered_profile()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    if old.delivered_at is not null then
      raise exception 'Delivered evidence profiles cannot be deleted'
        using errcode = '23514';
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
    raise exception 'Delivered evidence profile content is immutable'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger evidence_profiles_protect_delivered
before update or delete on public.evidence_profiles
for each row execute function public.protect_delivered_profile();

create function public.protect_delivered_profile_findings()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_profile_id uuid;
begin
  v_profile_id := case when tg_op = 'DELETE' then old.profile_id else new.profile_id end;

  if exists (
    select 1 from public.evidence_profiles p
    where p.id = v_profile_id and p.delivered_at is not null
  ) then
    raise exception 'Findings for a delivered profile are immutable'
      using errcode = '23514';
  end if;

  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create trigger evidence_findings_protect_delivered
before insert or update or delete on public.evidence_findings
for each row execute function public.protect_delivered_profile_findings();

create function public.log_v1a_workflow_event()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_table_name = 'evidence_review_submissions' then
    if tg_op = 'INSERT' then
      insert into public.workflow_events(entity_type, entity_id, event_type)
      values ('SUBMISSION', new.id, 'SUBMISSION_CREATED');
    elsif new.review_state is distinct from old.review_state then
      insert into public.workflow_events(
        entity_type,
        entity_id,
        event_type,
        actor_reference,
        metadata
      ) values (
        'SUBMISSION',
        new.id,
        'REVIEW_STATE_CHANGED',
        new.reviewer_reference,
        jsonb_build_object('from', old.review_state, 'to', new.review_state)
      );
    elsif new.coherence_status is distinct from old.coherence_status then
      insert into public.workflow_events(
        entity_type,
        entity_id,
        event_type,
        actor_reference,
        metadata
      ) values (
        'SUBMISSION',
        new.id,
        'COHERENCE_REVIEWED',
        new.reviewer_reference,
        jsonb_build_object('status', new.coherence_status)
      );
    end if;
  elsif tg_table_name = 'evidence_profiles' and tg_op = 'INSERT' then
    insert into public.workflow_events(entity_type, entity_id, event_type, metadata)
    values (
      'PROFILE',
      new.id,
      'PROFILE_VERSION_CREATED',
      jsonb_build_object('review_version', new.review_version)
    );
  elsif tg_table_name = 'talent_opt_ins' and tg_op = 'UPDATE'
    and new.opt_in_status is distinct from old.opt_in_status then
    insert into public.workflow_events(entity_type, entity_id, event_type, metadata)
    values (
      'OPT_IN',
      new.id,
      case new.opt_in_status
        when 'OFFERED' then 'OPT_IN_OFFERED'::public.workflow_event_type
        when 'ACCEPTED' then 'OPT_IN_ACCEPTED'::public.workflow_event_type
        when 'DECLINED' then 'OPT_IN_DECLINED'::public.workflow_event_type
      end,
      jsonb_build_object('from', old.opt_in_status, 'to', new.opt_in_status)
    );
  elsif tg_table_name = 'profile_access_tokens' then
    if tg_op = 'INSERT' then
      insert into public.workflow_events(entity_type, entity_id, event_type)
      values ('ACCESS_TOKEN', new.id, 'ACCESS_TOKEN_CREATED');
    elsif old.revoked_at is null and new.revoked_at is not null then
      insert into public.workflow_events(entity_type, entity_id, event_type)
      values ('ACCESS_TOKEN', new.id, 'ACCESS_TOKEN_REVOKED');
    end if;
  end if;

  return new;
end;
$$;

create trigger evidence_review_submissions_log_event
after insert or update of review_state, coherence_status on public.evidence_review_submissions
for each row execute function public.log_v1a_workflow_event();

create trigger evidence_profiles_log_event
after insert on public.evidence_profiles
for each row execute function public.log_v1a_workflow_event();

create trigger talent_opt_ins_log_event
after update of opt_in_status on public.talent_opt_ins
for each row execute function public.log_v1a_workflow_event();

create trigger profile_access_tokens_log_event
after insert or update of revoked_at on public.profile_access_tokens
for each row execute function public.log_v1a_workflow_event();

create function public.transition_review_state(
  p_submission_id uuid,
  p_to_state public.review_state,
  p_actor_reference text default null
)
returns public.evidence_review_submissions
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_submission public.evidence_review_submissions;
begin
  select * into v_submission
  from public.evidence_review_submissions
  where id = p_submission_id
  for update;

  if not found then
    raise exception 'Evidence review submission not found' using errcode = 'P0002';
  end if;

  update public.evidence_review_submissions
  set review_state = p_to_state,
      reviewer_reference = coalesce(p_actor_reference, reviewer_reference)
  where id = p_submission_id
  returning * into v_submission;

  return v_submission;
end;
$$;

create function public.create_evidence_profile_version(
  p_submission_id uuid,
  p_professional_intent_snapshot jsonb,
  p_evidence_context_snapshot jsonb,
  p_recommendations jsonb default '[]'::jsonb
)
returns public.evidence_profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_submission public.evidence_review_submissions;
  v_latest public.evidence_profiles;
  v_profile public.evidence_profiles;
  v_next_version integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_submission_id::text, 0));

  select * into v_submission
  from public.evidence_review_submissions
  where id = p_submission_id
  for update;

  if not found then
    raise exception 'Evidence review submission not found' using errcode = 'P0002';
  end if;

  select * into v_latest
  from public.evidence_profiles
  where submission_id = p_submission_id
  order by review_version desc
  limit 1
  for update;

  if found then
    if v_latest.correction_requested_at is null then
      raise exception 'A new profile version requires a correction request'
        using errcode = '23514';
    end if;

    if v_submission.review_state = 'CORRECTION_REQUESTED' then
      update public.evidence_review_submissions
      set review_state = 'REVIEW_IN_PROGRESS'
      where id = p_submission_id
      returning * into v_submission;
    end if;

    if v_submission.review_state <> 'REVIEW_IN_PROGRESS' then
      raise exception 'Corrected profile creation requires REVIEW_IN_PROGRESS'
        using errcode = '23514';
    end if;

    v_next_version := v_latest.review_version + 1;
  else
    if v_submission.review_state <> 'REVIEW_IN_PROGRESS' then
      raise exception 'First profile creation requires REVIEW_IN_PROGRESS'
        using errcode = '23514';
    end if;
    v_next_version := 1;
  end if;

  insert into public.evidence_profiles (
    person_id,
    submission_id,
    review_version,
    professional_intent_snapshot,
    evidence_context_snapshot,
    recommendations,
    supersedes_profile_id
  ) values (
    v_submission.person_id,
    p_submission_id,
    v_next_version,
    p_professional_intent_snapshot,
    p_evidence_context_snapshot,
    p_recommendations,
    v_latest.id
  )
  returning * into v_profile;

  return v_profile;
end;
$$;

create function public.deliver_evidence_profile(
  p_profile_id uuid,
  p_actor_reference text default null
)
returns public.evidence_profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_profile public.evidence_profiles;
  v_now timestamptz := now();
begin
  select * into v_profile
  from public.evidence_profiles
  where id = p_profile_id
  for update;

  if not found then
    raise exception 'Evidence profile not found' using errcode = 'P0002';
  end if;

  if v_profile.delivered_at is not null then
    raise exception 'Evidence profile is already delivered' using errcode = '23514';
  end if;

  if exists (
    select 1 from public.evidence_profiles newer
    where newer.submission_id = v_profile.submission_id
      and newer.review_version > v_profile.review_version
  ) then
    raise exception 'Only the latest profile version may be delivered' using errcode = '23514';
  end if;

  update public.evidence_profiles
  set reviewed_at = coalesce(reviewed_at, v_now), delivered_at = v_now
  where id = p_profile_id
  returning * into v_profile;

  update public.evidence_review_submissions
  set review_state = 'REVIEW_DELIVERED',
      reviewer_reference = coalesce(p_actor_reference, reviewer_reference)
  where id = v_profile.submission_id
    and review_state = 'REVIEW_IN_PROGRESS';

  if not found then
    raise exception 'Profile delivery requires REVIEW_IN_PROGRESS' using errcode = '23514';
  end if;

  insert into public.workflow_events(
    entity_type, entity_id, event_type, actor_reference,
    metadata
  ) values (
    'PROFILE', p_profile_id, 'PROFILE_DELIVERED', p_actor_reference,
    jsonb_build_object('review_version', v_profile.review_version)
  );

  return v_profile;
end;
$$;

create function public.request_evidence_profile_correction(
  p_profile_id uuid,
  p_correction_message text,
  p_actor_reference text default null
)
returns public.evidence_profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_profile public.evidence_profiles;
begin
  if char_length(btrim(p_correction_message)) not between 1 and 5000 then
    raise exception 'Correction message is required' using errcode = '23514';
  end if;

  select * into v_profile
  from public.evidence_profiles
  where id = p_profile_id
  for update;

  if not found then
    raise exception 'Evidence profile not found' using errcode = 'P0002';
  end if;

  if v_profile.delivered_at is null or v_profile.confirmed_at is not null
    or v_profile.correction_requested_at is not null then
    raise exception 'Only an unconfirmed delivered profile may request correction'
      using errcode = '23514';
  end if;

  update public.evidence_profiles
  set correction_requested_at = now(), correction_message = btrim(p_correction_message)
  where id = p_profile_id
  returning * into v_profile;

  update public.evidence_review_submissions
  set review_state = 'CORRECTION_REQUESTED',
      reviewer_reference = coalesce(p_actor_reference, reviewer_reference)
  where id = v_profile.submission_id
    and review_state = 'REVIEW_DELIVERED';

  if not found then
    raise exception 'Correction requires REVIEW_DELIVERED' using errcode = '23514';
  end if;

  insert into public.workflow_events(entity_type, entity_id, event_type, actor_reference)
  values ('PROFILE', p_profile_id, 'CORRECTION_REQUESTED', p_actor_reference);

  return v_profile;
end;
$$;

create function public.confirm_evidence_profile(
  p_profile_id uuid,
  p_actor_reference text default null
)
returns public.evidence_profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_profile public.evidence_profiles;
begin
  select * into v_profile
  from public.evidence_profiles
  where id = p_profile_id
  for update;

  if not found then
    raise exception 'Evidence profile not found' using errcode = 'P0002';
  end if;

  if v_profile.delivered_at is null or v_profile.confirmed_at is not null
    or v_profile.correction_requested_at is not null then
    raise exception 'Only an uncorrected delivered profile may be confirmed'
      using errcode = '23514';
  end if;

  update public.evidence_profiles
  set confirmed_at = now()
  where id = p_profile_id
  returning * into v_profile;

  update public.evidence_review_submissions
  set review_state = 'REVIEW_CONFIRMED',
      reviewer_reference = coalesce(p_actor_reference, reviewer_reference)
  where id = v_profile.submission_id
    and review_state = 'REVIEW_DELIVERED';

  if not found then
    raise exception 'Confirmation requires REVIEW_DELIVERED' using errcode = '23514';
  end if;

  insert into public.workflow_events(entity_type, entity_id, event_type, actor_reference)
  values ('PROFILE', p_profile_id, 'PROFILE_CONFIRMED', p_actor_reference);

  return v_profile;
end;
$$;

create function public.transition_talent_opt_in(
  p_opt_in_id uuid,
  p_to_state public.opt_in_status,
  p_network_consent_version text default null,
  p_network_consent_text text default null,
  p_network_consent_at timestamptz default null
)
returns public.talent_opt_ins
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_opt_in public.talent_opt_ins;
  v_now timestamptz := now();
begin
  select * into v_opt_in
  from public.talent_opt_ins
  where id = p_opt_in_id
  for update;

  if not found then
    raise exception 'Talent opt-in not found' using errcode = 'P0002';
  end if;

  if p_to_state = 'OFFERED' then
    update public.talent_opt_ins
    set opt_in_status = p_to_state, offered_at = v_now
    where id = p_opt_in_id
    returning * into v_opt_in;
  elsif p_to_state = 'ACCEPTED' then
    if char_length(btrim(p_network_consent_version)) not between 1 and 64
      or char_length(btrim(p_network_consent_text)) not between 20 and 4000
      or p_network_consent_at is null then
      raise exception 'Acceptance requires a complete network consent snapshot'
        using errcode = '23514';
    end if;

    update public.talent_opt_ins
    set opt_in_status = p_to_state,
        accepted_at = v_now,
        network_consent_version = btrim(p_network_consent_version),
        network_consent_text = btrim(p_network_consent_text),
        network_consent_at = p_network_consent_at
    where id = p_opt_in_id
    returning * into v_opt_in;
  elsif p_to_state = 'DECLINED' then
    update public.talent_opt_ins
    set opt_in_status = p_to_state, declined_at = v_now
    where id = p_opt_in_id
    returning * into v_opt_in;
  else
    update public.talent_opt_ins
    set opt_in_status = p_to_state
    where id = p_opt_in_id
    returning * into v_opt_in;
  end if;

  return v_opt_in;
end;
$$;

alter table public.people enable row level security;
alter table public.evidence_review_submissions enable row level security;
alter table public.evidence_profiles enable row level security;
alter table public.evidence_findings enable row level security;
alter table public.talent_opt_ins enable row level security;
alter table public.profile_access_tokens enable row level security;
alter table public.workflow_events enable row level security;

alter table public.people force row level security;
alter table public.evidence_review_submissions force row level security;
alter table public.evidence_profiles force row level security;
alter table public.evidence_findings force row level security;
alter table public.talent_opt_ins force row level security;
alter table public.profile_access_tokens force row level security;
alter table public.workflow_events force row level security;

revoke all on table public.people from anon, authenticated;
revoke all on table public.evidence_review_submissions from anon, authenticated;
revoke all on table public.evidence_profiles from anon, authenticated;
revoke all on table public.evidence_findings from anon, authenticated;
revoke all on table public.talent_opt_ins from anon, authenticated;
revoke all on table public.profile_access_tokens from anon, authenticated;
revoke all on table public.workflow_events from anon, authenticated;

grant select, insert, update, delete on table public.people to service_role;
grant select, insert, update, delete on table public.evidence_review_submissions to service_role;
grant select, insert, update, delete on table public.evidence_profiles to service_role;
grant select, insert, update, delete on table public.evidence_findings to service_role;
grant select, insert, update, delete on table public.talent_opt_ins to service_role;
grant select, insert, update, delete on table public.profile_access_tokens to service_role;
grant select, insert, update, delete on table public.workflow_events to service_role;

revoke execute on function public.set_v1a_updated_at() from public, anon, authenticated;
revoke execute on function public.enforce_review_state_transition() from public, anon, authenticated;
revoke execute on function public.enforce_opt_in_state_transition() from public, anon, authenticated;
revoke execute on function public.protect_delivered_profile() from public, anon, authenticated;
revoke execute on function public.protect_delivered_profile_findings() from public, anon, authenticated;
revoke execute on function public.log_v1a_workflow_event() from public, anon, authenticated;
revoke execute on function public.transition_review_state(uuid, public.review_state, text) from public, anon, authenticated;
revoke execute on function public.create_evidence_profile_version(uuid, jsonb, jsonb, jsonb) from public, anon, authenticated;
revoke execute on function public.deliver_evidence_profile(uuid, text) from public, anon, authenticated;
revoke execute on function public.request_evidence_profile_correction(uuid, text, text) from public, anon, authenticated;
revoke execute on function public.confirm_evidence_profile(uuid, text) from public, anon, authenticated;
revoke execute on function public.transition_talent_opt_in(uuid, public.opt_in_status, text, text, timestamptz) from public, anon, authenticated;

grant execute on function public.transition_review_state(uuid, public.review_state, text) to service_role;
grant execute on function public.create_evidence_profile_version(uuid, jsonb, jsonb, jsonb) to service_role;
grant execute on function public.deliver_evidence_profile(uuid, text) to service_role;
grant execute on function public.request_evidence_profile_correction(uuid, text, text) to service_role;
grant execute on function public.confirm_evidence_profile(uuid, text) to service_role;
grant execute on function public.transition_talent_opt_in(uuid, public.opt_in_status, text, text, timestamptz) to service_role;

comment on table public.people is 'Canonical professional identity; email is deduplication identity, not authentication.';
comment on column public.profile_access_tokens.token_hash is 'SHA-256 lowercase hex digest only. Raw access tokens must never be stored.';
comment on table public.workflow_events is 'Non-sensitive operational audit events only; never store professional scoring.';
