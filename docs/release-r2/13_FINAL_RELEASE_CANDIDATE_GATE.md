# TalentSync360 — Opt-In Engine v1A
## 13. Final Release Candidate Gate (R2.3 Privacy Lifecycle)

**Status:** LOCAL R2.3.1 VALIDATION PASSED — Production migration 008 application and release verification remain gated
**Release Candidate Branch:** `release/opt-in-v1a-production-readiness-r2`
**Current HEAD before uncommitted R2.3 work:** `8c69372925109850c46bca33d09fe53a3bc8197a`
**Target Destination:** `main`

---

### 1. Release Readiness Definition of Done (DoD)

| Category | Requirement | Audit Result | Status |
| :--- | :--- | :--- | :--- |
| **Owner Decision Gate** | Approved retention and sender decisions | APPROVED / CLOSED | ✅ PASS |
| **Qualified Legal Review** | Approved public `/privacy` and `/terms` | APPROVED / CLOSED | ✅ PASS |
| **Consent Versions** | Evidence: `evidence-review-v1-2026-09-14`; Opt-In: `talent-network-opt-in-v1-2026-09-15` | Source constants unchanged | ✅ PASS |
| **Employer Boundary** | Future separate capability, not implemented in v1A | No employer-presentation implementation added | ✅ PASS |
| **Production Baseline** | Dedicated Supabase exists with migrations 001–007; sender and Production Supabase Vercel variables configured; Resend domain verified | Prepared separately | ✅ PASS |
| **Privacy Lifecycle** | Migration 008 adds guarded withdrawal, closure, and minimal audit in a non-exposed `private` schema | R2.3.1 ACL, owner, seven-public-table, and local replay tests passed; separate Production authorization still required | 🛑 HOLD |
| **Operator Pilot** | 3–5 professionals; manual retention queue, preview, and closure after migration 008 | Pending migration and runbook verification | 🛑 HOLD |
| **Automated Tests / Lint / Build** | `npm test`, `npm run lint`, `npm run build`, `git diff --check` | Passed locally; rerun on the final diff before approval | ✅ PASS |
| **Production Dependencies** | `npm audit --omit=dev --audit-level=moderate` | Zero production runtime advisories after a transitive lockfile update | ✅ PASS |
| **Database Lint / Dry-Run** | `npx supabase db lint --linked`; `npx supabase db push --dry-run --linked` must propose only 008 | Linked lint passed; dry-run proposed only 008 and applied nothing | ✅ PASS |

---

### 2. Current deployment boundary

Production Supabase and migrations 001–007 already exist. Migration 008 has not been applied. Production has not been deployed with the R2.3 legal copy or privacy lifecycle. This document does not authorize a commit, push, merge, migration push, or deployment.

The working tree contains uncommitted legal copy and R2.3 work. The pre-existing untracked `outputs/` directory must remain untouched.

---

### 3. Final RC sign-off block (pending)

```
Release Candidate: Opt-In Engine v1A
Branch: release/opt-in-v1a-production-readiness-r2
R2.3 Starting HEAD: 8c69372925109850c46bca33d09fe53a3bc8197a

Release Engineer Sign-Off: _____________________ Date: __________
Security & Compliance Sign-Off: _________________ Date: __________
Product Lead Sign-Off: _________________________ Date: __________
```
