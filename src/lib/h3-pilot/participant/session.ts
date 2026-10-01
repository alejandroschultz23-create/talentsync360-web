import "server-only";

import { getPilotSession } from "../server/pilot-mode";
import type { PilotSession } from "../server/session-token";

/** Server-derived pilot session gate for participant BFF routes. */
export async function requirePilotSession(): Promise<PilotSession | null> {
  return getPilotSession();
}

export function pilotJson(body: unknown, status: number): Response {
  return Response.json(body, {
    status,
    headers: {
      "cache-control": "private, no-store",
      "referrer-policy": "no-referrer",
      "x-robots-tag": "noindex, nofollow, noarchive",
    },
  });
}
