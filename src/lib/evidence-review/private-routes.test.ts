import { describe, expect, it } from "vitest";

import {
  isPrivateEvidenceReviewPath,
  isPrivateEvidenceReviewUrl,
} from "./private-routes";
import { PRIVATE_RESPONSE_HEADERS } from "./server/private-http";
import nextConfig from "../../../next.config";
import sitemap from "../../app/sitemap";

describe("Private route classification and analytics exclusion", () => {
  it("classifies private access and profile paths as private", () => {
    const sampleToken = "a".repeat(43);
    expect(
      isPrivateEvidenceReviewPath(`/talents/evidence-review/access/${sampleToken}`),
    ).toBe(true);
    expect(isPrivateEvidenceReviewPath("/talents/evidence-review/profile")).toBe(
      true,
    );
    expect(
      isPrivateEvidenceReviewPath("/talents/evidence-review/profile/confirm"),
    ).toBe(true);
    expect(
      isPrivateEvidenceReviewPath("/talents/evidence-review/profile/correction"),
    ).toBe(true);
    expect(
      isPrivateEvidenceReviewPath("/talents/evidence-review/profile/opt-in"),
    ).toBe(true);
    expect(
      isPrivateEvidenceReviewPath("/talents/evidence-review/profile/opt-in/offer"),
    ).toBe(true);
    expect(
      isPrivateEvidenceReviewPath("/talents/evidence-review/profile/opt-in/accept"),
    ).toBe(true);
    expect(
      isPrivateEvidenceReviewPath("/talents/evidence-review/profile/opt-in/decline"),
    ).toBe(true);
    expect(
      isPrivateEvidenceReviewPath("/talents/evidence-review/profile?lang=es"),
    ).toBe(true);
  });

  it("classifies full URLs with private paths as private", () => {
    expect(
      isPrivateEvidenceReviewUrl(
        "https://www.talentsync360.com/talents/evidence-review/access/xyz",
      ),
    ).toBe(true);
    expect(
      isPrivateEvidenceReviewUrl(
        "https://www.talentsync360.com/talents/evidence-review/profile",
      ),
    ).toBe(true);
    expect(
      isPrivateEvidenceReviewUrl(
        "https://www.talentsync360.com/talents/evidence-review/profile/confirm",
      ),
    ).toBe(true);
    expect(
      isPrivateEvidenceReviewUrl(
        "https://www.talentsync360.com/talents/evidence-review/profile/opt-in?lang=en",
      ),
    ).toBe(true);
  });

  it("keeps every private profile and opt-in path out of the sitemap", () => {
    expect(
      sitemap().some(({ url }) =>
        url.includes("/talents/evidence-review/profile"),
      ),
    ).toBe(false);
  });

  it("ensures public Phase B routes remain non-private for acquisition analytics", () => {
    expect(isPrivateEvidenceReviewPath("/talents/evidence-review")).toBe(false);
    expect(isPrivateEvidenceReviewPath("/talents/evidence-review/apply")).toBe(
      false,
    );
    expect(isPrivateEvidenceReviewPath("/talents/evidence-review/submitted")).toBe(
      false,
    );
    expect(isPrivateEvidenceReviewPath("/companies")).toBe(false);
    expect(isPrivateEvidenceReviewPath("/")).toBe(false);
    expect(
      isPrivateEvidenceReviewUrl(
        "https://www.talentsync360.com/talents/evidence-review",
      ),
    ).toBe(false);
    expect(
      isPrivateEvidenceReviewUrl(
        "https://www.talentsync360.com/talents/evidence-review/apply",
      ),
    ).toBe(false);
  });

  it("handles malformed URLs safely without throwing", () => {
    expect(isPrivateEvidenceReviewUrl("not-a-url")).toBe(false);
    expect(isPrivateEvidenceReviewUrl("")).toBe(false);
  });

  it("exposes expected private security response headers", () => {
    expect(PRIVATE_RESPONSE_HEADERS["Cache-Control"]).toBe("private, no-store");
    expect(PRIVATE_RESPONSE_HEADERS["Referrer-Policy"]).toBe("no-referrer");
    expect(PRIVATE_RESPONSE_HEADERS["X-Robots-Tag"]).toBe(
      "noindex, nofollow, noarchive",
    );
  });

  it("configures next.config.ts headers for both exact profile and nested routes", async () => {
    if (typeof nextConfig.headers !== "function") {
      throw new Error("nextConfig.headers must be defined");
    }
    const headersList = await nextConfig.headers();
    const accessRule = headersList.find(
      (rule) => rule.source === "/talents/evidence-review/access/:path*",
    );
    const profileExactRule = headersList.find(
      (rule) => rule.source === "/talents/evidence-review/profile",
    );
    const profileNestedRule = headersList.find(
      (rule) => rule.source === "/talents/evidence-review/profile/:path*",
    );

    expect(accessRule).toBeDefined();
    expect(profileExactRule).toBeDefined();
    expect(profileNestedRule).toBeDefined();

    for (const rule of [accessRule, profileExactRule, profileNestedRule]) {
      expect(rule?.headers).toEqual(
        expect.arrayContaining([
          { key: "Cache-Control", value: "private, no-store" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ]),
      );
    }
  });
});
