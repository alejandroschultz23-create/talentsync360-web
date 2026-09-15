# TalentSync360 — Opt-In Engine v1A
## 03. Retention & Deletion Decision Register

**Status:** DECISION REGISTER (PENDING BUSINESS & LEGAL DECISION)
**Notice:** This register documents technical constraints and records open policy decisions. It does NOT establish final corporate policy.
**Governing Schema:** Seven Public Product Tables

---

### 1. Technical Constraints vs. Policy Decisions

To ensure accurate engineering implementation, technical system constraints must be distinguished from business and legal retention policies:

- **Technical Constraint:** Postgres database constraints (foreign keys, check constraints, cascading deletes) dictate how records can be deleted or anonymized without breaking relational integrity.
- **Technical Constraint:** `profile_access_tokens` enforce expiration at query time via `expires_at > now()`. The token string itself is 32 cryptographically random bytes (256 bits of entropy) in `base64url` format, and only its SHA-256 hash is persisted. The CLI delivery default expiry is 72 hours, with an accepted range of 1 to 168 hours.
- **Policy Decision:** The duration for which inactive records, submissions, or completed profiles remain in the database before deletion or anonymization requires formal business owner and legal determination.

---

### 2. Decision Register Across the Seven Public Tables

| Table Name | Entity Description | Technical Constraint | Policy Status / Retention Window |
| :--- | :--- | :--- | :--- |
| `people` | Professional identity (name, email) | Referenced by `evidence_review_submissions` and `evidence_profiles`. Hard delete cascades or requires anonymization. | **[OWNER DECISION REQUIRED]**  <br>Policy needed on retaining contact details post-review vs. scrubbing on demand. |
| `evidence_review_submissions` | Original intake form payload & claims | Contains submitted links and text. Linked to `people` and `evidence_profiles`. | **[OWNER DECISION REQUIRED]**  <br>Policy needed on retaining raw submission payloads once profile is published. |
| `evidence_profiles` | Synthesized Evidence Profile | Linked to `people` and child `evidence_findings`. | **[OWNER DECISION REQUIRED]**  <br>Policy needed on profile lifecycle duration if candidate never confirms or declines. |
| `evidence_findings` | Individual factual evidence items | Foreign key to `evidence_profiles` with `ON DELETE CASCADE`. | Tracks `evidence_profiles` lifecycle. |
| `talent_opt_ins` | Network opt-in decision record | Linked to `evidence_profiles`. Unique constraint per profile. | **[OWNER DECISION REQUIRED]**  <br>Policy needed on retaining `DECLINED` records vs. active membership records. |
| `profile_access_tokens` | SHA-256 hashes of access tokens | Expire via `expires_at` (CLI default 72h, range 1–168h). Revoked via `revoked_at`. | **[OWNER DECISION REQUIRED]**  <br>Policy needed on periodic cleanup frequency for expired/revoked token hashes. |
| `workflow_events` | Append-only operational audit log | Contains event type, submission ID, actor, timestamp, metadata. No foreign key constraints. | **[LEGAL REVIEW REQUIRED]**  <br>Policy needed on compliance audit log retention duration vs. privacy minimization. |

---

### 3. Right-to-Erasure (Data Deletion) Procedure Design

When a professional submits a formal data deletion request:
1. **Technical Requirement:** Deleting `people` or `evidence_profiles` cascades to child findings and tokens, but operator workflow logs in `workflow_events` may require audit preservation.
2. **Policy Decision Required:**
   - **Option A (Complete Purge):** Delete all records in all tables, removing all history.
   - **Option B (Pseudonymization / Scrubbing):** Anonymize PII in `people` and `evidence_review_submissions` (e.g. replace with hash/tombstone), revoke all active tokens in `profile_access_tokens`, and retain non-identifiable metrics in `workflow_events`.
3. **Status:** **[LEGAL REVIEW REQUIRED: Deletion vs. Audit Retention Standard]**.
