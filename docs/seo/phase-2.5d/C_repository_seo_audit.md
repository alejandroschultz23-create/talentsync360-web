# TalentSync360 Phase 2.5D — Repository & SEO Architecture Audit (C)

Audit date: 2026-08-22  
Branch gate: `audit/phase-2.5d-seo-strategy` — PASS  
Scope: `/en/nearshore-developers-latam`, `/companies`, `/talents`, `/methodology`, `/`  
Method: static repository inspection only; no application implementation or runtime deployment test.

## 1. Executive summary

The nearshore landing page is technically isolated enough for a narrow content experiment: route metadata and page-level schemas are in `src/app/en/nearshore-developers-latam/page.tsx`, while all visible copy, role data, FAQ data, and section order are in `NearshoreDevelopersLatamClient.tsx`. The only visible shared component used inside its body is `FAQAccordion`; the global layout adds navigation, footer, language state, analytics, and Organization JSON-LD.

The page is indexable and present in the generated sitemap, has a self-canonical, complete page-specific OpenGraph and Twitter objects, one H1, and coherent section headings. The implementation nevertheless has four Phase 2.5E-relevant constraints:

1. No rendered internal link points to `/en/nearshore-developers-latam` from the homepage, `/companies`, `/methodology`, navigation, or footer. Repository-wide occurrences outside audit reports are limited to the route itself and `src/app/sitemap.ts`.
2. No `alternates.languages`/hreflang exists. The global document declares `<html lang="es">` even for the English route, while the route body is hardcoded English. Language state can only add a Spanish “coming soon” notice.
3. The visible nearshore FAQ is not represented by FAQPage JSON-LD. The only FAQ schema is homepage-specific and uses a different data source.
4. Several commercial claims omit qualifiers already used elsewhere in the repository. In particular, “eliminates project blockages,” production readiness, universally “objective” English testing, and unconditional 3–5 profiles/72-hour delivery require evidence or qualification.

There is strong semantic overlap between `/companies` and the nearshore page, but the repository alone does not establish search cannibalization. The pages retain distinguishable intended ownership: `/companies` is the B2B package/pricing page; nearshore is the English LATAM nearshore acquisition page; `/talents` is candidate acquisition. Search Console/query/landing-page evidence would be required to elevate overlap to cannibalization.

## 2. Route/component map

### Nearshore route dependency tree

| Layer | File / lines | Responsibility | Shared impact |
|---|---|---|---|
| App Router route | `src/app/en/nearshore-developers-latam/page.tsx:7-35,37-49` | Page metadata; injects Service and Breadcrumb JSON-LD; renders client page | Route-only, except imported schemas |
| Visible page | `src/app/en/nearshore-developers-latam/NearshoreDevelopersLatamClient.tsx:9-267` | All visible sections, English copy, role data, FAQ data, and internal CTAs | Route-only except `FAQAccordion` behavior |
| Root layout | `src/app/layout.tsx:23-61,63-89` | Metadata base/template, default metadata, global schemas/UI, `<html lang>`, providers | All routes |
| Navigation | `src/components/Navbar.tsx:22-65` | Shared navigation; no nearshore link | All routes |
| Footer | `src/components/Footer.tsx:21-83` | Shared footer; no nearshore link | All routes |
| Locale provider | `src/context/LanguageContext.tsx:14-55` | Defaults to English, then reads/writes `ts360-lang` in local storage | All client-rendered translated pages |
| Translation source | `src/context/translations.ts:430+` | Shared EN/ES copy for root, companies, talents, methodology, nav/footer | Not the nearshore body; nearshore reads only `lang` |
| Visible FAQ UI | `src/components/FAQAccordion.tsx:5-62` | Generic accordion from passed `{q,a}` data | Homepage, talents, nearshore |
| Service schema | `src/components/ServiceSchema.tsx:3-22` | Hardcoded `Service` JSON-LD for “Shortlist Sprint” | Nearshore and companies |
| Breadcrumb schema | `src/components/BreadcrumbSchema.tsx:3-40` | Programmatic JSON-LD list; no visible breadcrumb UI | Nearshore, companies, talents, methodology |
| Organization schema | `src/components/OrganizationSchema.tsx:3-22`; mounted `src/app/layout.tsx:78` | Global Organization JSON-LD | All routes |
| Sitemap | `src/app/sitemap.ts:3-12` | Includes all five audited URLs, including nearshore | Site-wide |
| Robots | `src/app/robots.ts:3-10` | Allows `/` to all agents; advertises sitemap | Site-wide |

