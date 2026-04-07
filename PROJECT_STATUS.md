# TalentSync360 Web — Project Status

**Última actualización:** Iteración de refinamiento completada.
**Estado técnico:** Build compila sin errores. Rutas verificadas.

---

## 1. Rutas existentes

| Ruta | Objetivo | Audiencia |
|------|----------|-----------|
| `/` | Hero + Pipeline + Trust Section | Buyer (principal) |
| `/companies` | Oferta + Tiers Gold/Silver/Bronze + Roles | Buyer |
| `/talents` | Gold List + Proceso de validación | Talento LATAM |
| `/methodology` | Cómo validamos + Deliverables | Buyer (profundo) |
| `/contact` | Formulario + CTA Calendly | Buyer + Talento |
| `/terms` | Legal | — |
| `/privacy` | Legal | — |

---

## 2. Decisiones consolidadas

- **Idioma:** English-first en toda la web
- **Gold List:** Concepto talent-facing, separado de tiers comerciales
- **Gold / Silver / Bronze:** Tiers comerciales para empresas con pricing `from $XXX`
- **Pipeline:** 3 pasos (Definition → Screening → Delivery)
- **Tono:** Premium, evidence-backed, buyer-facing
- **Pricing:** `from $XXX` — no precios exactos visibles
- **Emojis:** Eliminados de toda la interfaz

---

## 3. NO tocar sin razón fuerte

- Navbar y logo (bloque cerrado en iteración previa)
- Separación Gold List / tiers comerciales
- Tono English-first
- Pipeline de 3 pasos
- Estructura de `/companies` con tiers
- Estructura de `/talents` con proceso de validación

---

## 4. Pendientes futuros posibles

- Logo / branding con herramienta visual externa
- Deploy para revisión en browser compartido
- Revisión visual final en viewport real
- Optional: refinamiento de cards de roles en `/companies`
- Optional: título de Trust Section ya ajustado

---

## 5. Estado técnico

- **Stack:** Next.js 16 + Tailwind CSS
- **Build:** Compila sin errores
- **TypeScript:** Sin errores
- **Rutas:** 7 rutas static prerendered
- **Deploy local:** `npm run dev` en puerto 3000
- **Build producción:** `npm run build`
