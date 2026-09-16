-- Enforce invariants even for manual non-production operator writes.

alter table public.evidence_review_submissions
  add constraint evidence_review_submissions_no_null_intents_check
  check (array_position(professional_intents, null) is null),
  add constraint evidence_review_submissions_id_person_key
  unique (id, person_id);

alter table public.evidence_profiles
  add constraint evidence_profiles_submission_person_fkey
  foreign key (submission_id, person_id)
  references public.evidence_review_submissions(id, person_id)
  on delete restrict,
  add constraint evidence_profiles_id_submission_key
  unique (id, submission_id),
  add constraint evidence_profiles_supersedes_submission_fkey
  foreign key (supersedes_profile_id, submission_id)
  references public.evidence_profiles(id, submission_id)
  on delete restrict;

alter table public.evidence_profiles
  drop constraint evidence_profiles_correction_check,
  add constraint evidence_profiles_correction_check check (
    (correction_requested_at is null and correction_message is null)
    or (
      correction_requested_at is not null
      and correction_message is not null
      and char_length(btrim(correction_message)) between 1 and 5000
    )
  );

alter table public.talent_opt_ins
  add constraint talent_opt_ins_decision_order_check check (
    (accepted_at is null or accepted_at >= offered_at)
    and (declined_at is null or declined_at >= offered_at)
  ),
  add constraint talent_opt_ins_consent_order_check check (
    network_consent_at is null
    or (
      network_consent_at >= offered_at
      and network_consent_at <= accepted_at
    )
  );
