# TalentSync360 Web — Analytics Preview Implementation

## STATUS

`READY_FOR_FOUNDER_REVIEW`

The implementation, automated tests, local build, protected Vercel Preview runtime checks, Vercel Analytics sanitization, and GA4 smoke regression are complete. S3 was a previous capture-method false negative; the Vercel `/view` intent leak was fixed with the minimum `beforeSend` change. No production, GTM, GA4, CRM, email, database, webhook, or form-submission mutation was performed.

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
- `src/components/VercelAnalytics.tsx`
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

The initial headless capture was superseded by the normal-browser capture in `FINAL RUNTIME DIAGNOSIS` below. Preview was accessed with Vercel's official automation protection-bypass mechanism. Deployment Protection remained enabled. No form was submitted.

| SCENARIO | EXPECTED | OBSERVED | RESULT | GA4 PAGE_VIEW COUNT | PAGE_LOCATION | PAGE_REFERRER | VERCEL `o`, `r`, `dp` | INTENT LEAK | UTM PRESERVED |
|---|---|---|---|---|---|---|---|---|---|
| 1. Direct `/contact?intent=pilot&utm_source=linkedin&utm_medium=social` | Analytics loads; no `intent`; approved UTMs preserved; exactly 1 page view | One `virtual_page_view`; sanitized location `/contact?utm_source=linkedin&utm_medium=social`; one real GA4 request with `en=page_view`, sanitized `dp`/`dl`; no Vercel view request | PASS for GA4/dataLayer; Vercel evidence unavailable | 1 | `/contact?utm_source=linkedin&utm_medium=social` | Not emitted in dataLayer; no `intent` in GA4 `dp`/`dl` | No `o/r/dp` request observed | NO in page location/referrer | YES |
| 2. `/contact` with intent → `/companies` | `/companies`; no intent leak; exactly 1 page view for route change | Internal click reached `/companies`; one sanitized `virtual_page_view`; one real GA4 `en=page_view` with `dp=/companies`; referrer was sanitized `/contact?utm_source=linkedin` | PASS | 1 | `/companies` | `https://.../contact?utm_source=linkedin` | No `/_vercel/insights/view`; `o/r/dp` unavailable | NO | YES |
| 3. Internal navigation → `/contact?intent=validate-role` | Intent functional; no intent in page location/referrer; exactly 1 page view | Previous headless capture missed the POST body. Normal-browser capture found one batched GA4 `page_view` with `dp=/contact`, `dl=/contact` | PREVIOUS FALSE NEGATIVE — TEST METHOD | 1 | `/contact` | `/companies` | Final capture observed `/view`; see final diagnosis | NO in page location/referrer; YES in functional `click_contact.destination` | N/A |
| 4. Query-only `history.pushState` to `/companies?utm_source=x` | Confirm observed behavior; no duplicate page view beyond the explicit route/query change | One new sanitized `virtual_page_view` and one GA4 `en=page_view`; no duplicate beyond that one change | PASS | 1 | `/companies?utm_source=x` | `/companies` | No `/_vercel/insights/view`; `o/r/dp` unavailable | NO | YES |

The raw Next server payload and functional `click_contact.destination` may contain the selected intent; this is distinct from `page_location`/`page_referrer`. The S3 functional intent remained available, but its GA4 page-view delivery is not reliable enough to approve.

The initial headless run did not observe Vercel `/view`; the normal-browser run did. The authoritative Vercel result, including the `o` leak, is recorded in `FINAL RUNTIME DIAGNOSIS`. Tag Assistant was not connected and no `gtm_debug` exception was added.

## AUTOMATED TESTS

- Focused: 3 files, 32 tests passed.
- Full suite: 51 files, 399 tests passed.
- Added URL allowlist, sanitization, internal referrer, intent separation, and copy-hygiene coverage.
- Updated two pre-existing expectations that contradicted the explicitly approved copy/private `/apply` behavior.

## RUNTIME DIAGNOSIS — ROOT CAUSE

Diagnostic date: 2026-10-26. The Preview was accessed in a normal, non-headless Chrome profile with `navigator.webdriver=false`, an official Vercel automation protection bypass, no extensions, and no submissions.

