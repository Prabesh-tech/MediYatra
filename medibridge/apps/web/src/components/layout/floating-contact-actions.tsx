import { MessageCircle, Phone, Star } from "lucide-react";
import { getWhatsAppHref, siteConfig } from "@/config/site";

export function FloatingContactActions() {
  return (
    <aside className="floating-contact-actions" aria-label="Quick contact and review links">
      <a className="floating-contact-link floating-phone" href={siteConfig.contact.phones[0].href} aria-label={`Call ${siteConfig.brand.name}`} title={`Call ${siteConfig.brand.name}`} data-tooltip="Call us">
        <Phone size={23} aria-hidden="true" />
        <span className="visually-hidden">Call us</span>
      </a>
      <a className="floating-contact-link floating-whatsapp" href={getWhatsAppHref()} aria-label={`Chat with ${siteConfig.brand.name} on WhatsApp`} title="Chat on WhatsApp" data-tooltip="WhatsApp" target="_blank" rel="noreferrer">
        <MessageCircle size={25} aria-hidden="true" />
        <span className="visually-hidden">WhatsApp</span>
      </a>
      <a className="floating-contact-link floating-google-reviews" href={siteConfig.googleReviewUrl} aria-label="Read and write Google reviews" title="Google reviews" data-tooltip="Google reviews" target="_blank" rel="noreferrer">
        <Star size={21} aria-hidden="true" />
        <span className="visually-hidden">Google reviews</span>
      </a>
    </aside>
  );
}
