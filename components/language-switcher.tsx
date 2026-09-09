"use client";

import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { localeNames, locales, type Locale } from "@/lib/i18n/config";

const preferenceMaxAge = 60 * 60 * 24 * 365;

const currentLanguageLabels: Record<Locale, string> = {
  en: "English, current language",
  id: "Bahasa Indonesia, bahasa saat ini",
};

const switchLanguageLabels: Record<Locale, Record<Locale, string>> = {
  en: {
    en: currentLanguageLabels.en,
    id: "Switch to Bahasa Indonesia",
  },
  id: {
    en: "Ganti ke bahasa Inggris",
    id: currentLanguageLabels.id,
  },
};

export function LanguageSwitcher({
  availableConceptSlugs,
  locale,
  label,
}: {
  availableConceptSlugs: Record<Locale, string[]>;
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [locationSuffix, setLocationSuffix] = useState("");

  useEffect(() => {
    function updateLocationSuffix() {
      setLocationSuffix(`${window.location.search}${window.location.hash}`);
    }

    updateLocationSuffix();
    window.addEventListener("hashchange", updateLocationSuffix);
    window.addEventListener("popstate", updateLocationSuffix);
    window.addEventListener("open-human:url-change", updateLocationSuffix);

    return () => {
      window.removeEventListener("hashchange", updateLocationSuffix);
      window.removeEventListener("popstate", updateLocationSuffix);
      window.removeEventListener("open-human:url-change", updateLocationSuffix);
    };
  }, [pathname]);

  function basePathFor(targetLocale: Locale) {
    const segments = pathname.split("/");
    if (locales.includes(segments[1] as Locale)) {
      const conceptSlug = segments[2] === "concepts" ? segments[3] : undefined;
      if (
        conceptSlug &&
        !availableConceptSlugs[targetLocale].includes(decodeURIComponent(conceptSlug))
      ) {
        return `/${targetLocale}/explore`;
      }
      segments[1] = targetLocale;
      return segments.join("/") || `/${targetLocale}`;
    }
    return `/${targetLocale}`;
  }

  function pathFor(targetLocale: Locale) {
    return `${basePathFor(targetLocale)}${locationSuffix}`;
  }

  function remember(targetLocale: Locale) {
    // This user-triggered write stores only the functional language preference.
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `open-human-locale=${targetLocale}; Path=/; Max-Age=${preferenceMaxAge}; SameSite=Lax`;
  }

  function switchLanguage(event: MouseEvent<HTMLAnchorElement>, targetLocale: Locale) {
    remember(targetLocale);

    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const destination = `${basePathFor(targetLocale)}${window.location.search}${window.location.hash}`;
    if (destination !== pathFor(targetLocale)) {
      event.preventDefault();
      router.push(destination);
    }
  }

  return (
    <nav className="language-switcher" aria-label={label}>
      {locales.map((targetLocale) => (
        <Link
          aria-label={switchLanguageLabels[locale][targetLocale]}
          aria-current={targetLocale === locale ? "page" : undefined}
          href={pathFor(targetLocale)}
          hrefLang={targetLocale}
          key={targetLocale}
          lang={targetLocale}
          onClick={(event) => switchLanguage(event, targetLocale)}
          title={localeNames[targetLocale]}
        >
          {targetLocale.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
