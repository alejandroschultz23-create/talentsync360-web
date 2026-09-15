# TalentSync360 — Opt-In Engine v1A
## 06. Vercel Production Environment Checklist

**Status:** PRE-PRODUCTION RUNBOOK
**Target Environment:** Vercel Production Deployment
**Scope:** Production Environment Configuration & Release Sequence

---

### 1. Production Environment Variables Matrix

Configure the following environment variables in Vercel Project Settings for the **Production** environment only:

| Variable Name | Exposure | Required Value / Format | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public / Client | `https://<prod-ref>.supabase.co` | Production Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public / Client | Production anon public key | Production Supabase anonymous key |
| `SUPABASE_SECRET_KEY` | **Server-Only (Secret)** | Production secret key | Production Supabase secret key (server-only) |
| `RESEND_API_KEY` | **Server-Only (Secret)** | Production Resend API key | API key for transactional email |
| `EVIDENCE_REVIEW_FROM_EMAIL` | Server-Only | `[OWNER DECISION REQUIRED: approved sender address]` | Verified sender address |
| `EVIDENCE_REVIEW_BASE_URL` | Server-Only | `https://talentsync360.com` | Production base URL for secure links |

---

### 2. Critical Security & Configuration Rules

1. **Use `SUPABASE_SECRET_KEY`:** Application code and runtime configuration use `SUPABASE_SECRET_KEY` for administrative backend access. Do not use legacy or alternative names in application environment configuration.
2. **Server-Only Isolation:** Under no circumstances should `SUPABASE_SECRET_KEY` or `RESEND_API_KEY` be prefixed with `NEXT_PUBLIC_` or exposed in client bundles.
3. **No Nonexistent Feature Flags:** Do not configure imaginary feature flags or runtime kill switches (such as `NEXT_PUBLIC_ENABLE_EVIDENCE_REVIEW_PILOT` or `PILOT=false`). Production release safety relies on the approved release sequence detailed below.

---

### 3. Approved Production Release Sequence

Production rollout follows this controlled progression:

```
1. Production Deployment ──> 2. Technical Smoke Verification ──> 3. Public CTA / Indexing / Pilot Invitation
```

- **Step 1 (Deploy):** Merge approved release candidate to `main` and allow Vercel to build and deploy.
- **Step 2 (Technical Smoke Verification):** Verify core site availability, metadata, routing, and database connectivity.
- **Step 3 (Public Outreach & Pilot Activation):** Request search indexing and invite the controlled cohort of 3–5 professionals to submit for the pilot.
