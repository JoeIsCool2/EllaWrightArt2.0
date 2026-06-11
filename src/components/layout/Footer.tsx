"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Mail } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import {
  SITE_NAME,
  EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
} from "@/lib/constants";
import { LayoutContainer } from "./LayoutContainer";

export function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto border-t border-teal/10 bg-ivory relative overflow-hidden">
      <div
        className="absolute bottom-0 left-0 w-48 h-48 opacity-30 pointer-events-none"
        style={{
          backgroundImage: "url(/decor/brush-corner.svg)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-48 h-48 opacity-30 pointer-events-none scale-x-[-1]"
        style={{
          backgroundImage: "url(/decor/brush-corner.svg)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden="true"
      />

      <LayoutContainer className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          <div>
            <h2 className="font-serif text-2xl text-teal mb-3">{SITE_NAME}</h2>
            <p className="text-teal/70 text-sm leading-relaxed max-w-xs">
              Original oil paintings inspired by femininity, spirituality,
              motherhood, and landscapes.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-teal mb-4 text-sm uppercase tracking-wider">
              Explore
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/gallery", label: "Gallery" },
                { href: "/commissions", label: "Commissions" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-teal/70 hover:text-coral transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-teal mb-4 text-sm uppercase tracking-wider">
              Connect
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-2 text-teal/70 hover:text-coral transition-colors text-sm"
                >
                  <Mail size={16} aria-hidden="true" />
                  {EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-teal/70 hover:text-coral transition-colors text-sm"
                >
                  <InstagramIcon size={16} />
                  {INSTAGRAM_HANDLE}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-teal/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-teal/50">
          <p>
            &copy; {year} {SITE_NAME}. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            <Heart size={14} className="text-gold" aria-hidden="true" />
            Made with love in Alpine, Utah
          </p>
        </div>
      </LayoutContainer>
    </footer>
  );
}
