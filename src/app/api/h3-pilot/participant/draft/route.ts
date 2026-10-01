import type { NextRequest } from "next/server";

import { isPilotDraftDecisionUi } from "@/lib/h3-pilot/participant/decisions";
import { getPilotProgressStore } from "@/lib/h3-pilot/participant/runtime";
import { pilotJson, requirePilotSession } from "@/lib/h3-pilot/participant/session";
import { recordPilotDraftDecisionAction } from "@/lib/h3-pilot/participant/actions-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<Response> {
  const session = await requirePilotSession();
  if (session === null) return pilotJson({ ok: false, code: "PILOT_SESSION_INVALID" }, 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return pilotJson({ ok: false, code: "INVALID_REQUEST" }, 400);
  }
  const record = body !== null && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const decision = record.decision;
  if (!isPilotDraftDecisionUi(decision)) return pilotJson({ ok: false, code: "INVALID_DECISION" }, 400);
  const correctionMessage = typeof record.correctionMessage === "string" ? record.correctionMessage : undefined;

  const result = await recordPilotDraftDecisionAction(
    {
      participantReference: session.participantReference,
      decision,
      ...(correctionMessage !== undefined ? { correctionMessage } : {}),
    },
    { progress: getPilotProgressStore() },
  );
  if (result.ok === false) return pilotJson({ ok: false, code: result.code }, 409);
  return pilotJson({ ok: true }, 200);
}