### S3

- Navigation type: SPA. No new `Document` request occurred after clicking `/contact?intent=validate-role` from `/companies`.
- Baseline `/companies`: GTM loaded; one `virtual_page_view`; one GA4 `page_view`.
- Destination dataLayer event:

  ```json
  {
    "event": "virtual_page_view",
    "page_path": "/contact",
    "page_location": "https://talentsync360-4wnib7cat-aleopents360.vercel.app/contact",
    "page_referrer": "https://talentsync360-4wnib7cat-aleopents360.vercel.app/companies",
    "language": "en"
  }
  ```

- Tag 20: direct Tag Assistant firing state was unavailable because Tag Assistant did not connect with debug signal OFF. The Live trigger is an exact `event=virtual_page_view` custom event with no URL filter, and the observed GA4 hit proves the event was processed into a `page_view`.
- Hits sent: one GA4 `POST` to `https://analytics.google.com/g/collect`.
- GA4 request body contained both events in one request:
  - `en=click_contact` with the functional `destination=/contact?intent=validate-role`;
  - `en=page_view` with `dp=/contact` and `dl=https://talentsync360-4wnib7cat-aleopents360.vercel.app/contact`.
- GA4 page_view count for the destination: exactly 1.
- `page_location`: sanitized `/contact`; no `intent`.
- `page_referrer`: sanitized `/companies`; no `intent`. The current Live v2 tag does not yet send an explicit `dr`/`page_referrer` parameter; that is the documented GTM diff, not an S3/app failure.
- Consent/runtime: `analytics_storage` was not directly readable from the non-Tag-Assistant page; no consent error or console error was observed. The Google tag runtime was present.
- Root cause: previous run filtered only query-string GET-style collection URLs and did not inspect POST bodies. The hit was batched in a POST body after the SPA event.
- Classification: `PREVIOUS FALSE NEGATIVE — TEST METHOD`. No code fix is recommended for S3.

### TAG ASSISTANT

- Connected: No.
- Debug signal OFF: Yes; the checkbox was explicitly disabled before connecting.
- Result: Tag Assistant showed `No conectado`, `0 Etiquetas de Google encontradas`, and `No se ha evaluado ninguna etiqueta en este contenedor`.
- Status: `TAG ASSISTANT BLOCKED — DEBUG SIGNAL OFF DID NOT CONNECT`. No `gtm_debug` exception was added. The run stopped there as required.

### VERCEL ANALYTICS

- `/_vercel/analytics/script.js`: HTTP 200, `application/javascript; charset=utf-8`, loaded successfully.
- `window.va`: `function`.
- `navigator.webdriver`: `false`.
- `localStorage.getItem('va-disable')`: `null`.
- `/view`: observed as `POST`; HTTP 200; initiator `script`; request body:

  ```json
  {"o":"https://talentsync360-4wnib7cat-aleopents360.vercel.app/contact?intent=pilot&utm_source=linkedin&utm_medium=social","sv":"0.1.3","sdkn":"@vercel/analytics/react","sdkv":"2.0.1"}
  ```

- Fields: `o` contains `intent=pilot`; `r` and `dp` were absent in this request.
- Classification before this patch: `FAIL / REQUIRES CHANGE`. The script worked, the environment was not webdriver/adblock/disable-flag blocked, `/view` was emitted with HTTP 200, and `o` contained `intent`.
- Root cause: the existing `beforeSend` callback only cancelled private Evidence Review URLs and returned contact events unchanged.

### PRE-FIX DECISION

`BLOCKED — REAL BUG (resolved by the current patch)`

S3 did not require a code change. The Vercel Analytics leak was addressed without changing navigation, GA4/GTM, or functional `intent`. Tag Assistant remains unavailable without debug signaling, and no `gtm_debug` exception was introduced.

## POST-FIX VERCEL ANALYTICS AND GA4 QA

Preview: `https://talentsync360-h5cqa95j2-aleopents360.vercel.app/`
Deployment: `dpl_EFk11E6jejMnw84V9ZDMGpVXHJxB`
Commit under test: `40b9f846225aba558685478011abbdb7666864be`

