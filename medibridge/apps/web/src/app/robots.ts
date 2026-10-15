import type { MetadataRoute } from "next";
import { localizedHref, siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: siteConfig.routes.public.map((path) => localizedHref("en", path)),
      disallow: [...siteConfig.routes.disallowedRobots],
    },
    sitemap: new URL("/sitemap.xml", siteConfig.brand.siteUrl).toString(),
  };
}