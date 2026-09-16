begin;

do $phase_c$
declare
  v_ready_person uuid;
  v_ready_submission uuid;
  v_ready_profile uuid;
  v_clarification_person uuid;
  v_clarification_submission uuid;
  v_not_actionable_person uuid;
  v_not_actionable_submission uuid;
  v_count integer;
  v_dimensions jsonb := '{
    "RESPONSE_RELEVANCE":"CONFIRMED",
    "PROFESSIONAL_INTENT_CLARITY":"CONFIRMED",
    "INDIVIDUAL_CONTRIBUTION_CLARITY":"CONFIRMED",
    "EXPECTATION_CONSISTENCY":"UNKNOWN",
    "EVIDENCE_READINESS":"CONFIRMED",
    "FOLLOW_THROUGH":"NOT_APPLICABLE"
  }'::jsonb;
begin
  select count(*) into v_count
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relkind = 'r'
    and c.relname in (
      'people',
      'evidence_review_submissions',
      'evidence_profiles',
      'evidence_findings',
      'talent_opt_ins',
      'profile_access_tokens',
      'workflow_events'
    );
  if v_count <> 7 then
    raise exception 'V1A seven-table model changed';
  end if;

  select count(*) into v_count
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname in (
      'people',
      'evidence_review_submissions',
      'evidence_profiles',
      'evidence_findings',
      'talent_opt_ins',
      'profile_access_tokens',
      'workflow_events'
    )
    and c.relrowsecurity
    and c.relforcerowsecurity;
  if v_count <> 7 then
    raise exception 'RLS and forced RLS must remain enabled on all V1A tables';
  end if;

  if has_schema_privilege('anon', 'internal', 'USAGE')
    or has_schema_privilege('authenticated', 'internal', 'USAGE')
    or has_table_privilege('anon', 'internal.evidence_review_queue', 'SELECT')
    or has_table_privilege(
      'authenticated',
      'internal.evidence_review_queue',
      'SELECT'
    ) then
    raise exception 'Browser roles can access internal operations';
  end if;

  select count(*) into v_count
  from information_schema.columns
  where table_schema = 'internal'
    and table_name = 'evidence_review_queue'
    and column_name = 'token_hash';
  if v_count <> 0 then
    raise exception 'Operational queue exposes token hashes';
  end if;

  select count(*) into v_count
  from pg_policies
  where schemaname = 'public'
    and tablename in (
      'people',
      'evidence_review_submissions',
      'evidence_profiles',
      'evidence_findings',
      'talent_opt_ins',
      'profile_access_tokens',
      'workflow_events'
    );
  if v_count <> 0 then
    raise exception 'Unexpected public RLS policy exists';
  end if;

  insert into public.people(full_name, email, country, "current_role")
  values (
    'Synthetic Phase C Ready',
    'phase-c-ready@example.test',
    'Argentina',
    'Synthetic Engineer'
  ) returning id into v_ready_person;

  insert into public.evidence_review_submissions(
    person_id,
    evidence_type,
    individual_contribution,
    opportunity_status,
    professional_intents,
    source,
    review_consent_version,
    review_consent_text,
    review_consent_at
  ) values (
    v_ready_person,
    'PRIVATE_PROFESSIONAL_EXPERIENCE',
    'Created a synthetic service boundary for the Phase C smoke test.',
    'REVIEW_ONLY',
    '{}',
    'direct',
    'synthetic-v1',
    'Synthetic consent text used only in a rolled-back database test.',
    now()
  ) returning id into v_ready_submission;

  perform public.record_evidence_review_coherence(
    v_ready_submission,
    'READY_FOR_REVIEW',
    v_dimensions,
    'Enough synthetic context exists to perform a manual review.',
    'synthetic-operator'
  );
  perform public.transition_review_state(
    v_ready_submission,
    'REVIEW_IN_PROGRESS',
    'synthetic-operator'
  );

  select id into v_ready_profile
  from public.create_evidence_profile_v1(
    v_ready_submission,
    '[
      {
        "finding_status":"SUPPORTED",
        "capability":"System boundary reasoning",
        "explanation":"The synthetic evidence supports one scoped architecture decision.",
        "sort_order":0
      },
      {
        "finding_status":"PARTIAL",
        "capability":"Testing approach",
        "explanation":"Only part of the testing approach is represented.",
        "sort_order":1
      },
      {
        "finding_status":"UNKNOWN",
        "capability":"Cloud depth",
        "explanation":"The available evidence does not support a responsible conclusion; this is not a gap.",
        "sort_order":2
      }
    ]'::jsonb,
    '[{
      "validation_area":"Architecture reasoning",
      "rationale":"Validate one additional tradeoff only if relevant to a future opportunity."
    }]'::jsonb,
    'synthetic-operator'
  );

  perform public.record_evidence_review_work_time(
    v_ready_submission,
    'COHERENCE_REVIEW',
    10,
    'synthetic-operator'
  );
  perform public.record_evidence_review_work_time(
    v_ready_submission,
    'EVIDENCE_REVIEW',
    25,
    'synthetic-operator'
  );
  perform public.record_evidence_review_work_time(
    v_ready_submission,
    'PROFILE_COMPOSITION',
    15,
    'synthetic-operator'
  );

  if (select review_state from public.evidence_review_submissions
      where id = v_ready_submission) <> 'REVIEW_IN_PROGRESS' then
    raise exception 'Profile composition changed the review lifecycle';
  end if;

  if (select review_version from public.evidence_profiles
      where id = v_ready_profile) <> 1
    or (select delivered_at from public.evidence_profiles
        where id = v_ready_profile) is not null then
    raise exception 'Profile v1 was versioned or delivered incorrectly';
  end if;

  select count(*) into v_count
  from public.evidence_findings
  where profile_id = v_ready_profile
    and finding_status in ('SUPPORTED', 'PARTIAL', 'UNKNOWN');
  if v_count <> 3 then
    raise exception 'Expected Phase C findings were not persisted';
  end if;

  if not exists (
    select 1 from public.evidence_findings
    where profile_id = v_ready_profile
      and finding_status = 'UNKNOWN'
      and explanation ilike '%not a gap%'
  ) then
    raise exception 'UNKNOWN was not preserved as neutral';
  end if;

  if jsonb_array_length((select recommendations from public.evidence_profiles
      where id = v_ready_profile)) <> 1 then
    raise exception 'Profile recommendations were not persisted';
  end if;

  select count(*) into v_count
  from public.workflow_events
  where entity_id = v_ready_submission
    and event_type = 'WORK_RECORDED';
  if v_count <> 3 then
    raise exception 'Work-time event trail is incomplete';
  end if;

  insert into public.people(full_name, email, country, "current_role")
  values (
    'Synthetic Phase C Clarification',
    'phase-c-clarification@example.test',
    'Uruguay',
    'Synthetic Developer'
  ) returning id into v_clarification_person;

  insert into public.evidence_review_submissions(
    person_id,
    evidence_type,
    individual_contribution,
    opportunity_status,
    professional_intents,
    source,
    review_consent_version,
    review_consent_text,
    review_consent_at
  ) values (
    v_clarification_person,
    'PROFESSIONAL_PROJECT',
    'Described a synthetic team project without enough ownership detail.',
    'REVIEW_ONLY',
    '{}',
    'direct',
    'synthetic-v1',
    'Synthetic consent text used only in a rolled-back database test.',
    now()
  ) returning id into v_clarification_submission;

  perform public.record_evidence_review_coherence(
    v_clarification_submission,
    'CLARIFICATION_NEEDED',
    jsonb_set(
      v_dimensions,
      '{INDIVIDUAL_CONTRIBUTION_CLARITY}',
      '"UNKNOWN"'::jsonb
    ),
    'The individual contribution needs one concrete clarification.',
    'synthetic-operator',
    'Distinguish the individual contribution from the team outcome.'
  );

  perform public.record_evidence_review_coherence(
    v_clarification_submission,
    'READY_FOR_REVIEW',
    jsonb_set(
      jsonb_set(
        v_dimensions,
        '{INDIVIDUAL_CONTRIBUTION_CLARITY}',
        '"CONFIRMED"'::jsonb
      ),
      '{FOLLOW_THROUGH}',
      '"CONFIRMED"'::jsonb
    ),
    'The synthetic clarification was provided and resolved the ambiguity.',
    'synthetic-operator'
  );

  if (select review_state from public.evidence_review_submissions
      where id = v_clarification_submission) <> 'READY_FOR_REVIEW' then
    raise exception 'Clarification path did not reach READY_FOR_REVIEW';
  end if;

  if jsonb_array_length((
      select coherence_details -> 'clarification_history'
      from public.evidence_review_submissions
      where id = v_clarification_submission
    )) <> 1
    or (select coherence_details #>> '{clarification_history,0,required}'
        from public.evidence_review_submissions
        where id = v_clarification_submission)
      <> 'Distinguish the individual contribution from the team outcome.' then
    raise exception 'Clarification request history was not preserved';
  end if;

  select count(*) into v_count
  from public.workflow_events
  where entity_id = v_clarification_submission
    and event_type in ('COHERENCE_REVIEWED', 'REVIEW_STATE_CHANGED');
  if v_count <> 4 then
    raise exception 'Clarification workflow history is incomplete';
  end if;

  insert into public.people(full_name, email, country, "current_role")
  values (
    'Synthetic Phase C Not Actionable',
    'phase-c-not-actionable@example.test',
    'Colombia',
    'Synthetic Analyst'
  ) returning id into v_not_actionable_person;

  insert into public.evidence_review_submissions(
    person_id,
    evidence_type,
    individual_contribution,
    opportunity_status,
    professional_intents,
    source,
    review_consent_version,
    review_consent_text,
    review_consent_at
  ) values (
    v_not_actionable_person,
    'OTHER',
    'Provided synthetic information that is not yet actionable for review.',
    'NOT_LOOKING',
    '{}',
    'direct',
    'synthetic-v1',
    'Synthetic consent text used only in a rolled-back database test.',
    now()
  ) returning id into v_not_actionable_submission;

  perform public.record_evidence_review_coherence(
    v_not_actionable_submission,
    'NOT_ACTIONABLE_YET',
    jsonb_set(v_dimensions, '{EVIDENCE_READINESS}', '"UNKNOWN"'::jsonb),
    'There is not enough usable synthetic signal to proceed yet; this is not rejection.',
    'synthetic-operator'
  );

  if exists (
    select 1 from public.evidence_profiles
    where submission_id = v_not_actionable_submission
  ) or exists (
    select 1 from public.talent_opt_ins
    where person_id = v_not_actionable_person
  ) then
    raise exception 'NOT_ACTIONABLE_YET created downstream records';
  end if;

  if exists (
    select 1 from public.profile_access_tokens
    where profile_id = v_ready_profile
  ) then
    raise exception 'Phase C created an access token';
  end if;

  if exists (
    select 1 from public.talent_opt_ins
    where person_id in (
      v_ready_person,
      v_clarification_person,
      v_not_actionable_person
    )
  ) then
    raise exception 'Phase C created a talent opt-in';
  end if;

  if not exists (
    select 1 from internal.evidence_review_queue
    where submission_id = v_ready_submission
      and latest_profile_version = 1
  ) then
    raise exception 'Internal operational queue does not resolve profile v1';
  end if;

  raise notice 'Phase C transactional smoke test passed';
end
$phase_c$;

rollback;

select 'Phase C synthetic records rolled back' as cleanup_status;
