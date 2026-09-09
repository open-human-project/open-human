import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  isLocale,
  localeOpenGraph,
  locales,
  type Locale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteConfig } from "@/lib/site";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: candidate } = await params;
  if (!isLocale(candidate)) return {};
  const dictionary = getDictionary(candidate);
  const socialImage = `${siteConfig.url}/${candidate}/social-image`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: dictionary.metadata.title,
      template: "%s — Open Human",
    },
    description: dictionary.metadata.description,
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: "Open Human",
      description: dictionary.metadata.description,
      locale: localeOpenGraph[candidate],
      images: [{ url: socialImage, width: 1200, height: 630, alt: dictionary.metadata.title }],
      alternateLocale: locales
        .filter((locale) => locale !== candidate)
        .map((locale) => localeOpenGraph[locale]),
    },
    twitter: {
      card: "summary_large_image",
      title: "Open Human",
      description: dictionary.metadata.description,
      images: [socialImage],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: candidate } = await params;
  if (!isLocale(candidate)) notFound();
  const locale: Locale = candidate;
  const dictionary = getDictionary(locale);

  return (
    <html lang={locale}>
      <body>
        <a className="skip-link" href="#main-content">
          {dictionary.skipLink}
        </a>
        <SiteHeader locale={locale} />
        <main id="main-content">{children}</main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
