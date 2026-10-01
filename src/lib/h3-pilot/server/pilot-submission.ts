import "server-only";

import { randomUUID } from "node:crypto";

import { callH3Pilot, type H3PilotCallResult } from "./client";
import {
  buildContentReference,
  containsPii,
  isContentReference,
  isProductPilotSourceType,
  parseSourceLocator,
  type ProductPilotSourceType,
} from "./pilot-source";

/**
 * Participant-side pilot submission orchestrator (owner decision V1_187A).
 *
 * Runs ONLY mechanical participant-side canonical operations, in the frozen
 * order. It NEVER performs H3 operator/review judgment (claims, coherence,
 * review completion, draft generation), NEVER auto-opts-in, NEVER promotes, and
 * NEVER creates presentation permission. Fail closed at every step.
 */
export const PARTICIPANT_OPERATIONS = [
  "createPilotIntake",
  "recordPilotConsent",
  "recordSourceAuthorization",
  "createAndBindPerson",
  "recordIdentityConfirmation",
  "initiateEvidenceReview",
  "openEvidenceReview",
  "ingestEvidenceArtifact",
] as const;
export type ParticipantOperation = (typeof PARTICIPANT_OPERATIONS)[number];

export type H3PilotCaller = (operation: string, payload: Record<string, unknown>) => Promise<H3PilotCallResult>;

export interface PilotSubmissionConsent {
  readonly pilotPurpose: string;
  readonly permittedDataCategories: readonly string[];
  readonly permittedSourceCategories: readonly string[];
  readonly retentionMaxDays?: number;
}

export interface PilotSubmissionSource {
  readonly sourceType: ProductPilotSourceType;
  readonly sourceLocator: string;
  readonly contentReference: string;
  readonly authorizedPurpose: string;
  readonly evidenceType: string;
  readonly summary?: string;
}

export interface PilotSubmissionInput {
  readonly participantReference: string;
  readonly operator: string;
  readonly identityAcknowledged: boolean;
  readonly consent: PilotSubmissionConsent;
  readonly sources: readonly PilotSubmissionSource[];
}

export interface PilotSubmissionArtifact {
  readonly sourceType: ProductPilotSourceType;
  readonly sourceLocator: string;
  readonly contentReference: string;
  readonly evidenceArtifactId: string | null;
}

export type PilotSubmissionResult =
  | {
      readonly ok: true;
      readonly intakeId: string;
      readonly consentId: string;
      readonly personId: string;
      readonly evidenceReviewId: string;
      readonly artifacts: readonly PilotSubmissionArtifact[];
    }
  | { readonly ok: false; readonly code: string; readonly stage: string };

export interface PilotSubmissionDependencies {
  readonly client?: H3PilotCaller;
  readonly now?: number;
  readonly uuid?: () => string;
}

const MAX_RETENTION_DAYS = 30;

function defaultCaller(operation: string, payload: Record<string, unknown>): Promise<H3PilotCallResult> {
  return callH3Pilot(operation, payload);
}

function isParticipantOperation(operation: string): operation is ParticipantOperation {
  return (PARTICIPANT_OPERATIONS as readonly string[]).includes(operation);
}

