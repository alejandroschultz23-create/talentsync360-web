import { describe, expect, it } from "vitest";

import {
  getAnalyticsPageContext,
  sanitizeAnalyticsPage,
  sanitizeAnalyticsReferrer,
} from "./analytics-url";

describe("contact analytics URL policy", () => {
  it.each([
    "/contact",
    "/contact?intent=pilot",
    "/contact?utm_source=x",
    "/contact?intent=pilot&utm_source=x",
    "/contact?utm_source=x&utm_medium=email&utm_campaign=test",
  ])("allows %s", (value) => {
    expect(sanitizeAnalyticsPage(value)).not.toBeNull();
  });

  it.each([
    "/contact?intent=INVALID",
    "/contact?intent=pilot&intent=demo",
    "/contact?foo=bar",
    "/contact?gclid=123",
    "/contact?fbclid=123",
    "/contact?gtm_debug=x",
    "/contact?utm_source=x&utm_source=y",
    "/contact?utm_source=bad value",
    "/contact#fragment",
  ])("blocks %s", (value) => {
    expect(sanitizeAnalyticsPage(value)).toBeNull();
  });

  it("removes intent while preserving approved UTM attribution", () => {
    expect(
      sanitizeAnalyticsPage(
        "https://www.talentsync360.com/contact?intent=validate-role&utm_source=x&utm_medium=discovery",
      ),
    ).toBe(
      "https://www.talentsync360.com/contact?utm_source=x&utm_medium=discovery",
    );
  });

  it("does not widen the policy to other routes", () => {
    expect(sanitizeAnalyticsPage("/companies?foo=bar")).toBe("/companies?foo=bar");
  });

  it("sanitizes an internal contact referrer and preserves external referrers", () => {
    expect(
      sanitizeAnalyticsReferrer(
        "https://www.talentsync360.com/contact?intent=pilot&utm_source=x",
        "https://www.talentsync360.com",
      ),
    ).toBe("https://www.talentsync360.com/contact?utm_source=x");
    expect(
      sanitizeAnalyticsReferrer(
        "https://search.example.test/?q=talentsync360",
        "https://www.talentsync360.com",
      ),
    ).toBe("https://search.example.test/?q=talentsync360");
  });

  it("does not let an invalid internal contact referrer block the destination", () => {
    expect(
      sanitizeAnalyticsReferrer(
        "https://www.talentsync360.com/contact?gclid=123",
        "https://www.talentsync360.com",
      ),
    ).toBeUndefined();
  });

  it("keeps intent out of page_location while keeping it functional in the URL", () => {
    const originalWindow = globalThis.window;
    const originalDocument = globalThis.document;
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        location: {
          origin: "https://www.talentsync360.com",
          href: "https://www.talentsync360.com/contact?intent=pilot&utm_source=x",
        },
      },
    });
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: { referrer: "" },
    });

    expect(getAnalyticsPageContext()).toMatchObject({
      page_path: "/contact?utm_source=x",
      page_location: "https://www.talentsync360.com/contact?utm_source=x",
    });

    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: originalWindow,
    });
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: originalDocument,
    });
  });
});
