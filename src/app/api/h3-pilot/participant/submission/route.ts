import type { NextRequest } from "next/server";

import { getPilotFileStorage, getPilotProgressStore } from "@/lib/h3-pilot/participant/runtime";
import { pilotJson, requirePilotSession } from "@/lib/h3-pilot/participant/session";
import {
  submitPilotParticipant,
  type PilotUpload,
} from "@/lib/h3-pilot/participant/submission-service";
import {
  PILOT_CONSENT_ACKNOWLEDGEMENT_KEYS,
  type PilotConsentAcknowledgements,
} from "@/lib/h3-pilot/participant/policy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function readUpload(value: unknown): Promise<PilotUpload | null> {
  if (value === null || typeof value !== "object") return null;
  const file = value as { size?: unknown; type?: unknown; arrayBuffer?: unknown };
  if (typeof file.arrayBuffer !== "function") return null;
  const bytes = new Uint8Array(await (file.arrayBuffer as () => Promise<ArrayBuffer>)());
  return {
    contentType: typeof file.type === "string" ? file.type : "",
    byteLength: typeof file.size === "number" ? file.size : bytes.byteLength,
    bytes,
  };
}

export async function POST(request: NextRequest): Promise<Response> {
  const session = await requirePilotSession();
  if (session === null) return pilotJson({ ok: false, code: "PILOT_SESSION_INVALID" }, 401);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return pilotJson({ ok: false, code: "INVALID_REQUEST" }, 400);
  }

  const acknowledgements = {} as Partial<PilotConsentAcknowledgements>;
  for (const key of PILOT_CONSENT_ACKNOWLEDGEMENT_KEYS) {
    acknowledgements[key] = form.get(`ack_${key}`) === "true";
  }

  const identityAcknowledged = form.get("identity_confirmed") === "true";
  const cv = await readUpload(form.get("cv"));
  const rawCoverLetter = form.get("cover_letter");
  const coverLetter =
    rawCoverLetter instanceof File && rawCoverLetter.size > 0 ? await readUpload(rawCoverLetter) : null;

  const storage = getPilotFileStorage();
  if (storage === null) return pilotJson({ ok: false, code: "PILOT_STORAGE_NOT_CONFIGURED" }, 503);

  const result = await submitPilotParticipant(
    {
      participantReference: session.participantReference,
      invitationId: session.invitationId,
      identityAcknowledged,
      acknowledgements,
      cv,
      coverLetter,
    },
    { storage, progress: getPilotProgressStore() },
  );

  if (result.ok === false) {
    const status = result.code === "PILOT_STORAGE_NOT_CONFIGURED" ? 503 : 400;
    return pilotJson({ ok: false, code: result.code, stage: result.stage }, status);
  }

  return pilotJson(
    {
      ok: true,
      intakeId: result.intakeId,
      evidenceReviewId: result.evidenceReviewId,
      status: result.presentationStatus,
    },
    201,
  );
}
