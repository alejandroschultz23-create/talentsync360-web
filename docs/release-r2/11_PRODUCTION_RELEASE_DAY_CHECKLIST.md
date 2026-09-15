# TalentSync360 — Opt-In Engine v1A
## 11. Production Release Day Checklist & STOP/GO Gates

**Status:** APPROVED RELEASE DAY RUNBOOK
**Target Release:** Release Candidate (Opt-In Engine v1A)
**Target Pilot Scope:** Controlled Pilot of 3–5 Professionals
**Rule:** Every phase contains a mandatory STOP/GO gate. Do NOT proceed to the next phase until all conditions are satisfied.

---

### Phase 1: Pre-Merge Validation (Local / Release Branch)

**Objective:** Verify release candidate integrity before touching production infrastructure.

- [ ] 1. Confirm active branch is `release/opt-in-v1a-production-readiness-r2`.
- [ ] 2. Run test suite: `npm test` (all 22 test suites, 126+ tests must pass 100%).
- [ ] 3. Run linter: `npm run lint` (zero errors).
- [ ] 4. Run build: `npm run build` (zero errors, production build succeeds).
- [ ] 5. Run git diff check: `git diff --check` (clean diff, no whitespace issues).
- [ ] 6. Run dependency audit: `npm audit` (zero production runtime vulnerabilities).
- [ ] 7. Verify non-prod Supabase migrations: `npx supabase db push --dry-run --linked`.

🛑 **STOP/GO GATE 1:** All 7 verification items must be strictly satisfied. If any test or build fails, STOP execution.

---

### Phase 2: Production Supabase Infrastructure Provisioning

**Objective:** Provision and migrate the production Supabase database instance.

- [ ] 1. Organization owner creates production Supabase project in authorized region.
- [ ] 2. Securely record production project credentials:
  - Project URL
  - Anon Public Key
  - Secret Key (`SUPABASE_SECRET_KEY`)
- [ ] 3. Authenticate Supabase CLI to production project:
  ```bash
  npx supabase link --project-ref "<production-project-ref>"
  ```
- [ ] 4. Apply migration sequence (001 through 007) in strict order:
  ```bash
  npx supabase db push
  ```
- [ ] 5. Verify production schema: confirm presence of exactly **SEVEN** public product tables:
  1. `people`
  2. `evidence_review_submissions`
  3. `evidence_profiles`
  4. `evidence_findings`
  5. `talent_opt_ins`
  6. `profile_access_tokens`
  7. `workflow_events`
- [ ] 6. Verify Row-Level Security (RLS) is ENABLED on all seven tables.
- [ ] 7. Verify core stored procedures (RPCs) are present.

🛑 **STOP/GO GATE 2:** Schema, seven tables, and RPCs must exist and match non-prod exactly. If migration fails, STOP and do not configure Vercel.

---

### Phase 3: Vercel Production Environment Configuration

**Objective:** Populate production environment variables in Vercel.

- [ ] 1. Log into Vercel Dashboard ──> Project `talentsync360-web` ──> Settings ──> Environment Variables.
- [ ] 2. Set `NEXT_PUBLIC_SUPABASE_URL` = Production Supabase URL.
- [ ] 3. Set `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Production Supabase Anon Key.
- [ ] 4. Set `SUPABASE_SECRET_KEY` = Production Supabase Secret Key (Server-only / Encrypted).
- [ ] 5. Set `RESEND_API_KEY` = Production Resend API Key (Server-only / Encrypted).
- [ ] 6. Set `EVIDENCE_REVIEW_FROM_EMAIL` = `[OWNER DECISION REQUIRED: approved sender address]`.
- [ ] 7. Set `EVIDENCE_REVIEW_BASE_URL` = `https://talentsync360.com`.
- [ ] 8. Save all variables for the **Production** environment.

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
- [ ] 2. Visit `https://talentsync360.com/talents` — verify title is "Professional Evidence Review for LATAM Tech Talent | TalentSync360".
- [ ] 3. Visit `https://talentsync360.com/talents/evidence-review` — verify landing page renders cleanly.
- [ ] 4. Verify `robots.txt` and `sitemap.xml` load correctly.

🛑 **STOP/GO GATE 5:** If any visual, routing, or metadata error occurs, investigate immediately.

---

### Phase 6: Public Outreach & Pilot Activation (3–5 Professionals)

**Objective:** Initiate controlled pilot intake.

- [ ] 1. Invite the controlled cohort of 3–5 LATAM tech professionals to submit for the pilot.
- [ ] 2. Ready operator CLI: `npm run operator -- queue` connected to production DB.
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
