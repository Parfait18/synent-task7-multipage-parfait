import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const variants = {
  /** Laterite block on light surfaces: the main action of a page. */
  primary: "bg-laterite text-lime hover:bg-laterite-deep",
  /** Outlined, for the secondary action next to a primary one. */
  secondary: "border-2 border-kiln text-kiln hover:bg-kiln hover:text-lime",
  /** Harmattan block, for the main action on dark or laterite surfaces. */
  onDark: "bg-harmattan text-kiln hover:bg-lime",
} as const;

type CtaLinkProps = ComponentProps<typeof Link> & { variant?: keyof typeof variants };

/**
 * A link styled as a button. Navigation stays a real link (right-click,
 * open in a new tab, crawlable) instead of a button with a click handler.
 */
export function CtaLink({ variant = "primary", className, ...props }: CtaLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-sm px-6 text-[1.02rem] font-semibold transition-colors",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
