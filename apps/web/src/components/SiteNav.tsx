"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Cockpit" },
  { href: "/submit", label: "Submit" },
  { href: "/cases", label: "Cases" },
  { href: "/quant", label: "Quant Lab" },
  { href: "/macro", label: "Macro" },
  { href: "/memo", label: "Memo" },
  { href: "/methods", label: "Methods" },
];

export function SiteNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ivory/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-xl tracking-tight text-navy">
          DWM
          <span className="ml-2 text-xs font-sans font-normal uppercase tracking-widest text-muted">
            Advisory
          </span>
        </Link>
        <nav className="flex flex-wrap gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded px-3 py-1.5 transition-colors",
                pathname === l.href ||
                  (l.href === "/cases" && pathname.startsWith("/cases")) ||
                  (l.href === "/submit" && pathname === "/submit")
                  ? "bg-navy text-white"
                  : "text-charcoal hover:bg-line",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
