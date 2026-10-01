-- HERMES / TALENTSYNC360
-- H3 Preview pilot — real-pilot invitation authorization binding (V1_191)
--
-- PRODUCT lane only. This schema stores ONLY non-authoritative Product
-- invitation metadata. It is NEVER the source of truth for authorization,
-- consent, source authorization, identity, draft decision, opt-in, retention,
-- or removal (those remain canonical in H3 Preview).
--
-- Apply with human review before issuing real pilot invitations.

BEGIN;

ALTER TABLE public.pilot_invitations
    ADD COLUMN IF NOT EXISTS pilot_authorization_id TEXT,
    ADD COLUMN IF NOT EXISTS owner_reference TEXT;

COMMENT ON COLUMN public.pilot_invitations.pilot_authorization_id IS
  'Product-only OPERATIONAL binding to exactly one H3 owner authorization. Non-authoritative.';
COMMENT ON COLUMN public.pilot_invitations.owner_reference IS
  'Product-only OPERATIONAL opaque owner alias (no identity inference). Non-authoritative.';

-- At most ONE active (unused, unrevoked) invitation per authorization.
CREATE UNIQUE INDEX IF NOT EXISTS pilot_invitations_active_authorization_uidx
    ON public.pilot_invitations (pilot_authorization_id)
    WHERE pilot_authorization_id IS NOT NULL
      AND used_at IS NULL
      AND revoked_at IS NULL;

-- Hard cap on simultaneously active real pilot invitations (V1_190 max = 2).
CREATE OR REPLACE FUNCTION public.enforce_pilot_invitation_active_cap()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.pilot_authorization_id IS NULL THEN
        RETURN NEW;
    END IF;
    IF (
        SELECT count(*)
          FROM public.pilot_invitations
         WHERE pilot_authorization_id IS NOT NULL
           AND used_at IS NULL
           AND revoked_at IS NULL
           AND expires_at > now()
    ) >= 2 THEN
        RAISE EXCEPTION 'PILOT_INVITATION_CAP_REACHED' USING ERRCODE = '23505';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_pilot_invitation_active_cap_trg ON public.pilot_invitations;
CREATE TRIGGER enforce_pilot_invitation_active_cap_trg
    BEFORE INSERT ON public.pilot_invitations
    FOR EACH ROW EXECUTE FUNCTION public.enforce_pilot_invitation_active_cap();

COMMIT;
