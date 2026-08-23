# TalentSync360 Phase 2.5D — GA4 / GTM / GSC Measurement & Experiment Audit

**Audit mode:** repository-only, no implementation
**Audit date:** 2026-08-22
**Experiment page:** `/en/nearshore-developers-latam`
**Fixed GSC baseline:** T0, previous 28 days as supplied

## 1. Executive summary

Phase 2.5A did implement a coherent client-side measurement layer. The root layout loads Google Tag Manager container `GTM-WSBC22RX`, `@next/third-parties` initializes the standard `dataLayer`, a shared utility sanitizes event parameters and pushes zero-PII custom events, and a route tracker emits `virtual_page_view` on App Router path/query changes. The contact form emits `contact_form_submit` only after `/api/send` returns a successful HTTP response. Vercel Analytics is also loaded independently.

That foundation is not sufficient by itself to prove GA4 reporting readiness. The repository contains no GA4 measurement ID, GTM container export, GA4 tag/trigger definitions, custom-dimension registrations, key-event configuration, GSC-to-GA4 link configuration, consent configuration, or production DebugView/Realtime evidence. The repository proves events are queued to `dataLayer`; it does not prove that GTM forwards them to the intended GA4 property or that GA4 exposes their parameters in reports.

The nearshore page itself has a material observability gap. Its hero `Request a Shortlist`, hero `See Our Vetting Standard`, hero `/companies` comparison link, and final `Get in Touch` CTA are plain internal links without custom analytics handlers. Subsequent route views can show that a user reached `/contact`, `/methodology`, or `/companies` if the GTM-to-GA4 route-event mapping is valid, but they cannot identify the clicked nearshore CTA, distinguish hero from final contact CTA, or prove that navigation originated from a click rather than another route action.

The SEO experiment can be evaluated in GSC using the fixed page and fixed commercial query cluster. Business-funnel evaluation is conditional on verifying the production GTM/GA4 path and closing the nearshore CTA gap before the Phase 2.5E measurement window begins. After that preflight, analytics must remain frozen during the SEO test.

## 2. Current measurement architecture

### Repository-proven flow

1. `src/app/layout.tsx:74-84` mounts `GTM`, `GTMRouteTracker`, the site UI, and the separate Vercel `Analytics` component globally.
2. `src/components/GTM.tsx:3-8` loads `@next/third-parties/google` with `NEXT_PUBLIC_GTM_ID`, falling back to `GTM-WSBC22RX`.
3. The installed `@next/third-parties` GTM component initializes `window.dataLayer`, pushes the standard `gtm.js` bootstrap event, and loads `https://www.googletagmanager.com/gtm.js?id=...`.
4. `src/lib/analytics.ts:36-66` removes prohibited PII keys, accepts only primitive parameter values, and calls `sendGTMEvent`, which pushes the object to `window.dataLayer`.
5. `src/components/GTMRouteTracker.tsx:14-32` emits `virtual_page_view` for the current pathname plus query string and suppresses an identical consecutive path.
6. Instrumented components call the shared utility for selected CTA and submission events.
7. `src/app/contact/ContactClient.tsx:43-65` emits `contact_form_submit` after `/api/send` returns `res.ok`; `src/app/api/send/route.ts:40-70,106-110` returns success only after the primary Resend email call succeeds.

### Destinations and boundaries

- **Proven destination:** the browser's standard `window.dataLayer` and GTM container `GTM-WSBC22RX`.
- **Intended but not repository-proven destination:** a GA4 property configured inside GTM.
- **Separate destination:** Vercel Analytics receives its own automatic web analytics through `@vercel/analytics/react`; no repository custom events are sent to it.
- **Not present in code:** direct `gtag`/GA4 initialization, a GA4 measurement ID, manual UTM persistence, user IDs, custom engagement timers, scroll-depth events, form-start events, Calendly click/completion events, or a GSC API/export integration.
- **PII control:** the shared custom event utility blocks common name, email, phone, company, message, text, and input keys. The contact payload still contains necessary lead PII for `/api/send`, but that payload is not passed to the custom analytics utility.