There is no nested `layout.tsx` under `src/app/en` or the nearshore route. The route therefore inherits the root layout directly. There is no CMS, MDX, API, database, or separate content file for this page.

### Audited route ownership

| URL | Server page | Visible client/content | Content model |
|---|---|---|---|
| `/` | `src/app/page.tsx` | `src/app/HomeClient.tsx:17-56` plus imported homepage components | Shared EN/ES `translations.ts` data |
| `/companies` | `src/app/companies/page.tsx` | `src/app/companies/CompaniesClient.tsx:9-190` | Mixed: translations plus local tier arrays |
| `/talents` | `src/app/talents/page.tsx` | `src/app/talents/TalentsClient.tsx:8-145` | Shared EN/ES translations |
| `/methodology` | `src/app/methodology/page.tsx` | `src/app/methodology/MethodologyClient.tsx:5-84` | Shared EN/ES translations |
| `/en/nearshore-developers-latam` | `src/app/en/nearshore-developers-latam/page.tsx` | `NearshoreDevelopersLatamClient.tsx` | Hardcoded English local constants/JSX |

## 3. SEO implementation

### Nearshore exact implementation

| Element | Current implementation | Source |
|---|---|---|
| Declared title | `Hire Nearshore Developers in LATAM \| Vetted Tech Talent \| TalentSync360` | `page.tsx:8` |
| Effective title | `Hire Nearshore Developers in LATAM \| Vetted Tech Talent \| TalentSync360 \| TalentSync360` because the child page string is augmented by root `title.template: "%s \| TalentSync360"` | `page.tsx:8`; `src/app/layout.tsx:25-28`; Next metadata behavior documented in `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md:243-345` |
| Meta description | `Access vetted LATAM developers and technical profiles through nearshore shortlists with timezone alignment, human screening, English communication checks, and technical scorecards.` | `page.tsx:9` |
| Canonical | Absolute self-canonical `https://www.talentsync360.com/en/nearshore-developers-latam` | `page.tsx:10-12` |
| Robots meta | Not explicitly set in root or route metadata; no page-level `<meta name="robots">` is authored | `page.tsx:7-35`; `src/app/layout.tsx:23-61` |
| Crawl policy | Site-wide `User-agent: *`, `Allow: /`; sitemap declared | `src/app/robots.ts:3-10` |
| Hreflang | None; `alternates` has only `canonical`, no `languages` | `page.tsx:10-12` |
| Document language | Incorrectly inherited as static `<html lang="es">` for this English URL | `src/app/layout.tsx:69-71` |
| H1 | `Hire vetted nearshore developers and technical talent in Latin America.` | `NearshoreDevelopersLatamClient.tsx:65-67` |
| OpenGraph | Page-specific title, description, URL, site name, 1200×630 `/logo_oficial.png`, `en_US`, website type | `page.tsx:13-28` |
| Twitter | `summary_large_image`; page-specific title, description, and logo image | `page.tsx:29-34` |
| Structured data | Global Organization plus page Service and BreadcrumbList | `src/app/layout.tsx:78`; `page.tsx:40-45` |
| Breadcrumbs | JSON-LD only: Home → Nearshore Developers LATAM; no visible breadcrumb component | `page.tsx:41-45`; `BreadcrumbSchema.tsx:12-40` |
| Sitemap | Explicitly included; generated `lastModified` is the generation time on every request/build, frequency `daily`, priority `0.8` | `src/app/sitemap.ts:3-12` |

### Heading hierarchy

The nearshore page contains one H1. Its ordered H2 sections are:

