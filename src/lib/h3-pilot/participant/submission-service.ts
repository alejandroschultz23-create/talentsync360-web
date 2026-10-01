import "server-only";

import { randomUUID } from "node:crypto";

import type { PilotFileStorage } from "../server/storage";
import { validatePilotFile } from "../server/storage";
import {
  buildContentReference,
  buildSourceLocator,
  type ProductPilotSourceType,
} from "../server/pilot-source";
import {
  orchestratePilotSubmission,
  type H3PilotCaller,
  type PilotSubmissionArtifact,
  type PilotSubmissionSource,
} from "../server/pilot-submission";
import {
  PILOT_AUTHORIZED_PURPOSE,
  PILOT_EVIDENCE_TYPE,
  PILOT_MAX_RETENTION_DAYS,
  validatePilotConsent,
  type PilotConsentAcknowledgements,
} from "./policy";
import type { PilotProgressStore } from "./progress";

/**
 * Participant submission service (V1_187B).
 *
 * Wraps the V1_187A canonical participant orchestrator with:
 *   - canonical consent validation (12 explicit acknowledgements),
 *   - identity confirmation gate,
 *   - required CV + optional cover letter,
 *   - private storage upload (opaque keys, no public URL),
 *   - non-authoritative progress persistence.
 *
 * NEVER calls an operator/review operation, NEVER auto-opts-in, NEVER promotes,
 * NEVER falls back to the legacy Supabase Evidence Review flow.
 */
export const PILOT_BFF_OPERATOR = "product-pilot-bff";

export interface PilotUpload {
  readonly contentType: string;
  readonly byteLength: number;
  readonly bytes: Uint8Array;
}

export interface ParticipantSubmissionRequest {
  readonly participantReference: string;
  readonly invitationId: string | null;
  readonly identityAcknowledged: boolean;
  readonly acknowledgements: Partial<PilotConsentAcknowledgements>;
  readonly cv: PilotUpload | null;
  readonly coverLetter: PilotUpload | null;
}

export type ParticipantSubmissionResult =
  | {
      readonly ok: true;
      readonly intakeId: string;
      readonly personId: string;
      readonly evidenceReviewId: string;
      readonly presentationStatus: "SUBMITTED";
      readonly uploadedFileKeys: readonly string[];
      readonly artifacts: readonly PilotSubmissionArtifact[];
    }
  | { readonly ok: false; readonly code: string; readonly stage: string };

export interface ParticipantSubmissionDependencies {
  readonly storage: PilotFileStorage;
  readonly progress: PilotProgressStore;
  readonly client?: H3PilotCaller;
  readonly now?: number;
  readonly uuid?: () => string;
}

interface PreparedSource {
  readonly sourceType: ProductPilotSourceType;
  readonly sourceLocator: string;
  readonly contentReference: string;
  readonly fileKey: string;
}

function fail(code: string, stage: string): Extract<ParticipantSubmissionResult, { ok: false }> {
  return { ok: false, code, stage };
}

export async function submitPilotParticipant(
  request: ParticipantSubmissionRequest,
  dependencies: ParticipantSubmissionDependencies,
): Promise<ParticipantSubmissionResult> {
  const now = dependencies.now ?? Date.now();
  const nextId = dependencies.uuid ?? randomUUID;

  if (typeof request.participantReference !== "string" || request.participantReference.trim().length === 0) {
    return fail("INVALID_PARTICIPANT_REFERENCE", "validate");
  }

  const consent = validatePilotConsent(request.acknowledgements);
  if (consent.ok === false) return fail("CONSENT_INCOMPLETE", "consent");

  if (request.identityAcknowledged !== true) return fail("IDENTITY_CONFIRMATION_REQUIRED", "identity");

  if (request.cv === null) return fail("CV_REQUIRED", "sources");

  const uploads: { sourceType: ProductPilotSourceType; upload: PilotUpload }[] = [
    { sourceType: "CV", upload: request.cv },
  ];
  if (request.coverLetter !== null) uploads.push({ sourceType: "COVER_LETTER", upload: request.coverLetter });

  for (const entry of uploads) {
    const validation = validatePilotFile({
      contentType: entry.upload.contentType,
      byteLength: entry.upload.byteLength,
    });
    if (validation.ok === false) return fail(validation.code, "sources");
  }

  // Upload ALL files first. Any failure aborts before any H3 call and cleans up.
  const prepared: PreparedSource[] = [];
  for (const entry of uploads) {
    const opaqueObjectId = `pilot/${nextId()}`;
    const uploaded = await dependencies.storage.upload(
      opaqueObjectId,
      entry.upload.bytes,
      entry.upload.contentType,
    );
    if (uploaded.ok === false) {
      await cleanup(dependencies.storage, prepared.map((source) => source.fileKey));
      return fail(uploaded.code ?? "UPLOAD_FAILED", "storage");
    }
    prepared.push({
      sourceType: entry.sourceType,
      sourceLocator: buildSourceLocator(entry.sourceType, nextId()),
      contentReference: buildContentReference(opaqueObjectId),
      fileKey: opaqueObjectId,
    });
  }

  const sources: PilotSubmissionSource[] = prepared.map((source) => ({
    sourceType: source.sourceType,
    sourceLocator: source.sourceLocator,
    contentReference: source.contentReference,
    authorizedPurpose: PILOT_AUTHORIZED_PURPOSE,
    evidenceType: PILOT_EVIDENCE_TYPE,
  }));

  const result = await orchestratePilotSubmission(
    {
      participantReference: request.participantReference,
      operator: PILOT_BFF_OPERATOR,
      identityAcknowledged: true,
      consent: {
        pilotPurpose: "Preview pilot evidence review",
        permittedDataCategories: ["PROFESSIONAL_MATERIALS"],
        permittedSourceCategories: [...new Set(prepared.map((source) => source.sourceType))],
        retentionMaxDays: PILOT_MAX_RETENTION_DAYS,
      },
      sources,
    },
    {
      ...(dependencies.client !== undefined ? { client: dependencies.client } : {}),
      now,
      uuid: nextId,
    },
  );

  if (result.ok === false) {
    await cleanup(dependencies.storage, prepared.map((source) => source.fileKey));
    return fail(result.code, result.stage);
  }

  const saved = await dependencies.progress.save({
    participantReference: request.participantReference,
    invitationId: request.invitationId,
    intakeId: result.intakeId,
    personId: result.personId,
    evidenceReviewId: result.evidenceReviewId,
    fileKeys: prepared.map((source) => source.fileKey),
    submittedAt: new Date(now).toISOString(),
    uiStage: "SUBMITTED",
    talentNetworkDeclined: false,
    cleanupPendingFileKeys: [],
  });
  if (saved.ok === false) {
    // H3 already accepted the submission; keep the files (traceability) and
    // surface a retryable Product error. Never fabricate success.
    return fail(saved.code ?? "PROGRESS_PERSIST_FAILED", "progress");
  }

  return {
    ok: true,
    intakeId: result.intakeId,
    personId: result.personId,
    evidenceReviewId: result.evidenceReviewId,
    presentationStatus: "SUBMITTED",
    uploadedFileKeys: prepared.map((source) => source.fileKey),
    artifacts: result.artifacts,
  };
}

async function cleanup(storage: PilotFileStorage, fileKeys: readonly string[]): Promise<void> {
  for (const key of fileKeys) {
    try {
      await storage.remove(key);
    } catch {
      // Best-effort cleanup only; never mask the primary failure.
    }
  }
}
