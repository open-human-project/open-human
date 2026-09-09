import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale, locales, type Locale } from "@/lib/i18n/config";

const preferenceCookie = "open-human-locale";

type LanguagePreference = {
  range: string;
  quality: number;
  order: number;
};

function parseLanguagePreferences(header: string): LanguagePreference[] {
  return header.split(",").flatMap((entry, order) => {
    const [rawRange, ...parameters] = entry.split(";");
    const range = rawRange?.trim().toLowerCase();
    if (!range) return [];

    const qualityParameter = parameters
      .map((parameter) => parameter.trim())
      .find((parameter) => parameter.toLowerCase().startsWith("q="));
    const parsedQuality = qualityParameter
      ? Number(qualityParameter.slice(qualityParameter.indexOf("=") + 1).trim())
      : 1;
    const quality =
      Number.isFinite(parsedQuality) && parsedQuality >= 0 && parsedQuality <= 1
        ? parsedQuality
        : 0;

    return [{ range, quality, order }];
  });
}

function preferredLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(preferenceCookie)?.value;
  if (saved && isLocale(saved)) return saved;

  const accepted = request.headers.get("accept-language") ?? "";
  const preferences = parseLanguagePreferences(accepted);
  const wildcardPreferences = preferences.filter(({ range }) => range === "*");
  const candidates = locales
    .map((locale) => {
      const explicitPreferences = preferences.filter(
        ({ range }) => range === locale || range.startsWith(`${locale}-`),
      );
      const matches = explicitPreferences.length ? explicitPreferences : wildcardPreferences;
      const preference = matches.toSorted(
        (a, b) => b.quality - a.quality || a.order - b.order,
      )[0];

      return preference ? { locale, ...preference } : undefined;
    })
    .filter((candidate): candidate is LanguagePreference & { locale: Locale } =>
      Boolean(candidate && candidate.quality > 0),
    )
    .sort(
      (a, b) =>
        b.quality - a.quality ||
        a.order - b.order ||
        Number(b.locale === defaultLocale) - Number(a.locale === defaultLocale),
    );

  return candidates[0]?.locale ?? defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];

  if (isLocale(firstSegment)) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-open-human-locale", firstSegment);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const locale = pathname === "/" ? preferredLocale(request) : defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  return NextResponse.redirect(url, pathname === "/" ? 307 : 308);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|icon.svg|manifest.webmanifest|robots.txt|sitemap.xml|opengraph-image|.*\\..*).*)",
  ],
};
