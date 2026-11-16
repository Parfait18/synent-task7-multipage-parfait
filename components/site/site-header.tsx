import { Logo } from "@/components/site/logo";
import { SiteNav } from "@/components/site/site-nav";

/** Shared header. A Server Component: only the navigation inside it runs on the client. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-lime/95 backdrop-blur-sm">
      <div className="shell flex h-18 items-center justify-between gap-4">
        <Logo />
        <SiteNav />
      </div>
    </header>
  );
}
