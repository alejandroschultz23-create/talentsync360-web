begin;

do $phase_d_smoke$
declare
  v_count integer;
  v_person_1 uuid;
  v_submission_1 uuid;
  v_profile_1 public.evidence_profiles;
  v_token_1 public.profile_access_tokens;
  v_confirmed_profile public.evidence_profiles;

  v_person_2 uuid;
  v_submission_2 uuid;
  v_profile_2 public.evidence_profiles;
  v_token_2 public.profile_access_tokens;
  v_corrected_profile public.evidence_profiles;
  v_revision_2 public.evidence_profiles;
  v_token_3 public.profile_access_tokens;
  v_token_4 public.profile_access_tokens;

  v_hash_1 text := '1111111111111111111111111111111111111111111111111111111111111111';
  v_hash_2 text := '2222222222222222222222222222222222222222222222222222222222222222';
  v_hash_3 text := '3333333333333333333333333333333333333333333333333333333333333333';
  v_hash_4 text := '4444444444444444444444444444444444444444444444444444444444444444';

  v_findings_json jsonb := jsonb_build_array(
    jsonb_build_object(
      'finding_status', 'SUPPORTED',
      'capability', 'Distributed Systems',
      'explanation', 'Strong distributed systems capability verified.',
      'evidence_reference', 'https://example.test/evidence',
      'sort_order', 0
    ),
    jsonb_build_object(
      'finding_status', 'UNKNOWN',
      'capability', 'Observability depth',
      'explanation', 'Observability telemetry was not present in supplied artifacts; not a gap.',
      'sort_order', 1
    )
  );

  v_recommendations_json jsonb := jsonb_build_array(
    jsonb_build_object(
      'validation_area', 'Architecture',
      'rationale', 'Demonstrate high throughput performance benchmarks.'
    )
  );
