import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Opening of the inner pages: the page's title and a short lede. The home
 * page has its own hero; the other pages share this quieter opening so the
 * site feels consistent without every page shouting.
 */
export function PageIntro({
  title,
  lede,
  children,
  className,
}: {
  title: string;
  lede: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby="page-title" className={cn("border-b border-border", className)}>
      <div className="shell grid gap-8 pt-14 pb-12 md:pt-20 md:pb-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <h1
            id="page-title"
            className="max-w-[16ch] text-[clamp(2.6rem,6.5vw,4.75rem)] leading-[0.98] font-bold tracking-[-0.015em]"
          >
            {title}
          </h1>
          <p className="measure mt-6 text-[1.2rem] leading-relaxed text-dust">{lede}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
