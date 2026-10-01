import { pilotJson, requirePilotSession } from "@/lib/h3-pilot/participant/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const session = await requirePilotSession();
  if (session === null) return pilotJson({ ok: false, pilotMode: false, code: "PILOT_SESSION_INVALID" }, 401);
  return pilotJson(
    { ok: true, pilotMode: true, participantReference: session.participantReference },
    200,
  );
}
