import Link from "next/link";

import { ClaustraBlock } from "@/components/art/claustra";
import { studio } from "@/content/site";
import { cn } from "@/lib/utils";

/** The mark is a single claustra block: the unit everything else is built from. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5 rounded-sm py-1", className)}
    >
      <ClaustraBlock className="size-8 shrink-0 text-laterite" />
      <span className="font-display text-[1.375rem] leading-none font-bold tracking-tight">
        {studio.name}
      </span>
      <span className="sr-only">, home page</span>
    </Link>
  );
}