1. `Who This Is For` (`NearshoreDevelopersLatamClient.tsx:100`) with H3s `US & EU Startups`, `Scaling Tech Teams`, `IT Consultancies` (`:106,112,118`).
2. `The LATAM Nearshore Advantage` (`:132`) alongside H3 `What We Screen Before Shortlisting` (`:169`). Its feature labels are H4s (`:142,151,160`).
3. `The 72-Hour Shortlist Sprint` (`:197`) with H3s `Define & Match`, `Technical Screening`, `Decision-Ready Profiles` (`:204,209,214`).
4. `Common LATAM Roles Covered in Shortlist Sprints` (`:225`) with role names rendered as H4, skipping H3 (`:230-236`). This is a minor hierarchy inconsistency, not evidence of a broad technical defect.
5. `Frequently Asked Questions`, rendered as H2 by shared accordion (`NearshoreDevelopersLatamClient.tsx:244`; `FAQAccordion.tsx:25`). Questions are styled `span` elements inside buttons, not headings (`FAQAccordion.tsx:33-54`).
6. `Activate Your Sourcing Sprint` (`NearshoreDevelopersLatamClient.tsx:250-252`).

### Cross-route metadata comparison

| URL | Declared page title | Effective title observation | Canonical | Page OG | Page Twitter |
|---|---|---|---|---|---|
| `/` | `White-Label LATAM Technical Shortlists for IT Consultancies \| TalentSync360` (`src/app/page.tsx:7`) | Root page is in the same segment as the template, so the root template does not suffix it | Self (`:9-11`) | Yes (`:12-17`) | Yes (`:18-22`) |
| `/companies` | `Hire Vetted LATAM Tech Talent \| B2B Technical Staffing \| TalentSync360` (`companies/page.tsx:8`) | Duplicated brand suffix via root template | Self (`:10-12`) | Title/description/URL only (`:13-17`) | No page override; inherits root homepage Twitter object |
| `/talents` | `Join the Gold List for LATAM Tech Professionals \| TalentSync360` (`talents/page.tsx:7`) | Duplicated brand suffix via root template | Self (`:9-11`) | Title/description/URL only (`:12-16`) | No page override; inherits root homepage Twitter object |
| `/methodology` | `Our Vetting Methodology & 360° Fit Matrix \| TalentSync360` (`methodology/page.tsx:7`) | Duplicated brand suffix via root template | Self (`:9-11`) | Title/description/URL only (`:12-16`) | No page override; inherits root homepage Twitter object |
| Nearshore | See above | Duplicated brand suffix via root template | Self | Complete page object | Complete page object |

All five pages omit page-level robots metadata and hreflang. `/companies`, `/talents`, `/methodology`, and `/` are translation-state pages on stable nonlocalized URLs: visible H1/body copy can change between EN and ES via local storage while their server metadata remains English and the document language remains `es`. Nearshore is different: its content stays English, with only an ES-state notice (`NearshoreDevelopersLatamClient.tsx:35-48`).

## 4. Content structure

### Nearshore rendered sections in order

| Order | Section / component | Source and data model | Translation dependency | Cross-page edit impact |
|---:|---|---|---|---|
| 0 | Optional Spanish notice | `NearshoreDevelopersLatamClient.tsx:41-48`; hardcoded | `lang` only | None outside route |
| 1 | Hero: positioning, two CTAs, comparison link | `:50-94`; hardcoded JSX | None for copy | None outside route |
| 2 | Who This Is For: three audience cards | `:96-125`; hardcoded JSX | None | None |
| 3 | LATAM Nearshore Advantage + screening list | `:127-191`; hardcoded JSX | None | None |
| 4 | 72-Hour Shortlist Sprint: three steps | `:193-219`; hardcoded JSX | None | None |
| 5 | Common LATAM Roles | `:221-241`; `ROLES` local array at `:9-14` | None | None |
| 6 | FAQ | `:243-244`; `FAQS` local array at `:16-33`; shared `FAQAccordion` | None | Data edits affect only nearshore; accordion code edits affect home/talents |
| 7 | Final CTA | `:246-263`; hardcoded JSX | None | None |

### Technically safe future insertion points

These are structural locations, not implementation recommendations:

