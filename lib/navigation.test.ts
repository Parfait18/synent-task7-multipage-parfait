import { describe, expect, it } from "vitest";

import { isActivePath } from "@/lib/navigation";

describe("isActivePath", () => {
  it("should match the home link only on the home page", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/about", "/")).toBe(false);
  });

  it("should match a section and its sub-pages, with or without a trailing slash", () => {
    expect(isActivePath("/services", "/services")).toBe(true);
    expect(isActivePath("/services/", "/services")).toBe(true);
    expect(isActivePath("/services/retrofit", "/services")).toBe(true);
  });

  it("should not match a different page that shares a prefix", () => {
    expect(isActivePath("/servicesxyz", "/services")).toBe(false);
    expect(isActivePath(null, "/services")).toBe(false);
  });
});
