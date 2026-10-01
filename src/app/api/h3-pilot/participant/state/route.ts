import type { NextRequest } from "next/server";

import type { PilotLanguage } from "@/lib/h3-pilot/participant/content";
import { getPilotProgressStore } from "@/lib/h3-pilot/participant/runtime";
import { pilotJson, requirePilotSession } from "@/lib/h3-pilot/participant/session";
import { readPilotParticipantState } from "@/lib/h3-pilot/participant/state-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<Response> {
  const session = await requirePilotSession();
  if (session === null) return pilotJson({ ok: false, code: "PILOT_SESSION_INVALID" }, 401);

  const language: PilotLanguage = new URL(request.url).searchParams.get("lang") === "en" ? "en" : "es";
  const result = await readPilotParticipantState(
    { participantReference: session.participantReference, language },
    { progress: getPilotProgressStore() },
  );

  if (result.ok === false) return pilotJson({ ok: false, code: result.code }, 502);
  return pilotJson({ ok: true, participantReference: session.participantReference, state: result.state }, 200);
}
