# TalentSync360 Homepage & Positioning Audit

This audit reviews the current TalentSync360 repository architecture, copy patterns, and page layouts to prepare for a consultancies-first positioning refactor and the integration of a static interactive white-label candidate demo.

---

## 1. Current File Map & Component Roles

### Core Routes (`src/app/`)
* **`page.tsx`**: Server component for `/`. Configures core SEO metadata, alternates (canonical), and renders `HomeClient`.
* **`HomeClient.tsx`**: Client component managing the homepage section order and referencing modular sub-components.
* **`layout.tsx`**: Global wrapper. Injects font configurations, global styles, and core context providers (`LanguageProvider`). Renders global layouts: `<GoogleAnalytics />`, `<WhatsAppButton />`, `<OrganizationSchema />`, `<Navbar />`, `<Footer />`, and Vercel `<Analytics />`.
* **`companies/page.tsx` & `CompaniesClient.tsx`**: Displays B2B pricing tiers, professional roles covered, and booking call CTAs.
* **`methodology/page.tsx` & `MethodologyClient.tsx`**: Outlines the 360° vetting methodology, screening filters, and deliverables.
* **`talents/page.tsx` & `TalentsClient.tsx`**: B2C onboarding page for LATAM software engineering talent.
* **`contact/page.tsx` & `ContactClient.tsx`**: Hub containing B2B (sourcing), B2C (candidate intake), and general contact forms.
* **`en/it-consultancies-spain/page.tsx` & `ItConsultanciesSpainClient.tsx`**: Targeted landing page for Spanish IT consultancies. Renders custom JSON-LD schemas (`ServiceSchema` & `BreadcrumbSchema`).
* **`en/nearshore-developers-latam/page.tsx` & `NearshoreDevelopersLatamClient.tsx`**: Startup-oriented landing page. Renders custom JSON-LD schemas.

### Component Layer (`src/components/`)
* **`Hero.tsx`**: Homepage hero banner displaying the value proposition and core recruitment statistics.
* **`SolutionSplit.tsx`**: Renders side-by-side positioning cards: Spanish IT Consultancies (pointing to `/en/it-consultancies-spain`) and US/EU Startups (triggering the "runway" modal).
* **`SolutionModals.tsx`**: Client-side Radix Dialog forms that POST lead data to `/api/send`.
* **`TalentGrid.tsx`**: Simulated live capacity map showing available vetted developers by stack.
* **`FAQAccordion.tsx`**: Reusable component rendering collapsible FAQ items.
* **`Navbar.tsx` & `Footer.tsx`**: Global header and footer links.
* **`LanguageSwitcher.tsx`**: Dynamic EN/ES state toggle.

---

## 2. Current Homepage Section Order

The homepage (`src/app/HomeClient.tsx`) renders sections in the following sequence:
1. **`FAQSchema`**: JSON-LD structured data.
2. **`Hero`**: Landing banner containing standard stats.
3. **`SolutionSplit`**: Dual-audience choice grid (Consultancies vs. Startups).
4. **`TalentGrid`**: Simulated regional scan with disclaimer.
5. **Pipeline Section**: Step-by-step trust cards (`01 Intake`, `02 Process`, `03 Output`) hardcoded directly in `HomeClient.tsx`.
6. **`FAQAccordion`**: Accordion initialized with B2B client questions (`t.home.faqClients`).
7. **Final CTA Section**: Booking/contact prompt box hardcoded in `HomeClient.tsx`.

---

## 3. Localization Architecture

* **State-Driven Provider:** Managed in `src/context/LanguageContext.tsx` using a `'en' | 'es'` state variable initialized from `localStorage` (`ts360-lang`).
* **Hydration Protection:** Uses a `mounted` state toggle to prevent hydration mismatches during server-side pre-rendering.
* **Copy Mappings:** Static translation map (`translations`) exposed via `t.*` selector hooks.
* **Language/URL Conflict:** The `/en/` sub-directories (`/en/it-consultancies-spain` and `/en/nearshore-developers-latam`) do not enforce English state programmatically. If the user toggles to Spanish, `/en/it-consultancies-spain` renders its Spanish translation.
* **Partial Localization:** `/en/nearshore-developers-latam` copy is hardcoded in English, displaying a temporary notification banner if the state language is set to Spanish.

---

## 4. SEO & Analytics Status

* **Static Metadata:** Defined at the route page level (`src/app/**/page.tsx`). Alternates are explicitly set to canonical URLs.
* **Open Graph / Twitter:** OG cards configured with the official brand image (`https://www.talentsync360.com/logo_oficial.png`).
* **Schemas:** Structured data is dynamically injected using dedicated components:
  * `OrganizationSchema.tsx` (Root layout level)
  * `FAQSchema.tsx` (Homepage and landing page levels)
  * `ServiceSchema.tsx` & `BreadcrumbSchema.tsx` (Landing page levels)
