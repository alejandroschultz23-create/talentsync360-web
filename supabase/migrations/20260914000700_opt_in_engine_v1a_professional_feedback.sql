-- OPT-IN ENGINE v1A Phase D: private delivery, correction and confirmation.

alter type public.workflow_event_type
  add value if not exists 'PROFILE_NOTIFICATION_RECORDED';

alter table public.evidence_profiles
  drop constraint evidence_profiles_correction_check,
  add constraint evidence_profiles_correction_check check (
    (correction_requested_at is null and correction_message is null)
    or (
      correction_requested_at is not null
      and correction_message is not null
      and char_length(btrim(correction_message)) between 1 and 2000
    )
  );

-- Preserve the Phase C actor context for token issue/revocation events.
create or replace function public.log_v1a_workflow_event()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_actor_reference text := nullif(
    current_setting('app.evidence_review_actor_reference', true),
    ''
  );
begin
  if tg_table_name = 'evidence_review_submissions' then
    if tg_op = 'INSERT' then
      insert into public.workflow_events(entity_type, entity_id, event_type)
      values ('SUBMISSION', new.id, 'SUBMISSION_CREATED');
    elsif tg_op = 'UPDATE' then
      if new.review_state is distinct from old.review_state then
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
      end if;

      if new.coherence_status is distinct from old.coherence_status then
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
          jsonb_build_object(
            'status', new.coherence_status,
            'dimensions', new.coherence_details -> 'dimensions'
          )
        );
      end if;
    end if;
  elsif tg_table_name = 'evidence_profiles' then
    if tg_op = 'INSERT' then
      insert into public.workflow_events(
        entity_type,
        entity_id,
        event_type,
        actor_reference,
        metadata
      ) values (
        'PROFILE',
        new.id,
        'PROFILE_VERSION_CREATED',
        v_actor_reference,
        jsonb_build_object('review_version', new.review_version)
      );
    end if;
  elsif tg_table_name = 'talent_opt_ins' then
    if tg_op = 'UPDATE' and new.opt_in_status is distinct from old.opt_in_status then
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
    end if;
  elsif tg_table_name = 'profile_access_tokens' then
    if tg_op = 'INSERT' then
      insert into public.workflow_events(
        entity_type,
        entity_id,
        event_type,
        actor_reference
      ) values (
        'ACCESS_TOKEN',
        new.id,
        'ACCESS_TOKEN_CREATED',
        v_actor_reference
      );
    elsif tg_op = 'UPDATE'
      and old.revoked_at is null and new.revoked_at is not null then
      insert into public.workflow_events(
        entity_type,
        entity_id,
        event_type,
        actor_reference
      ) values (
        'ACCESS_TOKEN',
        new.id,
        'ACCESS_TOKEN_REVOKED',
        v_actor_reference
      );
    end if;
  end if;

  return new;
end;
$$;

create function public.create_evidence_profile_revision(
  p_submission_id uuid,
  p_findings jsonb,
  p_recommendations jsonb,
  p_actor_reference text
)
returns public.evidence_profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_submission public.evidence_review_submissions;
  v_person public.people;
  v_latest public.evidence_profiles;
  v_profile public.evidence_profiles;
  v_finding jsonb;
  v_recommendation jsonb;
  v_reviewed_at timestamptz := now();
