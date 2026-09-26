# TalentSync360 — Opt-In Engine v1A
## 04. Employer Presentation Boundary Design Note

**Status:** APPROVED ARCHITECTURAL INVARIANT
**Scope:** Opt-In Engine v1A Core Architecture
**Future Capabilities:** FUTURE SEPARATE CAPABILITY — NOT IMPLEMENTED IN v1A

---

### 1. The Core Architectural Invariant

In TalentSync360 Opt-In Engine v1A:

> **CRITICAL INVARIANT:**
> A professional's acceptance of the TalentSync360 Talent Network (`status = 'ACCEPTED'` in `talent_opt_ins`) registers community interest and network membership.
> It does **NOT** authorize TalentSync360 to present, distribute, or share the professional's Evidence Profile or personal data with any prospective employer, client company, or third party.

---

### 2. Separation of Concerns in v1A

The system architecture strictly decouples evidence verification from employer matching:

```
┌────────────────────────────────────────────────────────┐
│                   OPT-IN ENGINE v1A                    │
├───────────────────────────┬────────────────────────────┤
│ 1. Evidence Review        │ 2. Talent Network Choice   │
│ • Submission intake       │ • Independent decision     │
│ • Factual verification    │ • `ACCEPTED` or `DECLINED`   │
│ • Structured profile      │ • Community membership     │
│ • Private confirmation    │ • ZERO employer sharing    │
└───────────────────────────┴────────────────────────────┘
                              │
                    FIREWALL BOUNDARY
                              │
┌────────────────────────────────────────────────────────┐
│     FUTURE SEPARATE CAPABILITY — NOT IN v1A            │
├────────────────────────────────────────────────────────┤
│ • Role-specific presentation consent                   │
│ • Employer profile views / matching pipeline           │
│ • Hiring company terms & mutual disclosure             │
└────────────────────────────────────────────────────────┘
```

---

### 3. Technical Safeguards in the Codebase

1. **No Employer Access Endpoints:** The codebase contains zero API routes, database roles, or query resolvers that allow external third parties or employers to search, browse, or inspect `evidence_profiles`.
2. **Database Isolation:** All private profile queries require authentication via `profile_access_tokens` bound to the specific professional.
3. **Audit Trails:** Network opt-in events record `network_consent_version` (`talent-network-opt-in-v1-2026-09-15`). Any future employer presentation capability will require a distinct, separate consent record.
