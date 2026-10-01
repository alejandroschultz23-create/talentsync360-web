import type { NextRequest } from "next/server";

import { getH3PilotConfig } from "@/lib/h3-pilot/server/config";
import {
  createInMemoryInvitationUseStore,
  validateInvitationToken,
} from "@/lib/h3-pilot/server/invitation";
import { setPilotSessionCookie } from "@/lib/h3-pilot/server/pilot-mode";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// NOTE: single-use enforcement across instances requires a durable store in the
// cloud configuration gate. This in-memory store is the local/dev default.
const invitationStore = createInMemoryInvitationUseStore();

function json(body: unknown, status: number): Response {
  return Response.json(body, { status, headers: { "cache-control": "no-store" } });
}

async function readToken(request: NextRequest): Promise<string> {
  try {
    const body = (await request.json()) as unknown;
    if (body !== null && typeof body === "object") {
      const token = (body as Record<string, unknown>).token;
      if (typeof token === "string" && token.length > 0) return token;
    }
  } catch {
    // fall through to query transport
  }
  return new URL(request.url).searchParams.get("token") ?? "";
}

export async function POST(request: NextRequest): Promise<Response> {
  const config = getH3PilotConfig();
  if (config === null) {
    return json({ ok: false, code: "H3_PILOT_NOT_CONFIGURED" }, 503);
  }

  const token = await readToken(request);
  const result = await validateInvitationToken(token, config.invitationSecret, invitationStore, Date.now());
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
