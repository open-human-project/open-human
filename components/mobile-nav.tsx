"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/human-101", label: "Human 101" },
  { href: "/explore", label: "Explore" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
];

export function MobileNav({ contributeHref, repositoryConnected }: { contributeHref: string; repositoryConnected: boolean }) {
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
      <summary aria-label="Open menu">
        <Menu size={20} strokeWidth={1.6} />
      </summary>
      <div className="mobile-menu-panel">
        <nav aria-label="Mobile navigation">
          {navigation.map((item, index) => (
            <Link href={item.href} key={item.href} onClick={closeMenu}>
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
            {repositoryConnected ? "Contribute on GitHub" : "How to contribute"}
          </a>
        </nav>
      </div>
    </details>
  );
}
