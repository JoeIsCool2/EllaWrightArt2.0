"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { NAV_LINKS, INSTAGRAM_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MobileNav } from "./MobileNav";

export function Navbar() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-[220] bg-ivory md:bg-ivory/95 md:backdrop-blur-sm border-b border-teal/5 shadow-[0_1px_0_rgba(13,59,63,0.04)]">
      <nav
        className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 flex items-center justify-between h-14 md:h-16"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="relative flex items-center shrink-0 min-w-0 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/40 rounded-sm"
          aria-label="EllaWrightArt home"
        >
          <BrandLogo variant="nav" priority />
        </Link>

        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : link.href === "/gallery"
                  ? pathname === "/gallery" ||
                    pathname.startsWith("/gallery/")
                  : pathname === link.href ||
                    pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium tracking-wide transition-colors relative py-1",
                  isActive
                    ? "text-teal"
                    : "text-teal/70 hover:text-teal"
                )}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-coral rounded-full"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex text-teal hover:text-coral transition-colors p-2"
            aria-label="Instagram"
          >
            <InstagramIcon size={20} />
          </a>
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
