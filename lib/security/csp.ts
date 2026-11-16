/**
 * Content-Security-Policy builder.
 *
 * Scripts: only this origin and scripts carrying the per-request nonce.
 * 'strict-dynamic' lets those trusted scripts load the chunks they need, and
 * makes browsers ignore host allow-lists, so an injected <script src> from
 * anywhere is refused.
 *
 * Styles: style elements need the nonce, but style *attributes* are allowed
 * ('unsafe-inline' in style-src-attr only). Radix UI positions the Select
 * menu and locks scrolling behind the Sheet with inline style attributes, and
 * next/font emits some as well. Inline style attributes cannot execute code;
 * the residual risk (CSS-based data exfiltration through injected markup) is
 * low on a site without secrets in the DOM. See docs/SPECIFICATION.md §7.
 */
export function buildContentSecurityPolicy({
  nonce,
  isDevelopment,
  isHttps,
}: {
  nonce: string;
  isDevelopment: boolean;
  /** Whether the site is served over HTTPS (true in any real deployment). */
  isHttps: boolean;
}): string {
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    // React needs eval in development only, to rebuild server error stacks.
    "script-src": ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'", ...(isDevelopment ? ["'unsafe-eval'"] : [])],
    // Development injects hot-reload styles without a nonce (as the Next.js guide notes).
    "style-src": ["'self'", isDevelopment ? "'unsafe-inline'" : `'nonce-${nonce}'`],
    "style-src-attr": ["'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:"],
    "font-src": ["'self'"],
    // Development needs a WebSocket for hot reload.
    "connect-src": ["'self'", ...(isDevelopment ? ["ws:"] : [])],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    "manifest-src": ["'self'"],
    "worker-src": ["'self'"],
  };

  const policy = Object.entries(directives).map(([name, values]) => `${name} ${values.join(" ")}`);
  // Only meaningful over HTTPS; on plain-HTTP localhost it would break `next start`.
  if (isHttps) policy.push("upgrade-insecure-requests");
  return policy.join("; ");
}

/** A fresh, unguessable nonce: 128 random bits, base64 encoded. */
export function createNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}
