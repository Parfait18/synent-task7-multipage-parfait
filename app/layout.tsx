import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next, Zilla_Slab } from "next/font/google";
import { connection } from "next/server";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { siteUrl, studio } from "@/content/site";

import "./globals.css";

/*
 * Two families, clearly distinct. Zilla Slab's heavy slabs read like stacked
 * blocks and carry the headlines; Atkinson Hyperlegible Next was drawn for
 * legibility and carries the running text. next/font downloads both at build
 * time and serves them from this origin, so the CSP needs no font host.
 */
const zilla = Zilla_Slab({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-zilla",
  display: "swap",
});

const atkinson = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  variable: "--font-atkinson",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${studio.name}, ${studio.tagline.toLowerCase()}`,
    template: `%s | ${studio.name}`,
  },
  description: studio.description,
  applicationName: studio.name,
  authors: [{ name: "Parfait Ahouanto", url: "https://github.com/Parfait18" }],
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#e9ebe6",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // The CSP nonce is generated per request in proxy.ts. Next.js can only stamp
  // it on its inline scripts when the page renders per request, so the whole
  // site opts into dynamic rendering here (see docs/SPECIFICATION.md, section 7).
  await connection();

  return (
    <html lang="en" className={`${zilla.variable} ${atkinson.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-sm bg-kiln px-4 py-3 text-lime focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