begin
  if p_submission_id is null then
    raise exception 'Submission id is required' using errcode = '23514';
  end if;
  if p_actor_reference is null
    or char_length(btrim(p_actor_reference)) not between 1 and 160 then
    raise exception 'Actor reference is required' using errcode = '23514';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_submission_id::text, 0));

  select * into v_submission
  from public.evidence_review_submissions
  where id = p_submission_id
  for update;
  if not found then
    raise exception 'Evidence review submission not found' using errcode = 'P0002';
  end if;
  if v_submission.review_state <> 'REVIEW_IN_PROGRESS' then
    raise exception 'Profile revision requires REVIEW_IN_PROGRESS'
      using errcode = '23514';
  end if;

  select * into v_latest
  from public.evidence_profiles
  where submission_id = p_submission_id
  order by review_version desc
  limit 1
  for update;
  if not found or v_latest.correction_requested_at is null then
    raise exception 'Profile revision requires a prior correction request'
      using errcode = '23514';
  end if;

  select * into strict v_person
  from public.people
  where id = v_submission.person_id;

  if p_findings is null
    or jsonb_typeof(p_findings) <> 'array'
    or jsonb_array_length(p_findings) not between 1 and 50 then
    raise exception 'Profile findings must contain between 1 and 50 items'
      using errcode = '23514';
  end if;

  for v_finding in select value from jsonb_array_elements(p_findings)
  loop
    if jsonb_typeof(v_finding) <> 'object'
      or not v_finding ?& array[
        'finding_status', 'capability', 'explanation', 'sort_order'
      ]
      or exists (
        select 1 from jsonb_object_keys(v_finding) finding_key
        where finding_key not in (
          'finding_status', 'capability', 'explanation',
          'evidence_reference', 'sort_order'
        )
      )
      or (v_finding ->> 'finding_status') not in (
        'SUPPORTED', 'PARTIAL', 'UNKNOWN', 'NEEDS_CLARIFICATION'
      )
      or char_length(btrim(v_finding ->> 'capability')) not between 1 and 160
      or char_length(btrim(v_finding ->> 'explanation')) not between 1 and 5000
      or (v_finding ? 'evidence_reference'
        and v_finding -> 'evidence_reference' <> 'null'::jsonb
        and char_length(btrim(v_finding ->> 'evidence_reference')) not between 1 and 2000)
      or coalesce(v_finding ->> 'sort_order', '') !~ '^(0|[1-9][0-9]{0,3})$' then
      raise exception 'Invalid profile finding' using errcode = '23514';
    end if;
  end loop;

  if p_recommendations is null
    or jsonb_typeof(p_recommendations) <> 'array'
    or jsonb_array_length(p_recommendations) > 20 then
    raise exception 'Profile recommendations must be an array of at most 20 items'
      using errcode = '23514';
  end if;

  for v_recommendation in select value from jsonb_array_elements(p_recommendations)
  loop
    if jsonb_typeof(v_recommendation) <> 'object'
      or (select count(*) from jsonb_object_keys(v_recommendation)) <> 2
      or not v_recommendation ?& array['validation_area', 'rationale']
      or char_length(btrim(v_recommendation ->> 'validation_area')) not between 1 and 160
      or char_length(btrim(v_recommendation ->> 'rationale')) not between 1 and 1000 then
      raise exception 'Invalid profile recommendation' using errcode = '23514';
    end if;
  end loop;

  perform set_config(
    'app.evidence_review_actor_reference',
    btrim(p_actor_reference),
    true
  );

  insert into public.evidence_profiles (
    person_id,
    submission_id,
    review_version,
    professional_intent_snapshot,
    evidence_context_snapshot,
    recommendations,
    supersedes_profile_id,
    reviewed_at
  ) values (
    v_person.id,
    v_submission.id,
    v_latest.review_version + 1,
    jsonb_build_object(
      'person_id', v_person.id,
      'full_name', v_person.full_name,
      'country', v_person.country,
      'current_role', v_person.current_role,
      'opportunity_status', v_submission.opportunity_status,
      'professional_intents', to_jsonb(v_submission.professional_intents)
    ),
    jsonb_build_object(
      'evidence_type', v_submission.evidence_type,
      'evidence_url', v_submission.evidence_url,
      'individual_contribution', v_submission.individual_contribution,
      'professional_context', v_submission.professional_context,
      'review_context', jsonb_build_object(
        'reviewed_at', v_reviewed_at,
        'source', v_submission.source,
        'campaign', v_submission.campaign
      )
    ),
    p_recommendations,
    v_latest.id,
    v_reviewed_at
  ) returning * into v_profile;

  insert into public.evidence_findings (
    profile_id,
    finding_status,
    capability,
    explanation,
    evidence_reference,
    sort_order
  )
  select
    v_profile.id,
    (finding ->> 'finding_status')::public.finding_status,
    btrim(finding ->> 'capability'),
    btrim(finding ->> 'explanation'),
    nullif(btrim(finding ->> 'evidence_reference'), ''),
    (finding ->> 'sort_order')::integer
  from jsonb_array_elements(p_findings) finding;

  return v_profile;
