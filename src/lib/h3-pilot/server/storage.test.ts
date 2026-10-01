import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

import {
  ALLOWED_PILOT_CONTENT_TYPES,
  buildPilotLocator,
  createPilotFileKey,
  createSupabasePilotFileStorage,
  isOpaquePilotFileKey,
  parsePilotLocator,
  PILOT_FILE_BUCKET,
  validatePilotFile,
} from "./storage";

describe("h3-pilot storage", () => {
  it("11. unsupported file type blocked", () => {
    expect(validatePilotFile({ contentType: "application/x-msdownload", byteLength: 10 }).ok).toBe(false);
    expect(validatePilotFile({ contentType: "text/html", byteLength: 10 }).ok).toBe(false);
  });

  it("12. oversize file blocked", () => {
    const result = validatePilotFile({ contentType: ALLOWED_PILOT_CONTENT_TYPES[0], byteLength: 6 * 1024 * 1024 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("FILE_TOO_LARGE");
  });

  it("empty file blocked; allowed types accepted", () => {
    expect(validatePilotFile({ contentType: ALLOWED_PILOT_CONTENT_TYPES[0], byteLength: 0 }).ok).toBe(false);
    for (const type of ALLOWED_PILOT_CONTENT_TYPES) {
      expect(validatePilotFile({ contentType: type, byteLength: 1024 }).ok).toBe(true);
    }
  });

  it("9,10. opaque key with no participant PII", () => {
    const key = createPilotFileKey();
    expect(isOpaquePilotFileKey(key)).toBe(true);
    expect(key).toMatch(/^pilot\//);
    expect(key).not.toMatch(/@|john|doe|gmail/i);
    expect(isOpaquePilotFileKey("pilot/john.doe@gmail.com")).toBe(false);
    expect(isOpaquePilotFileKey("pilot/Jane Doe")).toBe(false);
  });

  it("13,14. locator contains no public URL or secret", () => {
    const key = createPilotFileKey();
    const locator = buildPilotLocator(key);
    expect(locator).toBe(`product-storage://${PILOT_FILE_BUCKET}/${key}`);
    expect(locator).not.toMatch(/https?:|token=|signature=|X-Amz|supabase\.co/i);
    expect(parsePilotLocator(locator)).toEqual({ bucket: PILOT_FILE_BUCKET, key });
  });

  it("locator parser rejects malformed / foreign locators", () => {
    expect(parsePilotLocator("https://bucket.example/obj")).toBeNull();
    expect(parsePilotLocator("product-storage://other-bucket/pilot/not-a-uuid")).toBeNull();
    expect(parsePilotLocator("product-storage://h3-pilot-evidence/pilot/not-a-uuid")).toBeNull();
  });
});

interface FakeCalls {
  uploads: { bucket: string; key: string; upsert: boolean; contentType: string }[];
  removes: { bucket: string; keys: string[] }[];
  lists: { bucket: string; prefix: string }[];
}

function fakeClient(state: { exists?: boolean } = {}): { client: SupabaseClient; calls: FakeCalls } {
  const calls: FakeCalls = { uploads: [], removes: [], lists: [] };
  const client = {
    storage: {
      from(bucket: string) {
        return {
          async upload(key: string, _bytes: Uint8Array, options: { contentType: string; upsert: boolean }) {
            calls.uploads.push({ bucket, key, upsert: options.upsert, contentType: options.contentType });
            return { error: null };
          },
          async remove(keys: string[]) {
            calls.removes.push({ bucket, keys });
            return { error: null };
          },
          async list(prefix: string) {
            calls.lists.push({ bucket, prefix });
            return { data: state.exists === false ? [] : [{ name: "synthetic" }], error: null };
          },
        };
      },
    },
  } as unknown as SupabaseClient;
  return { client, calls };
}

describe("h3-pilot supabase private storage adapter", () => {
  const bytes = new Uint8Array([1, 2, 3]);

  it("uploads to the private bucket server-side with a strict content type", async () => {
    const { client, calls } = fakeClient();
    const storage = createSupabasePilotFileStorage(client);
    const key = createPilotFileKey();
    expect(await storage.upload(key, bytes, "application/pdf")).toEqual({ ok: true });
    expect(calls.uploads).toEqual([
      { bucket: PILOT_FILE_BUCKET, key, upsert: false, contentType: "application/pdf" },
    ]);
  });

  it("rejects non-opaque keys before touching the client", async () => {
    const { client, calls } = fakeClient();
    const storage = createSupabasePilotFileStorage(client);
    expect(await storage.upload("pilot/jane.doe@gmail.com", bytes, "application/pdf")).toEqual({
      ok: false,
      code: "INVALID_PILOT_FILE_KEY",
    });
    expect(await storage.remove("pilot/jane.doe@gmail.com")).toEqual({
      ok: false,
      code: "INVALID_PILOT_FILE_KEY",
    });
    expect(calls.uploads).toHaveLength(0);
    expect(calls.removes).toHaveLength(0);
  });

  it("removes the exact object and reports existence", async () => {
    const key = createPilotFileKey();
    const present = fakeClient();
    const storage = createSupabasePilotFileStorage(present.client);
    expect(await storage.remove(key)).toEqual({ ok: true });
    expect(present.calls.removes).toEqual([{ bucket: PILOT_FILE_BUCKET, keys: [key] }]);
    expect(await storage.exists(key)).toBe(true);

    const absent = fakeClient({ exists: false });
    expect(await createSupabasePilotFileStorage(absent.client).exists(key)).toBe(false);
  });

  it("never emits a public or signed URL from the storage module", () => {
    const src = readFileSync(resolve(import.meta.dirname, "storage.ts"), "utf8");
    expect(src).not.toMatch(/getPublicUrl|createSignedUrl|createSignedUrls|download\(/);
    expect(src).not.toMatch(/NEXT_PUBLIC_/);
  });
});