### Configuration that must be verified outside the repository

- GTM environment/container version published in production.
- GA4 Configuration/Google tag firing on all intended pages.
- Custom Event tags and triggers for every listed `dataLayer` event.
- Mapping of `page_path`, `page_location`, `language`, `cta_label`, `cta_location`, `destination`, and `form_type` into GA4 event parameters.
- GA4 custom dimensions needed to report CTA and form parameters.
- Whether `virtual_page_view` is mapped to GA4 `page_view`, retained as a custom event, or both; verify that the setup does not double-count initial page views.
- Whether `contact_form_submit` is marked as a GA4 key event and whether its meaning matches a successful commercial lead.
- GA4 enhanced-measurement, unwanted-referral, cross-domain, attribution, channel-group, data-retention, internal-traffic, consent, and bot/filter settings.
- GSC property ownership and any GA4/GSC product link.

## 3. Event inventory

The table lists repository-defined business events. In every row, “GTM/GA4” means **GTM is proven; downstream GA4 delivery is unknown from the repository**.

| Event name | Trigger | Parameters | Source file / mechanism | Destination | Page / component | Measurement purpose |
|---|---|---|---|---|---|---|
| `virtual_page_view` | Initial client render and every pathname or query-string change not identical to the last tracked path | `page_path`, `page_location`, `language` | `src/components/GTMRouteTracker.tsx:14-32` → `pushGTMEvent` | `dataLayer` → GTM; GA4 mapping unknown | Global | Route/page observation for App Router navigation, including landing URL query parameters |
| `click_contact` | Instrumented navbar or footer contact link click | `cta_label`, `cta_location`, `destination`, `language`, `page_path` | `src/components/Navbar.tsx:12-19`; `src/components/Footer.tsx:11-18` | `dataLayer` → GTM; GA4 mapping unknown | Global navbar; two footer contact links | Identify global contact-entry clicks and their page of origin |
| `click_request_shortlist` | Instrumented shortlist CTA click or companies hero modal open | `cta_label`, `cta_location`, `destination`, `language`, `page_path` | `src/components/Hero.tsx:20-27`; `FinalCTA.tsx:11-18`; `ShortlistSprint.tsx:11-18`; `src/app/companies/CompaniesClient.tsx:13-21` | `dataLayer` → GTM; GA4 mapping unknown | Home sections; companies hero | Measure commercial shortlist intent and CTA placement |
| `companies_cta_click` | Home secondary startup path click to `/companies` | `cta_label`, `cta_location`, `destination`, `language`, `page_path` | `src/components/SecondaryStartupPath.tsx:11-18` | `dataLayer` → GTM; GA4 mapping unknown | Home secondary startup path | Measure entry into the companies journey |
| `nearshore_cta_click` | Instrumented candidate/talent CTA click | `cta_label`, `cta_location`, `destination`, `language`, `page_path` | `src/components/Hero.tsx:30-37`; `TalentPathway.tsx:13-20`; `src/app/talents/TalentsClient.tsx:11-18` | `dataLayer` → GTM; GA4 mapping unknown | Home and talents page | Measure candidate/talent journey clicks; despite its name, it does **not** instrument the nearshore landing page |
| `click_whatsapp` | Floating WhatsApp button click | `cta_label`, `cta_location`, `destination`, `language`, `page_path` | `src/components/WhatsAppButton.tsx:26-33` | `dataLayer` → GTM; GA4 mapping unknown | Global, including nearshore | Measure manual chat intent and source page; conversation/lead outcome is not tracked |
| `contact_form_submit` | Contact page `/api/send` request returns an HTTP 2xx response | `form_type`, `language`, `page_path` | `src/app/contact/ContactClient.tsx:35-65` | `dataLayer` → GTM; GA4 mapping/key-event status unknown | `/contact` form | Measure successful server-accepted form submission without PII |

### Important non-events

