/**
 * Picks the value used to rate limit a visitor: the client IP address.
 *
 * `x-forwarded-for` is only trustworthy behind a proxy that overwrites it
 * (Vercel, a load balancer, nginx). Its first entry is the original client.
 * Without such a proxy a client can forge it; the limit then still slows
 * down naive scripts but is not a guarantee. See docs/SPECIFICATION.md.
 */
export function getClientKey(headers: Pick<Headers, "get">): string {
  const forwardedFor = headers.get("x-forwarded-for");
  const firstForwarded = forwardedFor?.split(",")[0]?.trim();
  if (firstForwarded) return firstForwarded.slice(0, 64);

  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 64);

  return "unknown-client";
}
