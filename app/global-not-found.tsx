import { headers } from "next/headers";
import { Logo } from "@/components/logo";
import { NotFoundContent } from "@/components/not-found-content";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import "./globals.css";

export default async function GlobalNotFound() {
  const candidate = (await headers()).get("x-open-human-locale") ?? "";
  const locale: Locale = isLocale(candidate) ? candidate : defaultLocale;
  const copy = getDictionary(locale).notFound;

  return (
    <html lang={locale}>
      <head>
        <title>{copy.title} — Open Human</title>
        <meta name="robots" content="noindex, follow" />
      </head>
      <body>
        <header className="site-header">
          <div className="shell header-inner">
            <Logo locale={locale} />
          </div>
        </header>
        <main id="main-content">
          <NotFoundContent locale={locale} />
        </main>
      </body>
    </html>
  );
}
