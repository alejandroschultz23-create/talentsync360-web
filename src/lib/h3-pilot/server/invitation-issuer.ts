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
}

export interface PilotInvitationWriter {
  insert(row: PilotInvitationInsert): Promise<{ ok: boolean; code?: string }>;
}

export interface IssuedPilotInvitation {
  readonly invitationId: string;
  readonly participantReference: string;
  readonly expiresAt: number;
  readonly token: string;
}

export interface IssuePilotInvitationInput {
  readonly participantReference: string;
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
      return error === null ? { ok: true } : { ok: false, code: "INVITATION_PERSIST_FAILED" };
    },
  };
}

export async function issuePilotInvitation(
  input: IssuePilotInvitationInput,
  dependencies: IssuePilotInvitationDependencies = {},
): Promise<IssuePilotInvitationResult> {
  const participantReference = typeof input.participantReference === "string" ? input.participantReference.trim() : "";
  if (participantReference.length === 0) return { ok: false, code: "INVALID_PARTICIPANT_REFERENCE" };

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
  });
  if (!inserted.ok) return { ok: false, code: inserted.code ?? "INVITATION_PERSIST_FAILED" };

  return { ok: true, invitation: { invitationId, participantReference, expiresAt, token } };
}