| Future section | Safest insertion point | Reason / dependency |
|---|---|---|
| Hiring process expansion | After current Sprint Process (`NearshoreDevelopersLatamClient.tsx:219`) or expand local process cards at `:193-219` | Keeps intent adjacent to current process; route-local |
| One developer vs team | Between audience cards and advantage (`:125-128`) | Clarifies buyer shape before benefits; route-local |
| Engagement-model clarification | After process and before roles (`:219-222`) or immediately before FAQ (`:241-243`) | Separates sourcing/validation service from employment/contract model before conversion questions |
| Expanded FAQ | Add items only to local `FAQS` (`:16-33`) | Visible impact is route-only; schema would remain absent unless separately designed |
| Contextual methodology proof link | Within screening/process prose at `:169-185` or `:209-215` | More semantically relevant than adding another generic CTA |

Avoid changing `FAQAccordion` for content-only work. It is shared and has no schema responsibility.

## 5. Claim source map

Classifications are editorial/technical audit opinions only. “Evidence” means substantiation outside the source code is needed; repository repetition is not proof.

| Claim topic | Exact nearshore wording and source | Related repository wording | Classification | Audit rationale |
|---|---|---|---|---|
| Timezone alignment | `timezone alignment` (`NearshoreDevelopersLatamClient.tsx:69`); `daily timezone overlap aligned with North American and European operations` (`:143`); FAQ says `full timezone alignment ... (EST/CST/GMT)` (`:18-20`) | Homepage qualifies timezone as a brief requirement (`translations.ts:605,622,637`); talents require US hours (`:816`) | CONTEXT-DEPENDENT | LATAM overlap varies by country, season, employer schedule, and Europe vs North America. “Full” alignment is not universal. |
| Project blockages/delays | `Real-time collaboration eliminates project blockages.` (`NearshoreDevelopersLatamClient.tsx:143`); FAQ says alignment `eliminates communication delays` (`:19`) | Homepage uses narrower “lose momentum” wording (`translations.ts:489-490`) | TOO ABSOLUTE | Time overlap can reduce asynchronous delay; it cannot eliminate all delays or project blockages. |
| Premium technical profiles | `premium technical profiles` (`NearshoreDevelopersLatamClient.tsx:226`); `Premium Technical Hubs` (`:160`) | `/talents`: `premium nearshore standards` (`translations.ts:809`) | NEEDS EVIDENCE | “Premium” is undefined and requires criteria or proof. “Technical hubs” and individual profile quality are separate assertions. |
| Production readiness | `ready to deploy directly into production environments` (`NearshoreDevelopersLatamClient.tsx:226`) | `/companies`: `pre-validated for immediate integration` (`translations.ts:772`) | TOO ABSOLUTE | Screening does not itself establish immediate production access/readiness for every person, stack, environment, or onboarding context. |
| Senior engineers screening | `Senior engineers screen candidates against technical screening criteria and English signals.` (`NearshoreDevelopersLatamClient.tsx:210`) | Homepage FAQ: each test/work sample/audio personally reviewed by a stack-relevant senior engineer (`translations.ts:660`); methodology says experts (`:822`) | NEEDS EVIDENCE | This is a verifiable operating-process claim; confirm actual reviewer assignment and scope. It also conflates technical reviewers with English evaluation. |
| Objective testing | `Objective testing of professional written and spoken English.` (`NearshoreDevelopersLatamClient.tsx:177`) | Methodology: standardized oral/written testing human-corrected by language experts (`translations.ts:824-825`); homepage disclaims certification of a specific English level (`:616`) | NEEDS EVIDENCE | “Objective” requires a documented rubric, consistent administration, reviewer qualifications, and reliability evidence. |
| 3–5 finalists | `Receive 3 to 5 finalist profiles` (`NearshoreDevelopersLatamClient.tsx:215`); FAQ `3 to 5 screened developers` (`:26-27`) | Homepage says 3–5 after one validated brief (`translations.ts:499-507`); companies tier says `3-5 senior candidates` (`CompaniesClient.tsx:31`) | CONTEXT-DEPENDENT | Safe only with brief validation, feasibility, scope, and specialized-role exceptions made explicit. |
| 72-hour delivery | `within 72 hours` (`NearshoreDevelopersLatamClient.tsx:215,27`); H2 `The 72-Hour Shortlist Sprint` (`:197`) | Homepage target begins after validated brief and specialized roles may take 2–5 days (`translations.ts:460-466`); companies says target SLA for validated briefs (`CompaniesClient.tsx:32,40-43`) | CONTEXT-DEPENDENT | Nearshore wording presents a firmer promise than the qualified shared baseline. |
| English / communication validation | `English communication checks` (`NearshoreDevelopersLatamClient.tsx:69`); structured FAQ funnel (`:22-24`); recorded English checks (`:215`) | `/talents` says English is assessed only when required (`translations.ts:793-796`); homepage says no specific level is certified (`:616`) | CONTEXT-DEPENDENT | Clarify whether every nearshore shortlist requires English, which instruments are used, and whether output is a signal vs certification. |
| AI-assisted matching/screening | Nearshore body does not explicitly claim AI; `Our platform initiates sourcing filters` (`NearshoreDevelopersLatamClient.tsx:210`) | Global Organization schema says `AI-assisted sourcing and human vetting` (`OrganizationSchema.tsx:13`); homepage says AI-assisted signal extraction/rubric mapping with human decisions (`translations.ts:607,616,661,731`); `/companies` tier says AI-assisted extraction plus human review (`CompaniesClient.tsx:36,41`) | SAFE for the narrow “assistance” formulation; CONTEXT-DEPENDENT for matching/screening | The repository consistently disclaims automated hiring decisions. Do not upgrade “assistance” to autonomous matching, rejection, selection, or guaranteed fit. |

