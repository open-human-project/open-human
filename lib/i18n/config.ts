export const locales = ["en", "id"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  id: "Bahasa Indonesia",
};

export const localeOpenGraph: Record<Locale, string> = {
  en: "en_US",
  id: "id_ID",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localizedPath(locale: Locale, path = "") {
  const normalized = !path || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized}`;
}

export function localizedAlternates(
  locale: Locale,
  path = "",
  availableLocales: readonly Locale[] = locales,
) {
  const languages = Object.fromEntries(
    availableLocales.map((availableLocale) => [
      availableLocale,
      localizedPath(availableLocale, path),
    ]),
  );

  return {
    canonical: localizedPath(locale, path),
    languages: {
      ...languages,
      "x-default": localizedPath(defaultLocale, path),
    },
  };
}
