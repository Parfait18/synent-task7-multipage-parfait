"use client";

import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { mainNav, studio } from "@/content/site";
import { isActivePath } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Primary navigation. This is a Client Component only because the active
 * link depends on the current pathname and the mobile menu has open state.
 *
 * Desktop (md and up): an inline list. Mobile: a hamburger that opens a
 * shadcn Sheet (Radix Dialog), which brings the focus trap, Escape to close,
 * focus return to the trigger and `aria-expanded` on the trigger for free.
 */
export function SiteNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav aria-label="Main" className="hidden md:block">
        <ul className="flex items-center gap-1">
          {mainNav.map((item) => {
            const isActive = isActivePath(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group relative flex flex-col items-center rounded-sm px-3.5 py-2 text-[0.98rem] font-medium transition-colors",
                    isActive ? "text-laterite" : "text-kiln hover:text-laterite",
                  )}
                >
                  {item.label}
                  {/* The active page is marked by a small block laid under its label. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-1 h-1 w-5 bg-laterite transition-transform duration-200",
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50",
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger
          className="inline-flex h-11 items-center gap-2 rounded-sm border border-joint px-3.5 text-[0.95rem] font-medium md:hidden"
          aria-label="Open menu"
        >
          <MenuIcon className="size-5" aria-hidden="true" />
          Menu
        </SheetTrigger>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="on-dark w-[min(22rem,88vw)] gap-0 border-l-0 bg-kiln text-lime"
        >
          {/* Own close button: the default ghost style is built for light surfaces. */}
          <SheetClose className="absolute top-4 right-4 inline-flex size-11 items-center justify-center rounded-sm text-lime hover:bg-white/10">
            <XIcon className="size-5" aria-hidden="true" />
            <span className="sr-only">Close menu</span>
          </SheetClose>
          <SheetHeader className="px-6 pt-6 pb-2">
            <SheetTitle className="font-display text-xl text-lime">{studio.name}</SheetTitle>
            <SheetDescription className="text-[#c8b9ad]">Site navigation</SheetDescription>
          </SheetHeader>
          <nav aria-label="Main" className="px-3 pt-4">
            <ul className="flex flex-col">
              {mainNav.map((item) => {
                const isActive = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      // Following a link closes the menu, even when it points to the current page.
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-sm px-3 py-3.5 font-display text-[1.75rem] leading-tight font-semibold",
                        isActive ? "text-harmattan" : "text-lime hover:text-harmattan",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn("size-2.5 shrink-0", isActive ? "bg-harmattan" : "bg-transparent")}
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="mt-auto border-t border-white/15 px-6 py-6 text-[0.95rem] text-[#c8b9ad]">
            <p>{studio.address.street}, {studio.address.city}</p>
            <p>
              <a href={`tel:${studio.phone.href}`} className="text-link text-lime">
                {studio.phone.display}
              </a>
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
