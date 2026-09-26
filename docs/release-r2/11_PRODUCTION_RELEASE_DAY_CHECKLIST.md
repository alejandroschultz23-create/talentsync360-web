# TalentSync360 — Opt-In Engine v1A
## 11. Production Release Day Checklist & STOP/GO Gates

**Status:** RELEASE DAY RUNBOOK — FINAL RC BLOCKED UNTIL R2.3 VALIDATION AND MIGRATION 008 APPROVAL
**Target Release:** Release Candidate (Opt-In Engine v1A)
**Target Pilot Scope:** Controlled Pilot of 3–5 Professionals
**Rule:** Every phase contains a mandatory STOP/GO gate. Do NOT proceed to the next phase until all conditions are satisfied.

---

### Phase 1: Pre-Merge Validation (Local / Release Branch)

**Objective:** Verify release candidate integrity before touching production infrastructure.

- [ ] 1. Confirm active branch is `release/opt-in-v1a-production-readiness-r2`.
- [ ] 2. Run test suite: `npm test` (all suites must pass).
- [ ] 3. Run linter: `npm run lint` (zero errors).
- [ ] 4. Run build: `npm run build` (zero errors, production build succeeds).
- [ ] 5. Run git diff check: `git diff --check` (clean diff, no whitespace issues).
- [ ] 6. Run production dependency audit: `npm audit --omit=dev --audit-level=moderate` (zero production runtime vulnerabilities).
- [ ] 7. Run `npx supabase db lint --linked` and `npx supabase db push --dry-run --linked`; confirm the dry-run proposes only migration 008. Do not apply it in this validation step.

🛑 **STOP/GO GATE 1:** All 7 verification items must be strictly satisfied. If any test or build fails, STOP execution.

---

### Phase 2: Production Supabase Migration 008 Gate

**Objective:** Production Supabase already exists and migrations 001–007 are applied. Review and approve migration 008 separately before any application.

- [x] 1. Dedicated Production project exists; migrations 001–007 are applied.
- [ ] 2. Review migration 008 SQL, guarded privacy functions, tests, and Production dry-run result.
- [ ] 3. Obtain separate authorization to apply migration 008. This checklist does not authorize the push.
- [ ] 4. After authorized application, verify exactly seven public product tables, `private.privacy_lifecycle_events`, owner/ACL denials for `service_role`, and operator-only private withdrawal/closure procedures.

🛑 **STOP/GO GATE 2:** Migration 008 must be reviewed, authorized, applied, and verified before deploying copy that promises its privacy lifecycle.

---

### Phase 3: Vercel Production Environment Configuration

**Objective:** Verify existing Production variables without changing them during the R2.3 review.

- [ ] 1. Log into Vercel Dashboard ──> Project `talentsync360-web` ──> Settings ──> Environment Variables.
- [x] 2. Production `SUPABASE_URL` is configured.
- [ ] 3. Verify other required public values against the deployed runtime.
- [x] 4. Production `SUPABASE_SECRET_KEY` is configured server-side.
- [ ] 5. Verify `RESEND_API_KEY` remains available server-side.
- [x] 6. `EVIDENCE_REVIEW_FROM_EMAIL` is configured as `TalentSync360 Evidence Review <reviews@talentsync360.com>`.
- [ ] 7. Verify `EVIDENCE_REVIEW_BASE_URL` before deployment.
- [ ] 8. Confirm all values are scoped to **Production** and secrets are not exposed to clients.

🛑 **STOP/GO GATE 3:** Confirm all variables are saved specifically for "Production" and that secret keys are not exposed to client bundles.

---

### Phase 4: Git Merge & Production Deployment

**Objective:** Merge the approved release branch into `main` and deploy to Vercel production.

- [ ] 1. Open Pull Request from `release/opt-in-v1a-production-readiness-r2` to `main`.
- [ ] 2. Attach R2 audit report and confirm CI checks pass.
- [ ] 3. Merge to `main`.
- [ ] 4. Monitor Vercel automatic production deployment.
- [ ] 5. Confirm deployment succeeds with HTTP 200 build status.

🛑 **STOP/GO GATE 4:** Production build must succeed without errors. If build fails, review build logs immediately.

---

### Phase 5: Production Technical Smoke Testing

**Objective:** Verify production site health and database connectivity.

- [ ] 1. Visit `https://talentsync360.com` — verify home page loads cleanly.
- [ ] 2. Visit `https://talentsync360.com/talents` and `https://talentsync360.com/companies` — verify single branding suffix in title.
- [ ] 3. Visit `https://talentsync360.com/talents/evidence-review` — verify landing page renders cleanly.
- [ ] 4. Verify `robots.txt` and `sitemap.xml` load correctly.

🛑 **STOP/GO GATE 5:** If any visual, routing, or metadata error occurs, investigate immediately.

---

### Phase 6: Public Outreach & Pilot Activation (3–5 Professionals)

**Objective:** Initiate controlled pilot intake.

- [ ] 1. Invite the controlled cohort of 3–5 LATAM tech professionals to submit for the pilot.
- [ ] 2. Ready operator CLI: normal `queue` uses the service client; `retention-queue` and other privacy commands require a separate local `SUPABASE_DB_URL` database-owner connection after migration 008 is authorized and applied. Never configure that credential in Vercel.
- [ ] 3. Monitor submissions as they arrive.

🛑 **STOP/GO GATE 6:** Opt-In Engine v1A is actively serving the controlled 3–5 professional pilot.

---

### Phase 7: Search Console Post-Deploy Verification

- [ ] 1. Open Google Search Console for `talentsync360.com`.
- [ ] 2. Inspect URL: `https://talentsync360.com/talents/evidence-review`.
- [ ] 3. Request indexing.
- [ ] 4. Confirm private route exclusion (`noindex` headers on `/profile/*`).

---

### Emergency Abort / Rollback Procedure

If a critical issue occurs:
1. **Pause Outreach:** Immediately halt invitation outreach to the pilot cohort.
2. **Promote Prior Deployment:** In Vercel Deployments dashboard, promote the previous known-good deployment (R1).
3. **Database Guard:** Supabase migrations are additive; no table drops are required.
4. **Post-Mortem:** Analyze Vercel runtime logs and database audit records before attempting redeployment.
