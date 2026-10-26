import { describe, expect, it } from "vitest";

import {
  getAnalyticsPageContext,
  sanitizeAnalyticsPage,
  sanitizeAnalyticsReferrer,
  sanitizeVercelAnalyticsEvent,
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

  it("sanitizes a Vercel pageview event without mutating the original", () => {
    const original = {
      type: "pageview" as const,
      url: "https://www.talentsync360.com/contact?intent=pilot&utm_source=linkedin&utm_medium=social",
    };

    expect(sanitizeVercelAnalyticsEvent(original)).toEqual({
      type: "pageview",
      url: "https://www.talentsync360.com/contact?utm_source=linkedin&utm_medium=social",
    });
    expect(original.url).toBe(
      "https://www.talentsync360.com/contact?intent=pilot&utm_source=linkedin&utm_medium=social",
    );
  });

  it("removes a valid contact intent when no UTM is present", () => {
    expect(
      sanitizeVercelAnalyticsEvent({
        type: "pageview",
        url: "/contact?intent=validate-role",
      }),
    ).toEqual({ type: "pageview", url: "/contact" });
  });

  it("preserves approved UTM parameters for Vercel Analytics", () => {
    expect(
      sanitizeVercelAnalyticsEvent({
        type: "pageview",
        url: "/contact?utm_source=x",
      }),
    ).toEqual({ type: "pageview", url: "/contact?utm_source=x" });
  });

  it("does not modify non-contact Vercel Analytics URLs", () => {
    const original = { type: "pageview" as const, url: "/companies?foo=bar" };
    expect(sanitizeVercelAnalyticsEvent(original)).toEqual(original);
    expect(sanitizeVercelAnalyticsEvent(original)).not.toBe(original);
  });

  it.each([
    "/contact?intent=INVALID",
    "/contact?foo=bar",
    "/contact?intent=pilot&intent=demo",
  ])("cancels invalid Vercel contact URL %s", (url) => {
    expect(sanitizeVercelAnalyticsEvent({ type: "pageview", url })).toBeNull();
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
