/**
 * Product-side NON-AUTHORITATIVE pilot progress (V1_187B).
 *
 * Product may retain ONLY: invitation/session ids, the H3 intake opaque
 * reference, UI progress, storage object references, and cleanup retry
 * metadata. It NEVER mirrors canonical consent, decision, opt-in or retention
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
