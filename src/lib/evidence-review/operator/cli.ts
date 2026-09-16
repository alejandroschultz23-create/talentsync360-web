import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import type { z } from "zod";

import { EvidenceReviewRepository } from "../server/repository";
import { parseOperatorArguments, requireOption } from "./arguments";
import {
  closePrivacyCase,
  listPrivacyRetentionQueue,
  previewPrivacyCaseClosure,
  recordPrivacyCaseActivity,
  withdrawTalentNetwork,
} from "./privacy-database";
import type { PrivacyClosureReason } from "./privacy-database";
import { EvidenceReviewOperatorService, toSafeInspectionOutput } from "./service";
import {
  coherenceInputSchema,
  expiresHoursSchema,
  publishProfileInputSchema,
  submissionIdSchema,
  workTimeInputSchema,
} from "./validation";

const MAX_OPERATOR_INPUT_BYTES = 64_000;
const CLOSURE_REASONS: ReadonlySet<string> = new Set([
  "RETENTION_90_DAYS",
  "RETENTION_DECLINED_180_DAYS",
  "WITHDRAWAL",
  "PRIVACY_REQUEST",
]);

function parsePrivacyActor(options: Record<string, string>): string {
  const actor = requireOption(options, "actor");
  if (!/^[A-Za-z0-9_-]{3,64}$/.test(actor)) {
    throw new Error("Privacy actor must be a non-email operator identifier (3–64 characters)");
  }
  return actor;
}

function parseClosureReason(options: Record<string, string>): PrivacyClosureReason {
  const reason = requireOption(options, "reason");
  if (!CLOSURE_REASONS.has(reason)) {
    throw new Error("Unsupported privacy closure reason");
  }
  return reason as PrivacyClosureReason;
}

async function readValidatedJson<T>(
  inputPath: string,
  schema: z.ZodType<T>,
): Promise<T> {
  const content = await readFile(resolve(inputPath), "utf8");
  if (Buffer.byteLength(content, "utf8") > MAX_OPERATOR_INPUT_BYTES) {
    throw new Error("Operator input file exceeds 64 KB");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Operator input file must contain valid JSON");
  }

  const result = schema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `${issue.path.join(".") || "input"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Operator input validation failed: ${issues}`);
  }
  return result.data;
}

function parseSubmissionId(value: string): string {
  const result = submissionIdSchema.safeParse(value);
  if (!result.success) {
    throw new Error("Submission must be a valid UUID");
  }
  return result.data;
}

