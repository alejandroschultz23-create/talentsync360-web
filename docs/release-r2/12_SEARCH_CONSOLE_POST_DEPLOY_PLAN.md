# TalentSync360 — Opt-In Engine v1A
## 12. Google Search Console Post-Deploy Plan & SEO Indexing Strategy

**Status:** APPROVED SEO & SEARCH CONSOLE SPECIFICATION
**Target URL:** `https://talentsync360.com/talents/evidence-review`
**Governing Principle:** Discoverability for public landing page; absolute exclusion for private professional profiles.

---

### 1. URL Architecture & Indexing Matrix

| Route | Canonical Target | Indexing Directive | Sitemap Inclusion |
| :--- | :--- | :--- | :--- |
| `/talents` | `https://talentsync360.com/talents` | `index, follow` | Included |
| `/talents/evidence-review` | `https://talentsync360.com/talents/evidence-review` | `index, follow` | Included (Priority 0.9) |
| `/talents/evidence-review/apply` | `https://talentsync360.com/talents/evidence-review/apply` | `noindex, nofollow` | Excluded |
| `/talents/evidence-review/profile` | N/A (Private Access Token) | `noindex, nofollow, noarchive` | Excluded |
| `/talents/evidence-review/profile/opt-in` | N/A (Private Decision Flow) | `noindex, nofollow, noarchive` | Excluded |

---

### 2. Post-Deploy SEO Verification Actions

Execute following production deployment:

#### Action 1: Robots.txt Directives Verification
Verify `https://talentsync360.com/robots.txt`:
```txt
User-agent: *
Allow: /
Disallow: /talents/evidence-review/profile/
Disallow: /talents/evidence-review/apply/
Sitemap: https://talentsync360.com/sitemap.xml
```

#### Action 2: Sitemap XML Verification
Verify entry in `https://talentsync360.com/sitemap.xml`:
```xml
<url>
  <loc>https://talentsync360.com/talents/evidence-review</loc>
  <lastmod>2026-09-15T00:00:00.000Z</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
</url>
```

#### Action 3: Google Search Console Inspection & Indexing Request
1. Open Google Search Console for `talentsync360.com`.
2. Inspect `https://talentsync360.com/talents/evidence-review`.
3. Test Live URL:
   - Verify HTTP 200 OK.
   - Verify mobile usability passes.
   - Verify canonical URL matches `https://talentsync360.com/talents/evidence-review`.
4. Click **"Request Indexing"**.

#### Action 4: Negative Verification (Private Route Protection)
In URL Inspection tool, test `https://talentsync360.com/talents/evidence-review/profile`:
- Verify response includes `noindex, nofollow` directives.
- Confirm Google Search Console acknowledges the route cannot be indexed.
