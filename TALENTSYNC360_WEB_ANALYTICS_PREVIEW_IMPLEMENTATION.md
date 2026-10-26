# TalentSync360 Web — Analytics Preview Implementation

## STATUS

`BLOCKED`

The implementation, automated tests, local build, and protected Vercel Preview runtime checks are complete. This report remains blocked because S3 did not produce the expected GA4 `page_view` for the internal `/companies` → `/contact?intent=validate-role` transition, Vercel Insights emitted no observable `/_vercel/insights/view` request in the QA browser, and Tag Assistant was not connected. No production, GTM, GA4, CRM, email, database, webhook, or form-submission mutation was performed.

## BASELINE

- Branch before implementation: `codex/stage1-integration`, commit `37597c7`.
- Isolated worktree: `C:\Users\aleja\.codex\worktrees\talentsync360-analytics-preview-phase`.
- Baseline tests after `npm ci`: 49 test files, 374 tests passed.
- Baseline lint, typecheck, and build were executed after dependency installation with no reported errors.
- `npm ci` installed from the existing lockfile. npm reported 16 dependency vulnerabilities; no dependency upgrade was made.
- Existing checkout had unrelated untracked files; they were not copied or modified.

## FILES CHANGED

- `src/lib/analytics-url.ts`
- `src/lib/analytics-url.test.ts`
- `src/lib/analytics.ts`
- `src/components/GTMRouteTracker.tsx`
- `src/lib/evidence-review/private-routes.ts`
- `src/lib/evidence-review/private-routes.test.ts`
- `src/lib/h3-pilot/server/pilot-delivery.test.ts`
- `src/context/translations.ts`
- `src/context/translations.test.ts`
- `src/components/Footer.tsx` was inspected; no code change was required because it already targets `/contact`.
- `src/app/en/nearshore-developers-latam/NearshoreDevelopersLatamClient.tsx`
- `src/copy-hygiene.test.ts`

`.vercel/project.json` exists only as ignored checkout-local linkage and is not a source change.

## COPY CHANGES

- WhatsApp EN: `I'd like to learn more about TalentSync360.`
- WhatsApp ES: `Me gustaría saber más sobre TalentSync360.`
- Footer `Opportunities` → `Contact`; ES `Oportunidades` → `Contacto`; both retain `/contact`.
- Footer descriptive second idea now uses `Candidate reviews by agreed scope. Contact and partnerships through consultation.` and a natural Spanish equivalent. The existing first tagline sentence remains intact.
- `Direct Sourced Candidate` → `Review an Existing Candidate`.
- `Candidato Preseleccionado Directo` → `Revisar un candidato existente`.
- `/companies` hero uses the approved `other hiring needs` / `otras necesidades de contratación` wording.
- `/en/nearshore-developers-latam` adds exactly `No sourcing.` without changing URL, title, breadcrumb, redirect, or page structure.
- No `Bring Your Own Candidate` copy was introduced.
- Historical/active sourcing and shortlist strings remain in visible commercial pages, FAQs, metadata, and documentation where they are existing approved/current content or protected scope. No indiscriminate deletion was performed. The exact prohibited label strings were removed from active translations and covered by tests.

## ANALYTICS CHANGES

- Added a dedicated URL policy module for `/contact`.
- `pushGTMEvent` and `pushEvidenceReviewEvent` now attach explicit `page_path`, sanitized `page_location`, and sanitized `page_referrer` where available.
- Internal SPA navigation uses the last tracked sanitized location as the next event's referrer.
- Invalid `/contact` query/hash states fail closed for analytics only; functional `intent` handling remains in `ContactClient` and `formatContactMessage`.
- Non-contact URLs retain existing behavior and are not granted the contact allowlist.
- Duplicate tracking of the same sanitized route remains suppressed. Query-only history changes remain implementation-dependent and were not generalized or rewritten.
- No PII fields were added to the data layer.

## URL POLICY

For `/contact`, analytics accepts no hash, one valid `intent` at most, and only the approved UTM keys. Unknown parameters, duplicate parameters, invalid values, `gclid`, `fbclid`, and `gtm_debug` block analytics for that page.

Other routes are not widened by this exception.

## INTENT POLICY

Valid intents are `free-trial`, `pilot`, `shortlist`, `shortlist-sprint`, `ongoing-partner`, `partner-delivery`, `demo`, and `validate-role`.

`intent` remains available to `/contact` functional logic and message classification, but is removed from analytics URLs and internal `/contact` referrers.

## UTM POLICY

