begin;

do $smoke$
declare
  v_person uuid;
  v_submission uuid;
  v_profile_v1 uuid;
  v_profile_v2 uuid;
  v_opt_in uuid;
  v_version integer;
  v_supersedes uuid;
  v_count integer;
begin
  insert into public.people(full_name, email, country, "current_role")
  values ('Synthetic Phase A', 'PHASE-A-SMOKE@EXAMPLE.TEST', 'Argentina', 'Software Engineer')
  returning id into v_person;

  if (select email_normalized from public.people where id = v_person)
    <> 'phase-a-smoke@example.test' then
    raise exception 'email normalization failed';
  end if;

  begin
    insert into public.people(full_name, email, country, "current_role")
    values ('Duplicate Synthetic', 'phase-a-smoke@example.test', 'Argentina', 'Engineer');
    raise exception 'duplicate normalized email was accepted';
  exception when unique_violation then
    null;
  end;

  insert into public.evidence_review_submissions(
    person_id,
    evidence_type,
    evidence_url,
    individual_contribution,
    opportunity_status,
    professional_intents,
    source,
    review_consent_version,
    review_consent_text,
    review_consent_at
  ) values (
    v_person,
    'PRIVATE_PROFESSIONAL_EXPERIENCE',
    null,
    'Built a synthetic system solely for the non-production smoke test.',
    'OPEN',
    array['FULL_TIME']::public.professional_intent[],
    'direct',
    'smoke-v1',
    'Synthetic consent text used only inside a rolled-back transaction.',
    now()
  ) returning id into v_submission;

  begin
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
      v_person,
      'OTHER',
      'Contradictory synthetic submission for constraint validation.',
      'NOT_LOOKING',
      array['FULL_TIME']::public.professional_intent[],
      'direct',
      'smoke-v1',
      'Synthetic consent text used only inside a rolled-back transaction.',
      now()
    );
    raise exception 'contradictory intent was accepted';
  exception when check_violation then
    null;
  end;

  perform public.transition_review_state(
    v_submission,
    'READY_FOR_REVIEW',
    'smoke-operator'
  );
  perform public.transition_review_state(
    v_submission,
    'REVIEW_IN_PROGRESS',
    'smoke-operator'
  );

  select id, review_version
  into v_profile_v1, v_version
  from public.create_evidence_profile_version(
    v_submission,
    '{"opportunity_status":"OPEN","professional_intents":["FULL_TIME"]}'::jsonb,
    '{"evidence_type":"PRIVATE_PROFESSIONAL_EXPERIENCE"}'::jsonb,
    '[]'::jsonb
  );

  if v_version <> 1 then
    raise exception 'first profile version was not one';
  end if;

  begin
    insert into public.evidence_profiles(
      person_id,
      submission_id,
      review_version,
      professional_intent_snapshot,
      evidence_context_snapshot
    ) values (v_person, v_submission, 1, '{}'::jsonb, '{}'::jsonb);
    raise exception 'duplicate profile version was accepted';
  exception when unique_violation then
    null;
  end;

  insert into public.evidence_findings(
    profile_id,
    finding_status,
    capability,
    explanation,
    sort_order
  ) values (
    v_profile_v1,
    'UNKNOWN',
    'Synthetic capability',
    'Unknown is retained distinctly and is not treated as a gap.',
    0
  );

  perform public.deliver_evidence_profile(v_profile_v1, 'smoke-operator');

  begin
    update public.evidence_profiles
    set recommendations = '[{"should":"fail"}]'::jsonb
    where id = v_profile_v1;
    raise exception 'delivered profile content was mutable';
  exception when check_violation then
    null;
  end;

  perform public.request_evidence_profile_correction(
    v_profile_v1,
    'Synthetic correction request.',
    'smoke-professional'
  );

  select id, review_version, supersedes_profile_id
  into v_profile_v2, v_version, v_supersedes
  from public.create_evidence_profile_version(
    v_submission,
    '{"opportunity_status":"OPEN","professional_intents":["FULL_TIME"]}'::jsonb,
    '{"evidence_type":"PRIVATE_PROFESSIONAL_EXPERIENCE","revision":2}'::jsonb,
    '[]'::jsonb
  );

  if v_version <> 2 or v_supersedes <> v_profile_v1 then
    raise exception 'corrected profile versioning failed';
  end if;

  insert into public.evidence_findings(
    profile_id,
    finding_status,
    capability,
    explanation,
    sort_order
  ) values (
    v_profile_v2,
    'SUPPORTED',
    'Synthetic capability',
    'Synthetic finding for the replacement version.',
    0
  );

  perform public.deliver_evidence_profile(v_profile_v2, 'smoke-operator');
  perform public.confirm_evidence_profile(v_profile_v2, 'smoke-professional');

  insert into public.talent_opt_ins(person_id, profile_id)
  values (v_person, v_profile_v2)
  returning id into v_opt_in;

  perform public.transition_talent_opt_in(v_opt_in, 'OFFERED');
  perform public.transition_talent_opt_in(
    v_opt_in,
    'ACCEPTED',
    'network-smoke-v1',
    'Synthetic network consent used only in a rolled-back transaction.',
    now()
  );

  insert into public.profile_access_tokens(profile_id, token_hash, expires_at)
  values (v_profile_v2, repeat('a', 64), now() + interval '1 day');

  begin
    insert into public.profile_access_tokens(profile_id, token_hash, expires_at)
    values (v_profile_v2, repeat('a', 64), now() + interval '1 day');
    raise exception 'duplicate token hash was accepted';
  exception when unique_violation then
    null;
  end;

  begin
    perform public.transition_review_state(
      v_submission,
      'SUBMITTED',
      'smoke-operator'
    );
    raise exception 'invalid terminal review transition was accepted';
  exception when check_violation then
    null;
  end;

  select count(*)
  into v_count
  from public.workflow_events
  where entity_id in (v_submission, v_profile_v1, v_profile_v2, v_opt_in);

  if v_count < 10 then
    raise exception 'workflow event trail was incomplete';
  end if;

  raise notice 'V1A synthetic transaction smoke test passed';
end
$smoke$;

rollback;

select 'synthetic records rolled back' as cleanup_status;
