import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import {
  createSupabasePilotFileStorage,
  type PilotFileStorage,
} from "../server/storage";
import {
  createInMemoryPilotProgressStore,
  type PilotProgressRecord,
  type PilotProgressStore,
} from "./progress";

/**
 * Server-only runtime factories for the participant BFF (V1_187B).
 *
 * Supabase is used ONLY for non-authoritative Product metadata (private file
 * bytes + UI progress). It is NEVER the source of truth for consent, source
 * authorization, identity, draft decision, opt-in, retention or removal.
 * Fail closed: missing configuration never degrades to a Production fallback.
 */
export const PILOT_PROGRESS_TABLE = "pilot_progress";

export function getSupabaseServerClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getPilotFileStorage(): PilotFileStorage | null {
  const client = getSupabaseServerClient();
  if (client === null) return null;
  return createSupabasePilotFileStorage(client);
}

function createSupabasePilotProgressStore(client: SupabaseClient): PilotProgressStore {
  async function readRow(participantReference: string): Promise<PilotProgressRecord | null> {
    const { data, error } = await client
      .from(PILOT_PROGRESS_TABLE)
      .select("record")
      .eq("participant_reference", participantReference)
      .maybeSingle();
    if (error !== null || data === null) return null;
    const record = (data as { record?: unknown }).record;
    return record !== null && typeof record === "object" ? (record as PilotProgressRecord) : null;
  }

  async function writeRow(record: PilotProgressRecord): Promise<{ ok: boolean; code?: string }> {
    const { error } = await client
      .from(PILOT_PROGRESS_TABLE)
      .upsert({ participant_reference: record.participantReference, record }, { onConflict: "participant_reference" });
    return error === null ? { ok: true } : { ok: false, code: "PROGRESS_PERSIST_FAILED" };
  }

  return {
    get: readRow,
    save: writeRow,
    async setCleanupPending(participantReference, fileKeys) {
      const existing = await readRow(participantReference);
      if (existing === null) return;
      await writeRow({ ...existing, cleanupPendingFileKeys: [...fileKeys] });
    },
    async markTalentNetworkDeclined(participantReference) {
      const existing = await readRow(participantReference);
      if (existing === null) return;
      await writeRow({ ...existing, talentNetworkDeclined: true });
    },
  };
}

let inMemoryProgressStore: PilotProgressStore | null = null;

export function getPilotProgressStore(): PilotProgressStore {
  const client = getSupabaseServerClient();
  if (client !== null) return createSupabasePilotProgressStore(client);
  // Dev/local fallback only. Serverless instances must configure Supabase.
  if (inMemoryProgressStore === null) inMemoryProgressStore = createInMemoryPilotProgressStore();
  return inMemoryProgressStore;
}