- The nearshore page's four commercial/internal links have no custom event: hero `/contact`, hero `/methodology`, hero `/companies`, and final `/contact` (`NearshoreDevelopersLatamClient.tsx:72-90,246-261`).
- No custom event marks the first interaction with the `/contact` form.
- The Calendly links on `/contact` and `/companies` have no custom click or booking-completion event.
- `SolutionModals.tsx` submits successfully to `/api/send` but emits no success event. This does not directly block the nearshore path because the nearshore page does not open that modal, but it prevents complete sitewide lead reconciliation.
- Internal navigation links in the navbar/footer and page body are not generally click-instrumented; only the destination route may be observed.
- No custom event defines meaningful engagement. Any GA4 `user_engagement`, `scroll`, `session_start`, `form_start`, or automatically collected acquisition event depends on GTM/GA4 configuration and runtime behavior outside repository evidence.

## 4. Nearshore observability

| Journey requirement | Classification | Repository evidence and limitation |
|---|---|---|
| 1. Organic landing sessions to nearshore | **PARTIALLY MEASURABLE** | `virtual_page_view` identifies the nearshore path and full landing URL. Standard GA4 session acquisition could identify Organic Search, but the GA4 tag, session collection, referrer handling, and reports are not proven here. GSC clicks are not sessions and cannot replace this metric. |
| Meaningful engagement | **UNKNOWN FROM REPOSITORY** | No custom engagement event exists. GA4 engaged sessions, `user_engagement`, and enhanced scroll measurement may exist, but their configuration and delivery cannot be inferred from code. |
| 2. CTA clicks from nearshore | **NOT MEASURABLE** | Nearshore hero and final CTA links have no custom click handlers. Global navbar contact and WhatsApp clicks can carry a nearshore `page_path`, but they do not cover the page's core CTAs. |
| 3. Which CTA was clicked | **NOT MEASURABLE** | No `cta_label` or `cta_location` is emitted for nearshore hero/final CTAs. A later `/contact` view cannot distinguish hero “Request a Shortlist” from final “Get in Touch.” |
| 4. Movement to `/companies`, `/methodology`, or another relevant page | **PARTIALLY MEASURABLE** | Sequential `virtual_page_view` events can show destination pages if the GTM/GA4 mapping and session continuity work. They do not prove which link was clicked and can be affected by duplicate/default page-view setup. |
| 5. Form/contact start | **UNKNOWN FROM REPOSITORY** | Arrival at `/contact` is observable through `virtual_page_view`, but form interaction is not custom-instrumented. GA4 enhanced form interactions may or may not be enabled and reliable. |
| 6. Successful submission | **PARTIALLY MEASURABLE** | `contact_form_submit` fires after a successful `/api/send` response and includes `form_type`, but GA4 delivery, parameter registration, and key-event status are not proven. It records server-accepted email delivery, not lead qualification or revenue. |
| 7. Campaign/source/medium attribution | **UNKNOWN FROM REPOSITORY** | `page_location` preserves landing query strings, including any UTMs, but the app has no manual attribution store. Standard GA4 attribution may be sufficient if correctly configured; that configuration and production data are outside the repository. |
| 8. Organic vs direct vs paid distinction | **UNKNOWN FROM REPOSITORY** | This is normally supplied by GA4 acquisition/channel processing. No repository artifact proves channel collection, channel grouping, ad linking, referral exclusions, or the production report result. |

**Current reconstructable path, conditional on GA4 mapping:** nearshore `virtual_page_view` → destination `virtual_page_view` → `/contact` `virtual_page_view` → `contact_form_submit`.
**Current missing path detail:** exact nearshore CTA/placement → form start → Calendly action → qualified lead/commercial outcome.

## 5. GSC baseline

### Fixed T0

**Date:** 2026-08-22
**Window:** previous 28 days
**Page:** `/en/nearshore-developers-latam`

| Metric | T0 |
|---|---:|
| Impressions | 485 |
| Clicks | 1 |
| CTR | 0.2% |
| Average position | 26 |

### Known commercial cluster

| Query | Impressions |
|---|---:|
| `hire nearshore developers` | 184 |
| `hire dedicated nearshore developers` | 56 |
| `how to hire nearshore developers` | 36 |
| `hire nearshore team latin america` | 19 |
| `hire nearshore dev team latin america` | 14 |
| `hiring nearshore developers` | 14 |
| `nearshore hire developers` | 12 |
| **Known cluster total** | **335** |

