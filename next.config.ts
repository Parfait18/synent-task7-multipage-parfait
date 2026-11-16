import type { NextConfig } from "next";

/**
 * Security headers that are the same on every response. The
 * Content-Security-Policy is not here: it carries a per-request nonce and is
 * set in proxy.ts.
 */
const securityHeaders = [
  // Two years of HTTPS only, subdomains included, eligible for browser preload lists.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Never guess a MIME type: a file served as text stays text.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Legacy twin of CSP frame-ancestors 'none', for older browsers.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site needs none of these powerful features; deny them to any embedded content too.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
] as const;

const nextConfig: NextConfig = {
  // Cache Components and partial prefetching are switched off on purpose:
  // Partial Prerendering serves a static shell that cannot carry a
  // per-request CSP nonce (see proxy.ts and docs/SPECIFICATION.md, section 7).
  reactCompiler: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: [...securityHeaders] }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
