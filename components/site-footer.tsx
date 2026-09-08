import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { categories } from "@/lib/categories";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-statement">
          <Logo />
          <p>
            An open-source manual for understanding yourself, other humans, and
            the systems around you.
          </p>
          <p className="footer-note">Awareness over obedience.</p>
        </div>
        <div className="footer-column">
          <p className="footer-label">Library</p>
          <Link href="/human-101">Human 101</Link>
          {categories.map((category) => (
            <Link href={`/explore/${category.slug}`} key={category.slug}>
              {category.name}
            </Link>
          ))}
        </div>
        <div className="footer-column">
          <p className="footer-label">Project</p>
          <Link href="/methodology">Methodology</Link>
          <Link href="/about">About</Link>
          <a
            href={siteConfig.contributeHref}
            target={siteConfig.repositoryUrl ? "_blank" : undefined}
            rel={siteConfig.repositoryUrl ? "noreferrer" : undefined}
          >
            Contribute <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <p>Open knowledge for human literacy.</p>
        <p>
          Code{" "}
          <a href="https://opensource.org/license/mit" target="_blank" rel="noreferrer">
            MIT
          </a>
          {" · "}Content{" "}
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
