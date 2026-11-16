import type { MetadataRoute } from "next";

import { mainNav, siteUrl } from "@/content/site";

/** One entry per page in the main navigation, so the sitemap follows the menu. */
export default function sitemap(): MetadataRoute.Sitemap {
  return mainNav.map((item) => ({
    url: new URL(item.href, siteUrl).toString(),
    changeFrequency: "monthly",
    priority: item.href === "/" ? 1 : 0.7,
  }));
}
