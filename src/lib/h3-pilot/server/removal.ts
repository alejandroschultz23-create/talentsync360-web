import "server-only";

import { callH3Pilot, type CallH3PilotDependencies } from "./client";
import type { H3PilotCaller } from "./pilot-submission";
import type { PilotFileStorage } from "./storage";

/**
 * Product-side file governance / removal hook.
 *
 * Canonical governance remains H3. The Product owns ONLY the private file bytes.
 * On a participant removal request:
 *   1. H3 `requestRealPersonRemoval` executes canonically (exact manifest,
 *      transaction, non-PII receipt, zero residue).
 *   2. Only AFTER H3 success, the Product deletes the exact private objects and
 *      verifies absence.
 * If H3 fails, nothing is deleted (no loss of traceability).
 * If file deletion fails after H3 success, a retryable cleanup state is
 * recorded (never recreating H3 participant data).
 */
export interface PilotRemovalInput {
  readonly intakeId: string;
  readonly personId: string;
  readonly reason: string;
  readonly operator: string;
  readonly fileKeys: readonly string[];
}

export interface PilotRemovalOutcome {
  readonly ok: boolean;
  readonly code: string;
  readonly h3Removed: boolean;
  readonly filesDeleted: boolean;
  readonly cleanupPending: boolean;
  readonly pendingFileKeys: readonly string[];
}

export interface PilotRemovalDependencies extends CallH3PilotDependencies {
  readonly storage: PilotFileStorage;
  /** Optional H3 caller seam (tests/synthetic); defaults to callH3Pilot. */
  readonly client?: H3PilotCaller;
  readonly recordPendingCleanup?: (input: {
    readonly intakeId: string;
    readonly fileKeys: readonly string[];
  }) => Promise<void>;
}

export async function requestPilotRemoval(
  input: PilotRemovalInput,
  dependencies: PilotRemovalDependencies,
): Promise<PilotRemovalOutcome> {
  const caller: H3PilotCaller =
    dependencies.client ?? ((operation, payload) => callH3Pilot(operation, payload, dependencies));
  const h3 = await caller("requestRealPersonRemoval", {
    intakeId: input.intakeId,
    personId: input.personId,
    reason: input.reason,
    operator: input.operator,
  });

  if (h3.ok === false) {
    // Do NOT delete files or Product mapping; keep traceability.
    return {
      ok: false,
      code: h3.code,
      h3Removed: false,
      filesDeleted: false,
      cleanupPending: false,
      pendingFileKeys: [],
    };
  }

  const pendingFileKeys: string[] = [];
  for (const key of input.fileKeys) {
    const removed = await dependencies.storage.remove(key);
    if (removed.ok === false) pendingFileKeys.push(key);
  }
  const filesDeleted = pendingFileKeys.length === 0;

  if (!filesDeleted && dependencies.recordPendingCleanup !== undefined) {
    await dependencies.recordPendingCleanup({ intakeId: input.intakeId, fileKeys: pendingFileKeys });
  }

  return {
    ok: true,
    code: filesDeleted ? "REMOVAL_COMPLETE" : "REMOVAL_FILES_PENDING",
    h3Removed: true,
    filesDeleted,
    cleanupPending: !filesDeleted,
    pendingFileKeys,
  };
}