## 6. Internal linking

### Links to nearshore

| Source URL / surface | Source file | Anchor | Destination | Type |
|---|---|---|---|---|
| `/` | `src/app/HomeClient.tsx` and imported components | None | None | No link |
| `/companies` | `src/app/companies/CompaniesClient.tsx` | None | None | No link |
| `/methodology` | `src/app/methodology/MethodologyClient.tsx` | None | None | No links at all in page body |
| Navigation (all routes) | `src/components/Navbar.tsx:46-54` | None | None | No nearshore navigation link |
| Footer (all routes) | `src/components/Footer.tsx:47-65` | None | None | No nearshore navigation link |
| `/talents` | `src/app/talents/TalentsClient.tsx` | None | None | No link |

The sitemap entry (`src/app/sitemap.ts:5`) supports crawler discovery but is not an HTML internal link and does not replace contextual linking.

### Links from nearshore

| Source section | Source file / lines | Anchor | Destination | Type |
|---|---|---|---|---|
| Hero primary CTA | `NearshoreDevelopersLatamClient.tsx:73-79` | `Request a Shortlist` | `/contact` | Contextual/conversion |
| Hero secondary CTA | `:80-85` | `See Our Vetting Standard` | `/methodology` | Contextual |
| Hero comparison | `:87-90` | `Compare with our B2B Shortlist Sprint packages →` | `/companies` | Contextual |
| Final CTA | `:256-261` | `Get in Touch` | `/contact` | Contextual/conversion |
| Global logo/nav/footer inherited by page | `Navbar.tsx:27-56`; `Footer.tsx:30-75` | Brand, Companies, Talents, Methodology, Contact, legal anchors | `/`, `/companies`, `/talents`, `/methodology`, `/contact`, `/terms`, `/privacy` | Navigational |

### Technically sensible contextual-link opportunities

1. Homepage `Hero` or `ICPSection`: link a phrase such as “LATAM engineering teams” or “nearshore developers” to the nearshore route. Sources: `src/components/Hero.tsx:58-62`, `src/components/ICPSection.tsx:21-45`; copy source `translations.ts:455-475`.
2. Homepage `ConsultancyUseCases`, in `Building a LATAM delivery pod`, link the relevant descriptive phrase to nearshore. Sources: `src/components/ConsultancyUseCases.tsx:17-34`; `translations.ts:629-638`.
3. `/companies` hero or roles intro: add a contextual “nearshore developers in LATAM” reference pointing to the specialized landing page. Source: `CompaniesClient.tsx:79-84` or `:143-148`.
4. `/methodology` intro/result section: add an explanatory link for readers moving from vetting mechanics to the nearshore service. Source: `MethodologyClient.tsx:13-18` or `:75-79`.
5. Footer “For Companies”: a stable navigational nearshore link is technically simple, but should follow—rather than substitute for—at least one contextual body link. Source: `Footer.tsx:47-52`; anchor strings live in both locale branches of `translations.ts`.

