import "server-only";

import type { EvidenceReviewSubmission } from "../database.types";
import { validatePublicEvidenceReviewPayload } from "../public-submission";
import type { ValidatedEvidenceReviewSubmission } from "../validation";
import {
  hasReasonableCompletionTime,
  hasTriggeredHoneypot,
  isRateLimited,
  readLimitedJsonBody,
} from "./anti-abuse";
import type { EvidenceReviewNotificationStatus } from "./notifications";

export type PublicSubmissionRepository = {
  createSubmission(
    input: ValidatedEvidenceReviewSubmission,
  ): Promise<EvidenceReviewSubmission>;
};

export type SubmissionHandlerDependencies = {
  repository: PublicSubmissionRepository;
  notify: (input: {
    email: string;
    language: "en" | "es";
  }) => Promise<EvidenceReviewNotificationStatus>;
  now?: () => Date;
};

function jsonResponse(body: { ok: boolean }, status: number): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function processEvidenceReviewSubmission(
  request: Request,
  dependencies: SubmissionHandlerDependencies,
): Promise<Response> {
  const now = dependencies.now?.() ?? new Date();
  const body = await readLimitedJsonBody(request);
  if (!body.success) {
    return jsonResponse({ ok: false }, 400);
  }

  if (hasTriggeredHoneypot(body.data)) {
    return jsonResponse({ ok: false }, 400);
  }
  if (!hasReasonableCompletionTime(body.data, now)) {
    return jsonResponse({ ok: false }, 400);
  }
  if (isRateLimited(request.headers, now)) {
    return jsonResponse({ ok: false }, 429);
  }

  const validation = validatePublicEvidenceReviewPayload(body.data, now);
  if (!validation.success) {
    return jsonResponse({ ok: false }, 400);
  }

  try {
    await dependencies.repository.createSubmission(validation.data.submission);
  } catch {
    return jsonResponse({ ok: false }, 503);
  }

  try {
    await dependencies.notify({
      email: validation.data.submission.email,
      language: validation.data.language,
    });
  } catch {
    // Persistence is authoritative; notification failure cannot roll it back.
  }

  return jsonResponse({ ok: true }, 201);
}
