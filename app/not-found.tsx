import type { Metadata } from "next";
import Link from "next/link";

import { Claustra } from "@/components/art/claustra";
import { CtaLink } from "@/components/site/cta-link";
import { mainNav } from "@/content/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/** Custom 404: a wall with no door, and the four ways back into the site. */
export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title">
      <div className="shell grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-20">
        <div>
          <p className="font-display text-[1.25rem] font-semibold text-laterite">Error 404</p>
          <h1
            id="not-found-title"
            className="mt-3 text-[clamp(2.4rem,6vw,4.4rem)] leading-[1.02] font-bold tracking-[-0.015em]"
          >
            This wall has no door.
          </h1>
          <p className="measure mt-6 text-[1.15rem] leading-relaxed text-dust">
            The page you asked for does not exist, or it moved. Check the address, or take one of
            the ways back in below.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <CtaLink href="/">Back to the home page</CtaLink>
          </div>
          <nav aria-label="Site pages" className="mt-10">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {mainNav
                .filter((item) => item.href !== "/")
                .map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-link font-semibold">
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        </div>
        <Claustra
          id="not-found-claustra"
          columns={4}
          courses={4}
          hasDepth
          className="block w-full max-w-[18rem] sm:max-w-sm lg:max-w-none"
        />
      </div>
    </section>
  );
}
