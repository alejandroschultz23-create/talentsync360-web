import type { NextRequest } from "next/server";

import { issuePilotInvitation, PILOT_INVITATION_MAX_TTL_SECONDS } from "@/lib/h3-pilot/server/invitation-issuer";
import { isOperatorAuthorized, PILOT_OPERATOR_HEADER } from "@/lib/h3-pilot/server/operator-auth";

/**
 * OPERATOR-ONLY pilot invitation issuance (V1_187A). Server-only, never linked
 * from participant UI. Missing/wrong operator secret -> 404 (fail closed).
 * Returns only the signed invitation token (never the signing secret).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function notFound(): Response {
  return new Response(null, { status: 404 });
}

function json(body: unknown, status: number): Response {
  return Response.json(body, { status, headers: { "cache-control": "no-store" } });
}

export async function POST(request: NextRequest): Promise<Response> {
  if (!isOperatorAuthorized(request.headers.get(PILOT_OPERATOR_HEADER))) return notFound();

  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, code: "INVALID_REQUEST" }, 400);
  }
  if (body === null || typeof body !== "object") return json({ ok: false, code: "INVALID_REQUEST" }, 400);
  const record = body as Record<string, unknown>;
  const participantReference = typeof record.participantReference === "string" ? record.participantReference : "";
  const ttlSeconds =
    typeof record.ttlSeconds === "number" && record.ttlSeconds > 0
      ? Math.min(record.ttlSeconds, PILOT_INVITATION_MAX_TTL_SECONDS)
      : undefined;

  const result = await issuePilotInvitation({ participantReference, ttlSeconds });
  if (result.ok === false) {
    const status = result.code === "H3_PILOT_NOT_CONFIGURED" ? 503 : 400;
    return json({ ok: false, code: result.code }, status);
  }

  return json(
    {
      ok: true,
      invitationId: result.invitation.invitationId,
      participantReference: result.invitation.participantReference,
      expiresAt: result.invitation.expiresAt,
      token: result.invitation.token,
    },
    201,
  );
}