The first four opportunities are preferable for topical relevance. Any translated shared-surface link needs parallel EN/ES anchor copy even though the destination currently renders English.

## 7. FAQ/schema

- Visible nearshore FAQ: **Yes**, four entries. Data is the local `FAQS` constant (`NearshoreDevelopersLatamClient.tsx:16-33`) rendered by `FAQAccordion` at `:244`.
- Nearshore FAQPage JSON-LD: **No**. `src/app/en/nearshore-developers-latam/page.tsx` mounts only Service and Breadcrumb schemas (`:40-45`).
- Visible generation: Programmatic rendering from the local array through the shared accordion (`FAQAccordion.tsx:28-57`).
- Schema generation: The repository’s only `FAQSchema` maps `translations.en.home.faqClients` (`src/components/FAQSchema.tsx:4-18`) and is mounted only on `/` (`src/app/page.tsx:28`).
- Shared data source between nearshore visible FAQ and schema: **No**, because nearshore has no FAQ schema. Reusing the existing homepage `FAQSchema` would be incorrect: it is hardwired to homepage questions.
- Mismatch risk: **High if schema is added independently.** The visible nearshore array lives inside a client component and is not exported. A second manually copied schema array would drift. A future design would need one route-local shared serializable data source consumed by both UI and server schema, but no schema change is authorized here.
- Other nearshore structured data: global Organization, route-level Service, and route-level BreadcrumbList. `ServiceSchema` is shared with `/companies` and its hardcoded “verified English” description (`ServiceSchema.tsx:13`) is broader than the role-dependent language qualification used on `/talents`.
- Visible breadcrumbs: none; schema-only.

## 8. Semantic ownership/cannibalization

### Intended ownership

| URL | Title/H1 ownership | Major commercial theme |
|---|---|---|
| `/` | Title: white-label LATAM technical shortlists for IT consultancies (`src/app/page.tsx:7`); H1: `Turn technical talent needs into decision-ready LATAM shortlists.` (`translations.ts:455`, rendered `Hero.tsx:58-60`) | Broad platform/consultancy positioning, one-brief Sprint, white-label delivery |
| `/companies` | Title: `Hire Vetted LATAM Tech Talent...` (`companies/page.tsx:8`); H1: `Hire vetted LATAM tech talent with decision-ready shortlists.` (`translations.ts:753`, rendered `CompaniesClient.tsx:79-81`) | Buyer package, pricing, roles, 72-hour shortlist |
| `/talents` | Title: Gold List for LATAM professionals (`talents/page.tsx:7`); H1: candidate application/validation (`translations.ts:787`, rendered `TalentsClient.tsx:30-32`) | Candidate acquisition and validation process |
| `/methodology` | Title/H1: vetting methodology and Shortlist Quality Standard (`methodology/page.tsx:7`; `translations.ts:821`, rendered `MethodologyClient.tsx:13-15`) | Evaluation mechanics, deliverables, human evidence |
| Nearshore | Title/H1: hire nearshore developers/technical talent in LATAM (`page.tsx:8`; client `:65-67`) | Geo/service-intent landing page for nearshore hiring |

### Semantic overlap

There is substantial phrase and concept reuse:

- **Hire tech talent from LATAM / vetted LATAM talent:** direct primary ownership on `/companies`; nearshore uses it in title, H1, and description; homepage uses LATAM shortlist language.
- **Hire nearshore developers:** strongest explicit ownership on nearshore; `/methodology` meta description mentions “nearshore developers” (`methodology/page.tsx:8`); `/talents` refers to premium nearshore standards (`translations.ts:809`).
- **Technical shortlist / sourcing sprint:** primary platform mechanism across `/`, `/companies`, and nearshore. Nearshore uses `Shortlist Sprint` in an H2, FAQ, and CTAs.
- **Candidate validation / technical signals / English checks:** methodology owns the process explanation; the same proof language supports commercial conversion on homepage, companies, and nearshore.
- **3–5 finalists / 72 hours:** repeated on homepage, companies, and nearshore, with inconsistent prominence and qualification.
- **Role coverage:** companies and nearshore repeat React/Next.js, Node/TypeScript, AI/data, and DevOps role families.

