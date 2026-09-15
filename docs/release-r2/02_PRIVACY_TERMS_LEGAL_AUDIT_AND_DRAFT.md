# TalentSync360 — Opt-In Engine v1A
## 02. Privacy Policy & Terms Legal Audit and Draft

**Status:** DRAFT — REQUIRES QUALIFIED LEGAL REVIEW
**Notice:** This document identifies privacy and regulatory considerations for qualified legal counsel. It does not constitute legal advice and does NOT assert regulatory compliance.
**Approved Version Constants:**
- Evidence Review Consent: `evidence-review-v1-2026-09-14`
- Talent Network Opt-In Consent: `talent-network-opt-in-v1-2026-09-15`

---

### 1. Audit of Current Live Copy vs. Opt-In Engine v1A Invariants

A review of current live text at `/privacy` and `/terms` identified significant discrepancies with the actual technical architecture of the Opt-In Engine v1A:

| Live Copy Assertion | Opt-In Engine v1A Reality | Required Legal Correction |
| :--- | :--- | :--- |
| Mentions collection of "video and audio recordings from screening sessions" | **Zero audio/video collected.** v1A collects only textual claims, portfolio URLs, and public repository links. | Remove references to audio/video collection in v1A context. |
| Mentions sharing candidate scorecards, resumes, and profiles with prospective employers | **Strict employer firewall.** An Evidence Review is strictly private to the professional. Network opt-in does NOT authorize employer presentation. | State explicitly that Evidence Review and Talent Network membership do not authorize presentation to employers. |
| Mentions candidate evaluation scores, percentiles, or rankings | **Non-evaluative evidence profile.** v1A records structured factual findings (supported, partially supported, unknown); zero numerical scores or grades. | Clarify that profiles contain structured evidence records, not scores or subjective evaluations. |
| Implies data is never processed by third parties | **Technical subprocessors process data.** Infrastructure providers (Supabase, Vercel, Resend) process data under data processing agreements. | Disclose technical subprocessors accurately without asserting absolute non-sharing. |

---

### 2. Core Product Invariants for Legal Review

Counsel should incorporate the following approved product invariants into the updated Terms and Privacy Policy:

1. **Strict Distinction Between Services:**
   - **Evidence Review:** A private verification service where professionals submit claims and receive a structured Evidence Profile.
   - **Talent Network:** An independent community/network choice offered only after the Evidence Profile is confirmed.
2. **Employer Presentation Boundary:**
   - Evidence Review confirmation and Talent Network membership **do not** authorize TalentSync360 to present or share the professional's profile with a prospective employer or company.
   - Any future presentation of talent to hiring companies represents a future separate capability not implemented in v1A and will require independent, explicit authorization.
3. **Factual Evidence Standard:**
   - Profiles present verifiable technical facts and observations. They do not constitute guarantees of employment, competency certifications, or credit/background checks.

---

### 3. Topics for Qualified Legal Review

Legal counsel should specifically evaluate and provide formal clauses regarding:

1. **International Data Protection Frameworks:**
   - **GDPR (European Union / UK):** Lawful basis for processing (consent and contract performance), international data transfers, data subject rights (access, rectification, erasure).
   - **LGPD (Brazil):** Processing bases for Latin American professionals, rights of holders.
   - **CCPA / CPRA (California, US):** Notice at collection, non-sale of personal data.
   - **Ley 25.326 (Argentina):** Data protection provisions for LATAM talent.
2. **Technical Subprocessor Disclosures:**
   - Cloud database infrastructure (Supabase Inc. / AWS).
   - Hosting and edge compute (Vercel Inc.).
   - Transactional email communications (Resend Inc.).
3. **Data Retention & Erasure:**
   - Policy-level retention windows for submissions, profiles, tokens, and audit logs (subject to owner decisions recorded in Document 03).
   - Procedures for honoring right-to-erasure and correction requests.

---

### 4. Proposed Draft Privacy Policy Language (DRAFT FOR LEGAL REVIEW)

```markdown
# Privacy Notice — TalentSync360 Evidence Review & Talent Network
*DRAFT — REQUIRES QUALIFIED LEGAL REVIEW*

### 1. Scope and Controller
TalentSync360 provides professionals with an independent technical Evidence Review. This Notice explains how we collect, process, and protect your information when you request an Evidence Review and when you choose to join the TalentSync360 Talent Network.

### 2. Information We Collect
We collect information that you directly provide to us:
- Identification & Contact Data: Name, email address, country/location, and verified communication channels.
- Professional Claims & Proof: Professional experience summaries, role history, links to public source code repositories (e.g., GitHub, GitLab), portfolio websites, live systems, and technical documentation.
- Authentication Data: Cryptographically hashed access tokens generated to provide you secure access to your private profile.

We do NOT collect audio or video recordings, biometric data, financial data, or government identity numbers during the Evidence Review.

### 3. Purpose of Processing
Your data is processed strictly for:
- Conducting the technical evidence verification you requested.
- Generating and delivering your private Professional Evidence Profile.
- Administering your decision regarding the TalentSync360 Talent Network.
- Maintaining security, auditing operational workflows, and preventing abuse.

### 4. Strict Employer Presentation Boundary
Confirmation of your Evidence Profile and membership in the TalentSync360 Talent Network DO NOT authorize TalentSync360 to present, distribute, or share your profile, contact details, or evidence findings with prospective employers or third-party companies. Any prospective employer engagement requires a future separate product agreement and your explicit prior authorization.

### 5. Data Processors and Service Providers
We do not sell your personal information. We transmit data only to technical service providers operating under strict confidentiality and data protection agreements:
- Cloud infrastructure and database hosting (Supabase).
- Application hosting and edge delivery (Vercel).
- Transactional notification delivery (Resend).

### 6. Your Rights
Depending on your applicable jurisdiction, you may have rights to access, review, correct, or request deletion of your personal data. To exercise these rights, contact [OWNER DECISION REQUIRED: privacy contact email].
```
