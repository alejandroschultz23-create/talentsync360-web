# TalentSync360 Web — Analytics Preview Implementation

## STATUS

`BLOCKED`

The implementation, automated tests, local build, and Vercel Preview deployment are complete. Preview runtime QA is blocked by Vercel Deployment Protection, and the requested `GTM-WSBC22RX_v2.json` export was not present in the repository or the workspace search path. No production, GTM, GA4, CRM, email, database, webhook, or form-submission mutation was performed.

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

`GTM-WSBC22RX_v2.json` was not found in the repository or under `C:\Users\aleja\Documents\PROYECTOS-IA`. Therefore the claimed Live v2 tag inventory could not be independently re-read from the source file. No GTM import/export was generated and no GTM change was made.

The founder-provided inventory remains unverified here: container `GTM-WSBC22RX`, Live version 2, base tag 19, and event tags 20–27. This is a hard follow-up blocker for exact tag-level validation.

## GTM PROPOSED DIFF

Prepared for manual review only; not imported or published.

| TAG | CURRENT | PROPOSED | WHY | ROLLBACK |
|---|---|---|---|---|
| New DLV | Not independently verified from export | `DLV - page_referrer`, Data Layer Variable `page_referrer` | Expose explicit sanitized referrer context | Delete the variable |
| New Event Settings variable | Not independently verified from export | `ES - analytics page context`: `page_location = {{DLV - page_location}}`; `page_referrer = {{DLV - page_referrer}}` | Share context consistently across GA4 event tags | Delete the variable and remove assignments |
| Tag 19 | Founder reports Google tag base with `send_page_view=false` | No change | Preserve no-auto-pageview baseline | Restore Live v2 |
| Tags 20–27 | Founder reports GA4 Event tags | Attach `ES - analytics page context`, subject to export verification | Carry sanitized location/referrer on relevant GA4 events | Remove Event Settings assignment |
| Tag 20 | Founder reports local `page_location` definition | Remove only the local duplicate and rely on shared context | Avoid duplicate/conflicting `page_location` | Restore the local definition |

Do not publish until the actual JSON is available and tag IDs/fields are read back against it.

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

The public Evidence Review apply route writes a submission through `EvidenceReviewRepository` and can notify through `sendEvidenceReviewReceivedEmail`; it has no privacy-preserving counter exposed in this repository. The H3 participant flow submits through the H3 pilot storage/progress backend and has no count endpoint suitable for this phase. No new counter architecture was added.

## VERCEL ANALYTICS A6.4

Preview deployment was created, but browser access redirected to Vercel login because Deployment Protection is enabled. The CLI could perform protected GETs with an automatically generated bypass token, and HTML copy checks passed; the token was not extracted or reused in a browser.

| SCENARIO | EXPECTED | OBSERVED | RESULT | `o`, `r`, `dp` | INTENT LEAK | UTM PRESERVED |
|---|---|---|---|---|---|---|
| 1. Direct `/contact?intent=pilot&utm_source=linkedin&utm_medium=social` | No `intent`; approved UTM may remain | Protected browser redirected to `vercel.com/login`; no analytics payload | BLOCKED | Unknown | Unknown | Unknown |
| 2. `/contact` with intent → `/companies` reload | Destination `/companies`; no intent leak | Not runnable behind protection | BLOCKED | Unknown | Unknown | Unknown |
| 3. Internal navigation to `/contact` | Usable analytics; no intent in payload | Not runnable behind protection | BLOCKED | Unknown | Unknown | Unknown |
| 4. Query-only history change | No new page view unless implementation explicitly requires it | Not runnable behind protection | BLOCKED | Unknown | Unknown | Unknown |

The protected GET HTML did confirm approved WhatsApp copy, footer Contact, companies copy, and `No sourcing.`. The raw Next server payload includes the functional query string, which is not evidence of an analytics leak.

Tag Assistant connection, GA4 requests, Vercel `/_vercel/insights/view`, and duplicate `page_view` behavior remain unverified until a human opens the protected Preview or supplies a safe Preview bypass mechanism. If Tag Assistant requires `gtm_debug`, stop and obtain approval; do not add a production exception.

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
- Protection: enabled; browser QA blocked.

## RISKS

- GTM exact tag configuration is not independently verified because the requested JSON export is missing.
- Preview runtime analytics payloads are unverified because Deployment Protection blocked headless browser access.
- `/api/send` production has real email side effects and has no isolated Preview sender configured.
- Existing metadata and visible commercial copy still contain older sourcing/shortlist language by scope; this phase intentionally did not perform a broad positioning/SEO rewrite.
- npm reports 16 dependency vulnerabilities; unrelated to this implementation and not changed.

## UNKNOWN

- Tag Assistant connection state and whether it can run with debug signal OFF.
- Actual GA4 request count and `page_view` duplication in Preview.
- Actual Vercel Analytics `o`, `r`, and `dp` values in Preview.
- Exact Live v2 GTM tag/trigger/variable fields.
- Reliable candidate submission count mechanism.

## DO NOT TOUCH

Production deployment, promotion, merge, GTM publish, GA4 configuration, real contact submissions, candidate submissions, Resend/CRM/database/webhook side effects, paid campaigns, redirects, global tagline, global Evidence-Backed Technical Recruiting identity, pricing, company thesis, FAQ `hiring search needs`, `llms.txt`, nearshore URL/title/breadcrumb, and broad SEO rewrite.

## EXACT NEXT STEPS FOR FOUNDER

1. Provide `GTM-WSBC22RX_v2.json` in the repository/workspace and verify the proposed variable/tag assignments against the real export.
2. Open the Preview URL in an authenticated browser, or provide an approved Preview-only protection bypass secret through a secure environment mechanism.
3. Run A6.4 scenarios 1–4 with Tag Assistant debug signal OFF and capture `dataLayer`, GA4 requests, `/_vercel/insights/view`, `o`, `r`, `dp`, and page-view counts.
4. Confirm Preview has no Resend key or configure a separately isolated test sender before any successful-submit test.
5. Review this branch and decide separately whether to merge and whether to apply the GTM change manually.