This is **SEMANTIC OVERLAP**. It is not, by itself, proof of cannibalization.

### Evidence of possible cannibalization

Repository evidence supports only a **possible** overlap between `/companies` and nearshore for broad English commercial queries such as “hire vetted LATAM tech talent,” because both place that intent in title/H1 and describe the same shortlist mechanism. The absence of inbound anchor differentiation also weakens explicit site architecture signals.

There is no repository-only evidence that both URLs rank for or exchange impressions/clicks on the same query, that Google alternates their ranking, or that either suppresses the other. Confirmed cannibalization requires query-by-page Search Console data, indexed canonical inspection, and preferably SERP observations. `/talents` has clearly different candidate-side intent and is not a credible cannibalization peer despite shared “LATAM,” “validation,” and “shortlist” vocabulary.

Recommended ownership boundary for a future experiment:

- Nearshore: informational-commercial geo/service intent (“nearshore developers in LATAM,” team shape, engagement model, time overlap).
- `/companies`: package/pricing/brief activation and broader B2B staffing intent.
- `/methodology`: proof and process (“how candidates are evaluated”).
- `/talents`: candidate enrollment and opportunity requirements.
- `/`: platform/category overview with qualified pathways.

## 9. Prospective change surface

No changes are authorized by this audit. This table maps the smallest prospective surface.

| File | Component | Potential future change | Why | Shared impact | Risk | Dependencies |
|---|---|---|---|---|---|---|
| `src/app/en/nearshore-developers-latam/NearshoreDevelopersLatamClient.tsx` | Nearshore client | Add/qualify copy, new sections, contextual links, expand local FAQ | Primary isolated content surface | Low for local JSX/data; shared accordion unchanged | Low–medium: copy claims and heading order | Claim evidence; approved positioning |
| `src/app/en/nearshore-developers-latam/page.tsx` | Route page | Correct title ownership; add language alternates only if a real alternate exists; adjust route schemas if separately approved | Server SEO surface | Route-only except shared schema imports | Medium: metadata/schema contract | Current Next metadata conventions; actual locale strategy |
| New route-local content module, if needed | Nearshore FAQ/content data | Export one serializable FAQ source for UI and any future schema | Prevent visible/schema drift | Route-only if kept local | Low | Server/client-safe plain data |
| `src/components/Hero.tsx` and/or `src/components/ConsultancyUseCases.tsx` | Homepage content | Add one contextual inbound nearshore link | Establish topical discovery from `/` | Homepage; both languages if anchor translated | Low–medium | `translations.ts`; English-only destination caveat |
| `src/app/companies/CompaniesClient.tsx` | Companies page | Add one differentiated contextual nearshore link | Connect package page to geo/service page | `/companies`, both client locales | Low–medium | Locale-specific anchor and destination expectations |
| `src/app/methodology/MethodologyClient.tsx` | Methodology page | Add one proof-to-service contextual link | Link evaluation proof to service intent | `/methodology`, both client locales | Low–medium | Translation copy if anchor is data-driven |
| `src/components/Footer.tsx` + `src/context/translations.ts` | Shared footer | Optional nearshore navigation entry | Persistent discovery after contextual links exist | Every page, EN/ES | Medium due site-wide footprint | Locale strategy and information architecture |
| `src/app/layout.tsx` | Root layout/metadata | Correct document-language and/or title strategy | Current lang mismatch and duplicated child titles | All routes | High; broad validated-flow impact | Explicit locale architecture decision; regression checks for every route |
| `src/app/sitemap.ts` | Sitemap | Only refine timestamps/alternates if broader sitemap work is approved | Current route is already included | Site-wide | Medium | Deployment/build behavior and real localized URLs |

For a narrow Phase 2.5E experiment, prefer the first row plus one or two contextual source links. Root layout and shared schema changes should be a separately scoped technical task.

## 10. Files to keep untouched

During a narrow nearshore content/internal-link experiment, explicitly keep these unchanged unless a separate acceptance criterion requires them:

