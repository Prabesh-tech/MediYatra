import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { FloatingContactActions } from "./floating-contact-actions";
import { CookieConsent } from "./cookie-consent";
import { PageMotion } from "./page-motion";
import { SiteExperience } from "./site-experience";
import { AppointmentRequestPopup } from "../home/appointment-request-popup";

export function SiteShell({ children, locale }: { children: ReactNode; locale: string }) {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <SiteExperience />
      <AppointmentRequestPopup locale={locale} />
      <SiteHeader locale={locale} />
      <PageMotion>{children}</PageMotion>
      <SiteFooter locale={locale} />
      <FloatingContactActions />
      <CookieConsent />
    </>
  );
}
