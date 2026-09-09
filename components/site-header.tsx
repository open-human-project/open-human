import Link from "next/link";
import { Github, Search } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { MobileNav } from "@/components/mobile-nav";
import { getAllConcepts } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { locales, localizedPath, type Locale } from "@/lib/i18n/config";
import { siteConfig } from "@/lib/site";

export function SiteHeader({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const contributionHref =
    siteConfig.repositoryUrl ?? localizedPath(locale, "/about#contribute");
  const availableConceptSlugs = Object.fromEntries(
    locales.map((availableLocale) => [
      availableLocale,
      getAllConcepts(availableLocale).map((concept) => concept.slug),
    ]),
  ) as Record<Locale, string[]>;

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Logo locale={locale} />
        <nav className="desktop-nav" aria-label={dictionary.navigation.primaryLabel}>
          {dictionary.navigation.links.map((item) => (
            <Link href={localizedPath(locale, item.path)} key={item.path}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <LanguageSwitcher
            availableConceptSlugs={availableConceptSlugs}
            locale={locale}
            label={dictionary.language.label}
          />
          <Link
            className="icon-link"
            href={localizedPath(locale, "/search")}
            aria-label={dictionary.navigation.searchLabel}
          >
            <Search size={18} strokeWidth={1.7} />
          </Link>
          <a
            className="icon-link desktop-github"
            href={contributionHref}
            target={siteConfig.repositoryUrl ? "_blank" : undefined}
            rel={siteConfig.repositoryUrl ? "noreferrer" : undefined}
            aria-label={
              siteConfig.repositoryUrl
                ? dictionary.navigation.githubLabel
                : dictionary.navigation.contributionLabel
            }
          >
            <Github size={18} strokeWidth={1.7} />
          </a>
          <MobileNav
            contributeHref={contributionHref}
            locale={locale}
            navigation={dictionary.navigation}
            repositoryConnected={Boolean(siteConfig.repositoryUrl)}
          />
        </div>
      </div>
    </header>
  );
}