end;
$$;

create function public.deliver_evidence_profile_with_token(
  p_submission_id uuid,
  p_token_hash text,
  p_expires_at timestamptz,
  p_actor_reference text
)
returns public.profile_access_tokens
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_submission public.evidence_review_submissions;
  v_profile public.evidence_profiles;
  v_token public.profile_access_tokens;
  v_now timestamptz := now();
begin
  if p_submission_id is null then
    raise exception 'Submission id is required' using errcode = '23514';
  end if;
  if p_token_hash is null or p_token_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid token hash' using errcode = '23514';
  end if;
  if p_expires_at is null
    or p_expires_at < v_now + interval '1 minute'
    or p_expires_at > v_now + interval '7 days' then
    raise exception 'Token expiry must be between one minute and seven days'
      using errcode = '23514';
  end if;
  if p_actor_reference is null
    or char_length(btrim(p_actor_reference)) not between 1 and 160 then
    raise exception 'Actor reference is required' using errcode = '23514';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_submission_id::text, 0));
  select * into v_submission
  from public.evidence_review_submissions
  where id = p_submission_id
  for update;
  if not found then
    raise exception 'Evidence review submission not found' using errcode = 'P0002';
  end if;
  if v_submission.review_state <> 'REVIEW_IN_PROGRESS' then
    raise exception 'Profile delivery requires REVIEW_IN_PROGRESS'
      using errcode = '23514';
  end if;

  select * into v_profile
  from public.evidence_profiles
  where submission_id = p_submission_id
  order by review_version desc
  limit 1
  for update;
  if not found or v_profile.delivered_at is not null then
    raise exception 'Latest profile is not eligible for delivery'
      using errcode = '23514';
  end if;

  perform set_config(
    'app.evidence_review_actor_reference',
    btrim(p_actor_reference),
    true
  );

  update public.profile_access_tokens token
  set revoked_at = v_now
  from public.evidence_profiles profile
  where token.profile_id = profile.id
    and profile.submission_id = p_submission_id
    and token.revoked_at is null;

  insert into public.profile_access_tokens(profile_id, token_hash, expires_at)
  values (v_profile.id, p_token_hash, p_expires_at)
  returning * into v_token;

  perform public.deliver_evidence_profile(v_profile.id, btrim(p_actor_reference));
  return v_token;
end;
$$;

create function public.reissue_evidence_profile_access(
  p_submission_id uuid,
  p_token_hash text,
  p_expires_at timestamptz,
  p_actor_reference text
)
returns public.profile_access_tokens
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_submission public.evidence_review_submissions;
  v_profile public.evidence_profiles;
  v_token public.profile_access_tokens;
  v_now timestamptz := now();
