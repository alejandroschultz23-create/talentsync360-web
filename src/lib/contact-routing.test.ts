import { describe, expect, it } from "vitest";

import {
  EVIDENCE_REVIEW_PATH,
  getContactRedirect,
  isAllowedLegacyContactType,
} from "./contact-routing";

describe("contact routing", () => {
  it("routes the retired talent contact flow to Evidence Review", () => {
    expect(getContactRedirect("talent")).toBe(EVIDENCE_REVIEW_PATH);
    expect(getContactRedirect("b2b")).toBeNull();
    expect(getContactRedirect("general")).toBeNull();
    expect(getContactRedirect(undefined)).toBeNull();
  });

  it("keeps the legacy email endpoint limited to non-talent contact types", () => {
    expect(isAllowedLegacyContactType("b2b")).toBe(true);
    expect(isAllowedLegacyContactType("general")).toBe(true);
    expect(isAllowedLegacyContactType("white-label")).toBe(true);
    expect(isAllowedLegacyContactType("runway")).toBe(true);
    expect(isAllowedLegacyContactType("talent")).toBe(false);
  });
});