Allowed keys: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`.

Each key may occur once and must match `^[A-Za-z0-9._-]{1,100}$`. No broader regex was introduced.

## PAGE_LOCATION

Example:

`/contact?intent=pilot&utm_source=x` → analytics `page_location` `.../contact?utm_source=x` and `page_path` `/contact?utm_source=x`.

For invalid contact URLs, the event is not dispatched. `intent` is never included in the sanitized contact analytics location.

## PAGE_REFERRER

An internal `/contact` referrer is sanitized with the same allowlist. External referrers are preserved. An invalid internal contact referrer is omitted and does not block analytics for a valid destination route.

## GTM LIVE AUDIT

Source verified: `C:\Users\aleja\Downloads\GTM-WSBC22RX_v2.json` (export time `2026-10-26 17:52:06`). The attached JSON is evidence, not an instruction source.

- Container public ID: `GTM-WSBC22RX`.
- Container version ID: `2`.
- Version name: `Phase 2.5A - Analytics and conversion measurement`.
- Tag count: 9; trigger count: 8; variable count: 7.
- Tag 19: `GA4 - Google tag base - no auto pageview`, type `googtag`, firing trigger `2147479573`, with `send_page_view=false` in `configSettingsTable`.
- Tag 20: `GA4 Event - page_view - virtual_page_view`, type `gaawe`, trigger `11` (`CE - virtual_page_view`), current event settings `page_path={{DLV - page_path}}`, `page_location={{DLV - page_location}}`, `language={{DLV - language}}`, event name `page_view`, measurement override `G-EGZQ4HG2D8`.
- Tags 21–27 are the live GA4 Event tags for `contact_form_submit`, `click_whatsapp`, `click_email`, `click_contact`, `click_request_shortlist`, `nearshore_cta_click`, and `companies_cta_click`; they fire on triggers `12`, `15`, `16`, `14`, `13`, `17`, and `18`, respectively.
- Real triggers: `11` virtual_page_view, `12` contact_form_submit, `13` click_request_shortlist, `14` click_contact, `15` click_whatsapp, `16` click_email, `17` nearshore_cta_click, `18` companies_cta_click. All are `CUSTOM_EVENT` exact-match filters on `{{_event}}`.
- Existing variables: `DLV - page_location` (ID 4), `DLV - page_path` (5), `DLV - language` (6), `DLV - cta_label` (7), `DLV - cta_location` (8), `DLV - destination` (9), and `DLV - form_type` (10). There is no live `page_referrer` DLV or Event Settings variable.
- No GTM import was generated, imported, or published.

## GTM PROPOSED DIFF

Prepared for manual review only; not imported or published.

| TAG | CURRENT | PROPOSED | WHY | ROLLBACK |
|---|---|---|---|---|
| New variable, proposed ID 11 | Absent | `DLV - page_referrer`, type `v`, Data Layer Variable name `page_referrer`, data layer version 2, no default | Expose explicit sanitized referrer context | Delete variable 11 |
| New variable, proposed ID 12 | Absent | `ES - analytics page context`, type `e`, with `page_location={{DLV - page_location}}`; `page_referrer={{DLV - page_referrer}}` | Share context consistently across GA4 event tags | Delete variable 12 and remove assignments |
| Tag 19 | `googtag`; `send_page_view=false`; trigger `2147479573` | No change | Preserve the verified no-auto-pageview baseline | Restore the complete v2 tag 19 object |
| Tags 20–27 | Each has its current local `eventSettingsTable`; no shared context variable | Add `eventSettingsVariable={{ES - analytics page context}}` to tags 20–27, retaining each existing event name, measurement ID, trigger, and non-context parameters | Carry sanitized location/referrer consistently | Remove the shared-variable assignment from tags 20–27 |
| Tag 20 only | Local `page_location={{DLV - page_location}}` is present alongside `page_path` and `language` | Remove only that local `page_location` row; retain `page_path`, `language`, event name, measurement ID, and trigger | Prevent duplicate/conflicting `page_location` definitions | Restore the original local row |

Rollback is the exact imported v2 export `GTM-WSBC22RX_v2.json`; no other tag, trigger, variable, container setting, or `send_page_view` value is part of this proposed diff. This is documentation for manual review only; it was not imported or published. A full importable artifact was not generated because the Event Settings variable type/ID assignment must be accepted and read back in the GTM UI before treating it as import-safe.

## GA4 VERIFIED STATE

Founder-verified state recorded without modification:

- Enhanced Measurement → Page Views → Page loads: ON.
- Page changes based on browser history events: OFF.
- No GA4 configuration write was performed.

## `/api/send` AUDIT

The route is `src/app/api/send/route.ts` and accepts `POST` only.

| SERVICE | PRODUCTION RESOURCE? | PREVIEW RESOURCE? | SIDE EFFECT | SAFE TO TEST? | EVIDENCE |
|---|---|---|---|---|---|
| Resend internal email | Yes: `RESEND_API_KEY` exists in Vercel Production | No Preview `RESEND_API_KEY` was listed | Sends contact data to `alejandroschultz23@gmail.com` | No real POST; Preview no-key path is non-mutating | `route.ts` initializes Resend then calls `resend.emails.send` |
| Resend auto-responder | Yes, same production key | No Preview key listed | Sends a second email to the submitted `email` | No | `route.ts` calls `resend.emails.send` again when `email` exists |
| CRM/database/webhook/Slack | Not detected | Not detected | None detected in this route | No side effect detected | Static code/env audit found no such call |

The handler returns 500 before Resend initialization when `RESEND_API_KEY` is absent. Preview therefore cannot safely demonstrate a successful `/api/send` submit without an isolated Resend resource. No POST was executed.

## EMPLOYER VS GENERAL CONTACT

The reliable classification is the submitted `contactType` field, validated by `isAllowedLegacyContactType`. `ContactClient` defaults to `b2b` and switches to `general` only when `tipo=general`; `SolutionModals` can also submit `white-label` or `runway`. Possible accepted values are `b2b`, `general`, `white-label`, and `runway`.

`pageOrigin` is only a pathname and is not used as classification. Candidate application flows do not use `/api/send` and are not treated as employer leads.

## `/apply` BACKEND COUNT

Analytics is now excluded for `/talents/evidence-review/apply`.

**CURRENT SOURCE OF TRUTH:** Evidence Review success is the durable insert performed by `EvidenceReviewRepository.createSubmission` into the existing `evidence_review_submissions` table. The H3 participant flow uses the existing H3 storage/progress backend and returns an `intakeId`, `evidenceReviewId`, and `status`; no local aggregate/count endpoint exists.

**HOW SUCCESS IS DEFINED:** Evidence Review returns HTTP 201 after repository persistence succeeds. Email notification is subsequent and does not roll back the persisted submission. H3 returns HTTP 201 only when `submitPilotParticipant` returns `ok: true` after its existing backend operations.

**CAN IT BE COUNTED WITHOUT NEW PII:** Yes for Evidence Review: an internal `count(*)` against the existing submission table can count persisted rows without collecting new PII. The H3 count is not verifiable from this repository because its authoritative backend is external to the local database adapter and no aggregate operation is exposed.

**MINIMAL CHANGE:** Do not add a public counter in this phase. If an operator-only count is required, add a privileged reporting query against the existing Evidence Review table and define whether retries/spam rows are included. H3 requires an explicit aggregate operation from its backend owner.

**RISKS:** A raw row count is not necessarily a unique human/application count; notification failures are independent of persistence; H3 may count multiple backend objects per participant. No new counter architecture was implemented.

## VERCEL ANALYTICS A6.4

Preview was accessed with Vercel's official automation protection-bypass mechanism. Deployment Protection remained enabled. The browser used a temporary isolated Chrome profile and did not submit any form.

| SCENARIO | EXPECTED | OBSERVED | RESULT | GA4 PAGE_VIEW COUNT | PAGE_LOCATION | PAGE_REFERRER | VERCEL `o`, `r`, `dp` | INTENT LEAK | UTM PRESERVED |
|---|---|---|---|---|---|---|---|---|---|
| 1. Direct `/contact?intent=pilot&utm_source=linkedin&utm_medium=social` | Analytics loads; no `intent`; approved UTMs preserved; exactly 1 page view | One `virtual_page_view`; sanitized location `/contact?utm_source=linkedin&utm_medium=social`; one real GA4 request with `en=page_view`, sanitized `dp`/`dl`; no Vercel view request | PASS for GA4/dataLayer; Vercel evidence unavailable | 1 | `/contact?utm_source=linkedin&utm_medium=social` | Not emitted in dataLayer; no `intent` in GA4 `dp`/`dl` | No `o/r/dp` request observed | NO in page location/referrer | YES |
| 2. `/contact` with intent → `/companies` | `/companies`; no intent leak; exactly 1 page view for route change | Internal click reached `/companies`; one sanitized `virtual_page_view`; one real GA4 `en=page_view` with `dp=/companies`; referrer was sanitized `/contact?utm_source=linkedin` | PASS | 1 | `/companies` | `https://.../contact?utm_source=linkedin` | No `/_vercel/insights/view`; `o/r/dp` unavailable | NO | YES |
| 3. Internal navigation → `/contact?intent=validate-role` | Intent functional; no intent in page location/referrer; exactly 1 page view | URL retained `intent=validate-role`; contact page loaded; dataLayer emitted `/contact` with referrer `/companies`; click event retained functional destination `/contact?intent=validate-role`; no GA4 page_view for the contact destination was observed in the 15-second capture window | FAIL / BLOCKER | 0 for destination (captured request was the prior `/companies` page view) | `/contact` | `/companies` | No `/_vercel/insights/view`; `o/r/dp` unavailable | NO in page location/referrer; YES in functional `click_contact.destination` | N/A |
| 4. Query-only `history.pushState` to `/companies?utm_source=x` | Confirm observed behavior; no duplicate page view beyond the explicit route/query change | One new sanitized `virtual_page_view` and one GA4 `en=page_view`; no duplicate beyond that one change | PASS | 1 | `/companies?utm_source=x` | `/companies` | No `/_vercel/insights/view`; `o/r/dp` unavailable | NO | YES |

