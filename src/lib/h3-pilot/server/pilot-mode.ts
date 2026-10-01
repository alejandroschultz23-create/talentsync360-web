import "server-only";

import { cookies } from "next/headers";

import { getH3PilotConfig } from "./config";
import {
  H3_PILOT_COOKIE,
  createPilotSessionToken,
  readPilotSessionToken,
  type PilotSession,
} from "./session-token";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

/**
 * Server-derived pilot mode. Returns the pilot session ONLY when a valid,
 * unexpired, server-signed cookie is present and the pilot is configured.
 * Never trusts client state.
 */
export async function getPilotSession(): Promise<PilotSession | null> {
  const config = getH3PilotConfig();
  if (config === null) return null;
  const store = await cookies();
  const token = store.get(H3_PILOT_COOKIE)?.value;
  return readPilotSessionToken(token, config.invitationSecret, Date.now());
}

export async function setPilotSessionCookie(session: PilotSession): Promise<void> {
  const config = getH3PilotConfig();
  if (config === null) throw new Error("H3_PILOT_NOT_CONFIGURED");
  const token = createPilotSessionToken(session, config.invitationSecret);
  const store = await cookies();
  store.set(H3_PILOT_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearPilotSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(H3_PILOT_COOKIE);
}
