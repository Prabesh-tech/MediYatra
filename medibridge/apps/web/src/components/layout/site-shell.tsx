import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { MobileActionBar } from "./mobile-action-bar";
import { FloatingContactActions } from "./floating-contact-actions";
import { CookieConsent } from "./cookie-consent";
import { PageMotion } from "./page-motion";
import { SiteExperience } from "./site-experience";

export function SiteShell({ children, locale }: { children: ReactNode; locale: string }) {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <SiteExperience />
      <SiteHeader locale={locale} />
      <PageMotion>{children}</PageMotion>
      <SiteFooter locale={locale} />
      <MobileActionBar locale={locale} />
      <FloatingContactActions />
      <CookieConsent />
    </>
  );
}
