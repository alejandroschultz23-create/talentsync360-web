# TalentSync360 — Opt-In Engine v1A
## 03. Approved Retention & Privacy Lifecycle Register

**Status:** OWNER DECISION GATE APPROVED / CLOSED; QUALIFIED LEGAL REVIEW APPROVED / CLOSED
**Current public policy:** `/privacy`, effective September 16, 2026 / 16 de septiembre de 2026.
**Runtime gate:** Migration 008 and its operator commands must be validated and applied before the policy is operated in Production. Migrations 001–007 are already applied there.

---

### 1. Approved retention windows

| Case | Retention and action |
| :--- | :--- |
| Abandoned, incomplete, or `NOT_ACTIONABLE_YET` without a confirmed review | 90 days from last meaningful activity, including a delivered but unconfirmed profile; close, delete, or anonymize under policy. Record external meaningful activity through the operator command before the due date is calculated. |
| Confirmed profile with Talent Network `DECLINED` | 180 days from `declined_at`, unless a valid deletion request requires earlier closure. |
| Talent Network `ACCEPTED` | Retain the confirmed profile while voluntary participation is active. Historical `ACCEPTED` with `withdrawn_at` is not active participation. |
| Withdrawal | Stop opportunity use and outreach immediately; guarded withdrawal records `withdrawn_at` and revokes links. Complete technical closure within 30 days. Re-entry requires a new opt-in record and decision. |
| Definitive closure | Remove case content, source references, profiles, findings, recommendations, tokens, and identity where no other open case needs it. Retain only minimal consent/lifecycle/closure audit metadata for 24 months from closure. |

Privacy requests go to `privacy@talentsync360.com`. Employer presentation remains a future separate capability, not implemented in v1A.

---

### 2. Database and operator behavior after migration 008

- `talent_opt_ins.withdrawn_at` preserves an accepted consent while ending active participation. A partial unique index permits a new opt-in record after withdrawal. Existing accepted consent is never overwritten for re-entry.
- `private.privacy_lifecycle_events` holds bounded withdrawal and definitive closure events outside the exposed public schema. Its closure row contains review consent version/time, network decision states and timestamps, closure reason/time, and audit expiry. It holds no profile text, source evidence, findings, recommendations, professional name, or email. The seven public product tables remain unchanged.
- The guarded `private.close_privacy_case` procedure deletes child tokens, opt-ins, findings, profiles, submission content, associated operational workflow events, and an orphaned `people` row. Delivered-profile deletion is allowed only inside this matching guarded closure transaction. Normal delivered-profile updates and deletion remain prohibited.
- Existing `ON DELETE RESTRICT` relationships require ordered deletion. Do not describe them as automatic cascades.
- The operator uses `retention-queue`, `closure-preview`, and `close-case` through a local database-owner connection. `SUPABASE_SECRET_KEY`/`service_role` cannot execute these private procedures or access the audit table. Closure requires a valid reason, a non-email actor identifier, and a matching confirmation ID; these are audit and mistake-prevention controls, not authentication. See Document 07.

---

### 3. Manual pilot operation and audit expiry

For a privacy deletion request, verify the requester and identify the submission. If Talent Network participation is active, run the guarded `withdraw-network` operation first and stop all opportunity use immediately. Preview `PRIVACY_REQUEST`, then close the case with the matching confirmation ID. A second closure fails safely because the submission is gone.

Review the retention queue on a recorded pilot cadence. For incomplete cases, record any meaningful external activity with `record-activity`; the database uses the later persisted activity timestamp. Preview each due case before closing. For withdrawal, the 30-day deadline is a maximum, not a waiting period.

After definitive closure, only `private.privacy_lifecycle_events` records remain for that case, with `audit_expires_at = closed_at + 24 months`. Automating expiry is a post-pilot option. Never use the audit table for sourcing, marketing, reactivation, or employer presentation.

For manual pilot expiry, a database administrator uses a separate authorized database-owner session, never the application service key. First review the due rows and case IDs:

```sql
select case_id, event_type, audit_expires_at
from private.privacy_lifecycle_events
where audit_expires_at <= now()
order by case_id, occurred_at;
```

For each verified case, set `case_id` in the administrator's `psql` session to that case's reviewed UUID, then execute the transaction below. It deletes nothing unless a closure event exists and every retained row for that case has expired. Review `RETURNING` before separately entering `COMMIT`; enter `ROLLBACK` if the rows differ from the preview.

```sql
begin;
select id, event_type, audit_expires_at
from private.privacy_lifecycle_events
where case_id = :'case_id'::uuid
for update;

delete from private.privacy_lifecycle_events e
where e.case_id = :'case_id'::uuid
  and e.audit_expires_at <= now()
  and exists (
    select 1 from private.privacy_lifecycle_events c
    where c.case_id = e.case_id and c.event_type = 'CASE_CLOSED'
      and c.audit_expires_at <= now()
  )
  and not exists (
    select 1 from private.privacy_lifecycle_events x
    where x.case_id = e.case_id
      and (x.audit_expires_at is null or x.audit_expires_at > now())
  )
returning id, event_type, audit_expires_at;
```

After verifying the returned rows, enter `COMMIT` in that same session. Use `ROLLBACK` if verification fails.
