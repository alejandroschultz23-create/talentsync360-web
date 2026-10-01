import type { NextRequest } from "next/server";

import {
  requestPilotRemovalAction,
  revokeTalentNetworkOptInAction,
  withdrawPilotParticipant,
} from "@/lib/h3-pilot/participant/actions-service";
import { isPilotLifecycleAction } from "@/lib/h3-pilot/participant/decisions";
import { getPilotFileStorage, getPilotProgressStore } from "@/lib/h3-pilot/participant/runtime";
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
  if (!isPilotLifecycleAction(record.action)) return pilotJson({ ok: false, code: "INVALID_ACTION" }, 400);
  const reason = typeof record.reason === "string" ? record.reason : "participant request";

  if (record.action === "WITHDRAW") {
    const result = await withdrawPilotParticipant(
      { participantReference: session.participantReference, reason },
      { progress: getPilotProgressStore() },
    );
    if (result.ok === false) return pilotJson({ ok: false, code: result.code }, 409);
    return pilotJson({ ok: true }, 200);
  }

  if (record.action === "REVOKE_OPT_IN") {
    const result = await revokeTalentNetworkOptInAction(
      { participantReference: session.participantReference },
      { progress: getPilotProgressStore() },
    );
    if (result.ok === false) return pilotJson({ ok: false, code: result.code }, 409);
    return pilotJson({ ok: true, revoked: result.revoked }, 200);
  }

  const storage = getPilotFileStorage();
  if (storage === null) return pilotJson({ ok: false, code: "PILOT_STORAGE_NOT_CONFIGURED" }, 503);
  const result = await requestPilotRemovalAction(
    { participantReference: session.participantReference, reason },
    { progress: getPilotProgressStore(), storage },
  );
  if (result.ok === false) return pilotJson({ ok: false, code: result.code }, 409);
  return pilotJson(
    { ok: true, cleanupPending: result.cleanupPending, pendingFileKeys: result.pendingFileKeys.length },
    200,
  );
}