### Vercel Analytics

| SCENARIO | OBSERVED `/view` BODY | RESULT |
|---|---|---|
| V1 `/contact?intent=pilot&utm_source=linkedin&utm_medium=social` | HTTP 200; `o=https://talentsync360-h5cqa95j2-aleopents360.vercel.app/contact?utm_source=linkedin&utm_medium=social`; no `intent` | PASS |
| V2 `/contact?intent=validate-role` | `o=https://talentsync360-h5cqa95j2-aleopents360.vercel.app/contact`; no `intent` | PASS |
| V3 `/companies` | `o=https://talentsync360-h5cqa95j2-aleopents360.vercel.app/companies`; unchanged behavior | PASS |
| V4 internal `/companies` → `/contact?intent=validate-role` | `o=https://talentsync360-h5cqa95j2-aleopents360.vercel.app/contact`; no `intent` | PASS |

`window.va` remained a function, `navigator.webdriver=false`, and `va-disable=null`. The real URL and functional query intent remained available to the page; only the Vercel Analytics event URL changed.

### GA4 smoke regression

- S1 direct contact URL: exactly 1 GA4 `page_view`; `dp/dl` retained approved UTMs and omitted `intent`.
- S3 internal companies → contact: exactly 1 batched GA4 `page_view`; `dp=/contact`, `dl=/contact`, and dataLayer `page_referrer=/companies` remained sanitized.
- Functional `intent=validate-role` remained present in the destination URL and functional `click_contact.destination`.
- No GA4/GTM code or configuration was changed by this fix.

### Tag Assistant

The no-debug connection remains unavailable: `No conectado`, zero tags evaluated. `gtm_debug` was not enabled. Per protocol, this is recorded but is not blocking this Vercel fix review.

### Final decision

`READY_FOR_FOUNDER_REVIEW`

## BUILD

- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed with Next.js 16.3.3.
- Build output includes `/api/send` and candidate routes as dynamic functions.

## PREVIEW URL

- Branch: `codex/analytics-preview-phase`
- Commit under runtime test: `40b9f846225aba558685478011abbdb7666864be`.
- Preview: `https://talentsync360-h5cqa95j2-aleopents360.vercel.app`
- Deployment ID: `dpl_EFk11E6jejMnw84V9ZDMGpVXHJxB`
- Target: Preview; not promoted.
- Status: Ready.
- Protection: enabled; official automation bypass used for browser QA; no protection setting changed.

## RISKS

- S3 internal route page_view delivery is confirmed; the previous result was a POST-body capture false negative.
- Vercel Analytics `/view` is now sanitized for contact URLs by `beforeSend`.
- GTM exact tag configuration is now verified from the supplied v2 export; the proposed v3 diff remains unapplied.
- `/api/send` production has real email side effects and has no isolated Preview sender configured.
- Existing metadata and visible commercial copy still contain older sourcing/shortlist language by scope; this phase intentionally did not perform a broad positioning/SEO rewrite.
- npm reports 16 dependency vulnerabilities; unrelated to this implementation and not changed.

## UNKNOWN

- Tag Assistant connection state with debug signal OFF.
- Tag Assistant firing/variables/consent timeline because the no-debug connection did not attach; this is non-blocking for this fix.
- Reliable H3 candidate submission aggregate/count mechanism.

## DO NOT TOUCH

Production deployment, promotion, merge, GTM publish, GA4 configuration, real contact submissions, candidate submissions, Resend/CRM/database/webhook side effects, paid campaigns, redirects, global tagline, global Evidence-Backed Technical Recruiting identity, pricing, company thesis, FAQ `hiring search needs`, `llms.txt`, nearshore URL/title/breadcrumb, and broad SEO rewrite.

## EXACT NEXT STEPS FOR FOUNDER

1. Review the branch and Preview evidence.
2. Keep the GTM v2 export as rollback; apply/publish the documented GTM diff only through the separate approved GTM workflow.
3. Decide separately whether to merge. No production deployment or publication was performed.
