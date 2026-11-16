import { NextResponse, type NextRequest } from "next/server";

import { buildContentSecurityPolicy, createNonce } from "@/lib/security/csp";

/**
 * Runs before every page request and attaches a Content-Security-Policy with
 * a fresh nonce. Next.js reads the nonce from the request's CSP header while
 * rendering and stamps it on its own inline scripts, which is why the policy
 * is set on the request as well as on the response.
 *
 * The static security headers (HSTS, frame, referrer, permissions…) live in
 * next.config.ts because they do not change per request.
 */
export function proxy(request: NextRequest) {
  const nonce = createNonce();
  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  const contentSecurityPolicy = buildContentSecurityPolicy({
    nonce,
    isDevelopment: process.env.NODE_ENV === "development",
    isHttps: (forwardedProtocol ?? request.nextUrl.protocol.replace(":", "")) === "https",
  });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", contentSecurityPolicy);
  return response;
}

export const config = {
  matcher: [
    {
      // Pages only: static files, images and metadata files need no nonce.
      source: "/((?!_next/static|_next/image|icon.svg|favicon.ico|robots.txt|sitemap.xml).*)",
      // Link prefetches are not rendered as documents, so they skip the proxy.
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
