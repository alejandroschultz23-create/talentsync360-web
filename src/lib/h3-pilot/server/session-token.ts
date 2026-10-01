import { signJson, verifyJson } from "./signed-token";

/**
 * Private pilot session token (pure). The token is stored in an httpOnly secure
 * cookie by the server after a valid invitation is consumed. Pilot mode is
 * ALWAYS derived server-side from a valid signed, unexpired session — never
 * from localStorage, a query param, or a client boolean.
 */
export const H3_PILOT_COOKIE = "h3_pilot_session";

export interface PilotSession {
  readonly invitationId: string;
  readonly participantReference: string;
  readonly expiresAt: number;
}

export function createPilotSessionToken(session: PilotSession, secret: string): string {
  return signJson(session, secret);
}

export function readPilotSessionToken(token: unknown, secret: string, now: number): PilotSession | null {
  const payload = verifyJson(token, secret);
  if (payload === null || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  if (
    typeof record.invitationId !== "string" ||
    record.invitationId.length === 0 ||
    typeof record.participantReference !== "string" ||
    typeof record.expiresAt !== "number"
  ) {
    return null;
  }
  if (record.expiresAt <= now) return null;
  return {
    invitationId: record.invitationId,
    participantReference: record.participantReference,
    expiresAt: record.expiresAt,
  };
}