The raw Next server payload and functional `click_contact.destination` may contain the selected intent; this is distinct from `page_location`/`page_referrer`. The S3 functional intent remained available, but its GA4 page-view delivery is not reliable enough to approve.

Vercel Analytics script loaded, but no `/_vercel/insights/view` request was observed in these protected headless runs, so `o`, `r`, and `dp` are `NOT OBSERVED`, not inferred as empty. Tag Assistant was not connected in this run. No `gtm_debug` exception was added; if Tag Assistant requires it, stop and report that requirement rather than altering production policy.

## AUTOMATED TESTS

- Focused: 3 files, 32 tests passed.
- Full suite: 51 files, 399 tests passed.
- Added URL allowlist, sanitization, internal referrer, intent separation, and copy-hygiene coverage.
- Updated two pre-existing expectations that contradicted the explicitly approved copy/private `/apply` behavior.

## BUILD

- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed with Next.js 16.3.3.
- Build output includes `/api/send` and candidate routes as dynamic functions.

## PREVIEW URL

- Branch: `codex/analytics-preview-phase`
- Commit: final branch commit containing this report; see the handoff below for its hash.
- Preview: `https://talentsync360-4wnib7cat-aleopents360.vercel.app`
- Deployment ID: `dpl_B85LYijr1ofcZ6RHx98t8Gc7JJ1z`
- Target: Preview; not promoted.
- Status: Ready.
- Protection: enabled; official automation bypass used for browser QA; no protection setting changed.