* **Sitemap (`src/app/sitemap.ts`):** Daily crawler priority mapping for all core and sub-pages.
* **Google Analytics:** The `<GoogleAnalytics />` wrapper handles basic pageview configuration using `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
* **CTA Targets:**
  * Homepage Hero & Sourcing Sprints: `/contact`
  * Consultancy Split: `/en/it-consultancies-spain`
  * Startup Split & Companies Hero: Opens lead capture modal pointing to `/api/send`.
  * Companies Page Footer CTA: Calendly link.

---

## 5. White-Label Demo Feasibility

TalentSync360 uses design tokens and styles that are highly compatible with building a frontend-only interactive demo widget:
* **Primitives:** Custom glassmorphism cards (`.glass-morphism` class), golden ratio grids, and clean layout flex wrappers are defined in `src/app/globals.css`.
* **Dependencies:** Already has `framer-motion` for transitions, `@radix-ui/react-dialog` for modal displays, and `lucide-react` for interactive icons.
* **Demo Architecture:** Since it is frontend-only, a client-side React component can manage the demo state:
  * **Branding Toggle:** A simple state switch allowing the user to select "Your Logo / Brand" (mocking a white-label presentation) vs "TalentSync360".
  * **Brief Selector:** Tabs or select inputs to toggle between mock project requirements (e.g., "React Developer", "DevOps Engineer").
  * **Candidate Cards:** An array of 3 pre-written mock candidate data structures.
  * **Scorecard View:** Interactive scorecards visualizing English proficiency, technical rubrics, and soft-skills results.
  * **Presentation Mode Toggle:** Button to switch between "Internal Review" (detailed developer metadata, cost details) and "Client Presentation View" (branded, anonymized, ready-to-share).

---

## 6. Positioning Inconsistencies & Risks

* **ICP Fragmentation:** The home page currently acts as a general startup-first portal. The primary ICP (IT consultancies) is buried in a sub-column in `SolutionSplit`.
* **Pricing Mismatch:**
  * `CompaniesClient.tsx` lists `€1,250 / $1,250` for Sprints and `€2,500 / $2,500` for Pilots.
  * `ItConsultanciesSpainClient.tsx` refers to the pilot package as the primary onboarding fee.
  * Sprints are positioned as the primary offer, but the homepage does not highlight the `€1,250` pricing value prominently.
* **SLA Wording:** Sprints target a "72-hour delivery SLA for validated briefs". We must ensure we specify "validated briefs" to prevent client expectations of 72 hours from first contact.
* **Simulated Metrics:** The homepage displays simulated engine load values and region maps. A clear disclaimer must be preserved under the new designs to prevent compliance exposure.

---

## 7. Proposed Future Homepage Component Tree

To reposition the site as consultancies-first, we propose reorganizing the homepage sections:

```
RootLayout (Global Wrapper)
 └── HomeClient (Page Manager)
      ├── FAQSchema (JSON-LD SEO Schema)
      ├── ConsultanciesHero (New Hero: targeted to agencies, white-label, shortlist velocity)
      ├── SolutionSplit (Re-weighted: highlighting White-Label Sprints with Startup track secondary)
      ├── InteractiveDemo (New interactive candidate review and client-sharing widget)
      ├── TalentGrid (Refactored: focusing on talent pool capacity available for consultancies)
      ├── TrustPipeline (Intake, white-label vetting, scorecard delivery)
      ├── FAQAccordion (Updated to include agency-specific Q&As)
      └── FinalCTA (Directing to Validation Pilot / Discovery calls)
```

---

## 8. Recommended Implementation Sequence

1. **Translations Refactor:** Add the new consultancies-first copy, hero texts, and demo labels under `translations.en` and `translations.es` inside `LanguageContext.tsx`.
2. **Hero Refactor:** Update `Hero.tsx` or create a new header section addressing IT consultancies, highlighting white-label speed and shortlist velocity.
3. **Interactive Demo Component:** Create `src/components/InteractiveDemo.tsx` implementing the frontend-only white-label candidate sharing simulator.
4. **Integration:** Wire `<InteractiveDemo />` into `HomeClient.tsx` below `SolutionSplit` and above `TalentGrid`.
5. **Copy Alignment:** Soften SLA claims (adding "for validated briefs") and unify CTA destinations.
6. **Validation:** Run TypeScript builds and ESLint checks to prevent regressions.

---

## 9. Exact Files Likely to be Modified Later

* `src/context/LanguageContext.tsx` (Copy additions)
* `src/app/HomeClient.tsx` (Homepage section ordering)
* `src/components/Hero.tsx` (Hero copy and structure updates)
* `src/components/WhatsAppButton.tsx` (Ensuring it does not overlap the new demo widgets)
* `src/components/InteractiveDemo.tsx` **[NEW]** (The interactive simulator component)

---

## 10. Risks & Regression Checks

* **Hydration Mismatch:** Any state changes on mount inside the interactive demo must be protected using `useEffect` or `mounted` state flags.
* **Layout Shifts (CLS):** Ensure the interactive demo component sets explicit minimum heights for card previews so it doesn't cause page jumps when toggling views.
* **Mobile Overlap:** Ensure the floating WhatsApp click-to-chat button (`bottom-6 right-6`) does not block clicks on critical interactive buttons inside the demo widget.
* **State Scope:** The language switcher must instantly update the text inside the interactive demo.
