import { describe, expect, it } from "vitest";

import { SlidingWindowRateLimiter } from "@/lib/contact/rate-limiter";

function createLimiter(limit = 3, windowMs = 60_000, maxKeys?: number) {
  let currentTime = 1_000_000;
  const limiter = new SlidingWindowRateLimiter({ limit, windowMs, now: () => currentTime, maxKeys });
  return { limiter, advance: (ms: number) => (currentTime += ms) };
}

describe("SlidingWindowRateLimiter", () => {
  it("should allow requests up to the limit and count down the remaining ones", () => {
    const { limiter } = createLimiter(3);
    expect(limiter.consume("a")).toEqual({ isAllowed: true, remaining: 2 });
    expect(limiter.consume("a")).toEqual({ isAllowed: true, remaining: 1 });
    expect(limiter.consume("a")).toEqual({ isAllowed: true, remaining: 0 });
  });

  it("should block the request after the limit and say when to retry", () => {
    const { limiter, advance } = createLimiter(2, 60_000);
    limiter.consume("a");
    advance(10_000);
    limiter.consume("a");
    expect(limiter.consume("a")).toEqual({ isAllowed: false, retryAfterSeconds: 50 });
  });

  it("should allow again once the oldest request leaves the window", () => {
    const { limiter, advance } = createLimiter(2, 60_000);
    limiter.consume("a");
    advance(10_000);
    limiter.consume("a");
    advance(50_001);
    expect(limiter.consume("a").isAllowed).toBe(true);
  });

  it("should count each key separately", () => {
    const { limiter } = createLimiter(1);
    expect(limiter.consume("a").isAllowed).toBe(true);
    expect(limiter.consume("b").isAllowed).toBe(true);
    expect(limiter.consume("a").isAllowed).toBe(false);
  });

  it("should never track more keys than its maximum", () => {
    const { limiter } = createLimiter(5, 60_000, 3);
    for (const key of ["a", "b", "c", "d", "e"]) limiter.consume(key);
    expect(limiter.size).toBeLessThanOrEqual(3);
  });

  it("should refuse an invalid configuration", () => {
    expect(() => new SlidingWindowRateLimiter({ limit: 0, windowMs: 1000 })).toThrow(RangeError);
    expect(() => new SlidingWindowRateLimiter({ limit: 1, windowMs: 0 })).toThrow(RangeError);
  });
});