function readId(value: unknown, keys: readonly string[]): string | null {
  if (value === null || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  for (const key of keys) {
    const candidate = record[key];
    if (typeof candidate === "string" && candidate.length > 0) return candidate;
  }
  return null;
}

function fail(code: string, stage: string): Extract<PilotSubmissionResult, { ok: false }> {
  return { ok: false, code, stage };
}

export async function orchestratePilotSubmission(
  input: PilotSubmissionInput,
  dependencies: PilotSubmissionDependencies = {},
): Promise<PilotSubmissionResult> {
  const now = dependencies.now ?? Date.now();
  const nextId = dependencies.uuid ?? randomUUID;
  const client = dependencies.client ?? defaultCaller;
  const isoTimestamp = new Date(now).toISOString();

  const call = async (operation: ParticipantOperation, payload: Record<string, unknown>): Promise<H3PilotCallResult> => {
    if (!isParticipantOperation(operation)) {
      return { ok: false, code: "INVALID_REQUEST" };
    }
    return client(operation, payload);
  };

  // --- pre-flight validation (fail closed before any H3 call) ---
  if (typeof input.participantReference !== "string" || input.participantReference.trim().length === 0) {
    return fail("INVALID_PARTICIPANT_REFERENCE", "validate");
  }
  if (input.identityAcknowledged !== true) {
    return fail("IDENTITY_CONFIRMATION_REQUIRED", "identity");
  }
  if (input.consent.permittedDataCategories.length === 0 || input.consent.permittedSourceCategories.length === 0) {
    return fail("CONSENT_INCOMPLETE", "consent");
  }
  const retentionMaxDays = input.consent.retentionMaxDays ?? MAX_RETENTION_DAYS;
  if (!Number.isInteger(retentionMaxDays) || retentionMaxDays <= 0 || retentionMaxDays > MAX_RETENTION_DAYS) {
    return fail("RETENTION_INVALID", "consent");
  }
  if (input.sources.length === 0) return fail("CV_REQUIRED", "sources");
  if (input.sources.filter((source) => source.sourceType === "CV").length !== 1) {
    return fail("CV_REQUIRED", "sources");
  }
  for (const source of input.sources) {
    if (!isProductPilotSourceType(source.sourceType)) return fail("INVALID_SOURCE_TYPE", "sources");
    const parsed = parseSourceLocator(source.sourceLocator);
    if (
      parsed === null ||
      parsed.sourceType !== source.sourceType ||
      containsPii(source.sourceLocator) ||
      !isContentReference(source.contentReference)
    ) {
      return fail("INVALID_SOURCE_LOCATOR", "sources");
    }
    if (source.authorizedPurpose.trim().length === 0 || source.evidenceType.trim().length === 0) {
      return fail("SOURCE_AUTHORIZATION_INCOMPLETE", "sources");
    }
  }

  const intakeId = nextId();
  const consentId = nextId();
  const personId = nextId();

  const intake = await call("createPilotIntake", { intakeId, pilotStartedAt: isoTimestamp });
  if (!intake.ok) return fail(intake.code, "createPilotIntake");

  const consent = await call("recordPilotConsent", {
    consentId,
    intakeId,
    status: "GRANTED",
    pilotPurpose: input.consent.pilotPurpose,
    permittedDataCategories: [...input.consent.permittedDataCategories],
    permittedSourceCategories: [...input.consent.permittedSourceCategories],
    withdrawalRemovalAcknowledged: true,
    externalPresentationDisabledAcknowledged: true,
    operator: input.operator,
    retentionMaxDays,
    consentTimestamp: isoTimestamp,
  });
  if (!consent.ok) return fail(consent.code, "recordPilotConsent");

  for (const source of input.sources) {
    const authorization = await call("recordSourceAuthorization", {
      authorizationId: nextId(),
      intakeId,
      sourceType: source.sourceType,
      sourceLocator: source.sourceLocator,
      status: "GRANTED",
      authorizedPurpose: source.authorizedPurpose,
      submittedByParticipant: true,
      publicSource: false,
      authorizedAt: isoTimestamp,
    });
    if (!authorization.ok) return fail(authorization.code, "recordSourceAuthorization");
  }

  const firstSource = input.sources[0]?.sourceLocator ?? "";
  const person = await call("createAndBindPerson", { intakeId, personId, firstSource });
  if (!person.ok) return fail(person.code, "createAndBindPerson");

  const identity = await call("recordIdentityConfirmation", {
    intakeId,
    status: "CONFIRMED",
    changedBy: input.operator,
    confirmedAt: isoTimestamp,
  });
  if (!identity.ok) return fail(identity.code, "recordIdentityConfirmation");

  const initiated = await call("initiateEvidenceReview", { personId, source: firstSource });
  if (!initiated.ok) return fail(initiated.code, "initiateEvidenceReview");
  const evidenceReviewId = readId(initiated.value, ["evidenceReviewId"]) ??
    readId((initiated.value as Record<string, unknown> | undefined)?.evidenceReview, ["evidenceReviewId"]);
  if (evidenceReviewId === null) return fail("EVIDENCE_REVIEW_ID_MISSING", "initiateEvidenceReview");

  const opened = await call("openEvidenceReview", {
    evidenceReviewId,
    changedBy: input.operator,
    reason: "pilot participant submission",
  });
  if (!opened.ok) return fail(opened.code, "openEvidenceReview");

  const artifacts: PilotSubmissionArtifact[] = [];
  for (const source of input.sources) {
    const ingested = await call("ingestEvidenceArtifact", {
      evidenceReviewId,
      evidenceType: source.evidenceType,
      visibility: "PRIVATE",
      source: source.sourceLocator,
      contentReference: source.contentReference,
      ...(source.summary !== undefined ? { summary: source.summary } : {}),
    });
    if (!ingested.ok) return fail(ingested.code, "ingestEvidenceArtifact");
    const evidenceArtifactId = readId(ingested.value, ["evidenceArtifactId"]) ??
      readId((ingested.value as Record<string, unknown> | undefined)?.evidenceArtifact, ["evidenceArtifactId"]);
    artifacts.push({
      sourceType: source.sourceType,
      sourceLocator: source.sourceLocator,
      contentReference: source.contentReference,
      evidenceArtifactId,
    });
  }

  return { ok: true, intakeId, consentId, personId, evidenceReviewId, artifacts };
}

/** Convenience: pair an uploaded storage object with a freshly built content reference. */
export function contentReferenceForStorageObject(objectId: string): string {
  return buildContentReference(objectId);
}