begin
  if p_submission_id is null then
    raise exception 'Submission id is required' using errcode = '23514';
  end if;
  if p_token_hash is null or p_token_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid token hash' using errcode = '23514';
  end if;
  if p_expires_at is null
    or p_expires_at < v_now + interval '1 minute'
    or p_expires_at > v_now + interval '7 days' then
    raise exception 'Token expiry must be between one minute and seven days'
      using errcode = '23514';
  end if;
  if p_actor_reference is null
    or char_length(btrim(p_actor_reference)) not between 1 and 160 then
    raise exception 'Actor reference is required' using errcode = '23514';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_submission_id::text, 0));
  select * into v_submission
  from public.evidence_review_submissions
  where id = p_submission_id
  for update;
  if not found then
    raise exception 'Evidence review submission not found' using errcode = 'P0002';
  end if;
  if v_submission.review_state not in (
    'REVIEW_DELIVERED', 'CORRECTION_REQUESTED', 'REVIEW_CONFIRMED'
  ) then
    raise exception 'Current review state does not allow access reissue'
      using errcode = '23514';
  end if;

  select * into v_profile
  from public.evidence_profiles
  where submission_id = p_submission_id
  order by review_version desc
  limit 1
  for update;
  if not found or v_profile.delivered_at is null then
    raise exception 'Latest profile is not delivered' using errcode = '23514';
  end if;

  perform set_config(
    'app.evidence_review_actor_reference',
    btrim(p_actor_reference),
    true
  );
  update public.profile_access_tokens
  set revoked_at = v_now
  where profile_id = v_profile.id and revoked_at is null;
  insert into public.profile_access_tokens(profile_id, token_hash, expires_at)
  values (v_profile.id, p_token_hash, p_expires_at)
  returning * into v_token;
  return v_token;
end;
$$;

