/**
 * A sliding-window rate limiter kept in memory.
 *
 * Why in memory: the site has no database and the contact form is low
 * traffic. The trade-off is documented in docs/SPECIFICATION.md: counters
 * reset when the server restarts and are not shared between instances, so a
 * deployment on several instances should move this to a shared store (Redis,
 * Upstash, a platform firewall rule).
 */
export type RateLimitResult =
  | { isAllowed: true; remaining: number }
  | { isAllowed: false; retryAfterSeconds: number };

type RateLimiterOptions = {
  /** Requests allowed per key within the window. */
  limit: number;
  windowMs: number;
  /** Injected clock so tests can move time forward. */
  now?: () => number;
  /** Upper bound on tracked keys, so a flood of addresses cannot exhaust memory. */
  maxKeys?: number;
};

export class SlidingWindowRateLimiter {
  private readonly hits = new Map<string, number[]>();
  private readonly limit: number;
  private readonly windowMs: number;
  private readonly now: () => number;
  private readonly maxKeys: number;

  constructor({ limit, windowMs, now = Date.now, maxKeys = 10_000 }: RateLimiterOptions) {
    if (!Number.isInteger(limit) || limit < 1) throw new RangeError("limit must be a positive integer");
    if (windowMs <= 0) throw new RangeError("windowMs must be positive");
    this.limit = limit;
    this.windowMs = windowMs;
    this.now = now;
    this.maxKeys = maxKeys;
  }

  /** Records an attempt for `key` and says whether it may proceed. */
  consume(key: string): RateLimitResult {
    const currentTime = this.now();
    const windowStart = currentTime - this.windowMs;
    const recentHits = (this.hits.get(key) ?? []).filter((time) => time > windowStart);

    if (recentHits.length >= this.limit) {
      this.hits.set(key, recentHits);
      const oldestHit = recentHits[0];
      return {
        isAllowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((oldestHit + this.windowMs - currentTime) / 1000)),
      };
    }

    recentHits.push(currentTime);
    this.hits.set(key, recentHits);
    this.evictIfFull(windowStart);
    return { isAllowed: true, remaining: this.limit - recentHits.length };
  }

  /** Number of keys currently tracked (exposed for tests and monitoring). */
  get size(): number {
    return this.hits.size;
  }

  private evictIfFull(windowStart: number): void {
    if (this.hits.size <= this.maxKeys) return;
    // First drop keys whose hits have all expired.
    for (const [key, times] of this.hits) {
      if (times.every((time) => time <= windowStart)) this.hits.delete(key);
    }
    // Still too many: drop the oldest entries (Map keeps insertion order).
    for (const key of this.hits.keys()) {
      if (this.hits.size <= this.maxKeys) break;
      this.hits.delete(key);
    }
  }
}
