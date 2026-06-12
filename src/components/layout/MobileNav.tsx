"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { NAV_LINKS, INSTAGRAM_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const PORTAL_ID = "mobile-nav-portal";

function isLinkActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/gallery") {
    return pathname === "/gallery" || pathname.startsWith("/gallery/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getPortalNode(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.getElementById(PORTAL_ID);
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const node = getPortalNode();
    if (!node) return;
    node.dataset.open = open ? "true" : "false";
    node.setAttribute("aria-hidden", open ? "false" : "true");
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }

    function onPopState() {
      close();
    }

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("popstate", onPopState);
    };
  }, [open, close]);

  const portalNode = open ? getPortalNode() : null;

  const menu =
    open && portalNode
      ? createPortal(
          <>
            <button
              type="button"
              className="mobile-nav-backdrop"
              onClick={close}
              aria-label="Close menu"
              tabIndex={-1}
            />
            <div
              id="mobile-nav-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="mobile-nav-panel"
            >
              <nav
                className="flex flex-col px-5 py-4 gap-0.5"
                aria-label="Mobile navigation"
              >
                {NAV_LINKS.map((link) => {
                  const isActive = isLinkActive(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={close}
                      prefetch
                      className={cn(
                        "py-3.5 px-3 rounded-lg text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/40",
                        isActive
                          ? "text-teal border-l-2 border-coral bg-teal/[0.04]"
                          : "text-teal/80 hover:bg-teal/[0.04] border-l-2 border-transparent"
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
                  className="flex items-center gap-2.5 py-3.5 px-3 text-teal/80 hover:bg-teal/[0.04] rounded-lg border-l-2 border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/40"
                  onClick={close}
                >
                  <InstagramIcon size={20} />
                  Instagram
                </a>
              </nav>
            </div>
          </>,
          portalNode
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="md:hidden relative z-[210] p-2 -mr-2 text-teal hover:text-coral transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/40"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
      >
        {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
      </button>
      {menu}
    </>
  );
}
