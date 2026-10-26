# TalentSync360 Founder Copy QA

## STATUS

`READY_FOR_FINAL_FOUNDER_REVIEW`

La limpieza se limita a copy, SEO, metadata pública y consistencia del producto. No se modificó la implementación de GA4, GTM, Vercel Analytics, UTM/intent sanitization, `/api/send`, `/apply`, redirects, pricing nuevo ni arquitectura.

## HOME

- Se reemplazó el lenguaje de shortlist/sourcing en el hero y el flujo visible por evidencia de candidatos, contexto de rol y decisiones de contratación técnica.
- La etapa visible ahora es `Profile and Context Intake` / `Ingesta de Perfil y Contexto`.
- El CTA principal visible conduce a revisar un candidato existente.
- Se suavizaron claims de certeza, confianza, rechazo de perfiles y acceso a oportunidades.
- Se mantuvieron las keywords de mercado cuando describen contexto: technical hiring, LATAM, nearshore y recruiting.

## COMPANIES

- Se mantuvo el hero aprobado en EN/ES.
- Se cambió el title de staffing a `Technical Candidate Evidence Review for LATAM Hiring`.
- Se retiró de la página la tarjeta pública de USD 4.500 y sus promesas de sourcing/finalistas/interés/compensación/disponibilidad.
- Se mantuvieron las ofertas ya implementadas: Free Evidence Trial y Evidence Review Pilot USD 1.250.
- No se agregó USD 495 ni ningún precio nuevo.
- El CTA final ahora invita a iniciar una conversación exploratoria.
- La muestra de evidencia declara referencias ficticias/ilustrativas.

## NEARSHORE

- Se preservaron URL, route, breadcrumb, canonical y existencia de `/en/nearshore-developers-latam`.
- Se mantiene explícitamente `No sourcing.`.
- Se reescribió el contenido visible para evaluar candidatos existentes, contexto LATAM/nearshore, límites de evidencia y preparación de entrevista.
- Se eliminaron Shortlist Sprint, sourcing, full-cycle search, SLA de 72 horas, challenge/defense y promesas de entrega.
- Se muestran exclusivamente `SUPPORTED`, `PARTIAL`, `UNKNOWN`, `CONFLICT` y `NEEDS_VALIDATION`.
- `UNKNOWN` se describe como evidencia no establecida, no como debilidad.

## CONTACT

- Title: `Contact TalentSync360 | Technical Hiring & Evidence Review`.
- Intro neutral: qué se está evaluando y qué se necesita entender antes de avanzar.
- Opciones visibles: evaluar candidatos existentes, consulta sobre proceso de contratación, partnership y consulta general.
- CTA: `Send inquiry` / `Enviar consulta`.
- Los intents internos se preservaron; no se eliminaron valores técnicos.
- Los banners de intent legacy fueron neutralizados como copy visible, sin tocar la clasificación ni el backend.

## TALENTS

- Sólo se cambió el CTA secundario a evaluación de candidatos para un rol técnico.
- El destino sigue siendo `/companies`.
- El resto de la página quedó intacto.

## METHODOLOGY

- Se cambió el título a `The Evidence Review Method` / `El Método de Evidence Review`.
- Se reemplazaron shortlist/test claims por candidate evidence, role context, reviewer notes y validation questions.
- Se agregó la visualización explícita de los cinco estados canónicos.
- Se eliminó el claim de reducción de rotación.

## FOOTER

- El tagline ahora es factual: structured evidence review para decisiones de contratación técnica.
- Se mantuvieron links y `/contact`.
- No se usan sourcing, staffing, curated shortlists ni placements en el tagline público.

## SEO TITLES / DESCRIPTIONS

QA de Preview autenticado:

| Ruta | Title observado | Resultado |
|---|---|---|
| `/` | Evidence-Backed LATAM Technical Hiring \| TalentSync360 | PASS |
| `/companies` | Technical Candidate Evidence Review for LATAM Hiring \| TalentSync360 | PASS |
| `/en/nearshore-developers-latam` | Evaluate Nearshore Developers in LATAM \| Candidate Evidence Review \| TalentSync360 | PASS |
| `/contact` | Contact TalentSync360 \| Technical Hiring & Evidence Review \| TalentSync360 | PASS |
| `/talents` | Professional Evidence Review for LATAM Tech Talent \| TalentSync360 | PASS |
| `/methodology` | Evidence-Based Talent Review Methodology \| TalentSync360 | PASS |

## GLOBAL STRING AUDIT

