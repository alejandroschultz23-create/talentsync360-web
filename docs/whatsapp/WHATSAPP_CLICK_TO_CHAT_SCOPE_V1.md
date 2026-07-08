# WhatsApp Click-to-Chat Scope (V1)

## 1. Architectural Boundaries & System Governance

The WhatsApp integration on the TalentSync360 public website is strictly defined as a **frontend-only, click-to-chat** channel.

### Strictly Out of Scope
* **No API Connections:** Not connected to Kapso or Hermes systems.
* **No WhatsApp Business API:** No automated messaging API integrations or WhatsApp cloud provider integrations.
* **No CRM or Database Sync:** No automated logging, candidate records, or client records are written to a database or CRM directly from the chat trigger.
* **No Webhooks:** No webhook integrations are configured on the web application side.
* **No LLM or AI Agent integrations:** No automated chat agents, AI scrapers, or candidate vetting auto-responders.
* **No Automation:** The channel does not perform automated screening, scoring, rejection, or outreach.

### Strictly In Scope
* **Frontend-only URL generation:** Utilizes standard `https://wa.me/` protocol linking.
* **User-initiated conversation:** The user must explicitly click the button and send the prefilled message.
* **Manual conversation only:** Conversions are handled manually by a human operator using a designated device.
* **Bilingual EN/ES support:** Localized routing based on active website language.

---

## 2. Strategic Purposes

The WhatsApp button serves as a commercial onboarding wedge to capture warm leads and field basic inquiries:

* **Companies/Clients:** Inquiries about LATAM technical talent pool access, pricing, or sprint durations.
* **IT Consultancies (Spanish/EU):** Sprints white-labeling, project overflow, and shortlist partnerships.
* **Partners:** Inquiries regarding business collaboration or outbound trials.
* **Talent/Candidates:** Basic orientation questions regarding open roles or application status updates.

---

## 3. Prohibited Use Cases

To maintain data integrity and regulatory compliance, the WhatsApp channel **must not** be used for:
* CV/Resume submissions.
* Delivery of client candidates' profiles/shortlists.
* Structured technical assessment data transmission.
* Collection or storage of sensitive personal data (e.g. government IDs, salary expectations tied to PII, diversity statistics).
* Automated candidate matching or scoring.

---

## 4. Compliance & Data-Minimization Posture

TalentSync360 enforces a strict data-minimization framework under GDPR/data protection regulations:

### For Candidates
1. **Basic Orientation Only:** Operators may only answer public questions (e.g., "Are you recruiting Go developers?").
2. **Redirect Intake:** All candidates seeking to apply must be redirected to the official application flow.
3. **No Chat CV Processing:** Under no circumstances should CVs sent to the WhatsApp operator be stored in the primary applicant tracking database. Operators must instruct candidates to submit via the website forms.

### For Companies/Clients
1. **No Confidential Exchange:** No NDAs, contracts, or proprietary client job specifications should be accepted or sent over informal chat.
2. **Pre-sales Qualification Only:** Operators can qualify client needs (regions, sizing, urgency) and immediately redirect them to schedule a formal brief call or complete the official contact form.
