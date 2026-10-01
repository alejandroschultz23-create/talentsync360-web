import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { InvitationUseStore } from "./invitation";

/**
 * Durable, atomic single-use invitation store backed by Supabase.
 *
 * Supabase is used ONLY for non-authoritative Product invitation/session
 * metadata — never for canonical H3 governance truth.
 *
 * Atomicity is delegated to the `consume_pilot_invitation` RPC, which performs
 * `UPDATE ... SET used_at = now() WHERE invitation_id = $1 AND used_at IS NULL
 * AND revoked_at IS NULL AND expires_at > now() RETURNING invitation_id`.
 * Concurrent replay therefore consumes exactly once.
 */
export const CONSUME_INVITATION_RPC = "consume_pilot_invitation";

export function createSupabaseInvitationUseStore(client: SupabaseClient): InvitationUseStore {
  return {
    async consume(invitationId: string, now: number): Promise<boolean> {
      const { data, error } = await client.rpc(CONSUME_INVITATION_RPC, {
        p_invitation_id: invitationId,
        p_now: new Date(now).toISOString(),
      });
      if (error !== null) return false;
      return data === true;
    },
  };
}