- `src/app/layout.tsx` — title template, document language, providers, global UI/schema, and analytics are site-wide.
- `src/context/LanguageContext.tsx` — client locale persistence is a shared contract.
- `src/components/Navbar.tsx` and `src/components/Footer.tsx` — global navigation footprint; footer only becomes in scope if explicitly selected as an inbound-link surface.
- `src/components/FAQAccordion.tsx` — shared UI used by homepage, talents, and nearshore.
- `src/components/FAQSchema.tsx` — homepage-specific schema; must not be reused for nearshore as-is.
- `src/components/ServiceSchema.tsx`, `BreadcrumbSchema.tsx`, `OrganizationSchema.tsx` — shared schema contracts.
- `src/app/sitemap.ts` and `src/app/robots.ts` — nearshore is already included and allowed.
- `src/app/companies/page.tsx`, `src/app/talents/page.tsx`, `src/app/methodology/page.tsx`, `src/app/page.tsx` — route metadata is outside a nearshore content test.
- `src/app/talents/**` — candidate-side flow is not part of nearshore acquisition testing.
- Homepage components not chosen for one deliberate contextual link, including `WhiteLabelDemo`, `ShortlistSprint`, and `DeliverableEvidence`.
- `src/app/en/it-consultancies-spain/**` — adjacent landing page but outside the audited change target.
- Analytics/GTM, contact, API, pricing/modal, routing, schemas, and data contracts generally; none is required for the narrow content experiment.

## 11. Technical risks

1. **Language signal conflict:** English nearshore content is served under a global `lang="es"`, without hreflang. This is the clearest technical language inconsistency, but fixing it safely requires an explicit locale architecture rather than a route-copy patch.
2. **Effective title duplication:** child page titles already contain `TalentSync360` and then receive the root suffix. Nearshore, companies, talents, and methodology are affected. This is broader than nearshore and should not be silently fixed inside a content experiment.
3. **No inbound HTML links:** sitemap inclusion alone leaves nearshore isolated from the rendered link graph. Internal-link readiness is conditional until at least one relevant contextual source is selected and copy/localization implications are resolved.
4. **FAQ/schema separation:** no nearshore FAQ schema exists. Adding manually duplicated schema data would introduce drift risk; reusing homepage schema would create incorrect visible/schema correspondence.
5. **Claim inconsistency:** nearshore uses unconditional 72-hour/3–5 delivery language while the homepage and companies surfaces use validation, target-SLA, and specialized-role qualifiers.
6. **English process inconsistency:** nearshore implies English checks throughout; `/talents` says English is role-dependent, and homepage disclaims certification of a specific level.
7. **Shared schema claim:** `ServiceSchema` says “verified English” globally, which is stronger than some visible copy. Because it is shared, it is unsafe to alter as part of a nearshore-only experiment.
8. **Client-side locale variability:** `/`, `/companies`, `/talents`, and `/methodology` can render English or Spanish visible copy at the same canonical URL based on local storage, while static metadata stays English. Static source comparison therefore describes default-English render plus alternate client state, not separate localized URLs.
9. **Unproven runtime output:** this audit did not run a production build, browser crawl, Rich Results test, or live URL inspection. Effective metadata observations are based on the installed Next.js documentation and source inheritance rules.
10. **Sitemap timestamp semantics:** every listed URL receives `new Date()` rather than content-derived modification time. Directly relevant inclusion is correct, but the freshness signal is not content-specific.

## 12. Final verdict

The repository supports a narrow Phase 2.5E nearshore content experiment without a broad refactor. The safest implementation boundary is the route-local client component, optionally paired with one or two carefully differentiated contextual links from existing buyer-facing pages. Do not combine that experiment with global locale, root metadata, shared schema, or navigation redesign.

Before publishing stronger commercial copy, validate the operating evidence and restore the existing qualifiers around delivery timing, finalist count, English assessment, reviewer role, and specialized briefs. Before any FAQ schema work, establish a single route-local data source shared by visible content and server-rendered JSON-LD.

- Nearshore implementation readiness: **CONDITIONAL**
- Internal linking readiness: **CONDITIONAL**
- Claim safety: **BLOCKED**
- Schema situation: **CONDITIONAL**
