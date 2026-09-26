-- Keep each polymorphic trigger branch isolated from unrelated record shapes.

create or replace function public.log_v1a_workflow_event()
returns trigger
language plpgsql
set search_path = ''
as $$
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
    end if;
  elsif tg_table_name = 'evidence_profiles' then
    if tg_op = 'INSERT' then
      insert into public.workflow_events(entity_type, entity_id, event_type, metadata)
      values (
        'PROFILE',
        new.id,
        'PROFILE_VERSION_CREATED',
        jsonb_build_object('review_version', new.review_version)
      );
    end if;
  elsif tg_table_name = 'talent_opt_ins' then
    if tg_op = 'UPDATE' then
      if new.opt_in_status is distinct from old.opt_in_status then
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
    end if;
  elsif tg_table_name = 'profile_access_tokens' then
    if tg_op = 'INSERT' then
      insert into public.workflow_events(entity_type, entity_id, event_type)
      values ('ACCESS_TOKEN', new.id, 'ACCESS_TOKEN_CREATED');
    elsif tg_op = 'UPDATE' then
      if old.revoked_at is null and new.revoked_at is not null then
        insert into public.workflow_events(entity_type, entity_id, event_type)
        values ('ACCESS_TOKEN', new.id, 'ACCESS_TOKEN_REVOKED');
      end if;
    end if;
  end if;

  return new;
end;
$$;

revoke execute on function public.log_v1a_workflow_event()
  from public, anon, authenticated;
