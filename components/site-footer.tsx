import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { getCategories } from "@/lib/categories";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteConfig } from "@/lib/site";

export function SiteFooter({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const categories = getCategories(locale);
  const contributionHref =
    siteConfig.repositoryUrl ?? localizedPath(locale, "/about#contribute");

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-statement">
          <Logo locale={locale} />
          <p>{dictionary.footer.statement}</p>
          <p className="footer-note">{dictionary.footer.note}</p>
        </div>
        <div className="footer-column">
          <p className="footer-label">{dictionary.footer.library}</p>
          <Link href={localizedPath(locale, "/human-101")}>Human 101</Link>
          {categories.map((category) => (
            <Link href={localizedPath(locale, `/explore/${category.slug}`)} key={category.slug}>
              {category.name}
            </Link>
          ))}
        </div>
        <div className="footer-column">
          <p className="footer-label">{dictionary.footer.project}</p>
          <Link href={localizedPath(locale, "/methodology")}>
            {dictionary.footer.methodology}
          </Link>
          <Link href={localizedPath(locale, "/about")}>{dictionary.footer.about}</Link>
          <a
            href={contributionHref}
            target={siteConfig.repositoryUrl ? "_blank" : undefined}
            rel={siteConfig.repositoryUrl ? "noreferrer" : undefined}
          >
            {dictionary.footer.contribute} <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <p>{dictionary.footer.literacy}</p>
        <p>
          {dictionary.footer.code}{" "}
          <a href="https://opensource.org/license/mit" target="_blank" rel="noreferrer">
            MIT
          </a>
          {" · "}
          {dictionary.footer.content}{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noreferrer"
          >
            CC BY 4.0
          </a>
        </p>
      </div>
    </footer>
  );
}
