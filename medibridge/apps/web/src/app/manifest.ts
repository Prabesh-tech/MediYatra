import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.brand.name,
    short_name: siteConfig.brand.displayName,
    description: siteConfig.brand.description,
    start_url: "/en",
    display: "standalone",
    background_color: siteConfig.theme.background,
    theme_color: siteConfig.theme.color,
    categories: ["health"],
    icons: [{ src: siteConfig.brand.logoPath, sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
