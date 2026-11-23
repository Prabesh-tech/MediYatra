"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import { SiteNavLink } from "./site-nav-link";
import { localizedHref, siteConfig } from "@/config/site";
import { motionEase } from "@/lib/motion";

export function SiteHeader({ locale }: { locale: string }) {
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();
  const [isCompact, setIsCompact] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    const delta = latest - previous;
    const headerHasFocus = headerRef.current?.contains(document.activeElement) ?? false;

    setIsCompact(latest > 24);
    if (latest < 72 || headerHasFocus) {
      setIsHidden(false);
    } else if (!reduceMotion && Math.abs(delta) > 6) {
      setIsHidden(delta > 0);
    }

    lastScrollY.current = latest;
  });

  return (
    <>
      <motion.header
        ref={headerRef}
        className="site-header"
        data-compact={isCompact}
        animate={{ y: isHidden ? "-100%" : 0 }}
        initial={false}
        onFocusCapture={() => setIsHidden(false)}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.38, ease: motionEase }}
      >
        <div className="container header-inner">
          <Link className="brand" href={localizedHref(locale, "")} aria-label={`${siteConfig.brand.displayName} home`}>
            <Image className="brand-wordmark" src={siteConfig.brand.logoPath} alt="" width={180} height={60} sizes="(max-width: 1050px) 152px, 172px" />
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {siteConfig.navigation.main.map(({ label, href }) => (
              <SiteNavLink key={href || label} href={localizedHref(locale, href)}>{label}</SiteNavLink>
            ))}
          </nav>
          <div className="header-actions">
            <span className="desktop-theme-toggle"><ThemeToggle /></span>
            <Link className="button button-accent header-quote" href={localizedHref(locale, siteConfig.navigation.cta.href)}>
              Request an appointment
            </Link>
            <MobileNav locale={locale} />
          </div>
        </div>
      </motion.header>
      <div className="header-spacer" aria-hidden="true" />
    </>
  );
}
