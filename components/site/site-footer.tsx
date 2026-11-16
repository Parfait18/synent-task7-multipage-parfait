import Link from "next/link";

import { Claustra } from "@/components/art/claustra";
import { mainNav, studio } from "@/content/site";

/** Shared footer: the same on every page, including the fictional-business notice. */
export function SiteFooter() {
  return (
    <footer className="on-dark mt-auto bg-kiln text-lime">
      {/* A strip of claustra marks the top of the footer like a ventilation course. */}
      <Claustra
        id="footer-claustra"
        columns={60}
        courses={1}
        preserveAspectRatio="xMinYMid slice"
        className="block h-6 w-full"
        lightClassName="fill-kiln"
        blockClassName="fill-laterite"
      />
      <div className="shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-bold">{studio.name}</p>
          <p className="mt-2 max-w-sm text-[#c8b9ad]">{studio.tagline}.</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-display text-lg font-semibold text-harmattan">Pages</h2>
          <ul className="mt-3 space-y-1.5">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-lg font-semibold text-harmattan">Studio</h2>
          <address className="mt-3 space-y-1.5 not-italic">
            <p>
              {studio.address.street}, {studio.address.city}, {studio.address.country}
            </p>
            <p>
              <a href={`tel:${studio.phone.href}`} className="text-link">
                {studio.phone.display}
              </a>
            </p>
            <p>
              <a href={`mailto:${studio.email}`} className="text-link break-all">
                {studio.email}
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="shell flex flex-col gap-2 py-6 text-[0.9rem] text-[#c8b9ad] md:flex-row md:justify-between">
          <p>
            {studio.name} is a fictional business, invented for a web development exercise. Projects,
            prices and contact details are illustrative.
          </p>
          <p className="shrink-0">
            Site by{" "}
            <a href="https://github.com/Parfait18" className="text-link text-lime">
              Parfait Ahouanto
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
