-- OPT-IN ENGINE v1A Phase C: internal queue and atomic manual operations.

create schema if not exists internal;

revoke all on schema internal from public, anon, authenticated;
grant usage on schema internal to service_role;

create view internal.evidence_review_queue
with (security_invoker = true)
as
select
  s.id as submission_id,
  p.id as person_id,
  p.full_name,
  p.email,
  p.country,
  p.current_role,
  s.opportunity_status,
  s.professional_intents,
  s.source,
  s.campaign,
  s.evidence_type,
  s.evidence_url,
  s.individual_contribution,
  s.professional_context,
  s.coherence_status,
  s.coherence_details,
  s.reviewer_reference,
  s.review_state,
  s.created_at,
  s.coherence_reviewed_at,
  latest.review_version as latest_profile_version,
  latest.created_at as latest_profile_created_at
from public.evidence_review_submissions s
join public.people p on p.id = s.person_id
left join lateral (
  select ep.review_version, ep.created_at
  from public.evidence_profiles ep
  where ep.submission_id = s.id
  order by ep.review_version desc
  limit 1
) latest on true;

revoke all on table internal.evidence_review_queue
  from public, anon, authenticated;
grant select on table internal.evidence_review_queue to service_role;

comment on schema internal is
  'Internal operator surfaces. This schema must not be exposed through PostgREST.';
comment on view internal.evidence_review_queue is
  'Pilot Evidence Review queue. Excludes consent text, access tokens and secrets.';

-- Phase C records coherence and the corresponding lifecycle transition in one
-- update. Log both audit events when both fields change together.
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
      insert into public.workflow_events(entity_type, entity_id, event_type)
      values ('ACCESS_TOKEN', new.id, 'ACCESS_TOKEN_CREATED');
    elsif tg_op = 'UPDATE'
      and old.revoked_at is null and new.revoked_at is not null then
      insert into public.workflow_events(entity_type, entity_id, event_type)
      values ('ACCESS_TOKEN', new.id, 'ACCESS_TOKEN_REVOKED');
    end if;
  end if;

  return new;
end;
$$;

create function public.record_evidence_review_coherence(
  p_submission_id uuid,
  p_decision public.review_state,
  p_dimensions jsonb,
  p_operator_note text,
  p_actor_reference text,
  p_clarification_required text default null
)
returns public.evidence_review_submissions
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_submission public.evidence_review_submissions;
  v_coherence_status public.coherence_status;
  v_allowed_dimensions constant text[] := array[
    'RESPONSE_RELEVANCE',
    'PROFESSIONAL_INTENT_CLARITY',
    'INDIVIDUAL_CONTRIBUTION_CLARITY',
    'EXPECTATION_CONSISTENCY',
    'EVIDENCE_READINESS',
    'FOLLOW_THROUGH'
  ];
  v_allowed_values constant text[] := array[
    'CONFIRMED',
    'PARTIAL',
    'UNKNOWN',
    'CONTRADICTORY',
    'NOT_APPLICABLE'
  ];
