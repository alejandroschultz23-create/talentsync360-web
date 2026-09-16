# TalentSync360 — Opt-In Engine v1A
## 09. Pilot Failure & Incident Response Procedure

**Status:** APPROVED OPERATIONAL PROCEDURE
**Target Pilot Scope:** Controlled Pilot of 3–5 Professionals
**Escalation Path:** Reviewer Operator ──> Lead Engineer ──> Release Owner

---

### 1. Incident Taxonomy & Playbooks

This procedure outlines standard operational responses for failure scenarios during the 3–5 professional pilot.

---

### Playbook 1: Transactional Email Delivery Failure

**Symptoms:**
- Professional reports non-receipt of access link.
- Delivery status logged as `failed` in `workflow_events`.
- Resend console indicates delivery error.

**Procedure:**
1. Check Resend dashboard for recipient status (e.g. invalid mailbox, DNS block).
2. Check `workflow_events` for detailed error message:
   ```sql
   SELECT occurred_at, event_type, metadata
   FROM workflow_events
   WHERE entity_type = 'PROFILE'
     AND entity_id = '<profile-uuid>'
     AND event_type = 'PROFILE_NOTIFICATION_RECORDED'
     AND metadata->>'status' = 'failed'
   ORDER BY occurred_at DESC LIMIT 1;
   ```
3. If the professional's email address was mistyped:
   - Verify identity and correct email in `people` via authorized operator process.
4. Execute CLI reissuance:
   ```bash
   npm run evidence-review:operator -- reissue-access --submission "<submission-uuid>" --actor operator-id
   ```

---

### Playbook 2: Expired Access Link

**Symptoms:**
- Professional accesses profile after configured expiration (CLI default: 72 hours; range: 1–168 hours).
- Screen displays expiration notice.

**Procedure:**
1. Confirm professional identity.
2. Execute CLI reissuance:
   ```bash
   npm run evidence-review:operator -- reissue-access --submission "<submission-uuid>" --actor operator-id
   ```
3. Fresh link with a new 72-hour window is delivered to their inbox.

---

### Playbook 3: Professional Requests Correction of Evidence Profile

**Symptoms:**
- Professional reviews draft profile and submits correction details.

**Procedure:**
1. Review submitted feedback against provided evidence artifacts.
2. If correction is factually supported by verifiable evidence:
   - Update profile draft JSON.
   - Run CLI revision:
     ```bash
     npm run evidence-review:operator -- revise-profile --submission "<submission-uuid>" --actor operator-id --input path/to/updated-profile.json
     ```
3. If correction cannot be verified with demonstrable artifacts, maintain factual evidence standard and explain rationale to professional.

---

### Playbook 4: Professional Declines Talent Network Choice

**Symptoms:**
- Professional confirms Evidence Profile, but chooses "Decline for now" on the network choice screen.

**Procedure:**
1. System commits `opt_in_status = 'DECLINED'` in `talent_opt_ins`.
2. Record the 180-day retention due date from `declined_at` in the pilot tracker and review `retention-queue` regularly.
3. Verify core invariant: The professional's confirmed Evidence Profile remains accessible to them privately. No employer presentation or outreach is initiated.

---

### Playbook 5: Data Deletion / Right-to-Erasure Request

**Symptoms:**
- Professional requests deletion of their personal data.

**Procedure:**
1. Route the verified request through `privacy@talentsync360.com` and identify the submission.
   Use the operator-only local `SUPABASE_DB_URL` connection for the following privacy commands; the web application's `SUPABASE_SECRET_KEY` cannot execute them.
2. If Talent Network participation is active, stop opportunity use immediately and run `withdraw-network --submission "<submission-uuid>" --actor operator-id`.
3. Run `closure-preview --submission "<submission-uuid>" --reason PRIVACY_REQUEST`. Review its eligibility and case counts.
4. Run `close-case --submission "<submission-uuid>" --actor operator-id --reason PRIVACY_REQUEST --confirm "<submission-uuid>"` only after human review. The guarded transaction removes professional content and leaves the minimal 24-month closure audit.
5. Verify the `CASE_CLOSED` event and confirm completion to the professional.

---

### Playbook 6: Production Database Connectivity Degradation

**Symptoms:**
- HTTP 500 responses on submission or profile endpoints.
- Server logs indicate Supabase connection timeout.

**Procedure:**
1. Check Supabase platform status.
2. Halt operator CLI operations until database connectivity is stable.
3. Once restored, verify database integrity: all mutations in Opt-In Engine v1A are guarded by transactional stored procedures (RPCs); no partial state commits occur.

---

### Playbook 7: Rollback / Incident Mitigation Procedure

**Symptoms:**
- Unforeseen critical defect identified during pilot.

**Procedure:**
1. **Pause Outreach:** Immediately halt invitation outreach to the 3–5 pilot cohort professionals.
2. **Promote Prior Deployment:** In Vercel Deployments dashboard, promote the prior known-good deployment.
3. **Database Integrity:** Migrations 001–007 are already applied in Production. Migration 008 must pass its separate release gate before application; do not assume a schema rollback.
4. **Analyze Logs:** Inspect Vercel runtime logs and `workflow_events` table to diagnose root cause.
