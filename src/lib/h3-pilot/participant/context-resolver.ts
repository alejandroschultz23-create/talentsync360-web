import "server-only";

import { callH3Pilot, type H3PilotCallResult } from "../server/client";
import type { H3PilotCaller } from "../server/pilot-submission";

/**
 * Product-side canonical participant CONTEXT resolver (V1_187E).
 *
 * ONE intake-scoped read that resolves the canonical opaque identifiers the
 * participant flows need. Product NEVER infers these ids; it asks H3.
 *
 *   intakeId -> readPilotParticipantContext -> canonical ids -> explicit op
 *
 * Fail closed on malformed payload or scope mismatch. The response is NOT
 * persisted as authoritative state and NOT cached beyond the request scope.
 */
export interface PilotParticipantContext {
  readonly intakeId: string;
  readonly personId: string | null;
  readonly evidenceReviewId: string | null;
  readonly professionalProfileDraftId: string | null;
  readonly talentNetworkOptInPermissionGrantId: string | null;
  readonly talentProfileId: string | null;
}

export type ResolvePilotContextResult =
  | { readonly ok: true; readonly context: PilotParticipantContext }
  | { readonly ok: false; readonly code: string };

type NullableId = string | null | undefined;

function readNullableId(value: unknown): NullableId {
  if (value === null) return null;
  if (typeof value === "string" && value.length > 0) return value;
  return undefined;
}

/**
 * Defensive parse + scope validation of the canonical context payload. Returns
 * fail-closed on any missing key, non-string id, or intakeId mismatch.
 */
export function parsePilotParticipantContext(
  value: unknown,
  expectedIntakeId: string,
): ResolvePilotContextResult {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, code: "INVALID_CONTEXT_PAYLOAD" };
  }
  const record = value as Record<string, unknown>;
  const intakeId = record.intakeId;
  if (typeof intakeId !== "string" || intakeId.length === 0) {
    return { ok: false, code: "INVALID_CONTEXT_PAYLOAD" };
  }
  if (intakeId !== expectedIntakeId) {
    return { ok: false, code: "PILOT_CONTEXT_SCOPE_MISMATCH" };
  }

  const personId = readNullableId(record.personId);
  const evidenceReviewId = readNullableId(record.evidenceReviewId);
  const professionalProfileDraftId = readNullableId(record.professionalProfileDraftId);
  const talentNetworkOptInPermissionGrantId = readNullableId(record.talentNetworkOptInPermissionGrantId);
  const talentProfileId = readNullableId(record.talentProfileId);

  if (
    personId === undefined ||
    evidenceReviewId === undefined ||
    professionalProfileDraftId === undefined ||
    talentNetworkOptInPermissionGrantId === undefined ||
    talentProfileId === undefined
  ) {
    return { ok: false, code: "INVALID_CONTEXT_PAYLOAD" };
  }

  return {
    ok: true,
    context: {
      intakeId,
      personId,
      evidenceReviewId,
      professionalProfileDraftId,
      talentNetworkOptInPermissionGrantId,
      talentProfileId,
    },
  };
}

export interface ResolvePilotContextDependencies {
  readonly client?: H3PilotCaller;
}

function defaultClient(operation: string, payload: Record<string, unknown>): Promise<H3PilotCallResult> {
  return callH3Pilot(operation, payload);
}

export async function resolvePilotParticipantContext(
  intakeId: string,
  dependencies: ResolvePilotContextDependencies = {},
): Promise<ResolvePilotContextResult> {
  if (typeof intakeId !== "string" || intakeId.trim().length === 0) {
    return { ok: false, code: "INVALID_INTAKE_ID" };
  }
  const client = dependencies.client ?? defaultClient;
  const result = await client("readPilotParticipantContext", { intakeId });
  if (result.ok === false) return { ok: false, code: result.code };
  return parsePilotParticipantContext(result.value, intakeId);
}
