import { signJson, verifyJson } from "./signed-token";

/**
 * Private pilot invitation tokens (server-issued, server-validated).
 *
 * Single-use is enforced through a pluggable `InvitationUseStore` whose
 * `consume` operation MUST be atomic (unused -> used, exactly once). A durable
 * store (e.g. a Supabase RPC) is required in the cloud configuration gate; an
 * in-memory store is provided for local/dev only.
 *
 * Fail closed on: malformed token, bad signature, expiry, reuse/revoke.
 */
export interface InvitationRecord {
  readonly invitationId: string;
  readonly participantReference: string;
  readonly expiresAt: number;
}

export interface InvitationUseStore {
  /** Atomically consume an unused invitation. Returns false if already used/revoked/absent. */
  consume(invitationId: string, now: number): Promise<boolean>;
}

export type InvitationValidation =
  | { readonly ok: true; readonly record: InvitationRecord }
  | { readonly ok: false; readonly code: string };

export function createInvitationToken(record: InvitationRecord, secret: string): string {
  return signJson(record, secret);
}

function isInvitationRecord(value: unknown): value is InvitationRecord {
  if (value === null || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.invitationId === "string" &&
    record.invitationId.length > 0 &&
    typeof record.participantReference === "string" &&
    typeof record.expiresAt === "number"
  );
}

export async function validateInvitationToken(
  token: unknown,
  secret: string,
  store: InvitationUseStore,
  now: number,
): Promise<InvitationValidation> {
  const payload = verifyJson(token, secret);
  if (!isInvitationRecord(payload)) return { ok: false, code: "INVALID_INVITATION" };
  if (payload.expiresAt <= now) return { ok: false, code: "EXPIRED_INVITATION" };
  const consumed = await store.consume(payload.invitationId, now);
  if (!consumed) return { ok: false, code: "REUSED_INVITATION" };
  return { ok: true, record: payload };
}

/** Local/dev in-memory store. NOT durable; replace in the cloud gate. */
export function createInMemoryInvitationUseStore(): InvitationUseStore {
  const used = new Set<string>();
  return {
    async consume(invitationId: string): Promise<boolean> {
      if (used.has(invitationId)) return false;
      used.add(invitationId);
      return true;
    },
  };
}
