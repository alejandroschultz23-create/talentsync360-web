-- HERMES / TALENTSYNC360
-- H3 Preview pilot — Product-side NON-AUTHORITATIVE metadata (V1_186).
--
-- GATE: PRODUCT_TALENT_H3_PILOT_CLOUD_IAM_AND_STORAGE_CONFIGURATION_V1_186
--
-- NOT EXECUTED BY THIS GATE. Apply with human review.
--
-- This schema stores ONLY Product invitation/session metadata. It is NEVER the
-- source of truth for consent, source authorization, identity, draft decision,
-- opt-in, retention, or removal (those remain canonical in H3 Preview).

BEGIN;

CREATE TABLE IF NOT EXISTS public.pilot_invitations (
    invitation_id  TEXT PRIMARY KEY,
    token_hash     TEXT NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at     TIMESTAMPTZ NOT NULL,
    used_at        TIMESTAMPTZ,
    revoked_at     TIMESTAMPTZ
);

COMMENT ON TABLE public.pilot_invitations IS
  'Product-only single-use invitation metadata for the H3 Preview pilot. Non-authoritative.';

-- Atomic single-use consumption (unused -> used, exactly once).
CREATE OR REPLACE FUNCTION public.consume_pilot_invitation(
    p_invitation_id TEXT,
    p_now TIMESTAMPTZ
) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    updated_id TEXT;
BEGIN
    UPDATE public.pilot_invitations
       SET used_at = p_now
     WHERE invitation_id = p_invitation_id
       AND used_at IS NULL
       AND revoked_at IS NULL
       AND expires_at > p_now
    RETURNING invitation_id INTO updated_id;

    RETURN updated_id IS NOT NULL;
END;
$$;

COMMIT;

-- Private evidence bucket (create via Supabase dashboard or Management API,
-- NOT by SQL). Bucket: h3-pilot-evidence (PRIVATE, no public read).
-- Access is only via the server-side service key; no public/signed URLs are
-- emitted and no client-side storage access is granted.
