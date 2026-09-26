# TalentSync360 — Opt-In Engine v1A
## 05. Production Supabase Release Plan

**Status:** PRE-PRODUCTION RUNBOOK
**Target Environment:** Production Supabase Instance (TO BE CREATED)
**Authorized Non-Prod Baseline:** `talentsync360-nonprod` (`ferzsgmybhrwgcsmqonb`)
**Constraint:** Zero production database operations authorized during Release Prep R2.

---

### 1. Database Lineage & Migration Sequence

The production Supabase database must be initialized from scratch using exactly the approved, immutable migration sequence (001 through 007):

| Migration File | Primary Functional Scope |
| :--- | :--- |
| `20260914000100_opt_in_engine_v1a_foundation.sql` | Core schema: 7 public tables, constraints, initial RLS |
| `20260914000200_opt_in_engine_v1a_workflow_trigger_fix.sql` | Trigger fixes for workflow auditing |
| `20260914000300_opt_in_engine_v1a_evidence_profiles.sql` | Evidence profile structure and findings schema |
| `20260914000400_opt_in_engine_v1a_manual_operations.sql` | Operator workflow RPCs and review locks |
| `20260914000500_opt_in_engine_v1a_private_access_tokens.sql` | Token management and verification functions |
| `20260914000600_opt_in_engine_v1a_profile_confirmation.sql` | Candidate confirmation RPC functions |
| `20260914000700_opt_in_engine_v1a_professional_feedback.sql` | Feedback, corrections, and Phase E opt-in RPCs |

---

### 2. The Seven Public Product Tables

Production verification must confirm the presence of exactly **SEVEN** public product tables:

1. `public.people`
2. `public.evidence_review_submissions`
3. `public.evidence_profiles`
4. `public.evidence_findings`
5. `public.talent_opt_ins`
6. `public.profile_access_tokens`
7. `public.workflow_events`

---

### 3. Production Execution Steps (Execution Day Only)

When authorized for production execution:

#### Step 1: Link to Production Project
```bash
# Link Supabase CLI to newly created production project
npx supabase link --project-ref "<production-project-ref>"
```

#### Step 2: Push Migrations
```bash
# Apply migrations 001 through 007
npx supabase db push
```

#### Step 3: Verify the Seven Tables
Execute the following verification query:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```
*Expected result:* Exactly the seven public product tables listed above.

#### Step 4: Verify Row-Level Security (RLS)
Execute:
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'people',
    'evidence_review_submissions',
    'evidence_profiles',
    'evidence_findings',
    'talent_opt_ins',
    'profile_access_tokens',
    'workflow_events'
  );
```
*Expected result:* `rowsecurity = true` on all seven tables.

#### Step 5: Verify Critical Stored Procedures (RPCs)
Confirm the existence of the core RPCs:
- `public.submit_evidence_review`
- `public.lock_submission_review`
- `public.log_operator_review_work`
- `public.publish_evidence_profile`
- `public.issue_profile_access_token`
- `public.reissue_profile_access_token`
- `public.revoke_profile_access_token`
- `public.authenticate_profile_access_token`
- `public.confirm_evidence_profile`
- `public.record_candidate_correction_request`
- `public.prepare_talent_opt_in_offer`
- `public.decide_talent_opt_in`
