import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import { ServicesMenu } from "./services-menu";
import { SiteNavLink } from "./site-nav-link";
import { localizedHref, siteConfig } from "@/config/site";

export function SiteHeader({ locale }: { locale: string }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href={localizedHref(locale, "")} aria-label={`${siteConfig.brand.displayName} home`}>
          <Image className="brand-mark" src={siteConfig.brand.logoPath} alt="" width={32} height={32} priority />
          <span>{siteConfig.brand.displayName}</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {siteConfig.navigation.main.slice(0, 1).map(({ label, href }) => (
            <SiteNavLink key={href || label} href={localizedHref(locale, href)}>{label}</SiteNavLink>
          ))}
          <ServicesMenu locale={locale} />
          {siteConfig.navigation.main.slice(1).map(({ label, href }) => (
            <SiteNavLink key={href} href={localizedHref(locale, href)}>{label}</SiteNavLink>
          ))}
        </nav>
        <div className="header-actions">
          <span className="locale-control" aria-label="Current language: English">EN</span>
          <ThemeToggle />
          <Link className="button button-accent header-quote" href={localizedHref(locale, "quote")}>
            Get a free quote
          </Link>
          <MobileNav locale={locale} />
        </div>
      </div>
    </header>
  );
}