| Ocurrencia | Clasificación | Tratamiento |
|---|---|---|
| `Shortlist Sprint`, `Sourcing Sprint`, `Request a Shortlist`, `Solicitar Shortlist` en superficies servidas | REMOVE/REWRITE | Retiradas o neutralizadas de Home, Companies, Contact, Nearshore, Methodology y Talents. |
| USD 4.500 / USD 4,500 shortlist | REMOVE | Tarjeta pública y banners retirados; no se agregó reemplazo comercial inventado. |
| `B2B Technical Staffing`, `Hire Vetted LATAM Tech Talent` | REWRITE | Metadata y schema pública actualizados. |
| 72-hour / 72 hours | REMOVE | Retirado de las rutas revisadas y del contenido visible de la landing nearshore. |
| full-cycle search / technical challenge / technical defense | REMOVE/REWRITE | Retirado del flujo público nearshore y metodología. |
| `sourcing` en el texto de problemas, FAQ o límites | KEEP WITH REASON | Se conserva sólo cuando describe una alternativa de mercado, una exclusión explícita (`No sourcing`) o un límite legal/técnico, no como oferta vigente. |
| intents `shortlist`, `shortlist-sprint`, etc. | KEEP WITH REASON | Contrato técnico de URLs/formulario/analytics; no se exponen como oferta nueva. |
| fixtures, contratos de traducción legacy y componentes no montados por las seis rutas QA | HISTORICAL/TEST ONLY | No se borraron indiscriminadamente. Quedan identificados para una futura limpieza separada si dejan de ser necesarios. |

## TESTS

- Focused copy tests: 30/30 passed.
- Full Vitest suite: 51 files, 408/408 tests passed.
- `npm run lint`: passed.
- `npx tsc --noEmit`: passed. El repo no tiene script `typecheck` dedicado.
- `git diff --check`: passed.

## BUILD

- `npm run build`: passed.
- Next.js 16.3.3/Turbopack compiló y generó las rutas esperadas.
- Vercel Preview build: passed.

## ANALYTICS SMOKE REGRESSION

No se modificaron archivos de analytics.

### Contact direct with UTM

- URL: `/contact?intent=pilot&utm_source=linkedin&utm_medium=social`
- Vercel `/_vercel/insights/view`: HTTP 200.
- Vercel `o`: `/contact?utm_source=linkedin&utm_medium=social`.
- `intent`: no leak.
- GA4: un `page_view`.
- GA4 `dp`: `/contact?utm_source=linkedin&utm_medium=social`.
- GA4 `dl`: misma ruta sanitizada con UTMs.
- `intent` funcional: el formulario mostró el banner de Evidence Review Pilot según el intent interno.

### Companies → Contact

- `/companies` cargó correctamente.
- Click interno a `/contact?intent=validate-role` llegó al destino esperado.
- Vercel `o`: `/contact`, HTTP 200.
- GA4 emitió un `page_view` de `/companies` y un `page_view` de `/contact` en el request agrupado; no hubo duplicado de destino.
- GA4 `dp/dl` de destino: `/contact` sin `intent`.

### Runtime environment

- Vercel Insights script: HTTP 200.
- `window.va`: function.
- `navigator.webdriver`: false.
- `localStorage.va-disable`: null.

## FILES CHANGED

- `src/app/companies/CompaniesClient.tsx`
- `src/app/companies/companies-analytics.test.ts`
- `src/app/companies/page.tsx`
- `src/app/contact/ContactClient.tsx`
- `src/app/contact/page.tsx`
- `src/app/en/nearshore-developers-latam/NearshoreDevelopersLatamClient.tsx`
- `src/app/en/nearshore-developers-latam/page.tsx`
- `src/app/layout.tsx`
- `src/app/methodology/MethodologyClient.tsx`
- `src/app/talents/TalentsClient.tsx`
- `src/components/FinalCTA.tsx`
- `src/components/Hero.tsx`
- `src/components/ServiceSchema.tsx`
- `src/context/translations.ts`
- `src/context/translations.test.ts`
- `src/copy-hygiene.test.ts`

No analytics implementation files changed.

## REMAINING LEGACY COPY

Remaining legacy terms are limited to internal translation contracts, non-mounted legacy components, historical/legal explanatory mentions, or preserved intent values. They are not visible on the six QA routes above. The dedicated public IT consultancies route was also neutralized where its content was served.

## DO NOT TOUCH

GA4, GTM, Vercel Analytics sanitization, `/api/send`, `/apply`, tracking, UTM/intent policy, redirects, pricing architecture, company thesis, production, merge and GTM publication.

## PREVIEW URL

https://talentsync360-e900juxw7-aleopents360.vercel.app/

Deployment: `dpl_HKJhCv52rtxjFq6DvieMcZL2s9au`

## COMMIT

Code commit: `4ceca2d96ab750606285a0d5017c314fa992eeb7`

Final documentation commit: recorded after this report is added.
