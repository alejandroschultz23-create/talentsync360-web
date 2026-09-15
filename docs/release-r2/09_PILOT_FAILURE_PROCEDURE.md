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
   SELECT created_at, event_type, metadata
   FROM workflow_events
   WHERE submission_id = '<submission-uuid>'
     AND event_type = 'DELIVERY_NOTIFICATION_FAILED'
   ORDER BY created_at DESC LIMIT 1;
   ```
3. If the professional's email address was mistyped:
   - Verify identity and correct email in `people` via authorized operator process.
4. Execute CLI reissuance:
   ```bash
   npm run operator -- reissue-access --id="<submission-uuid>" --actor="operator@talentsync360.com"
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
   npm run operator -- reissue-access --id="<submission-uuid>" --actor="operator@talentsync360.com"
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
     npm run operator -- revise-profile --id="<submission-uuid>" --actor="operator@talentsync360.com" --file="path/to/updated-profile.json"
     ```
3. If correction cannot be verified with demonstrable artifacts, maintain factual evidence standard and explain rationale to professional.

---

### Playbook 4: Professional Declines Talent Network Choice

**Symptoms:**
- Professional confirms Evidence Profile, but chooses "Decline for now" on the network choice screen.

**Procedure:**
1. System commits `status = 'DECLINED'` in `talent_opt_ins`.
2. **NO OPERATOR ACTION REQUIRED.**
3. Verify core invariant: The professional's confirmed Evidence Profile remains accessible to them privately. No employer presentation or outreach is initiated.

---

### Playbook 5: Data Deletion / Right-to-Erasure Request

**Symptoms:**
- Professional requests deletion of their personal data.

**Procedure:**
1. Follow guidelines in `03_RETENTION_DELETION_DECISION_REGISTER.md`.
2. Execute deletion protocol according to approved legal determination:
   - Status: **[LEGAL REVIEW REQUIRED: Deletion vs. Audit Retention Standard]**.
3. Confirm deletion to professional once completed.

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
3. **Database Integrity:** Migrations 001–007 are purely additive and backward-compatible; database schema does not require rollback.
4. **Analyze Logs:** Inspect Vercel runtime logs and `workflow_events` table to diagnose root cause.