begin
  -- 1. Seven-table invariant check
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
    raise exception 'V1A seven-table model violated: count = %', v_count;
  end if;

  -- 2. Forced RLS invariant check
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

  -- =========================================================================
  -- PATH A: SUBMITTED -> IN_PROGRESS -> v1 -> DELIVER -> TOKEN -> CONFIRM
  -- =========================================================================

  insert into public.people (full_name, email, country, "current_role")
  values ('Synthetic Professional A', 'phase_d_a@example.test', 'Argentina', 'Staff Engineer')
  returning id into v_person_1;

  insert into public.evidence_review_submissions (
    person_id,
    opportunity_status,
    professional_intents,
    source,
    evidence_type,
    individual_contribution,
    review_state,
    review_consent_version,
    review_consent_text,
    review_consent_at
  ) values (
    v_person_1,
    'OPEN',
    array['CONTRACT']::public.professional_intent[],
    'direct',
    'PUBLIC_REPOSITORY',
    'Lead architect and sole committer for the synthetic test repository.',
    'REVIEW_IN_PROGRESS',
    'evidence-review-v1-2026-09-14',
    'Autorizo a TalentSync360 a utilizar la información enviada para realizar esta Professional Evidence Review y contactarme en relación con ella.',
    now()
  ) returning id into v_submission_1;

  -- Create profile v1
  select * into v_profile_1
  from public.create_evidence_profile_v1(
    v_submission_1,
    v_findings_json,
    v_recommendations_json,
    'phase_d_operator'
  );

  if v_profile_1.review_version <> 1 or v_profile_1.delivered_at is not null then
    raise exception 'Initial profile v1 has invalid state';
  end if;

  -- Deliver profile v1 with token
  select * into v_token_1
  from public.deliver_evidence_profile_with_token(
    v_submission_1,
    v_hash_1,
    now() + interval '3 days',
    'phase_d_operator'
  );

  if v_token_1.token_hash <> v_hash_1 or v_token_1.profile_id <> v_profile_1.id then
    raise exception 'Delivered token not bound to profile v1';
  end if;

  -- Verify submission transitioned to REVIEW_DELIVERED
  if not exists (
    select 1 from public.evidence_review_submissions
    where id = v_submission_1 and review_state = 'REVIEW_DELIVERED'
  ) then
    raise exception 'Submission did not transition to REVIEW_DELIVERED';
  end if;

  -- Confirm profile via token
  select * into v_confirmed_profile
  from public.confirm_evidence_profile_by_token(v_hash_1);

  if v_confirmed_profile.confirmed_at is null then
    raise exception 'Profile v1 confirmed_at was not set by confirm_evidence_profile_by_token';
  end if;

  -- Verify submission transitioned to REVIEW_CONFIRMED
  if not exists (
    select 1 from public.evidence_review_submissions
    where id = v_submission_1 and review_state = 'REVIEW_CONFIRMED'
  ) then
    raise exception 'Submission did not transition to REVIEW_CONFIRMED';
  end if;

  -- Verify confirm idempotency
  perform public.confirm_evidence_profile_by_token(v_hash_1);

  -- =========================================================================
  -- PATH B: CORRECTION LOOP (v1 -> DELIVER -> CORRECTION -> v2 -> DELIVER -> CONFIRM)
  -- =========================================================================

  insert into public.people (full_name, email, country, "current_role")
  values ('Synthetic Professional B', 'phase_d_b@example.test', 'Uruguay', 'Principal Architect')
  returning id into v_person_2;

  insert into public.evidence_review_submissions (
    person_id,
    opportunity_status,
    professional_intents,
    source,
    evidence_type,
    individual_contribution,
    review_state,
    review_consent_version,
    review_consent_text,
    review_consent_at
  ) values (
    v_person_2,
    'OPEN',
    array['FULL_TIME']::public.professional_intent[],
    'direct',
    'PRIVATE_PROFESSIONAL_EXPERIENCE',
    'Architectural specification and benchmark tests.',
    'REVIEW_IN_PROGRESS',
    'evidence-review-v1-2026-09-14',
    'Autorizo a TalentSync360 a utilizar la información enviada para realizar esta Professional Evidence Review y contactarme en relación con ella.',
    now()
  ) returning id into v_submission_2;

  -- Create profile v1
  select * into v_profile_2
  from public.create_evidence_profile_v1(
    v_submission_2,
    v_findings_json,
    v_recommendations_json,
    'phase_d_operator'
  );

  -- Deliver profile v1 with token 2
  select * into v_token_2
  from public.deliver_evidence_profile_with_token(
    v_submission_2,
    v_hash_2,
    now() + interval '3 days',
    'phase_d_operator'
  );

  -- Request correction by token
  select * into v_corrected_profile
  from public.request_evidence_profile_correction_by_token(
    v_hash_2,
    'Please clarify the distributed streaming scope in finding 1.'
  );

  if v_corrected_profile.correction_requested_at is null
     or v_corrected_profile.correction_message <> 'Please clarify the distributed streaming scope in finding 1.' then
    raise exception 'Profile correction was not recorded properly';
  end if;

  -- Verify submission transitioned to CORRECTION_REQUESTED
  if not exists (
    select 1 from public.evidence_review_submissions
    where id = v_submission_2 and review_state = 'CORRECTION_REQUESTED'
  ) then
    raise exception 'Submission did not transition to CORRECTION_REQUESTED';
  end if;

  -- Transition back to REVIEW_IN_PROGRESS for revision
  perform public.transition_review_state(v_submission_2, 'REVIEW_IN_PROGRESS', 'phase_d_operator');

  -- Create revision v2
  select * into v_revision_2
  from public.create_evidence_profile_revision(
    v_submission_2,
    v_findings_json,
    v_recommendations_json,
    'phase_d_operator'
  );

  if v_revision_2.review_version <> 2 then
    raise exception 'Revision review_version expected 2, got %', v_revision_2.review_version;
  end if;
  if v_revision_2.supersedes_profile_id <> v_profile_2.id then
    raise exception 'Revision supersedes_profile_id does not point to v1';
  end if;
  if v_revision_2.delivered_at is not null then
    raise exception 'Revision v2 must start undelivered';
  end if;

  -- Verify profile v1 content was NOT mutated
  if not exists (
    select 1 from public.evidence_profiles
    where id = v_profile_2.id
      and review_version = 1
      and delivered_at is not null
      and correction_requested_at is not null
  ) then
    raise exception 'Prior profile v1 was mutated during revision';
  end if;

  -- Deliver revision v2 with token 3
  select * into v_token_3
  from public.deliver_evidence_profile_with_token(
    v_submission_2,
    v_hash_3,
    now() + interval '3 days',
    'phase_d_operator'
  );

  -- Verify old token 2 for v1 was revoked
  if not exists (
    select 1 from public.profile_access_tokens
    where id = v_token_2.id and revoked_at is not null
  ) then
    raise exception 'Token 2 was not revoked upon v2 delivery';
  end if;

  -- Verify token 3 is active and bound to v2
  if v_token_3.profile_id <> v_revision_2.id or v_token_3.revoked_at is not null then
    raise exception 'Token 3 is not active or not bound to v2';
  end if;

  -- =========================================================================
  -- REISSUE & REVOKE VERIFICATION
  -- =========================================================================

  -- Reissue access with token 4
  select * into v_token_4
  from public.reissue_evidence_profile_access(
    v_submission_2,
    v_hash_4,
    now() + interval '2 days',
    'phase_d_operator'
  );

  -- Verify token 3 was revoked
  if not exists (
    select 1 from public.profile_access_tokens
    where id = v_token_3.id and revoked_at is not null
  ) then
    raise exception 'Token 3 was not revoked on reissue';
  end if;

  -- Revoke access
  perform public.revoke_evidence_profile_access(v_submission_2, 'phase_d_operator');

  -- Verify token 4 is now revoked
  if not exists (
    select 1 from public.profile_access_tokens
    where id = v_token_4.id and revoked_at is not null
  ) then
    raise exception 'Token 4 was not revoked on revoke_evidence_profile_access';
  end if;

  -- =========================================================================
  -- TALENT OPT-IN INVARIANT: ZERO OPT-INS MUST BE CREATED
  -- =========================================================================
  select count(*) into v_count from public.talent_opt_ins;
  if v_count <> 0 then
    raise exception 'Phase D lifecycle must NOT create talent opt-in records; count = %', v_count;
  end if;

  -- Record notification outcome smoke check
  perform public.record_evidence_profile_notification(
    v_revision_2.id,
    'sent',
    'phase_d_operator'
  );

  if not exists (
    select 1 from public.workflow_events
    where entity_id = v_revision_2.id
      and event_type = 'PROFILE_NOTIFICATION_RECORDED'
  ) then
    raise exception 'PROFILE_NOTIFICATION_RECORDED workflow event was not created';
  end if;

end $phase_d_smoke$;

rollback;
