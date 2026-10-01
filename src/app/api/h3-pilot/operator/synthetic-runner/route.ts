import type { NextRequest } from "next/server";

import { runSyntheticPilotJourney } from "@/lib/h3-pilot/operator/synthetic-runner";
import { isOperatorAuthorized, PILOT_OPERATOR_HEADER } from "@/lib/h3-pilot/server/operator-auth";

/**
 * OPERATOR-ONLY synthetic pilot runner (V1_187F). Server-only, never linked
 * from participant UI. Missing/wrong operator secret -> 404 (fail closed).
 * Returns ONLY sanitized statuses/counts; never a secret or a raw token.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

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
  const synthetic = body !== null && typeof body === "object" ? (body as Record<string, unknown>).synthetic : undefined;
  if (synthetic !== true) return json({ ok: false, code: "SYNTHETIC_FLAG_REQUIRED" }, 400);

  const result = await runSyntheticPilotJourney({ synthetic: true });
  return json(
    {
      ok: result.ok,
      runId: result.runId,
      steps: result.steps,
      residue: result.residue,
    },
    result.ok ? 200 : 502,
  );
}
