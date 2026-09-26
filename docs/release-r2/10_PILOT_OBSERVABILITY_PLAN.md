# TalentSync360 — Opt-In Engine v1A
## 10. Pilot Observability Plan (Manual / Zero-Overhead)

**Status:** APPROVED OBSERVABILITY SPECIFICATION
**Target Pilot Scope:** Controlled Pilot of 3–5 Professionals
**Infrastructure Overhead:** 0 New Monitoring Services

---

### 1. Observability Strategy for the Controlled Pilot

For the 3–5 professional controlled pilot, existing platform capabilities provide full visibility without adding third-party monitoring dependencies:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        OBSERVABILITY PILLARS                          │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ 1. Event Audit    │ 2. Operator CLI   │ 3. Platform Monitoring         │
│   (Supabase DB)   │    (Queue/Status) │    (Vercel & Resend)           │
├───────────────────┼───────────────────┼────────────────────────────────┤
│ • workflow_events │ • queue command   │ • Vercel Edge/Runtime Logs     │
│ • talent_opt_ins  │ • inspect command │ • Resend Delivery Dashboard    │
│ • token audit     │ • coherence tool  │ • Supabase Dashboard Metrics   │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

---

### 2. Primary Observability Sources

#### Pillar 1: Supabase Audit Log (`workflow_events`)
Lifecycle events are written transactionally to `workflow_events`:
- `SUBMISSION_CREATED`
- `REVIEW_STARTED`
- `PROFILE_PUBLISHED`
- `DELIVERY_NOTIFICATION_SENT` / `DELIVERY_NOTIFICATION_FAILED`
- `PROFILE_CONFIRMED`
- `OPT_IN_OFFERED`
- `OPT_IN_ACCEPTED` / `OPT_IN_DECLINED`

**Operational Query for Pilot Monitoring:**
```sql
SELECT
    created_at,
    event_type,
    submission_id,
    actor_reference,
    metadata
FROM workflow_events
ORDER BY created_at DESC
LIMIT 20;
```

#### Pillar 2: Operator CLI Queue
Check pending reviews in real time:
```bash
npm run evidence-review:operator -- queue
```

#### Pillar 3: Resend Delivery Analytics
Monitor transactional email delivery rates and potential bounces directly in the Resend dashboard.

#### Pillar 4: Vercel Runtime Logs
Filter runtime logs for HTTP 5xx responses or edge function errors during pilot traffic.

---

### 3. Daily Pilot Check Routine

During the active pilot for the 3–5 professionals:
1. **Queue Inspection (1 min):** Verify no submission remains unaddressed in the operator queue.
2. **Workflow Failure Check (1 min):** Check for `DELIVERY_NOTIFICATION_FAILED` in `workflow_events`.
3. **Resend Delivery Check (1 min):** Verify 100% delivery rate in Resend dashboard.
4. **Vercel Log Check (1 min):** Verify absence of runtime exceptions.
