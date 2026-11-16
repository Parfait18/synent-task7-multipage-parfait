import { describe, expect, it } from "vitest";

import { getClientKey, readClientKeyConfig, SHARED_CLIENT_KEY } from "@/lib/contact/client-key";

const noTrustedSource = { isVercel: false, trustedProxyHops: 0 };

describe("getClientKey", () => {
  it("should ignore X-Forwarded-For entirely when no trusted proxy is configured", () => {
    const headers = new Headers({ "x-forwarded-for": "198.51.100.4", "x-real-ip": "198.51.100.4" });
    expect(getClientKey(headers, noTrustedSource)).toBe(SHARED_CLIENT_KEY);
  });

  it("should ignore a spoofed first entry and use the address added by the trusted proxy", () => {
    // The client sent "1.2.3.4"; the single trusted proxy appended the real peer address.
    const headers = new Headers({ "x-forwarded-for": "1.2.3.4, 203.0.113.7" });
    expect(getClientKey(headers, { isVercel: false, trustedProxyHops: 1 })).toBe("203.0.113.7");
  });

  it("should give the same key whatever the client puts in front when the proxy is trusted", () => {
    const config = { isVercel: false, trustedProxyHops: 1 };
    const first = getClientKey(new Headers({ "x-forwarded-for": "10.0.0.1, 203.0.113.7" }), config);
    const second = getClientKey(new Headers({ "x-forwarded-for": "10.0.0.2, 203.0.113.7" }), config);
    expect(first).toBe(second);
  });

  it("should skip the hops added by inner proxies when several proxies are trusted", () => {
    // The CDN appends the client (203.0.113.7), then the load balancer appends the CDN (192.0.2.10).
    const headers = new Headers({ "x-forwarded-for": "6.6.6.6, 203.0.113.7, 192.0.2.10" });
    expect(getClientKey(headers, { isVercel: false, trustedProxyHops: 2 })).toBe("203.0.113.7");
  });

  it("should fall back to the shared key when the chain is shorter than the trusted hops", () => {
    const headers = new Headers({ "x-forwarded-for": "203.0.113.7" });
    expect(getClientKey(headers, { isVercel: false, trustedProxyHops: 2 })).toBe(SHARED_CLIENT_KEY);
    expect(getClientKey(new Headers(), { isVercel: false, trustedProxyHops: 1 })).toBe(SHARED_CLIENT_KEY);
  });

  it("should use the address written by the Vercel edge on Vercel and ignore X-Forwarded-For", () => {
    const headers = new Headers({
      "x-vercel-forwarded-for": "203.0.113.7",
      "x-forwarded-for": "1.2.3.4",
    });
    expect(getClientKey(headers, { isVercel: true, trustedProxyHops: 0 })).toBe("203.0.113.7");
  });

  it("should fall back to the shared key on Vercel when the platform header is missing", () => {
    const headers = new Headers({ "x-forwarded-for": "1.2.3.4" });
    expect(getClientKey(headers, { isVercel: true, trustedProxyHops: 0 })).toBe(SHARED_CLIENT_KEY);
  });

  it("should cap the key length so an oversized header cannot grow memory", () => {
    const headers = new Headers({ "x-forwarded-for": `1.2.3.4, ${"x".repeat(500)}` });
    expect(getClientKey(headers, { isVercel: false, trustedProxyHops: 1 })).toHaveLength(64);
  });
});

describe("readClientKeyConfig", () => {
  it("should read Vercel and a whole number of trusted hops from the environment", () => {
    expect(readClientKeyConfig({ VERCEL: "1", TRUSTED_PROXY_HOPS: "2" })).toEqual({
      isVercel: true,
      trustedProxyHops: 2,
    });
  });

  it("should trust no proxy when the setting is missing or not a small whole number", () => {
    for (const value of [undefined, "", "-1", "1.5", "one", "999"]) {
      expect(readClientKeyConfig({ TRUSTED_PROXY_HOPS: value }).trustedProxyHops).toBe(0);
    }
    expect(readClientKeyConfig({}).isVercel).toBe(false);
  });
});