begin
  if char_length(btrim(p_actor_reference)) not between 1 and 160 then
    raise exception 'Actor reference is required' using errcode = '23514';
  end if;

  if char_length(btrim(p_operator_note)) not between 1 and 2000 then
    raise exception 'Operator note is required' using errcode = '23514';
  end if;

  if p_decision not in (
    'READY_FOR_REVIEW',
    'CLARIFICATION_NEEDED',
    'NOT_ACTIONABLE_YET'
  ) then
    raise exception 'Invalid coherence decision' using errcode = '23514';
  end if;

  if jsonb_typeof(p_dimensions) <> 'object'
    or jsonb_object_length(p_dimensions) <> cardinality(v_allowed_dimensions)
    or not p_dimensions ?& v_allowed_dimensions
    or exists (
      select 1
      from jsonb_each_text(p_dimensions) dimension
      where not (dimension.key = any(v_allowed_dimensions))
        or not (dimension.value = any(v_allowed_values))
    ) then
    raise exception 'Invalid coherence dimensions' using errcode = '23514';
  end if;

  if p_decision = 'CLARIFICATION_NEEDED' then
    if char_length(btrim(p_clarification_required)) not between 1 and 2000 then
      raise exception 'A specific clarification is required'
        using errcode = '23514';
    end if;
  elsif p_clarification_required is not null then
    raise exception 'Clarification text is allowed only for CLARIFICATION_NEEDED'
      using errcode = '23514';
  end if;

  select * into v_submission
  from public.evidence_review_submissions
  where id = p_submission_id
  for update;

  if not found then
    raise exception 'Evidence review submission not found' using errcode = 'P0002';
  end if;

  if v_submission.review_state = 'SUBMITTED' then
    if p_dimensions ->> 'FOLLOW_THROUGH' <> 'NOT_APPLICABLE' then
      raise exception 'FOLLOW_THROUGH is not observable at initial submission'
        using errcode = '23514';
    end if;
  elsif v_submission.review_state = 'CLARIFICATION_NEEDED' then
    if p_decision = 'CLARIFICATION_NEEDED' then
      raise exception 'A clarification cycle cannot be reopened'
        using errcode = '23514';
    end if;
  else
    raise exception 'Current review state does not allow coherence review'
      using errcode = '23514';
  end if;

  v_coherence_status := case p_decision
    when 'READY_FOR_REVIEW' then 'READY'::public.coherence_status
    when 'CLARIFICATION_NEEDED' then 'CLARIFICATION_NEEDED'::public.coherence_status
    when 'NOT_ACTIONABLE_YET' then 'NOT_ACTIONABLE_YET'::public.coherence_status
  end;

  update public.evidence_review_submissions
  set coherence_status = v_coherence_status,
      coherence_details = jsonb_build_object(
        'version', 'v1',
        'dimensions', p_dimensions,
        'operator_note', btrim(p_operator_note),
        'clarification_required', case
          when p_clarification_required is null then null
          else to_jsonb(btrim(p_clarification_required))
        end
      ),
      reviewer_reference = btrim(p_actor_reference),
      coherence_reviewed_at = now(),
      review_state = p_decision
  where id = p_submission_id
  returning * into v_submission;

  return v_submission;
end;
$$;