The fixed cluster accounts for **335 / 485 = approximately 69.1%** of T0 page impressions. This concentration makes query-level cluster movement more decision-useful than the page-wide average alone. The remaining 150 impressions must stay visible as a separate “other queries” segment so cluster gains are not confused with a shift in unrelated demand.

This audit accepts the supplied GSC figures as the fixed baseline. It does not claim repository evidence for the GSC property, export, filters, or live UI state.

## 6. Query-cluster methodology

1. **Freeze the cohort.** Use the seven exact supplied queries as the primary fixed commercial cluster for every checkpoint. Do not add newly appearing variants retrospectively to the fixed cohort.
2. **Use the same page filter.** Apply an exact page filter for the canonical nearshore URL. Record whether GSC exports the URL with scheme/host/trailing slash and use the same form each time.
3. **Use comparable windows.** Keep search type, property, country/device filters, timezone, and inclusion rules constant. Compare complete GSC days; do not mix partial days. Record GSC data freshness at each pull.
4. **Retain query rows.** For every fixed query export impressions, clicks, CTR, and average position. Do not average the seven displayed average-position values. GSC position is impression-weighted and must be read at the query row or calculated only from appropriate underlying export data.
5. **Report cluster totals and distributions.** Sum impressions and clicks across the fixed query rows; calculate cluster CTR as total clicks / total impressions. Report query counts in Top 20, Top 15, and Top 10, plus the impressions represented within each band.
6. **Interpret CTR against position.** Compare CTR only within similar position bands and preferably device/country segments. A falling raw CTR can coexist with a successful expansion into lower-ranked impressions; a rising CTR can be caused by position gains rather than title copy.
7. **Separate fixed and discovery cohorts.** Track new commercial variants in a secondary discovery set without rewriting the fixed baseline. Promote them only in a future experiment definition.
8. **Inspect query distribution, not only the mean.** Show which queries gained/lost impressions and position, whether gains are concentrated in the head query, and whether more of the fixed cohort crosses Top 20/15/10 boundaries.
9. **Preserve raw evidence.** Save dated GSC exports or screenshots and a checkpoint log containing filters, extraction time, and any anomalies. The experiment document may summarize them, but decisions should remain traceable to raw rows.
10. **Avoid false precision.** At T0 there is one click. CTR and conversion-rate changes are extremely noisy; impressions and position distribution provide earlier directional evidence, while business metrics remain descriptive until volume accumulates.

## 7. Phase 2.5E experiment scorecard

| Dimension | Primary measures | Supporting cuts | Interpretation rule |
|---|---|---|---|
| Ranking | Fixed-cluster impressions; average position per target query; query distribution; number of fixed queries in Top 20 / Top 15 / Top 10 | Impressions within each rank band; device; country; “other queries” segment | Require query-level and distribution evidence; never decide from aggregate page average position alone |
| CTR | Fixed-cluster clicks and CTR | Query, position band, device, country | Interpret only relative to position and impression mix; one-click T0 is not a stable CTR benchmark |
| Organic acquisition | Organic landing sessions with landing page = nearshore | Session source/medium; default channel group; device; country | Use GA4 only after production tag/channel validation; reconcile trend direction with GSC clicks, not one-to-one counts |
| Engagement | Engaged sessions/engagement rate and meaningful downstream page views | `/companies`, `/methodology`, `/contact`; session path | GA4 engagement definition/configuration must be recorded; do not invent a custom “quality” conclusion from time alone |
| CTA interaction | Nearshore CTA clicks by `cta_location`, `cta_label`, and `destination` | Hero shortlist, hero methodology, hero companies, final contact, navbar, WhatsApp | Core page CTA metric is unavailable until the gap is closed and verified before the test |
| Commercial navigation | Sessions moving from nearshore to `/companies`, `/methodology`, or `/contact` | Next-page path and same-session sequence | Destination views are a fallback, not a substitute for CTA clicks |
| Contact initiation | Form start/first valid interaction on `/contact` | Form type and prior nearshore session | Definition must exclude mere contact-page arrival and must not send PII |
| Conversion | Successful `contact_form_submit` from a session that landed organically on nearshore | `form_type=b2b`; source/medium; landing page; CTA path where known | Treat as a server-accepted inquiry, not automatically as a qualified lead; GA4 key-event configuration must be verified |

