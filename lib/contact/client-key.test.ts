import { describe, expect, it } from "vitest";

import { getClientKey } from "@/lib/contact/client-key";

describe("getClientKey", () => {
  it("should use the first address of x-forwarded-for when a proxy sets it", () => {
    expect(getClientKey(new Headers({ "x-forwarded-for": "198.51.100.4, 10.0.0.1" }))).toBe("198.51.100.4");
  });

  it("should fall back to x-real-ip, then to a shared key", () => {
    expect(getClientKey(new Headers({ "x-real-ip": "198.51.100.9" }))).toBe("198.51.100.9");
    expect(getClientKey(new Headers())).toBe("unknown-client");
  });

  it("should cap the key length so a forged header cannot grow memory", () => {
    expect(getClientKey(new Headers({ "x-forwarded-for": "x".repeat(500) }))).toHaveLength(64);
  });
});
