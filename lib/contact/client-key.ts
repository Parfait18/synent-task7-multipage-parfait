/**
 * Picks the key used to rate limit a visitor of the contact form.
 *
 * The client controls every header it sends, including `X-Forwarded-For`.
 * Its left-most entry is whatever the client wrote, so keying on it would let
 * anyone bypass the limit by sending a new value with each request. The IP is
 * therefore only read from sources a trusted party wrote:
 *
 * 1. On Vercel, `x-vercel-forwarded-for`, which the Vercel edge sets itself
 *    (any value sent by the client is overwritten).
 * 2. Behind your own reverse proxies, `X-Forwarded-For` when
 *    `TRUSTED_PROXY_HOPS` says how many proxies sit in front of the app. Each
 *    proxy appends the address it received the request from, so the client
 *    address is the entry written by the outermost trusted proxy: counting
 *    from the right, entry number `TRUSTED_PROXY_HOPS`. Entries further left
 *    came from the client and are ignored.
 * 3. Otherwise, one shared key. Every visitor then shares one budget: the
 *    limit gets stricter, but it can no longer be bypassed.
 */

export const SHARED_CLIENT_KEY = "anonymous";

const MAX_KEY_LENGTH = 64;

export type ClientKeyConfig = {
  /** True when running on Vercel (the platform sets VERCEL=1). */
  isVercel: boolean;
  /** Number of trusted reverse proxies that append to X-Forwarded-For. 0 means none is trusted. */
  trustedProxyHops: number;
};

/** Reads the configuration from environment variables, rejecting anything that is not a small whole number. */
export function readClientKeyConfig(env: Record<string, string | undefined>): ClientKeyConfig {
  const rawHops = env.TRUSTED_PROXY_HOPS?.trim();
  const hops = rawHops && /^\d{1,2}$/.test(rawHops) ? Number(rawHops) : 0;
  return { isVercel: env.VERCEL === "1", trustedProxyHops: hops };
}

function normaliseAddress(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, MAX_KEY_LENGTH) : undefined;
}

export function getClientKey(headers: Pick<Headers, "get">, config: ClientKeyConfig): string {
  if (config.isVercel) {
    // Vercel writes the client address here; take the first entry in case a list is ever sent.
    const vercelAddress = normaliseAddress(headers.get("x-vercel-forwarded-for")?.split(",")[0]);
    if (vercelAddress) return vercelAddress;
  }

  if (config.trustedProxyHops > 0) {
    const entries = (headers.get("x-forwarded-for") ?? "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
    // Fewer entries than trusted proxies means the chain is not the expected one: trust nothing.
    if (entries.length >= config.trustedProxyHops) {
      const clientAddress = normaliseAddress(entries[entries.length - config.trustedProxyHops]);
      if (clientAddress) return clientAddress;
    }
  }

  return SHARED_CLIENT_KEY;
}
