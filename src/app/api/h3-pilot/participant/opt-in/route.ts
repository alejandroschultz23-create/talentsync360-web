import type { NextRequest } from "next/server";

import { decideTalentNetworkOptIn } from "@/lib/h3-pilot/participant/actions-service";
import type { PilotLanguage } from "@/lib/h3-pilot/participant/content";
import { isPilotOptInAction } from "@/lib/h3-pilot/participant/decisions";
import { getPilotProgressStore } from "@/lib/h3-pilot/participant/runtime";
import { pilotJson, requirePilotSession } from "@/lib/h3-pilot/participant/session";

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
  if (!isPilotOptInAction(record.action)) return pilotJson({ ok: false, code: "INVALID_OPT_IN_ACTION" }, 400);
  const language: PilotLanguage = record.language === "en" ? "en" : "es";

  const result = await decideTalentNetworkOptIn(
    { participantReference: session.participantReference, action: record.action, language },
    { progress: getPilotProgressStore() },
  );
  if (result.ok === false) return pilotJson({ ok: false, code: result.code }, 409);
  return pilotJson({ ok: true }, 200);
}
