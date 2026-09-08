import Link from "next/link";
import { Github, Search } from "lucide-react";
import { Logo } from "@/components/logo";
import { MobileNav } from "@/components/mobile-nav";
import { siteConfig } from "@/lib/site";

const navigation = [
  { href: "/human-101", label: "Human 101" },
  { href: "/explore", label: "Explore" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="icon-link" href="/search" aria-label="Search the library">
            <Search size={18} strokeWidth={1.7} />
          </Link>
          <a
            className="icon-link desktop-github"
            href={siteConfig.contributeHref}
            target={siteConfig.repositoryUrl ? "_blank" : undefined}
            rel={siteConfig.repositoryUrl ? "noreferrer" : undefined}
            aria-label={siteConfig.repositoryUrl ? "Open Human on GitHub" : "About contributing to Open Human"}
          >
            <Github size={18} strokeWidth={1.7} />
          </a>
          <MobileNav
            contributeHref={siteConfig.contributeHref}
            repositoryConnected={Boolean(siteConfig.repositoryUrl)}
          />
        </div>
      </div>
    </header>
  );
}
