import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { fetchAllCatalogItems } from "@/lib/catalog";
import { treatmentAreas } from "@/lib/site-content";

export const revalidate = 3600;

type SlugEntry = { slug: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [treatments, hospitals, doctors, destinations, articles] = await Promise.all([
    fetchAllCatalogItems<SlugEntry>("treatments"),
    fetchAllCatalogItems<SlugEntry>("hospitals"),
    fetchAllCatalogItems<SlugEntry>("doctors"),
    fetchAllCatalogItems<SlugEntry>("destinations"),
    fetchAllCatalogItems<SlugEntry>("blog"),
  ]);
  const dynamicPaths = [
    ...treatmentAreas.map(({ slug }) => `/treatments/${slug}`),
    ...(treatments ?? []).map(({ slug }) => `/treatments/${encodeURIComponent(slug)}`),
    ...(hospitals ?? []).map(({ slug }) => `/hospitals/${encodeURIComponent(slug)}`),
    ...(doctors ?? []).map(({ slug }) => `/doctors/${encodeURIComponent(slug)}`),
    ...(destinations ?? []).map(({ slug }) => `/destinations/${encodeURIComponent(slug)}`),
    ...(articles ?? []).map(({ slug }) => `/blog/${encodeURIComponent(slug)}`),
  ];
  const publicPaths = [...new Set([...siteConfig.routes.public, ...dynamicPaths])];

  return publicPaths.map((path, index) => ({
    url: new URL(`/en${path === "/" ? "" : path}`, siteConfig.brand.siteUrl).toString(),
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : 0.6,
  }));
}
