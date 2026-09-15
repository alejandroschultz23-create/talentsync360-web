# TalentSync360 — Opt-In Engine v1A
## 07. Operator Pilot Runbook (Controlled Pilot: 3–5 Professionals)

**Status:** APPROVED OPERATIONAL RUNBOOK
**Audience:** TalentSync360 Human Operators & Reviewers
**Target Pilot Scope:** 3–5 Selected LATAM Tech Professionals
**Turnaround Target:** [OWNER DECISION REQUIRED: Target turnaround time, e.g. 24–48 hours from submission to profile delivery]

---

### 1. Overview & Operator Philosophy

The TalentSync360 Opt-In Engine v1A is an operator-guided verification pipeline. Participating professionals submit their technical experience claims and verifiable artifacts (public GitHub repositories, live systems, portfolio materials). An operator:
1. Validates claims against demonstrable evidence.
2. Synthesizes a structured Professional Evidence Profile (factual, structured, non-evaluative).
3. Delivers the profile privately to the professional for review and confirmation.
4. If confirmed, allows the professional to independently choose whether to join the TalentSync360 Talent Network.

**Core Principles for Operators:**
- **No Evaluation / Scoring:** We do not issue ratings, letter grades, percentiles, or algorithmic scores. We document verifiable artifacts, roles, tech stacks, and demonstrable contributions.
- **Evidence Over Claim:** An unverified claim is documented as "claimed / unverified" or classified under unknown evidence.
- **Confidentiality:** Never share raw access tokens, magic links, or private draft profiles across unauthorized channels (e.g., Slack, public tickets, Discord).
- **Strict Invariant:** Evidence Review confirmation and Talent Network membership do not authorize presentation to prospective employers.

---

### 2. Operator CLI Environment Setup

Operators interact with the pipeline via the official CLI tool:
```bash
# Configure production Supabase credentials in operator terminal session
export SUPABASE_URL="https://<production-project-ref>.supabase.co"
export SUPABASE_SECRET_KEY="<production-secret-key>"
export EVIDENCE_REVIEW_BASE_URL="https://talentsync360.com"

# Verify CLI is operational
npm run operator -- --help
```

---

### 3. Step-by-Step Operator Workflow

```
[1. Queue] ──> [2. Inspect & Coherence] ──> [3. Start Review]
     │
     └──> [4. Verify Evidence & Draft Profile] ──> [5. Publish Profile]
               │
               └──> [6. Log Time & Deliver Profile] ──> [Professional Review]
                         │
                         ├──> Professional Confirms ──> [Network Choice]
                         └──> Professional Requests Correction ──> [7. Revise Profile]
```

#### Step 1: Check the Pending Queue
View submissions awaiting review:
```bash
npm run operator -- queue
```
*Displays submission IDs, candidate names, submission timestamps, and current review status.*

#### Step 2: Inspect Submission & Run Coherence Checks
Select a submission ID from the queue and inspect full details:
```bash
npm run operator -- inspect --id="<submission-uuid>"
```
Run automated data coherence and validation checks:
```bash
npm run operator -- coherence --id="<submission-uuid>"
```

#### Step 3: Claim Submission and Start Review
Lock the submission to yourself to prevent concurrent operator collisions:
```bash
npm run operator -- start-review --id="<submission-uuid>" --actor="operator@talentsync360.com"
```
*Transitions submission status to `IN_REVIEW`. Logs start event in `workflow_events`.*

#### Step 4: Evidence Verification Guidelines
The operator conducts verification of submitted claims:
- **Code Repositories (GitHub/GitLab):** Verify commit authorship, commit history consistency, pull requests, and technical implementation.
- **Production Systems / Live Apps:** Verify live URLs, domain ownership, or verifiable role in deployment.
- **Professional Timeline:** Cross-reference verifiable contributions and role descriptions.
- **Technical Skills:** Categorize verified technologies versus aspirational/unsubstantiated claims.

#### Step 5: Publish Evidence Profile Draft
Once the profile is drafted in the operator workspace:
```bash
npm run operator -- publish-profile --id="<submission-uuid>" --actor="operator@talentsync360.com" --file="path/to/profile-draft.json"
```
*Inserts or updates `evidence_profiles` and associated `evidence_findings`.*

#### Step 6: Log Operator Review Time
Log review time for internal metrics:
```bash
npm run operator -- log-time --id="<submission-uuid>" --actor="operator@talentsync360.com" --minutes=45 --notes="Verified GitHub repositories and architecture"
```

#### Step 7: Deliver Profile to Professional
Issue the secure access token and dispatch transactional delivery email via Resend:
```bash
# Default expiration is 72 hours; accepted range is 1 to 168 hours
npm run operator -- deliver-profile --id="<submission-uuid>" --actor="operator@talentsync360.com" --expires-hours=72
```
*Generates a 256-bit cryptographic token in `base64url` format, persists only its SHA-256 hash in `profile_access_tokens`, logs delivery event in `workflow_events`, and sends email via Resend.*

---

### 4. Handling Post-Delivery Actions & Edge Cases

#### Scenario A: Reissue Access Link (Expired / Lost)
If the professional did not receive the email or the link expired:
```bash
npm run operator -- reissue-access --id="<submission-uuid>" --actor="operator@talentsync360.com" --expires-hours=72
```
*Revokes prior active tokens in `profile_access_tokens`, generates a fresh token, and resends transactional email.*

#### Scenario B: Security Revocation (Suspected Token Compromise)
If a token is suspected of being compromised:
```bash
npm run operator -- revoke-access --id="<submission-uuid>" --actor="operator@talentsync360.com"
```
*Sets `revoked_at = now()` on active tokens in `profile_access_tokens` for that profile.*

#### Scenario C: Professional Requests Factual Correction
If the professional reviews their profile and provides factual corrections:
```bash
npm run operator -- revise-profile --id="<submission-uuid>" --actor="operator@talentsync360.com" --file="path/to/updated-profile.json"
```
*Updates published state and notifies professional.*

---

### 5. Controlled Pilot Tracking Table (3–5 Professionals)

| Pilot # | Submission ID | Operator | Intake Date | Status | Confirmed? | Network Decision | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | | | | | [ ] | [ ] ACCEPTED / [ ] DECLINED | |
| 2 | | | | | [ ] | [ ] ACCEPTED / [ ] DECLINED | |
| 3 | | | | | [ ] | [ ] ACCEPTED / [ ] DECLINED | |
| 4 | | | | | [ ] | [ ] ACCEPTED / [ ] DECLINED | |
| 5 | | | | | [ ] | [ ] ACCEPTED / [ ] DECLINED | |
