import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Music2 } from "lucide-react";
import { getCopyrightYear, localizedHref, siteConfig } from "@/config/site";
import { SiteNavLink } from "./site-nav-link";

const socialIcons = { Instagram, TikTok: Music2, Facebook } as const;

export function SiteFooter({ locale }: { locale: string }) {
  const primaryPhone = siteConfig.contact.phones[0];

  return (
    <footer className="site-footer">
      <svg className="site-footer-wave" viewBox="0 0 1440 72" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0 H1440 V34 C1200 70 1010 8 740 39 C490 68 220 12 0 44 Z" />
      </svg>
      <div className="container">
        <div className="footer-compact-grid">
          <div className="footer-brand-column">
            <Link className="brand" href={localizedHref(locale, "")}>
              <Image className="brand-wordmark" src={siteConfig.brand.logoPath} alt="" width={150} height={50} />
            </Link>
            <p className="footer-motto">{siteConfig.brand.tagline}</p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="footer-column-heading">Explore</h2>
            <div className="footer-links">
              {siteConfig.navigation.footer.quickLinks.map(({ label, href }) => (
                <SiteNavLink key={href} href={localizedHref(locale, href)}>{label}</SiteNavLink>
              ))}
            </div>
            <div className="footer-social-block">
              <h3>Follow us</h3>
              <div className="footer-social-links" role="group" aria-label="MediYatra social media profiles">
                {siteConfig.socialLinks.map(({ label, href }) => {
                  const Icon = socialIcons[label];
                  return href ? (
                    <a key={label} href={href} aria-label={`Visit MediYatra on ${label}`} title={label} target="_blank" rel="noreferrer">
                      <Icon size={19} aria-hidden="true" />
                    </a>
                  ) : (
                    <button key={label} type="button" disabled aria-label={`${label} profile link coming soon`} title={`${label} link coming soon`}>
                      <Icon size={19} aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
              <p>
                {siteConfig.socialLinks.some(({ href }) => href)
                  ? "Follow MediYatra on Instagram."
                  : "Social profile links coming soon."}
              </p>
            </div>
          </nav>

          <div className="footer-contact">
            <h2 className="footer-column-heading">Contact</h2>
            <address>
              {siteConfig.contact.addressDisplay}<br />
              <a href={primaryPhone.href}>{primaryPhone.display}</a><br />
              <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
            </address>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {getCopyrightYear()} {siteConfig.brand.displayName}. All rights reserved.</span>
          <nav className="footer-policy-links" aria-label="Legal policies">
            {siteConfig.navigation.footer.policies.map(({ label, href }) => (
              <SiteNavLink key={href} href={localizedHref(locale, href)}>{label}</SiteNavLink>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