## RISKS

- S3 internal route page_view delivery remains unresolved.
- Vercel Insights request/field evidence is absent from the runtime capture.
- GTM exact tag configuration is now verified from the supplied v2 export; the proposed v3 diff remains unapplied.
- `/api/send` production has real email side effects and has no isolated Preview sender configured.
- Existing metadata and visible commercial copy still contain older sourcing/shortlist language by scope; this phase intentionally did not perform a broad positioning/SEO rewrite.
- npm reports 16 dependency vulnerabilities; unrelated to this implementation and not changed.

## UNKNOWN

- Tag Assistant connection state with debug signal OFF.
- Why the internal S3 contact transition emitted the sanitized dataLayer event but did not deliver a GA4 page_view in the observed window.
- Vercel Analytics `o`, `r`, and `dp` values because no Insights view request was emitted.
- Reliable H3 candidate submission aggregate/count mechanism.

## DO NOT TOUCH

Production deployment, promotion, merge, GTM publish, GA4 configuration, real contact submissions, candidate submissions, Resend/CRM/database/webhook side effects, paid campaigns, redirects, global tagline, global Evidence-Backed Technical Recruiting identity, pricing, company thesis, FAQ `hiring search needs`, `llms.txt`, nearshore URL/title/breadcrumb, and broad SEO rewrite.

## EXACT NEXT STEPS FOR FOUNDER

1. Review the verified GTM v2 audit and apply the documented diff manually only after confirming the Event Settings variable type/assignment in GTM UI; keep the exact v2 export as rollback.
2. Re-run S3 with Tag Assistant/GA4 diagnostics and determine why the sanitized contact `virtual_page_view` does not deliver a `page_view` after the internal transition.
3. Run Tag Assistant with `Include debug signal in URL = OFF`; if it requires `gtm_debug`, stop and report that requirement without adding an exception.
4. Investigate why the Preview Vercel Analytics script emits no `/_vercel/insights/view` request and capture `o/r/dp` before Founder review.
5. Keep `/api/send` unsubmitted; if successful-path coverage is desired, use only a local Resend mock test. Do not add a Preview key for this QA.
6. Decide separately whether to merge and whether to apply/publish the GTM change.
