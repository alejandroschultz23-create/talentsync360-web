# TalentSync360 — Opt-In Engine v1A
## 08. Secure Access Link Procedure

**Status:** APPROVED SECURITY PROCEDURE
**Classification:** Confidential — Internal Operational Standard
**Governing Table:** `public.profile_access_tokens`
**Governing Architecture:** Cryptographic Hash Token Storage (SHA-256)

---

### 1. Token Generation & Storage Architecture

Access to private Evidence Profiles and the Talent Network choice is protected by single-use, high-entropy cryptographic access tokens.

```
[Server Generation] ──> crypto.randomBytes(32).toString('base64url')
         │              (32 cryptographically random bytes / 256 bits of entropy)
         │
         ├──> SHA-256 Hash ──> Stored in DB: profile_access_tokens.token_hash
         │                     (Raw token is NEVER persisted in database)
         │
         └──> Formatted URL ──> https://talentsync360.com/talents/evidence-review/access/<raw_token>
                  │
                  └──> Dispatched ONLY via transactional email to professional's verified address
```

### 2. Operational Security Rules

#### Rule 1: Zero Persistence of Raw Tokens
- Raw tokens exist solely in memory during generation and email dispatch.
- Raw tokens are **never** logged to stdout, files, database tables, analytics trackers, or server runtime logs.
- The database persists only the SHA-256 lowercase hex digest in `profile_access_tokens.token_hash`.

#### Rule 2: Token Representation & Entropy
- Tokens are generated with **32 cryptographically random bytes** (256 bits of entropy) formatted as **`base64url`**.
- Tokens are not fixed 64-character strings; their length reflects standard base64url encoding of 32 bytes (43 characters).

#### Rule 3: Configurable Expiration Window
- The CLI delivery default expiration is **72 hours**.
- The CLI accepted expiration range is **1 to 168 hours** (`--expires-hours=1..168`).
- Expiration is strictly enforced at query time via `expires_at > now()`.
- Expired links render a clear notice informing the professional that the link has expired and providing instructions to request a fresh link.

#### Rule 4: Strict Channel Isolation
- **PROHIBITED:** Operators must **never** paste raw access links into team chat (Slack, Discord), ticket trackers, shared documents, or pull requests.
- Delivery is performed programmatically via Resend to the verified professional email on record.
- If email delivery fails repeatedly, reissuance must be executed via the official CLI:
  ```bash
  npm run evidence-review:operator -- reissue-access --submission "<submission-uuid>" --actor operator-id
  ```

#### Rule 5: Immediate Revocation Procedure
If there is suspicion that an access link has been misdirected or intercepted:
1. Operator runs:
   ```bash
   npm run evidence-review:operator -- revoke-access --submission "<submission-uuid>" --actor operator-id
   ```
2. Database immediately sets `revoked_at = now()` on all active tokens for that profile.
3. Active sessions utilizing that token are invalidated on their next request.
4. A fresh token can then be issued using `reissue-access`.
