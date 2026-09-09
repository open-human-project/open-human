import type { MetadataRoute } from "next";
import { getCategories } from "@/lib/categories";
import { getAllConcepts, getConceptBySlug } from "@/lib/content";
import {
  defaultLocale,
  localizedPath,
  locales,
  type Locale,
} from "@/lib/i18n/config";
import { siteConfig } from "@/lib/site";

function absolute(path: string) {
  return `${siteConfig.url}${path}`;
}

function alternates(path: string, availableLocales: readonly Locale[] = locales) {
  return {
    languages: {
      ...Object.fromEntries(
        availableLocales.map((locale) => [locale, absolute(localizedPath(locale, path))]),
      ),
      "x-default": absolute(localizedPath(defaultLocale, path)),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/human-101", "/explore", "/methodology", "/about"];

  return locales.flatMap((locale) => [
    ...staticRoutes.map((route) => ({
      url: absolute(localizedPath(locale, route)),
      changeFrequency: "weekly" as const,
      alternates: alternates(route),
    })),
    ...getCategories(locale).map((category) => ({
      url: absolute(localizedPath(locale, `/explore/${category.slug}`)),
      changeFrequency: "weekly" as const,
      alternates: alternates(`/explore/${category.slug}`),
    })),
    ...getAllConcepts(locale).map((concept) => {
      const availableLocales = locales.filter((availableLocale) =>
        getConceptBySlug(availableLocale, concept.slug),
      );
      return {
        url: absolute(localizedPath(locale, `/concepts/${concept.slug}`)),
        lastModified: new Date(`${concept.last_reviewed}T12:00:00Z`),
        changeFrequency: "monthly" as const,
        alternates: alternates(`/concepts/${concept.slug}`, availableLocales),
      };
    }),
  ]);
}
