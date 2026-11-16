import type { Metadata } from "next";

import { studio } from "@/content/site";

type PageMetadataInput = {
  title: string;
  description: string;
  path: "/" | "/about" | "/services" | "/contact";
};

/**
 * Builds the metadata of one page: title, description, canonical URL and the
 * matching Open Graph and Twitter fields, so no page can forget one of them.
 * The title template ("… | Atelier Barre") comes from the root layout.
 */
export function buildPageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${studio.name}`,
      description,
      url: path,
      siteName: studio.name,
      locale: "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${title} | ${studio.name}`,
      description,
    },
  };
}
