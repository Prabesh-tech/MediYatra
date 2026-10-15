import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, MapPin, ShieldCheck, Star } from "lucide-react";
import { localizedHref, getWhatsAppHref, siteConfig } from "@/config/site";
import { fetchAllCatalogItems } from "@/lib/catalog";
import { SocialShareLinks } from "./social-share-links";
import { SiteNavLink } from "./site-nav-link";

type TreatmentLink = { slug: string; name: string };
type HospitalLink = { slug: string; name: string };
type DestinationLink = { slug: string; city: string; country: string };

export async function SiteFooter({ locale }: { locale: string }) {
  const [treatments, hospitals, destinations] = await Promise.all([
    fetchAllCatalogItems<TreatmentLink>("treatments"),
    fetchAllCatalogItems<HospitalLink>("hospitals"),
    fetchAllCatalogItems<DestinationLink>("destinations"),
  ]);

  const listingGroups = [
    { title: "Published treatments", href: "treatments", items: treatments?.map(({ slug, name }) => ({ slug, label: name })) ?? [] },
    { title: "Published hospitals", href: "hospitals", items: hospitals?.map(({ slug, name }) => ({ slug, label: name })) ?? [] },
    { title: "Available destinations", href: "destinations", items: destinations?.map(({ slug, city, country }) => ({ slug, label: `${city}, ${country}` })) ?? [] },
  ].filter(({ items }) => items.length > 0);

  return (
    <>
      <section className="footer-review-cta" aria-label="Google reviews">
        <div className="container">
          <a className="button button-accent" href={siteConfig.googleReviewUrl} target="_blank" rel="noreferrer">
            <Star size={17} aria-hidden="true" />
            Google Reviews
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        </div>
      </section>
      <footer className="site-footer">
      <div className="container">
        <section className="footer-location-band" aria-labelledby="footer-location-title">
          <div>
            <p className="eyebrow">Our location</p>
            <h2 id="footer-location-title">Based in {siteConfig.contact.address.city}, here to help across Nepal.</h2>
          </div>
          <a className="footer-location-link" href={siteConfig.contact.directionsUrl} target="_blank" rel="noreferrer">
            <MapPin size={20} aria-hidden="true" />
            <span><strong>{siteConfig.contact.address.streetAddress}, {siteConfig.contact.address.city}</strong><small>{siteConfig.contact.address.country}</small></span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </section>

        <div className="footer-grid">
          <div className="footer-brand-column">
            <Link className="brand" href={localizedHref(locale, "")}>
              <Image className="brand-mark" src={siteConfig.brand.logoPath} alt="" width={32} height={32} />
              <span>{siteConfig.brand.displayName}</span>
            </Link>
            <p className="muted" style={{ maxWidth: 330, marginTop: "1rem" }}>{siteConfig.brand.description}</p>
            <p className="footer-motto">{siteConfig.brand.tagline}</p>
            <p className="notice"><ShieldCheck size={17} aria-hidden="true" /> Your health information should only be shared through secure channels.</p>
            <div className="footer-social-block">
              <h3>Share {siteConfig.brand.name}</h3>
              <SocialShareLinks locale={locale} />
            </div>
          </div>
          <FooterLinkGroup locale={locale} title="Company" items={siteConfig.navigation.footer.company} />
          <div>
            <h3>Services</h3>
            <div className="footer-links">
              {siteConfig.navigation.footer.services.map(({ label, href }) => (
                <SiteNavLink key={href} href={localizedHref(locale, href)}>{label}</SiteNavLink>
              ))}
              {listingGroups.map(({ title, href, items }) => (
                <div className="footer-dynamic-group" key={title}>
                  <strong>{title}</strong>
                  {items.map(({ slug, label }) => (
                    <SiteNavLink key={slug} href={localizedHref(locale, `${href}/${encodeURIComponent(slug)}`)}>{label}</SiteNavLink>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3>Contact & help</h3>
            <div className="footer-links">
              {siteConfig.navigation.footer.help.map(({ label, href }) => (
                <SiteNavLink key={href} href={localizedHref(locale, href)}>{label}</SiteNavLink>
              ))}
              {siteConfig.contact.phones.map((phone) => <a key={phone.href} href={phone.href}>{phone.display}</a>)}
              <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
              <a href={getWhatsAppHref()} target="_blank" rel="noreferrer">WhatsApp support</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {siteConfig.brand.displayName}. All rights reserved.</span>
          <nav className="footer-policy-links" aria-label="Legal policies">
            {siteConfig.navigation.footer.policies.map(({ label, href }) => (
              <SiteNavLink key={href} href={localizedHref(locale, href)}>{label}</SiteNavLink>
            ))}
          </nav>
        </div>
      </div>
      </footer>
    </>
  );
}

function FooterLinkGroup({
  locale,
  title,
  items,
}: {
  locale: string;
  title: string;
  items: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3>{title}</h3>
      <div className="footer-links">
        {items.map(({ label, href }) => (
          <SiteNavLink key={href} href={localizedHref(locale, href)}>{label}</SiteNavLink>
        ))}
      </div>
    </div>
  );
}