create function public.create_evidence_profile_v1(
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
  v_profile public.evidence_profiles;
  v_finding jsonb;
  v_recommendation jsonb;
  v_reviewed_at timestamptz := now();
begin
  if char_length(btrim(p_actor_reference)) not between 1 and 160 then
    raise exception 'Actor reference is required' using errcode = '23514';
  end if;

  select * into v_submission
  from public.evidence_review_submissions
  where id = p_submission_id
  for update;

  if not found then
    raise exception 'Evidence review submission not found' using errcode = 'P0002';
  end if;

  if v_submission.review_state <> 'REVIEW_IN_PROGRESS' then
    raise exception 'Profile v1 requires REVIEW_IN_PROGRESS'
      using errcode = '23514';
  end if;

  if exists (
    select 1 from public.evidence_profiles
    where submission_id = p_submission_id
  ) then
    raise exception 'Profile v1 already exists' using errcode = '23514';
  end if;

  select * into strict v_person
  from public.people
  where id = v_submission.person_id;

  if jsonb_typeof(p_findings) <> 'array'
    or jsonb_array_length(p_findings) not between 1 and 50 then
    raise exception 'Profile findings must contain between 1 and 50 items'
      using errcode = '23514';
  end if;

  for v_finding in select value from jsonb_array_elements(p_findings)
  loop
    if jsonb_typeof(v_finding) <> 'object'
      or not v_finding ?& array[
        'finding_status',
        'capability',
        'explanation',
        'sort_order'
      ]
      or (v_finding ->> 'finding_status') not in (
        'SUPPORTED',
        'PARTIAL',
        'UNKNOWN',
        'NEEDS_CLARIFICATION'
      )
      or char_length(btrim(v_finding ->> 'capability')) not between 1 and 160
      or char_length(btrim(v_finding ->> 'explanation')) not between 1 and 5000
      or (v_finding ? 'evidence_reference' and v_finding -> 'evidence_reference' <> 'null'::jsonb
        and char_length(btrim(v_finding ->> 'evidence_reference')) not between 1 and 2000)
      or coalesce(v_finding ->> 'sort_order', '') !~ '^(0|[1-9][0-9]{0,3})$' then
      raise exception 'Invalid profile finding' using errcode = '23514';
    end if;
  end loop;

  if jsonb_typeof(p_recommendations) <> 'array'
    or jsonb_array_length(p_recommendations) > 20 then
    raise exception 'Profile recommendations must be an array of at most 20 items'
      using errcode = '23514';
  end if;

  for v_recommendation in select value from jsonb_array_elements(p_recommendations)
  loop
    if jsonb_typeof(v_recommendation) <> 'object'
      or jsonb_object_length(v_recommendation) <> 2
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
    reviewed_at
  ) values (
    v_person.id,
    v_submission.id,
    1,
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

create function public.record_evidence_review_work_time(
  p_submission_id uuid,
  p_category text,
  p_minutes integer,
  p_actor_reference text,
  p_occurred_at timestamptz default now()
)
returns public.workflow_events
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_submission_created_at timestamptz;
  v_event public.workflow_events;
begin
  if p_category not in (
    'COHERENCE_REVIEW',
    'CLARIFICATION',
    'EVIDENCE_REVIEW',
    'PROFILE_COMPOSITION'
  ) then
    raise exception 'Invalid work category' using errcode = '23514';
  end if;

  if p_minutes not between 1 and 480 then
    raise exception 'Work minutes must be between 1 and 480'
      using errcode = '23514';
  end if;

  if char_length(btrim(p_actor_reference)) not between 1 and 160 then
    raise exception 'Actor reference is required' using errcode = '23514';
  end if;

  select created_at into v_submission_created_at
  from public.evidence_review_submissions
  where id = p_submission_id;

  if not found then
    raise exception 'Evidence review submission not found' using errcode = 'P0002';
  end if;

  if p_occurred_at < v_submission_created_at
    or p_occurred_at > now() + interval '5 minutes' then
    raise exception 'Work occurrence timestamp is outside the allowed range'
      using errcode = '23514';
  end if;

  insert into public.workflow_events(
    entity_type,
    entity_id,
    event_type,
    actor_reference,
    metadata,
    occurred_at
  ) values (
    'SUBMISSION',
    p_submission_id,
    'WORK_RECORDED',
    btrim(p_actor_reference),
    jsonb_build_object('category', p_category, 'minutes', p_minutes),
    p_occurred_at
  ) returning * into v_event;

  return v_event;
end;
$$;

revoke execute on function public.record_evidence_review_coherence(
  uuid,
  public.review_state,
  jsonb,
  text,
  text,
  text
) from public, anon, authenticated;
revoke execute on function public.create_evidence_profile_v1(
  uuid,
  jsonb,
  jsonb,
  text
) from public, anon, authenticated;
revoke execute on function public.record_evidence_review_work_time(
  uuid,
  text,
  integer,
  text,
  timestamptz
) from public, anon, authenticated;

grant execute on function public.record_evidence_review_coherence(
  uuid,
  public.review_state,
  jsonb,
  text,
  text,
  text
) to service_role;
grant execute on function public.create_evidence_profile_v1(
  uuid,
  jsonb,
  jsonb,
  text
) to service_role;
grant execute on function public.record_evidence_review_work_time(
  uuid,
  text,
  integer,
  text,
  timestamptz
) to service_role;

comment on function public.record_evidence_review_coherence(
  uuid,
  public.review_state,
  jsonb,
  text,
  text,
  text
) is 'Atomically records the manual coherence gate and authoritative review transition.';
comment on function public.create_evidence_profile_v1(
  uuid,
  jsonb,
  jsonb,
  text
) is 'Creates internal profile v1 and findings without delivery or access-token side effects.';
comment on function public.record_evidence_review_work_time(
  uuid,
  text,
  integer,
  text,
  timestamptz
) is 'Records bounded, non-sensitive pilot work time in workflow_events.';
