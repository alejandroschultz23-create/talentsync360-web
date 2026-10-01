import type { NextRequest } from "next/server";

import { getH3PilotConfig } from "@/lib/h3-pilot/server/config";
import {
  createInMemoryInvitationUseStore,
  validateInvitationToken,
  type InvitationUseStore,
} from "@/lib/h3-pilot/server/invitation";
import { createSupabaseInvitationUseStore } from "@/lib/h3-pilot/server/invitation-store";
import { setPilotSessionCookie } from "@/lib/h3-pilot/server/pilot-mode";
import { getSupabaseServerClient } from "@/lib/h3-pilot/participant/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Private pilot entry (V1_192).
 *
 * Consumes a signed, single-use invitation and establishes the server-signed
 * pilot session cookie. The bearer token is accepted ONLY in the POST JSON body
 * (never in the URL/query), so it never appears in server, proxy, or CDN logs.
 * Participant links carry the token in the URL fragment and are posted by the
 * `/talents/evidence-review/enter` wrapper.
 *
 * Single-use is durable: when Supabase is configured, consumption goes through
 * the atomic `consume_pilot_invitation` RPC (sets `used_at` exactly once across
 * serverless instances). The in-memory store is a local/dev fallback ONLY.
 */
const PRIVATE_HEADERS = {
  "cache-control": "private, no-store",
  "referrer-policy": "no-referrer",
  "x-robots-tag": "noindex, nofollow, noarchive",
} as const;

let fallbackStore: InvitationUseStore | null = null;

function getInvitationStore(): InvitationUseStore {
  const client = getSupabaseServerClient();
  if (client !== null) return createSupabaseInvitationUseStore(client);
  if (fallbackStore === null) fallbackStore = createInMemoryInvitationUseStore();
  return fallbackStore;
}

function json(body: unknown, status: number): Response {
  return Response.json(body, { status, headers: PRIVATE_HEADERS });
}

async function readToken(request: NextRequest): Promise<string> {
  try {
    const body = (await request.json()) as unknown;
    if (body !== null && typeof body === "object") {
      const token = (body as Record<string, unknown>).token;
      if (typeof token === "string" && token.length > 0) return token;
    }
  } catch {
    // No parseable JSON body -> fail closed (no query transport).
  }
  return "";
}

export async function POST(request: NextRequest): Promise<Response> {
  const config = getH3PilotConfig();
  if (config === null) {
    return json({ ok: false, code: "H3_PILOT_NOT_CONFIGURED" }, 503);
  }

  const token = await readToken(request);
  const result = await validateInvitationToken(token, config.invitationSecret, getInvitationStore(), Date.now());
  if (result.ok === false) {
    return json({ ok: false, code: result.code }, 401);
  }

  await setPilotSessionCookie({
    invitationId: result.record.invitationId,
    participantReference: result.record.participantReference,
    expiresAt: result.record.expiresAt,
  });

  return json({ ok: true, pilotMode: true }, 200);
}