No numerical success threshold is set in this audit. If a minimum detectable effect, confidence rule, or commercial conversion target is later adopted, it must be explicitly labeled as a hypothesis and fixed before reviewing checkpoint outcomes.

## 8. T0 / D+7 / D+14 / D+28

### T0 — baseline (2026-08-22; previous 28 days)

**Inspect**

- Preserve the supplied page metrics and exact seven-query rows.
- Export the full page-query table, device/country cuts, and current Top 20/15/10 distribution if access is available.
- Record the deployed title, H1, content, internal links, schema, canonical, indexability, and last-modified/deployment evidence.
- Validate production GTM load and consent behavior; use GTM Preview plus GA4 DebugView/Realtime to verify one route event, no duplicate page view, CTA parameters, contact submission, acquisition parameters, and the intended GA4 property.
- Capture a pre-change GA4 landing-page/channel baseline where available, clearly marking any metric that begins only after instrumentation validation.

**Do not conclude yet**

- Do not treat T0 average position 26 as the position of every target query.
- Do not treat one click or 0.2% CTR as a stable rate.
- Do not infer GA4 correctness from the presence of GTM code alone.

**Decision criteria**

- Proceed only when the exact deployed change is documented, the page is indexable/canonical, the fixed query cohort is saved, and P0 measurement checks/gaps are resolved or explicitly accepted as limitations.
- If exact nearshore CTA measurement is unavailable, the SEO experiment may still measure GSC ranking/CTR, but it cannot claim CTA-lift evidence.

**Noise risks**

- Low click volume; GSC anonymized/omitted low-volume rows; partial-day data; device/country mix; seasonality; SERP features; competitor changes; Google updates; duplicate GA4 page views; consent/ad-blocking; internal/test traffic.

### D+7 — technical/crawl observation

**Inspect**

- Deployment correctness, HTTP status, canonical, robots directives, rendered title/H1/schema, sitemap inclusion, internal links, and GSC URL Inspection/indexing signals.
- Whether Google has recrawled the page and whether the intended title appears in search results; note title rewrites.
- GSC daily impressions/position for the fixed cluster only as descriptive telemetry.
- GA4 event continuity, tag failures, duplicate page views, unexpected self-referrals, and missing CTA/form parameters.

**Do not conclude yet**

- Do not declare ranking, CTR, or business success/failure after seven days.
- Do not interpret no movement before confirmed recrawl as rejection of the change.
- Do not compare a partial seven-day window directly with the full 28-day T0 total.

**Decision criteria**

- Fix only technical or measurement defects that invalidate the test; document any intervention as a confounder.
- Continue observation when the page is accessible/indexable and data collection is healthy, even if rankings have not moved.

**Noise risks**

- Crawl latency, GSC reporting lag, weekday composition, very small samples, title rewrites, temporary rank volatility, tag/consent changes.

### D+14 — early directional signal

**Inspect**

- Per-query impressions and position; cluster rank-band distribution; queries entering/leaving Top 20/15/10; head-query versus long-tail contribution.
- Clicks and CTR by query only alongside position.
- Organic nearshore sessions, downstream navigation, CTA interactions, form starts, and successful submissions if P0 validation was completed.
- Any external or sitewide changes during the first two weeks.

**Do not conclude yet**

- Do not call a winner from a single query, a single click/conversion, or aggregate page averages.
- Do not attribute CTR movement to copy when position or query mix also changed.
- Do not backfill missing pre-instrumentation business data as zero.

**Decision criteria**

- Continue when movement is mixed, volume is insufficient, or the page was recrawled late.
- Investigate, without broadening the experiment, if multiple fixed queries show concordant deterioration after confirmed recrawl or if measurement breaks.
- Treat improvement across several fixed queries/rank bands as directional evidence, not a final result.

