# TalentSync360 — Opt-In Engine v1A
## 01. Resend Production Setup Checklist

**Status:** PRE-PRODUCTION OPERATIONAL CHECKLIST
**Target Environment:** Production
**Runtime Integration:** `resend@6.28.1` (Zero production runtime CVEs)

---

### 1. Overview & Operational Principles

The TalentSync360 Opt-In Engine v1A utilizes Resend exclusively for transactional delivery of private Evidence Profile access links and submission confirmations.

**Core Technical Invariants:**
- **Non-blocking Execution:** Notification failures never abort or roll back database transactions.
- **Graceful Degradation:** If `RESEND_API_KEY` is unset, notification attempts return `{ status: "skipped" }`. If sending fails, attempts return `{ status: "failed" }` and log to `workflow_events`.
- **Zero Sensitive Data in Email:** Notification bodies contain no evaluation findings, matrices, or scores—only neutral instructional text and the private access link.
- **Zero Emails on Network Opt-In:** Accepting or declining the Talent Network choice triggers no emails; state is committed entirely in the database.

---

### 2. Provider Configuration & Verification Steps

Complete the following provider verification steps in the Resend administrative console prior to production release:

#### Step 1: Sending Domain Verification
- [ ] Domain `talentsync360.com` registered in Resend console.
- [ ] Complete DNS verification records configured in primary DNS provider:
  - **DKIM:** TXT record (provided by Resend)
  - **SPF:** TXT / MX record (provided by Resend)
  - **DMARC:** TXT record configured according to domain security policy.
- [ ] Provider status confirmed as **"Verified"** before sending production traffic.

#### Step 2: Production API Key Generation
- [ ] Generate a production API key within the Resend console.
- [ ] Configure key permissions with **"Sending access only"** (restricted to authorized sending domain).
- [ ] Store key securely in the team password manager.
- [ ] **Crucial:** Never log, print, or commit this key to version control.

#### Step 3: Verified Sender Address Determination
- [ ] Record the approved sending address in project configuration:
  - Variable: `EVIDENCE_REVIEW_FROM_EMAIL`
  - Value: `[OWNER DECISION REQUIRED: approved sender address]` (e.g., `TalentSync360 <reviews@talentsync360.com>` or designated notification mailbox).

---

### 3. Application Environment Variable Configuration

Configure the following variables in the Vercel Production deployment:

| Variable Name | Environment | Description |
| :--- | :--- | :--- |
| `RESEND_API_KEY` | Production (Server-only) | Resend API key generated in Step 2 |
| `EVIDENCE_REVIEW_FROM_EMAIL` | Production (Server-only) | `[OWNER DECISION REQUIRED: approved sender address]` |
| `EVIDENCE_REVIEW_BASE_URL` | Production (Server-only) | Base URL for link generation (`https://talentsync360.com`) |

---

### 4. Operational Fallback & Manual Intervention

If an email fails to deliver during live operations (e.g., recipient mailbox full, temporary provider outage):
1. The profile and access token remain securely committed in `evidence_profiles` and `profile_access_tokens`.
2. The delivery failure is recorded with details in `workflow_events`.
3. An authorized operator can reissue and resend the access link using the CLI tool:
   ```bash
   npm run operator -- reissue-access --id="<submission-uuid>" --actor="operator@talentsync360.com"
   ```
