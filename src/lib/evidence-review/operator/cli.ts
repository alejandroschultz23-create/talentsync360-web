import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import type { z } from "zod";

import { EvidenceReviewRepository } from "../server/repository";
import { parseOperatorArguments, requireOption } from "./arguments";
import { EvidenceReviewOperatorService, toSafeInspectionOutput } from "./service";
import {
  coherenceInputSchema,
  expiresHoursSchema,
  publishProfileInputSchema,
  submissionIdSchema,
  workTimeInputSchema,
} from "./validation";

const MAX_OPERATOR_INPUT_BYTES = 64_000;

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
  const repository = new EvidenceReviewRepository();
  const service = new EvidenceReviewOperatorService(repository);

  if (command === "queue") {
    const limitValue = options.limit ?? "20";
    if (!/^\d+$/.test(limitValue)) {
      throw new Error("Queue limit must be an integer between 1 and 100");
    }
    const limit = Number(limitValue);
    if (limit < 1 || limit > 100) {
      throw new Error("Queue limit must be an integer between 1 and 100");
    }
    writeJson(await service.queue(limit));
    return;
  }

  const submissionId = parseSubmissionId(
    requireOption(options, "submission"),
  );

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
