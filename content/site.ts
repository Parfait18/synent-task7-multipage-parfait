/**
 * Facts about the studio that appear on more than one page.
 * Keeping them in one place guarantees the header, footer, contact page and
 * metadata never disagree. Atelier Barre is fictional: the address and phone
 * number are illustrative and must not be dialled.
 */
export const studio = {
  name: "Atelier Barre",
  tagline: "Architecture and building in compressed earth, Cotonou",
  description:
    "Atelier Barre designs and builds houses, shops and schools in southern Benin with compressed earth blocks made from local laterite. Cooler rooms, lower bills, walls that age well.",
  founded: 2016,
  address: {
    street: "Rue 12.054, Haie Vive",
    city: "Cotonou",
    country: "Benin",
  },
  yard: "Block yard and press: Ouèdo, Abomey-Calavi",
  phone: { display: "+229 01 97 00 00 00", href: "+2290197000000" },
  email: "studio@atelier-barre.example",
  hours: [
    { days: "Monday to Friday", time: "8:00 to 17:30" },
    { days: "Saturday", time: "9:00 to 13:00, block yard only" },
  ],
} as const;

export type NavItem = {
  href: "/" | "/about" | "/services" | "/contact";
  label: string;
};

export const mainNav: readonly NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

/** Base URL used for canonical links and Open Graph. Overridable per environment. */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100";
