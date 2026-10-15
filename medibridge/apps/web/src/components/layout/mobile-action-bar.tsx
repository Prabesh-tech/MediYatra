import Link from "next/link";
import { ClipboardList, MessageCircle, Phone } from "lucide-react";
import { getWhatsAppHref, localizedHref, siteConfig } from "@/config/site";

export function MobileActionBar({ locale }: { locale: string }) {
  return (
    <nav className="mobile-action-bar" aria-label="Quick actions">
      <a className="mobile-action-icon mobile-action-phone" href={siteConfig.contact.phones[0].href} aria-label={`Call ${siteConfig.brand.name}`} data-tooltip="Call us">
        <Phone size={18} aria-hidden="true" />
      </a>
      <a className="mobile-action-icon mobile-action-whatsapp" href={getWhatsAppHref()} aria-label={`Chat with ${siteConfig.brand.name} on WhatsApp`} data-tooltip="WhatsApp" target="_blank" rel="noreferrer">
        <MessageCircle size={18} aria-hidden="true" />
      </a>
      <Link className="button button-secondary" href={localizedHref(locale, "contact")}>
        <MessageCircle size={17} aria-hidden="true" /> Contact
      </Link>
      <Link className="button button-accent" href={localizedHref(locale, "quote")} aria-label="Get a quote">
        <ClipboardList size={17} aria-hidden="true" /> Quote
      </Link>
    </nav>
  );
}
