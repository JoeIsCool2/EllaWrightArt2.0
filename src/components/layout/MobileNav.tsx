"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { NAV_LINKS, INSTAGRAM_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 text-teal hover:text-coral transition-colors"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-teal/20 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-nav-panel"
            className="fixed top-14 md:top-16 right-0 left-0 bg-ivory border-b border-teal/10 shadow-lg z-50 animate-fade-in max-h-[calc(100vh-3.5rem)] overflow-y-auto"
          >
            <nav className="flex flex-col p-6 gap-1" aria-label="Mobile navigation">
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
                    onClick={() => setOpen(false)}
                    prefetch
                    className={cn(
                      "py-3 px-4 rounded-lg text-lg font-medium transition-colors",
                      isActive
                        ? "text-teal bg-coral/10"
                        : "text-teal/80 hover:bg-teal/5"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-3 px-4 text-teal/80 hover:bg-teal/5 rounded-lg"
                onClick={() => setOpen(false)}
              >
                <InstagramIcon size={20} />
                Instagram
              </a>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
