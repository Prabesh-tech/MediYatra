"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { localizedHref, siteConfig } from "@/config/site";
import { ThemeToggle } from "./theme-toggle";

export function MobileNav({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname().replace(/\/$/, "");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    drawerRef.current?.toggleAttribute("inert", !open);
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("mobile-nav-open");
    drawerRef.current?.querySelector<HTMLElement>(".mobile-drawer-close")?.focus({ preventScroll: true });

    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("mobile-nav-open");
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function trapFocus(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") return;
    const focusable = drawerRef.current?.querySelectorAll<HTMLElement>('a[href]:not([tabindex="-1"]), button:not([disabled])');
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        className="icon-button mobile-menu-button"
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
      </button>
      {mounted && createPortal(
        <>
          {open && <button className="mobile-drawer-backdrop" type="button" aria-label="Dismiss navigation overlay" tabIndex={-1} onClick={() => { setOpen(false); triggerRef.current?.focus(); }} />}
          <div
            ref={drawerRef}
            id="mobile-navigation"
            className={`mobile-drawer ${open ? "is-open" : ""}`}
            role="dialog"
            aria-label="Mobile navigation"
            aria-modal={open}
            aria-hidden={!open}
            onKeyDown={trapFocus}
          >
            <div className="mobile-drawer-top">
              <span className="mobile-drawer-heading">Explore {siteConfig.brand.displayName}</span>
              <button
                className="icon-button mobile-drawer-close"
                type="button"
                aria-label="Close navigation menu"
                onClick={() => { setOpen(false); triggerRef.current?.focus(); }}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Mobile navigation">
              {siteConfig.navigation.main.map(({ label, href }) => {
                const destination = localizedHref(locale, href);
                const isCurrent = pathname === destination || (Boolean(href) && pathname.startsWith(`${destination}/`));
                return <Link key={href || label} href={destination} aria-current={isCurrent ? "page" : undefined} onClick={() => setOpen(false)}>{label}</Link>;
              })}
            </nav>
            <div className="mobile-drawer-utilities">
              <span>Appearance</span>
              <ThemeToggle />
            </div>
            <div className="mobile-drawer-actions">
              <Link className="button button-accent" href={localizedHref(locale, siteConfig.navigation.cta.href)} onClick={() => setOpen(false)}>
                Request an appointment
              </Link>
              <a className="button button-secondary" href={siteConfig.contact.phones[0].href} onClick={() => setOpen(false)}>
                Call now
              </a>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