**Noise risks**

- Still-low click/conversion volume, non-independent query variants, impression expansion into lower positions, device/country shifts, SERP feature changes, delayed indexing.

### D+28 — first decision checkpoint

**Inspect**

- A complete comparable 28-day page and fixed-cluster export using the same filters as T0.
- Per-query changes, cluster impressions/clicks/CTR, Top 20/15/10 distribution, and the “other queries” segment.
- CTR within comparable position bands.
- Validated GA4 organic nearshore sessions and the CTA → commercial navigation → form start → submission funnel, with raw counts and rates.
- Crawl timing, title rewrites, deployments, sitewide edits, campaigns, outages, Google updates, and measurement incidents.

**Do not conclude yet**

- Do not claim causality if multiple SEO variables or analytics definitions changed.
- Do not claim business impact from a handful of sessions or conversions.
- Do not call raw CTR improvement a title win if rank distribution improved at the same time.

**Decision criteria**

- **Retain and observe:** query-level/rank-band evidence is directionally favorable or mixed without material downside, but volume remains insufficient.
- **Iterate in a new isolated test:** ranking visibility is stable/improving but position-adjusted CTR evidence suggests the snippet is underperforming, or the hypothesis was not expressed cleanly.
- **Revert/reassess:** deterioration is sustained across multiple fixed queries/rank bands after recrawl and cannot be explained by technical defects, external changes, query mix, or measurement failure.
- **Business conclusion deferred:** GA4 validation failed, nearshore CTA tracking was absent during the window, or volume is too low. This does not invalidate the GSC SEO result; it limits the funnel claim.

**Noise risks**

- Low absolute clicks and leads, 28-day seasonality, overlapping rolling windows, algorithm/competitor changes, GSC privacy thresholds, title rewrites, channel misclassification, consent loss, and any unlogged release.

## 9. Experiment isolation

Simultaneously changing title, H1, body content, internal links, schema, and analytics would create unnecessary confounding variables. Ranking, snippet CTR, crawl interpretation, and funnel measurement could all change at once, making the outcome non-diagnostic.

### Smallest measurable Phase 2.5E experiment

- **SEO treatment:** change one search-facing variable only. The narrowest test is the HTML title for the nearshore page, aligned to the fixed commercial cluster while preserving brand/readability.
- **Hold constant during the observation window:** H1, body copy, section order, internal inbound and outbound links, anchor text, schema, canonical, robots, sitemap behavior, page path, navigation, CTA copy/placement, performance behavior, GTM container logic, GA4 definitions, consent behavior, and unrelated sitewide SEO changes where controllable.
- **Measurement preflight:** verify GTM-to-GA4 delivery and add/verify the minimum nearshore CTA instrumentation **before** T0 treatment deployment. Record its deployment time and validate it. Once the SEO treatment begins, freeze analytics.
- **If measurement cannot be completed first:** run the title-only GSC experiment with an explicit scope limitation. Do not claim CTA or conversion impact; use destination page views and submissions only as incomplete supporting observations.
- **Future iterations:** test H1/content/internal links/schema separately, each with a fresh declared baseline and checkpoint clock. Schema should change only for a valid content/markup reason, not as part of an undifferentiated ranking bundle.

## 10. Measurement gaps

