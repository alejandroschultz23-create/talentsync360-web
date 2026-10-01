import "server-only";

import { createHash, randomUUID } from "node:crypto";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getH3PilotConfig, type H3PilotConfig } from "./config";
import { createInvitationToken } from "./invitation";

/**
 * Operator-controlled durable invitation issuance (owner decision V1_187A).
 *
 * Server-only. Creates ONE durable single-use invitation and returns the signed
 * invitation token for operator-controlled test/use. The invitation SIGNING
 * secret is never returned. Not exposed publicly; the operator route guards it.
 */
export const PILOT_INVITATION_DEFAULT_TTL_SECONDS = 7 * 24 * 60 * 60;
export const PILOT_INVITATION_MAX_TTL_SECONDS = 30 * 24 * 60 * 60;
export const PILOT_INVITATIONS_TABLE = "pilot_invitations";

export interface PilotInvitationInsert {
  readonly invitation_id: string;
  readonly token_hash: string;
  readonly expires_at: string;
  /** OPERATIONAL, non-authoritative binding to an H3 owner authorization. */
  readonly pilot_authorization_id?: string | null;
  readonly owner_reference?: string | null;
}

export interface PilotInvitationWriter {
  insert(row: PilotInvitationInsert): Promise<{ ok: boolean; code?: string }>;
}

export interface IssuedPilotInvitation {
  readonly invitationId: string;
  readonly participantReference: string;
  readonly expiresAt: number;
  readonly token: string;
  /** OPERATIONAL, non-authoritative; null when not bound to an authorization. */
  readonly pilotAuthorizationId: string | null;
  readonly ownerReference: string | null;
}

export interface IssuePilotInvitationInput {
  readonly participantReference: string;
  /**
   * OPERATIONAL binding to exactly one H3 owner authorization. Optional so the
   * synthetic/local paths remain authorization-less; real pilot issuance MUST
   * supply both fields together.
   */
  readonly pilotAuthorizationId?: string;
  readonly ownerReference?: string;
  readonly ttlSeconds?: number;
}

export interface IssuePilotInvitationDependencies {
  readonly writer?: PilotInvitationWriter;
  readonly config?: H3PilotConfig | null;
  readonly now?: number;
  readonly uuid?: () => string;
}

export type IssuePilotInvitationResult =
  | { readonly ok: true; readonly invitation: IssuedPilotInvitation }
  | { readonly ok: false; readonly code: string };

export function hashInvitationToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export const PILOT_INVITATION_CAP_REACHED = "INVITATION_CAP_REACHED";
export const PILOT_AUTHORIZATION_ALREADY_INVITED = "AUTHORIZATION_ALREADY_INVITED";

function createSupabaseWriter(): PilotInvitationWriter | null {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  const client: SupabaseClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return {
    async insert(row) {
      const { error } = await client.from(PILOT_INVITATIONS_TABLE).insert(row);
      if (error === null) return { ok: true };
      const message = typeof error.message === "string" ? error.message : "";
      if (message.includes("PILOT_INVITATION_CAP_REACHED")) {
        return { ok: false, code: PILOT_INVITATION_CAP_REACHED };
      }
      if (message.includes("pilot_invitations_active_authorization_uidx")) {
        return { ok: false, code: PILOT_AUTHORIZATION_ALREADY_INVITED };
      }
      return { ok: false, code: "INVITATION_PERSIST_FAILED" };
    },
  };
}

interface AuthorizationBinding {
  readonly pilotAuthorizationId: string | null;
  readonly ownerReference: string | null;
}

function normalizeBinding(input: IssuePilotInvitationInput): AuthorizationBinding | { code: string } {
  const hasAuth = typeof input.pilotAuthorizationId === "string" && input.pilotAuthorizationId.trim().length > 0;
  const hasOwner = typeof input.ownerReference === "string" && input.ownerReference.trim().length > 0;
  if (!hasAuth && !hasOwner) return { pilotAuthorizationId: null, ownerReference: null };
  // Both-or-neither: an invitation is bound to exactly one authorization.
  if (!hasAuth || !hasOwner) return { code: "INVALID_AUTHORIZATION_BINDING" };
  const pilotAuthorizationId = input.pilotAuthorizationId!.trim();
  const ownerReference = input.ownerReference!.trim();
  if (pilotAuthorizationId.length > 200 || ownerReference.length > 200) {
    return { code: "INVALID_AUTHORIZATION_BINDING" };
  }
  return { pilotAuthorizationId, ownerReference };
}

export async function issuePilotInvitation(
  input: IssuePilotInvitationInput,
  dependencies: IssuePilotInvitationDependencies = {},
): Promise<IssuePilotInvitationResult> {
  const participantReference = typeof input.participantReference === "string" ? input.participantReference.trim() : "";
  if (participantReference.length === 0) return { ok: false, code: "INVALID_PARTICIPANT_REFERENCE" };

  const binding = normalizeBinding(input);
  if ("code" in binding) return { ok: false, code: binding.code };

  const requestedTtl = input.ttlSeconds ?? PILOT_INVITATION_DEFAULT_TTL_SECONDS;
  const ttlSeconds = Number.isFinite(requestedTtl)
    ? Math.min(Math.max(Math.floor(requestedTtl), 1), PILOT_INVITATION_MAX_TTL_SECONDS)
    : PILOT_INVITATION_DEFAULT_TTL_SECONDS;

  const config = dependencies.config === undefined ? getH3PilotConfig() : dependencies.config;
  if (config === null) return { ok: false, code: "H3_PILOT_NOT_CONFIGURED" };

  const now = dependencies.now ?? Date.now();
  const expiresAt = now + ttlSeconds * 1000;
  const invitationId = (dependencies.uuid ?? randomUUID)();

  const token = createInvitationToken({ invitationId, participantReference, expiresAt }, config.invitationSecret);

  const writer = dependencies.writer ?? createSupabaseWriter();
  if (writer === null) return { ok: false, code: "INVITATION_STORE_UNAVAILABLE" };

  const inserted = await writer.insert({
    invitation_id: invitationId,
    token_hash: hashInvitationToken(token),
    expires_at: new Date(expiresAt).toISOString(),
    pilot_authorization_id: binding.pilotAuthorizationId,
    owner_reference: binding.ownerReference,
  });
  if (!inserted.ok) return { ok: false, code: inserted.code ?? "INVITATION_PERSIST_FAILED" };

  return {
    ok: true,
    invitation: {
      invitationId,
      participantReference,
      expiresAt,
      token,
      pilotAuthorizationId: binding.pilotAuthorizationId,
      ownerReference: binding.ownerReference,
    },
  };
}
