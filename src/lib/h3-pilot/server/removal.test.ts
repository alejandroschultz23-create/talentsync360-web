import { describe, expect, it, vi } from "vitest";

import type { IdentityTokenProvider } from "./identity";
import { requestPilotRemoval } from "./removal";
import type { PilotFileStorage } from "./storage";

const CONFIG = {
  baseUrl: "https://pilot.example.invalid",
  serviceCredential: "APP-CREDENTIAL",
  invitationSecret: "invite-secret",
};
const identity: IdentityTokenProvider = { getIdentityToken: async () => "iam-token" };

function fakeStorage(failKeys: readonly string[] = []): { storage: PilotFileStorage; removed: string[] } {
  const removed: string[] = [];
  return {
    removed,
    storage: {
      async upload() {
        return { ok: true };
      },
      async remove(key: string) {
        removed.push(key);
        return failKeys.includes(key) ? { ok: false, code: "DELETE_FAILED" } : { ok: true };
      },
      async exists() {
        return false;
      },
    },
  };
}

const KEY_A = "pilot/11111111-1111-4111-8111-111111111111";
const KEY_B = "pilot/22222222-2222-4222-8222-222222222222";

describe("h3-pilot removal hook", () => {
  it("15. H3 removal success triggers exact file deletion", async () => {
    const { storage, removed } = fakeStorage();
    const transport = { post: vi.fn(async () => ({ status: 200, body: { ok: true, code: "OK", value: { removed: true } } })) };
    const result = await requestPilotRemoval(
      { intakeId: "i", personId: "p", reason: "request", operator: "op", fileKeys: [KEY_A, KEY_B] },
      { config: CONFIG, identityTokenProvider: identity, transport, storage },
    );
    expect(result).toMatchObject({ ok: true, h3Removed: true, filesDeleted: true, cleanupPending: false });
    expect(removed).toEqual([KEY_A, KEY_B]);
  });

  it("16. H3 removal failure does not delete files", async () => {
    const { storage, removed } = fakeStorage();
    const transport = { post: vi.fn(async () => ({ status: 409, body: { ok: false, code: "PROCESSING_BLOCKED" } })) };
    const result = await requestPilotRemoval(
      { intakeId: "i", personId: "p", reason: "request", operator: "op", fileKeys: [KEY_A] },
      { config: CONFIG, identityTokenProvider: identity, transport, storage },
    );
    expect(result).toMatchObject({ ok: false, h3Removed: false, filesDeleted: false });
    expect(removed).toEqual([]);
  });

  it("17. file deletion failure becomes a retryable cleanup state", async () => {
    const { storage, removed } = fakeStorage([KEY_B]);
    const recorded: { intakeId: string; fileKeys: readonly string[] }[] = [];
    const transport = { post: vi.fn(async () => ({ status: 200, body: { ok: true, code: "OK", value: { removed: true } } })) };
    const result = await requestPilotRemoval(
      { intakeId: "i", personId: "p", reason: "request", operator: "op", fileKeys: [KEY_A, KEY_B] },
      {
        config: CONFIG,
        identityTokenProvider: identity,
        transport,
        storage,
        recordPendingCleanup: async (input) => {
          recorded.push(input);
        },
      },
    );
    expect(result).toMatchObject({ ok: true, h3Removed: true, filesDeleted: false, cleanupPending: true, pendingFileKeys: [KEY_B] });
    expect(removed).toEqual([KEY_A, KEY_B]);
    expect(recorded).toEqual([{ intakeId: "i", fileKeys: [KEY_B] }]);
  });
});
