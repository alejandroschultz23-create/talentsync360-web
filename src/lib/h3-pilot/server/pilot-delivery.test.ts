import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { isPrivateEvidenceReviewPath } from "@/lib/evidence-review/private-routes";
import nextConfig from "../../../../next.config";

const read = (relative: string) => readFileSync(join(process.cwd(), relative), "utf8");

describe("V1_192 pilot invitation delivery preparation", () => {
  it("classifies the pilot entry wrapper as a private route", () => {
    expect(isPrivateEvidenceReviewPath("/talents/evidence-review/enter")).toBe(true);
    expect(isPrivateEvidenceReviewPath("/talents/evidence-review/enter/")).toBe(true);
    // Public acquisition routes stay non-private.
    expect(isPrivateEvidenceReviewPath("/talents/evidence-review")).toBe(false);
    expect(isPrivateEvidenceReviewPath("/talents/evidence-review/apply")).toBe(false);
  });

  it("sends private no-store/no-referrer/noindex headers for the entry wrapper", async () => {
    if (typeof nextConfig.headers !== "function") {
      throw new Error("nextConfig.headers must be defined");
    }
    const rules = await nextConfig.headers();
    const rule = rules.find((candidate) => candidate.source === "/talents/evidence-review/enter");
    expect(rule).toBeDefined();
    expect(rule?.headers).toEqual(
      expect.arrayContaining([
        { key: "Cache-Control", value: "private, no-store" },
        { key: "Referrer-Policy", value: "no-referrer" },
        { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
      ]),
    );
  });

  it("entry route uses the durable single-use store and never reads a URL token", () => {
    const route = read("src/app/api/h3-pilot/enter/route.ts");
    expect(route).toContain("createSupabaseInvitationUseStore");
    expect(route).toContain("getSupabaseServerClient");
    expect(route).toContain("setPilotSessionCookie");
    expect(route).not.toContain("searchParams");
    expect(route).not.toContain("NEXT_PUBLIC_");
  });

  it("entry page is noindex and defers to the client wrapper", () => {
    const page = read("src/app/talents/evidence-review/enter/page.tsx");
    expect(page).toContain("PilotEnterClient");
    expect(page).toContain("index: false");
    expect(page).toContain("nocache: true");
  });

  it("client wrapper reads the token from the fragment, posts once, and clears it", () => {
    const client = read("src/app/talents/evidence-review/enter/PilotEnterClient.tsx");
    expect(client).toContain("window.location.hash");
    expect(client).toContain("/api/h3-pilot/enter");
    expect(client).toContain("history.replaceState");
    expect(client).not.toContain("searchParams");
    expect(client).not.toContain("NEXT_PUBLIC_");
    expect(client).not.toContain("localStorage");
    expect(client).not.toContain("H3_PILOT_INVITATION_SECRET");
    expect(client).not.toContain("SUPABASE_SECRET_KEY");
  });
});
