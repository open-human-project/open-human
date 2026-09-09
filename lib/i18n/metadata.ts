import type { Metadata } from "next";
import {
  localeOpenGraph,
  locales,
  localizedAlternates,
  localizedPath,
  type Locale,
} from "@/lib/i18n/config";
import { siteConfig } from "@/lib/site";

type LocalizedMetadataOptions = {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  availableLocales?: readonly Locale[];
  robots?: Metadata["robots"];
};

export function createLocalizedMetadata({
  locale,
  title,
  description,
  path = "",
  type = "website",
  availableLocales = locales,
  robots,
}: LocalizedMetadataOptions): Metadata {
  const socialImage = `${siteConfig.url}/${locale}/social-image`;

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    alternates: localizedAlternates(locale, path, availableLocales),
    openGraph: {
      type,
      siteName: siteConfig.name,
      title,
      description,
      url: localizedPath(locale, path),
      locale: localeOpenGraph[locale],
      alternateLocale: availableLocales
        .filter((availableLocale) => availableLocale !== locale)
        .map((availableLocale) => localeOpenGraph[availableLocale]),
      images: [{ url: socialImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
    robots,
  };
}
