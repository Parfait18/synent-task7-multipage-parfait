import { describe, expect, it } from "vitest";

import { buildContentSecurityPolicy, createNonce } from "@/lib/security/csp";

function directives(policy: string) {
  return Object.fromEntries(
    policy.split("; ").map((directive) => {
      const [name, ...values] = directive.split(" ");
      return [name, values];
    }),
  );
}

describe("buildContentSecurityPolicy", () => {
  const production = directives(buildContentSecurityPolicy({ nonce: "abc", isDevelopment: false, isHttps: true }));

  it("should allow scripts only from this origin and with the request nonce in production", () => {
    expect(production["script-src"]).toEqual(["'self'", "'nonce-abc'", "'strict-dynamic'"]);
    expect(production["script-src"]).not.toContain("'unsafe-inline'");
    expect(production["script-src"]).not.toContain("'unsafe-eval'");
  });

  it("should require the nonce for style elements in production", () => {
    expect(production["style-src"]).toEqual(["'self'", "'nonce-abc'"]);
  });

  it("should forbid framing, plugins and foreign form targets", () => {
    expect(production["frame-ancestors"]).toEqual(["'none'"]);
    expect(production["object-src"]).toEqual(["'none'"]);
    expect(production["form-action"]).toEqual(["'self'"]);
    expect(production["base-uri"]).toEqual(["'self'"]);
  });

  it("should upgrade insecure requests only when served over HTTPS", () => {
    expect(production).toHaveProperty("upgrade-insecure-requests");
    const overHttp = buildContentSecurityPolicy({ nonce: "abc", isDevelopment: false, isHttps: false });
    expect(overHttp).not.toContain("upgrade-insecure-requests");
  });

  it("should relax only what hot reload needs in development", () => {
    const development = directives(buildContentSecurityPolicy({ nonce: "abc", isDevelopment: true, isHttps: false }));
    expect(development["script-src"]).toContain("'unsafe-eval'");
    expect(development["connect-src"]).toContain("ws:");
  });
});

describe("createNonce", () => {
  it("should return a different 128-bit base64 value on every call", () => {
    const first = createNonce();
    expect(first).toMatch(/^[A-Za-z0-9+/]{22}==$/);
    expect(createNonce()).not.toBe(first);
  });
});