| Priority | Gap | Why it matters | Required audit-only action before/during Phase 2.5E |
|---|---|---|---|
| **P0** | GTM → intended GA4 property delivery and production container version are not proven | All GA4 conclusions depend on the correct tag, triggers, parameters, consent behavior, and property | Validate in production with GTM Preview and GA4 DebugView/Realtime; save evidence. Confirm no duplicate initial/virtual page views. Do not change application code during this audit. |
| **P0** | Core nearshore page CTA clicks are not instrumented | Cannot measure CTA interaction, CTA identity, or hero-versus-final performance for the experiment | Before the SEO treatment window, define one consistent event with `cta_label`, stable `cta_location`, `destination`, `page_path`, and `language`; validate it, then freeze analytics. Implementation is outside this audit. |
| **P0** | GA4 reporting semantics are unverified | Custom parameters may not be reportable; submission may not be a key event; source/medium may be misclassified | Verify parameter mappings/custom dimensions, key-event status, acquisition/channel behavior, session continuity, and the reporting property before claiming readiness. |
| **P1** | No explicit contact-form start event | Contact-page arrival cannot be separated from actual form engagement | Define a zero-PII, once-per-form start/first-interaction event if funnel diagnosis is needed. Confirm enhanced measurement does not create duplicates. |
| **P1** | No Calendly click or booking-completion measurement | A relevant commercial action can leave the site without a measurable result | Track outbound scheduling intent; use Calendly/cross-domain integration for confirmed booking only if available and privacy-compliant. |
| **P1** | No exact click measurement for nearshore `/companies` and `/methodology` links | Route sequences show movement but not the selected link/placement | Include these destinations in the same stable nearshore CTA/navigation taxonomy before the experiment, or accept destination views as a weaker proxy. |
| **P1** | No qualified-lead outcome linkage | `contact_form_submit` is an inquiry, not proof of a qualified opportunity | Maintain a privacy-safe offline reconciliation process or GA4-compatible outcome event with no PII if commercial validation becomes necessary. |
| **P1** | Successful `SolutionModals` submissions emit no analytics event | Sitewide lead totals may not reconcile with `/contact` submissions | Audit separately; it is not blocking for the direct nearshore → `/contact` experiment path. |
| **P2** | No custom scroll/content-depth event | Limits section-level engagement diagnosis | Use only if it answers a declared content hypothesis; GA4 engagement/scroll may already be sufficient after verification. |
| **P2** | No repository-backed GSC export automation | Manual checkpoint extraction risks inconsistent filters | Use a fixed export template/checklist first; automate only after the experiment definition is stable. |

## 11. Recommended KPIs

### Ranking — primary SEO evidence

- Fixed commercial-cluster impressions.
- Average position for each target query, not only the page average.
- Distribution of the seven target queries and their impressions across rank bands.
- Number of fixed queries entering Top 20, Top 15, and Top 10.
- “Other queries” impressions reported separately to reveal query-mix expansion or dilution.

### CTR — secondary SEO evidence

- Fixed-cluster clicks.
- Fixed-cluster CTR calculated from total cluster clicks / total cluster impressions.
- Query-level CTR and CTR by position band, with device/country context where volume permits.
- Title rewrite status when interpreting snippet performance.

CTR must always be interpreted in relation to position. With one T0 click, CTR is descriptive and highly unstable.

### Business — downstream evidence

- Organic landing sessions whose landing page is `/en/nearshore-developers-latam`.
- Meaningful engagement using the documented GA4 definition, plus downstream commercial page views.
- Nearshore CTA interactions by stable CTA location/label/destination.
- Same-session movement to `/companies`, `/methodology`, and `/contact`.
- Contact-form initiation, distinct from contact-page arrival.
- Successful `contact_form_submit`, segmented to organic nearshore landing sessions and `form_type=b2b` where applicable.
- Confirmed commercial outcome/qualified lead only if a separately validated privacy-safe process exists.

Use raw counts beside rates at every checkpoint. Do not optimize on rates with tiny denominators, and do not create numerical pass/fail thresholds after observing the results.

## 12. Final verdict

The repository contains a real Phase 2.5A GTM/dataLayer foundation and a valid success-timed contact submission event; measurement is not absent. The fixed GSC baseline and query cluster are sufficient to run a narrow ranking/CTR experiment. However, the repository cannot prove the downstream GA4 configuration, and the nearshore page's core CTA interactions are not currently distinguishable. Those are material conditions for evaluating the complete organic-to-commercial journey requested for Phase 2.5E.

Proceed with a single-variable, preferably title-only SEO treatment only after production GTM/GA4 validation and minimum nearshore CTA instrumentation are completed and frozen. If those conditions are not met, proceed only as a GSC ranking/CTR experiment and explicitly exclude CTA/conversion impact claims.

**ANALYTICS MEASUREMENT READINESS: CONDITIONAL**
