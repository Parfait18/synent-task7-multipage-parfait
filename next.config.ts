import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components and partial prefetching are switched off on purpose:
  // Partial Prerendering serves a static shell that cannot carry a
  // per-request CSP nonce (see proxy.ts and docs/SPECIFICATION.md, section 7).
  reactCompiler: true,
  poweredByHeader: false,
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