function writeJson(value: unknown): void {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

export async function runEvidenceReviewOperator(
  argv: readonly string[],
): Promise<void> {
  const { command, options } = parseOperatorArguments(argv);

  if (command === "queue") {
    const limitValue = options.limit ?? "20";
    if (!/^\d+$/.test(limitValue)) {
      throw new Error("Queue limit must be an integer between 1 and 100");
    }
    const limit = Number(limitValue);
    if (limit < 1 || limit > 100) {
      throw new Error("Queue limit must be an integer between 1 and 100");
    }
    writeJson(await new EvidenceReviewOperatorService(new EvidenceReviewRepository()).queue(limit));
    return;
  }

  if (command === "retention-queue") {
    const limitValue = options.limit ?? "100";
    if (!/^\d+$/.test(limitValue) || Number(limitValue) < 1 || Number(limitValue) > 100) {
      throw new Error("Retention queue limit must be between 1 and 100");
    }
    writeJson(await listPrivacyRetentionQueue(Number(limitValue)));
    return;
  }

  const submissionId = parseSubmissionId(
    requireOption(options, "submission"),
  );

  if (command === "record-activity") {
    const occurredAt = await recordPrivacyCaseActivity(submissionId, parsePrivacyActor(options));
    writeJson({ ok: true, command, submission_id: submissionId, occurred_at: occurredAt });
    return;
  }

  if (command === "withdraw-network") {
    const optIn = await withdrawTalentNetwork(submissionId, parsePrivacyActor(options));
    writeJson({ ok: true, command, submission_id: submissionId, opt_in_id: optIn.id, withdrawn_at: optIn.withdrawn_at });
    return;
  }

  if (command === "closure-preview") {
    writeJson(await previewPrivacyCaseClosure(submissionId, parseClosureReason(options)));
    return;
  }

  if (command === "close-case") {
    const confirmSubmissionId = parseSubmissionId(requireOption(options, "confirm"));
    if (confirmSubmissionId !== submissionId) {
      throw new Error("--confirm must exactly match --submission");
    }
    const result = await closePrivacyCase({
      submissionId,
      actor: parsePrivacyActor(options),
      reason: parseClosureReason(options),
      confirmSubmissionId,
    });
    writeJson({ ok: true, command, submission_id: submissionId, event_id: result.id,
      closed_at: result.occurred_at, audit_expires_at: result.audit_expires_at });
    return;
  }

  // The preceding privacy commands use a separate local database-owner
  // connection. Actor, reason, and confirmation guard mistakes and record
  // intent; they do not authorize the operation.
  const service = new EvidenceReviewOperatorService(new EvidenceReviewRepository());

  if (command === "inspect") {
    writeJson(toSafeInspectionOutput(await service.inspect(submissionId)));
    return;
  }

  if (command === "coherence") {
    const input = await readValidatedJson(
      requireOption(options, "input"),
      coherenceInputSchema,
    );
    const submission = await service.recordCoherence(submissionId, input);
    writeJson({
      ok: true,
      command,
      submission_id: submission.id,
      review_state: submission.review_state,
      coherence_status: submission.coherence_status,
      coherence_reviewed_at: submission.coherence_reviewed_at,
    });
    return;
  }

  if (command === "start-review") {
    const actorReference = requireOption(options, "actor").trim();
    if (!actorReference || actorReference.length > 160) {
      throw new Error("Actor reference must contain between 1 and 160 characters");
    }
    const submission = await service.startReview(submissionId, actorReference);
    writeJson({
      ok: true,
      command,
      submission_id: submission.id,
      review_state: submission.review_state,
    });
    return;
  }

  if (command === "publish-profile") {
    const input = await readValidatedJson(
      requireOption(options, "input"),
      publishProfileInputSchema,
    );
    const profile = await service.publishProfile(submissionId, input);
    writeJson({
      ok: true,
      command,
      submission_id: profile.submission_id,
      profile_id: profile.id,
      review_version: profile.review_version,
      reviewed_at: profile.reviewed_at,
      delivered_at: profile.delivered_at,
    });
    return;
  }

  if (command === "deliver-profile") {
    const actorReference = requireOption(options, "actor").trim();
    if (!actorReference || actorReference.length > 160) {
      throw new Error("Actor reference must contain between 1 and 160 characters");
    }
    const expiresHours = options["expires-hours"]
      ? expiresHoursSchema.parse(options["expires-hours"])
      : 72;
    const result = await service.deliverProfile({
      submissionId,
      actorReference,
      expiresHours,
    });
    writeJson(result);
    return;
  }

  if (command === "reissue-access") {
    const actorReference = requireOption(options, "actor").trim();
    if (!actorReference || actorReference.length > 160) {
      throw new Error("Actor reference must contain between 1 and 160 characters");
    }
    const expiresHours = options["expires-hours"]
      ? expiresHoursSchema.parse(options["expires-hours"])
      : 72;
    const result = await service.reissueAccess({
      submissionId,
      actorReference,
      expiresHours,
    });
    writeJson(result);
    return;
  }

  if (command === "revoke-access") {
    const actorReference = requireOption(options, "actor").trim();
    if (!actorReference || actorReference.length > 160) {
      throw new Error("Actor reference must contain between 1 and 160 characters");
    }
    const result = await service.revokeAccess({
      submissionId,
      actorReference,
    });
    writeJson(result);
    return;
  }

  if (command === "revise-profile") {
    const input = await readValidatedJson(
      requireOption(options, "input"),
      publishProfileInputSchema,
    );
    if (options.actor) {
      const actorReference = options.actor.trim();
      if (!actorReference || actorReference.length > 160) {
        throw new Error("Actor reference must contain between 1 and 160 characters");
      }
      input.actor_reference = actorReference;
    }
    const profile = await service.reviseProfile(submissionId, input);
    writeJson({
      ok: true,
      command,
      submission_id: profile.submission_id,
      profile_id: profile.id,
      review_version: profile.review_version,
      supersedes_profile_id: profile.supersedes_profile_id,
      reviewed_at: profile.reviewed_at,
      delivered_at: profile.delivered_at,
    });
    return;
  }

  const input = await readValidatedJson(
    requireOption(options, "input"),
    workTimeInputSchema,
  );
  const event = await service.logTime(submissionId, input);
  writeJson({
    ok: true,
    command,
    submission_id: event.entity_id,
    event_type: event.event_type,
    occurred_at: event.occurred_at,
  });
}
