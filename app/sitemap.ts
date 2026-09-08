import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";
import { getAllConcepts } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/human-101", "/explore", "/methodology", "/about"];
  return [
    ...staticRoutes.map((route) => ({ url: `${siteConfig.url}${route}`, changeFrequency: "weekly" as const })),
    ...categories.map((category) => ({ url: `${siteConfig.url}/explore/${category.slug}`, changeFrequency: "weekly" as const })),
    ...getAllConcepts().map((concept) => ({
      url: `${siteConfig.url}/concepts/${concept.slug}`,
      lastModified: new Date(`${concept.last_reviewed}T12:00:00Z`),
      changeFrequency: "monthly" as const,
    })),
  ];
}