create function public.revoke_evidence_profile_access(
  p_submission_id uuid,
  p_actor_reference text
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_revoked integer;
begin
  if p_submission_id is null then
    raise exception 'Submission id is required' using errcode = '23514';
  end if;
  if p_actor_reference is null
    or char_length(btrim(p_actor_reference)) not between 1 and 160 then
    raise exception 'Actor reference is required' using errcode = '23514';
  end if;
  if not exists (
    select 1 from public.evidence_review_submissions
    where id = p_submission_id
  ) then
    raise exception 'Evidence review submission not found' using errcode = 'P0002';
  end if;

  perform set_config(
    'app.evidence_review_actor_reference',
    btrim(p_actor_reference),
    true
  );
  update public.profile_access_tokens token
  set revoked_at = now()
  from public.evidence_profiles profile
  where token.profile_id = profile.id
    and profile.submission_id = p_submission_id
    and token.revoked_at is null;
  get diagnostics v_revoked = row_count;
  return v_revoked;
end;
$$;

create function public.confirm_evidence_profile_by_token(
  p_token_hash text
)
returns public.evidence_profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_token public.profile_access_tokens;
  v_profile public.evidence_profiles;
  v_state public.review_state;
begin
  if p_token_hash is null or p_token_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Private access is invalid' using errcode = '28000';
  end if;
  select * into v_token
  from public.profile_access_tokens
  where token_hash = p_token_hash
    and revoked_at is null
    and expires_at > now()
  for update;
  if not found then
    raise exception 'Private access is invalid' using errcode = '28000';
  end if;
  select * into v_profile from public.evidence_profiles
  where id = v_token.profile_id for update;
  if not found or v_profile.delivered_at is null then
    raise exception 'Private access is invalid' using errcode = '28000';
  end if;
  select review_state into v_state from public.evidence_review_submissions
  where id = v_profile.submission_id and person_id = v_profile.person_id
  for update;
  if v_profile.confirmed_at is not null and v_state = 'REVIEW_CONFIRMED' then
    return v_profile;
  end if;
  return public.confirm_evidence_profile(
    v_profile.id,
    'professional-private-access'
  );
end;
$$;

create function public.request_evidence_profile_correction_by_token(
  p_token_hash text,
  p_correction_message text
)
returns public.evidence_profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_token public.profile_access_tokens;
  v_profile public.evidence_profiles;
  v_state public.review_state;
begin
  if p_token_hash is null or p_token_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Private access is invalid' using errcode = '28000';
  end if;
  if p_correction_message is null
    or char_length(btrim(p_correction_message)) not between 1 and 2000 then
    raise exception 'Correction message is invalid' using errcode = '23514';
  end if;
  select * into v_token
  from public.profile_access_tokens
  where token_hash = p_token_hash
    and revoked_at is null
    and expires_at > now()
  for update;
  if not found then
    raise exception 'Private access is invalid' using errcode = '28000';
  end if;
  select * into v_profile from public.evidence_profiles
  where id = v_token.profile_id for update;
  if not found or v_profile.delivered_at is null then
    raise exception 'Private access is invalid' using errcode = '28000';
  end if;
  select review_state into v_state from public.evidence_review_submissions
  where id = v_profile.submission_id and person_id = v_profile.person_id
  for update;
  if v_profile.correction_requested_at is not null
    and v_state in ('CORRECTION_REQUESTED', 'REVIEW_IN_PROGRESS') then
    return v_profile;
  end if;
  return public.request_evidence_profile_correction(
    v_profile.id,
    btrim(p_correction_message),
    'professional-private-access'
  );
end;
$$;

create function public.record_evidence_profile_notification(
  p_profile_id uuid,
  p_status text,
  p_actor_reference text
)
returns public.workflow_events
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event public.workflow_events;
begin
  if p_profile_id is null or not exists (
    select 1 from public.evidence_profiles where id = p_profile_id
  ) then
    raise exception 'Evidence profile not found' using errcode = 'P0002';
  end if;
  if p_status is null or p_status not in ('sent', 'skipped', 'failed') then
    raise exception 'Invalid notification status' using errcode = '23514';
  end if;
  if p_actor_reference is null
    or char_length(btrim(p_actor_reference)) not between 1 and 160 then
    raise exception 'Actor reference is required' using errcode = '23514';
  end if;
  insert into public.workflow_events(
    entity_type,
    entity_id,
    event_type,
    actor_reference,
    metadata
  ) values (
    'PROFILE',
    p_profile_id,
    'PROFILE_NOTIFICATION_RECORDED',
    btrim(p_actor_reference),
    jsonb_build_object('status', p_status)
  ) returning * into v_event;
  return v_event;
end;
$$;

revoke execute on function public.create_evidence_profile_revision(
  uuid, jsonb, jsonb, text
) from public, anon, authenticated;
revoke execute on function public.deliver_evidence_profile_with_token(
  uuid, text, timestamptz, text
) from public, anon, authenticated;
revoke execute on function public.reissue_evidence_profile_access(
  uuid, text, timestamptz, text
) from public, anon, authenticated;
revoke execute on function public.revoke_evidence_profile_access(
  uuid, text
) from public, anon, authenticated;
revoke execute on function public.confirm_evidence_profile_by_token(text)
  from public, anon, authenticated;
revoke execute on function public.request_evidence_profile_correction_by_token(
  text, text
) from public, anon, authenticated;
revoke execute on function public.record_evidence_profile_notification(
  uuid, text, text
) from public, anon, authenticated;

grant execute on function public.create_evidence_profile_revision(
  uuid, jsonb, jsonb, text
) to service_role;
grant execute on function public.deliver_evidence_profile_with_token(
  uuid, text, timestamptz, text
) to service_role;
grant execute on function public.reissue_evidence_profile_access(
  uuid, text, timestamptz, text
) to service_role;
grant execute on function public.revoke_evidence_profile_access(
  uuid, text
) to service_role;
grant execute on function public.confirm_evidence_profile_by_token(text)
  to service_role;
grant execute on function public.request_evidence_profile_correction_by_token(
  text, text
) to service_role;
grant execute on function public.record_evidence_profile_notification(
  uuid, text, text
) to service_role;

comment on function public.deliver_evidence_profile_with_token(
  uuid, text, timestamptz, text
) is 'Atomically binds a hashed token to the latest profile and delivers it.';
comment on function public.confirm_evidence_profile_by_token(text)
  is 'Confirms only the profile bound to a valid opaque-token hash.';
comment on function public.request_evidence_profile_correction_by_token(text, text)
  is 'Requests correction only for the profile bound to a valid opaque-token hash.';
