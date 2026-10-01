/**
 * Product-side NON-AUTHORITATIVE pilot progress (V1_187B / V1_187E).
 *
 * Product may retain ONLY: invitation/session ids, the H3 intake opaque
 * reference, UI progress, storage object references, cleanup retry metadata,
 * and last-known canonical id hints.
 *
 * NON-AUTHORITATIVE INVARIANT: `lastKnownProfessionalProfileDraftId` and
 * `lastKnownPermissionGrantId` are UX/resume HINTS only. They MUST NEVER be
 * used as the source for a canonical mutation. Every mutation re-resolves the
 * canonical ids from H3 (`readPilotParticipantContext`) immediately before the
 * call. Product NEVER mirrors canonical consent, decision, opt-in or retention
 * truth — those are read live from H3.
 */
export interface PilotProgressRecord {
  readonly participantReference: string;
  readonly invitationId: string | null;
  readonly intakeId: string;
  readonly personId: string;
  readonly evidenceReviewId: string;
  readonly fileKeys: readonly string[];
  readonly submittedAt: string;
  readonly uiStage: string;
  readonly talentNetworkDeclined: boolean;
  readonly cleanupPendingFileKeys: readonly string[];
  /** Non-authoritative UX hint. Never trusted for a mutation. */
  readonly lastKnownProfessionalProfileDraftId?: string | null;
  /** Non-authoritative UX hint. Never trusted for a mutation. */
  readonly lastKnownPermissionGrantId?: string | null;
}

export interface PilotProgressStore {
  get(participantReference: string): Promise<PilotProgressRecord | null>;
  save(record: PilotProgressRecord): Promise<{ ok: boolean; code?: string }>;
  setCleanupPending(participantReference: string, fileKeys: readonly string[]): Promise<void>;
  markTalentNetworkDeclined(participantReference: string): Promise<void>;
}

export function createInMemoryPilotProgressStore(): PilotProgressStore {
  const records = new Map<string, PilotProgressRecord>();
  return {
    async get(participantReference) {
      return records.get(participantReference) ?? null;
    },
    async save(record) {
      records.set(record.participantReference, record);
      return { ok: true };
    },
    async setCleanupPending(participantReference, fileKeys) {
      const existing = records.get(participantReference);
      if (existing === undefined) return;
      records.set(participantReference, { ...existing, cleanupPendingFileKeys: [...fileKeys] });
    },
    async markTalentNetworkDeclined(participantReference) {
      const existing = records.get(participantReference);
      if (existing === undefined) return;
      records.set(participantReference, { ...existing, talentNetworkDeclined: true });
    },
  };
}
