import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { ImageReveal, Reveal } from "@/components/shared/reveal";
import { StaticPage } from "@/components/shared/static-page";
import { getWhatsAppHref, localizedHref, siteConfig } from "@/config/site";

export default function ContactPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { request?: string; doctor?: string };
}) {
  const callbackDoctor = searchParams?.request === "callback" && searchParams.doctor && searchParams.doctor.length <= 100
    ? searchParams.doctor
    : undefined;

  return (
    <StaticPage eyebrow="Contact MediYatra" title="We’re here to help you take the next step." description="Ask a question, talk through your options, or get help coordinating care between Nepal and India.">
      <main className="contact-page">
        <section className="contact-channel-grid" aria-label="Contact options">
          <Reveal delay={0}>
            <a className="contact-channel" href={siteConfig.contact.phones[0].href}>
              <span className="contact-channel-icon"><Phone size={19} aria-hidden="true" /></span>
              <span className="contact-channel-copy"><span>Call our team</span><strong>{siteConfig.contact.phones[0].display}</strong><small>More numbers: {siteConfig.contact.phones.slice(1).map(({ nationalDisplay }) => nationalDisplay).join(" · ")}</small></span>
              <ArrowUpRight className="contact-channel-arrow" size={17} aria-hidden="true" />
            </a>
          </Reveal>
          <Reveal delay={0.07}>
            <a className="contact-channel" href={getWhatsAppHref()} target="_blank" rel="noreferrer">
              <span className="contact-channel-icon"><MessageCircle size={19} aria-hidden="true" /></span>
              <span className="contact-channel-copy"><span>WhatsApp</span><strong>Message MediYatra</strong><small>For general questions and coordination</small></span>
              <ArrowUpRight className="contact-channel-arrow" size={17} aria-hidden="true" />
            </a>
          </Reveal>
          <Reveal delay={0.14}>
            <a className="contact-channel" href={`mailto:${siteConfig.contact.email}`}>
              <span className="contact-channel-icon"><Mail size={19} aria-hidden="true" /></span>
              <span className="contact-channel-copy"><span>Email</span><strong>{siteConfig.contact.email}</strong><small>We’ll get back to your message</small></span>
              <ArrowUpRight className="contact-channel-arrow" size={17} aria-hidden="true" />
            </a>
          </Reveal>
          <Reveal delay={0.21}>
            <a
              className="contact-channel contact-channel--location"
              href={siteConfig.contact.osmUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span className="contact-channel-icon"><MapPin size={19} aria-hidden="true" /></span>
              <span className="contact-channel-copy"><span>Visit our office</span><strong>{siteConfig.contact.address.streetAddress}, {siteConfig.contact.address.city}</strong><small>{siteConfig.contact.address.country}</small></span>
              <ArrowUpRight className="contact-channel-arrow" size={17} aria-hidden="true" />
            </a>
          </Reveal>
        </section>

        <section className="contact-main-layout" aria-labelledby="contact-form-title">
          <Reveal className="contact-form-column">
            <div className="contact-form-heading">
              <p className="eyebrow">{callbackDoctor ? "Request a call back" : "Send us a message"}</p>
              <h2 id="contact-form-title">{callbackDoctor ? "When should we call you?" : "How can we help?"}</h2>
              <p className="muted">Tell us a little about what you need. Our team will help you find the right next step.</p>
            </div>
            <ContactForm callbackDoctor={callbackDoctor} />
          </Reveal>

          <Reveal className="contact-visual-column" delay={0.12}>
            <ImageReveal className="contact-feature-photo">
              <Image src="/images/slide-04.png" alt="A healthcare professional listening attentively to a patient" fill sizes="(max-width: 760px) 100vw, 48vw" priority />
            </ImageReveal>
            <ImageReveal className="contact-detail-photo">
              <Image src="/images/slide-06.png" alt="Care professional preparing patient support equipment" fill sizes="(max-width: 760px) 42vw, 18vw" />
            </ImageReveal>
            <div className="contact-image-caption">
              <span className="contact-caption-icon"><ShieldCheck size={18} aria-hidden="true" /></span>
              <span><strong>Here for the practical details</strong><small>Care coordination, with your choices at the center.</small></span>
            </div>
          </Reveal>
        </section>

        <section className="contact-map-section" aria-labelledby="contact-map-title">
          <div className="contact-map-copy">
            <p className="eyebrow">Find us</p>
            <h2 id="contact-map-title">Our {siteConfig.contact.address.city} office</h2>
            <p className="muted">{siteConfig.contact.addressDisplay}</p>
            <a className="text-link" href={siteConfig.contact.directionsUrl} target="_blank" rel="noreferrer">
              Open directions <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="contact-map-frame">
            <iframe
              title={`Map showing ${siteConfig.contact.addressDisplay}`}
              src={siteConfig.contact.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </section>

        <p className="contact-privacy-note"><ShieldCheck size={17} aria-hidden="true" /> Please don’t include medical details or attach records here. For care requests, use our <Link href={localizedHref(params.locale, "quote")}>secure inquiry form</Link>.</p>
      </main>
    </StaticPage>
  );
}
