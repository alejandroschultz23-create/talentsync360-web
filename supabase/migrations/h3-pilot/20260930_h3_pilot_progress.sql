-- HERMES / TALENTSYNC360
-- H3 Preview pilot — Product-side NON-AUTHORITATIVE participant progress (V1_187B).
--
-- GATE: PRODUCT_TALENT_H3_PILOT_PARTICIPANT_UI_V1_187B
--
-- NOT EXECUTED BY THIS GATE. Apply with human review.
--
-- Stores ONLY Product-owned, non-authoritative metadata: invitation/session ids,
-- the opaque H3 intake reference, UI progress, private storage object keys, and
-- cleanup retry metadata. It is NEVER the source of truth for consent, source
-- authorization, identity, draft decision, opt-in, retention, or removal.

BEGIN;

CREATE TABLE IF NOT EXISTS public.pilot_progress (
    participant_reference TEXT PRIMARY KEY,
    record                JSONB NOT NULL,
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.pilot_progress IS
  'Product-only non-authoritative H3 Preview pilot progress metadata (V1_187B). Does not mirror canonical governance truth.';

COMMIT;
