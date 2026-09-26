-- Preserve clarification audit history and fail closed on null RPC inputs.

create or replace function public.record_evidence_review_coherence(
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
  v_reviewed_at timestamptz := now();
  v_clarification_history jsonb;
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
  if p_submission_id is null then
    raise exception 'Submission id is required' using errcode = '23514';
  end if;

  if p_actor_reference is null
    or char_length(btrim(p_actor_reference)) not between 1 and 160 then
    raise exception 'Actor reference is required' using errcode = '23514';
  end if;

  if p_operator_note is null
    or char_length(btrim(p_operator_note)) not between 1 and 2000 then
    raise exception 'Operator note is required' using errcode = '23514';
  end if;

  if p_decision is null or p_decision not in (
    'READY_FOR_REVIEW',
    'CLARIFICATION_NEEDED',
    'NOT_ACTIONABLE_YET'
  ) then
    raise exception 'Invalid coherence decision' using errcode = '23514';
  end if;

  if p_dimensions is null
    or jsonb_typeof(p_dimensions) <> 'object'
    or (select count(*) from jsonb_object_keys(p_dimensions))
      <> cardinality(v_allowed_dimensions)
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
    if p_clarification_required is null
      or char_length(btrim(p_clarification_required)) not between 1 and 2000 then
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

  v_clarification_history := coalesce(
    v_submission.coherence_details -> 'clarification_history',
    '[]'::jsonb
  );
  if jsonb_typeof(v_clarification_history) <> 'array' then
    v_clarification_history := '[]'::jsonb;
  end if;

  if p_decision = 'CLARIFICATION_NEEDED' then
    v_clarification_history := v_clarification_history || jsonb_build_array(
      jsonb_build_object(
        'required', btrim(p_clarification_required),
        'requested_by', btrim(p_actor_reference),
        'requested_at', v_reviewed_at
      )
    );
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
        end,
        'clarification_history', v_clarification_history
      ),
      reviewer_reference = btrim(p_actor_reference),
      coherence_reviewed_at = v_reviewed_at,
      review_state = p_decision
  where id = p_submission_id
  returning * into v_submission;

  return v_submission;
end;
$$;

create or replace function public.create_evidence_profile_v1(
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
  if p_submission_id is null then
    raise exception 'Submission id is required' using errcode = '23514';
  end if;

  if p_actor_reference is null
    or char_length(btrim(p_actor_reference)) not between 1 and 160 then
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
        'finding_status',
        'capability',
        'explanation',
        'sort_order'
      ]
      or exists (
        select 1 from jsonb_object_keys(v_finding) finding_key
        where finding_key not in (
          'finding_status',
          'capability',
          'explanation',
          'evidence_reference',
          'sort_order'
        )
      )
      or (v_finding ->> 'finding_status') not in (
        'SUPPORTED',
        'PARTIAL',
        'UNKNOWN',
        'NEEDS_CLARIFICATION'
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

create or replace function public.record_evidence_review_work_time(
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
  if p_submission_id is null then
    raise exception 'Submission id is required' using errcode = '23514';
  end if;

  if p_category is null or p_category not in (
    'COHERENCE_REVIEW',
    'CLARIFICATION',
    'EVIDENCE_REVIEW',
    'PROFILE_COMPOSITION'
  ) then
    raise exception 'Invalid work category' using errcode = '23514';
  end if;

  if p_minutes is null or p_minutes not between 1 and 480 then
    raise exception 'Work minutes must be between 1 and 480'
      using errcode = '23514';
  end if;

  if p_actor_reference is null
    or char_length(btrim(p_actor_reference)) not between 1 and 160 then
    raise exception 'Actor reference is required' using errcode = '23514';
  end if;

  if p_occurred_at is null then
    raise exception 'Work occurrence timestamp is required'
      using errcode = '23514';
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

-- CREATE OR REPLACE retains the service-role-only execute grants from 004.
