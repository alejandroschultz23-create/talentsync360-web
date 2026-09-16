# TalentSync360 — Opt-In Engine v1A
## 06. Vercel Production Environment Checklist

**Status:** PRODUCTION VARIABLES PREPARED; DEPLOYMENT PENDING
**Target Environment:** Vercel Production Deployment
**Scope:** Production Environment Configuration & Release Sequence

---

### 1. Production Environment Variables Matrix

Production `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `EVIDENCE_REVIEW_FROM_EMAIL` are configured. Verify the full matrix before deployment; do not change it as part of the R2.3 code review.

`SUPABASE_DB_URL` is an operator-only local database-owner credential for private privacy lifecycle commands. It is not a Vercel variable and is not used by the web application.

| Variable Name | Exposure | Required Value / Format | Description |
| :--- | :--- | :--- | :--- |
| `SUPABASE_URL` | Server-Only | `https://<prod-ref>.supabase.co` (configured) | Production Supabase project URL used by the Evidence Review server and operator CLI |
| `SUPABASE_SECRET_KEY` | **Server-Only (Secret)** | Production secret key | Production Supabase secret key (server-only) |
| `RESEND_API_KEY` | **Server-Only (Secret)** | Production Resend API key | API key for transactional email |
| `EVIDENCE_REVIEW_FROM_EMAIL` | Server-Only | `TalentSync360 Evidence Review <reviews@talentsync360.com>` (configured) | Verified sender address |
| `EVIDENCE_REVIEW_BASE_URL` | Server-Only | `https://talentsync360.com` | Production base URL for secure links |

---

### 2. Critical Security & Configuration Rules

1. **Use the actual server variables:** Application code uses `SUPABASE_URL` and `SUPABASE_SECRET_KEY` for administrative backend access. Do not substitute public client variables.
2. **Server-Only Isolation:** Under no circumstances should `SUPABASE_SECRET_KEY` or `RESEND_API_KEY` be prefixed with `NEXT_PUBLIC_` or exposed in client bundles.
3. **No Nonexistent Feature Flags:** Do not configure imaginary feature flags or runtime kill switches (such as `NEXT_PUBLIC_ENABLE_EVIDENCE_REVIEW_PILOT` or `PILOT=false`). Production release safety relies on the approved release sequence detailed below.

---

### 3. Approved Production Release Sequence

Production rollout follows this controlled progression:

```
1. Separately authorized migration 008 ──> 2. Production Deployment ──> 3. Technical Smoke Verification ──> 4. Public CTA / Indexing / Pilot Invitation
```

- **Step 1 (Migration):** Apply and verify migration 008 only after separate authorization; do not deploy copy promising closure before the database can perform it.
- **Step 2 (Deploy):** Merge approved release candidate to `main` and allow Vercel to build and deploy.
- **Step 3 (Technical Smoke Verification):** Verify core site availability, metadata, routing, and database connectivity.
- **Step 4 (Public Outreach & Pilot Activation):** Request search indexing and invite the controlled cohort of 3–5 professionals to submit for the pilot.
