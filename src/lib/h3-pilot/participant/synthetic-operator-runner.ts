import "server-only";

import { callH3Pilot } from "../server/client";
import type { H3PilotCaller } from "../server/pilot-submission";
import {
  createSyntheticOperatorReviewHarness,
  type SyntheticReviewResult,
} from "../server/pilot-operator-review";
import { resolvePilotParticipantContext, type ResolvePilotContextResult } from "./context-resolver";

/**
 * Server-only synthetic operator runner seam (V1_187E, prepared for V1_187F).
 *
 * Accepts an `intakeId`, resolves the canonical ids via
 * `readPilotParticipantContext`, then drives the EXISTING V1_187A synthetic
 * operator harness to a draft. This is the ONLY place operator/review
 * operations may be sequenced from the Product lane.
 *
 * STRICT BOUNDARIES:
 *   - requires the literal `synthetic: true` guard,
 *   - server-only (never imported by a browser component),
 *   - NEVER exposed through a participant route,
 *   - NEVER executed automatically.
 *
 * It does not create claims/coherence from real participant data; it is a
 * synthetic test seam only.
 */
export interface SyntheticOperatorReviewRunInput {
  readonly intakeId: string;
  readonly evidenceArtifactId: string;
  readonly changedBy?: string;
  readonly claimType?: string;
}

export interface SyntheticOperatorReviewRunDependencies {
  /** Must be literally `true`; guards against accidental production use. */
  readonly synthetic: true;
  readonly client?: H3PilotCaller;
}

export type SyntheticOperatorReviewRunResult =
  | { readonly ok: true; readonly evidenceReviewId: string; readonly result: SyntheticReviewResult }
  | { readonly ok: false; readonly code: string; readonly stage: string };

export async function runSyntheticOperatorReview(
  input: SyntheticOperatorReviewRunInput,
  dependencies: SyntheticOperatorReviewRunDependencies,
): Promise<SyntheticOperatorReviewRunResult> {
  if (dependencies.synthetic !== true) {
    throw new Error("SYNTHETIC_OPERATOR_RUNNER_REQUIRES_SYNTHETIC_FLAG");
  }
  const client: H3PilotCaller =
    dependencies.client ?? ((operation, payload) => callH3Pilot(operation, payload));

  const contextResult: ResolvePilotContextResult = await resolvePilotParticipantContext(input.intakeId, {
    client,
  });
  if (contextResult.ok === false) {
    return { ok: false, code: contextResult.code, stage: "readPilotParticipantContext" };
  }
  const evidenceReviewId = contextResult.context.evidenceReviewId;
  if (evidenceReviewId === null) {
    return { ok: false, code: "EVIDENCE_REVIEW_NOT_READY", stage: "context" };
  }

  const harness = createSyntheticOperatorReviewHarness({ synthetic: true, client });
  const result = await harness.progressToDraft({
    evidenceReviewId,
    evidenceArtifactId: input.evidenceArtifactId,
    changedBy: input.changedBy ?? "SYNTHETIC_OPERATOR",
    ...(input.claimType !== undefined ? { claimType: input.claimType } : {}),
  });
  if (result.ok === false) {
    return { ok: false, code: result.code, stage: result.stage };
  }
  return { ok: true, evidenceReviewId, result: result.result };
}
