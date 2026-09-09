"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function MobileNav({
  contributeHref,
  locale,
  navigation,
  repositoryConnected,
}: {
  contributeHref: string;
  locale: Locale;
  navigation: Dictionary["navigation"];
  repositoryConnected: boolean;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (detailsRef.current) detailsRef.current.open = false;
  }, [pathname]);

  function closeMenu() {
    if (detailsRef.current) detailsRef.current.open = false;
  }

  return (
    <details className="mobile-menu" ref={detailsRef}>
      <summary aria-label={navigation.menuLabel}>
        <Menu size={20} strokeWidth={1.6} />
      </summary>
      <div className="mobile-menu-panel">
        <nav aria-label={navigation.mobileLabel}>
          {navigation.links.map((item, index) => (
            <Link
              href={localizedPath(locale, item.path)}
              key={item.path}
              onClick={closeMenu}
            >
              <span>0{index + 1}</span>
              {item.label}
            </Link>
          ))}
          <a
            href={contributeHref}
            target={repositoryConnected ? "_blank" : undefined}
            rel={repositoryConnected ? "noreferrer" : undefined}
            onClick={closeMenu}
          >
            <span>05</span>
            {repositoryConnected ? navigation.contribute : navigation.howToContribute}
          </a>
        </nav>
      </div>
    </details>
  );
}
