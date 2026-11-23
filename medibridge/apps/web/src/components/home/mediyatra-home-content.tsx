import Image from "next/image";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  CircleDollarSign,
  Clock3,
  Hospital,
  HeartHandshake,
  Home,
  MapPin,
  Plane,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedAccordion } from "@/components/shared/animated-accordion";
import { GoogleReviewsPanel } from "@/components/home/google-reviews-panel";
import { Counter, ImageReveal, Reveal, StaggerGrid, Tilt } from "@/components/motion";
import { SpecialtyMarquee } from "@/components/shared/specialty-marquee";
import { HeroImageCarousel, HeroIntro, HeroStoryChapter } from "@/components/home/hero-interactions";
import { localizedHref } from "@/config/site";
import type { HomeCopy } from "@/types/home-copy";

const serviceVisuals = [
  {
    number: "01",
    image: "/images/slide-03.png",
    imageAlt: "Nurse supporting an older patient during a hospital stay",
    icon: Plane,
    href: "medical-tourism",
  },
  {
    number: "02",
    image: "/images/slide-02.png",
    imageAlt: "Nurse checking a patient's blood pressure",
    icon: Home,
    href: "nursing-care",
  },
] as const;

const journeyImages = [
  ["/images/slide-01.png", "Healthcare professional wearing a white coat"],
  ["/images/slide-02.png", "Nurse supporting an older patient during a hospital stay"],
  ["/images/slide-03.png", "Doctor and patient in a clinical consultation"],
  ["/images/slide-04.png", "Medical care and travel planning discussion"],
  ["/images/slide-05.png", "Healthcare team coordinating patient support"],
  ["/images/slide-06.png", "Nurse holding a tray with medication and care supplies"],
  ["/images/slide-07.png", "Patient follow-up and care coordination at home"],
] as const;

const storyCollageImages = [
  { src: "/images/nurse-support.png", alt: "Nurse in blue scrubs in a care setting", placement: "tall" },
  { src: "/images/slide-02.png", alt: "Nurse supporting an older patient in a hospital room", placement: "top" },
  { src: "/images/slide-05.png", alt: "Healthcare professional checking a patient's blood pressure", placement: "bottom" },
  { src: "/images/nurse-care.png", alt: "Nurse preparing medical supplies in a clinical setting", placement: "top" },
  { src: "/images/doctor-white-coat.png", alt: "Healthcare professional wearing a white coat and stethoscope", placement: "bottom" },
] as const;

const trustIcons = [ClipboardCheck, CheckCircle2, Plane, HeartHandshake] as const;
const journeyRouteIcons = [MapPin, Plane, Home] as const;

const reasonIcons = [
  CircleDollarSign,
  Stethoscope,
  HeartHandshake,
  Clock3,
  Hospital,
] as const;

export function MediYatraHomeContent({
  locale,
  copy,
  doctorsSection,
}: {
  locale: string;
  copy: HomeCopy;
  doctorsSection: ReactNode;
}) {
  return (
    <main>
      <HeroStoryChapter labelledBy="home-title">
        <span className="hero-glow hero-glow--one" aria-hidden="true" />
        <span className="hero-glow hero-glow--two" aria-hidden="true" />
        <span className="hero-glow hero-glow--three" aria-hidden="true" />
        <span className="hero-grid-pattern" aria-hidden="true" />
        <span className="hero-noise" aria-hidden="true" />
        <div className="container hero-layout">
          <HeroIntro locale={locale} copy={copy.hero} />
          <HeroImageCarousel />
        </div>
        <a className="hero-scroll-indicator" href="#trust-strip" aria-label={copy.hero.scrollAction}>
          <span>{copy.hero.scrollAction}</span>
          <ChevronDown size={17} aria-hidden="true" />
        </a>
        <svg className="hero-wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 42 C240 92 420 14 720 48 C1000 80 1190 14 1440 44 V90 H0 Z" />
        </svg>
      </HeroStoryChapter>
      <section className="trust-strip" id="trust-strip" aria-label="Support principles">
        <div className="container trust-items">
          {copy.trustPoints.map((point, index) => {
            const Icon = trustIcons[index];
            return <div className="trust-item" key={point}><Icon size={18} aria-hidden="true" /> {point}</div>;
          })}
        </div>
      </section>

      <section className="section section-muted" aria-labelledby="services-title">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">{copy.services.eyebrow}</p>
            <h2 id="services-title">{copy.services.heading}</h2>
          </div>
          <div className="services-showcase">
            {copy.services.items.map((service, index) => {
              const { number, image, imageAlt, icon: Icon, href } = serviceVisuals[index];
              return (
                <Reveal className="service-showcase-item" delay={index * 0.08} key={number}>
                  <Link className="card service-card service-card--image" href={localizedHref(locale, href)}>
                    <span className="service-card-image">
                      <Image src={image} alt={imageAlt} fill sizes="(max-width: 760px) 90vw, 42vw" />
                      <span className="service-number">{number}</span>
                    </span>
                    <span className="service-card-body">
                      <Icon size={25} aria-hidden="true" />
                      <h3>{service.title}</h3>
                      <p className="muted">{service.description}</p>
                      <span className="text-link">{service.action} <ArrowRight size={15} aria-hidden="true" /></span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-muted" id="journey" aria-labelledby="journey-title">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">{copy.journey.eyebrow}</p>
            <h2 id="journey-title">{copy.journey.heading}</h2>
          </div>
          <div className="journey-route" role="group" aria-label={copy.journey.routeLabel}>
            <p className="journey-route-description">{copy.journey.routeDescription}</p>
            <div className="journey-route-stops">
              {copy.journey.route.map((stop, index) => {
                const Icon = journeyRouteIcons[index];
                return (
                  <Fragment key={stop}>
                    <div className="journey-route-stop">
                      <span className="journey-route-icon"><Icon size={20} aria-hidden="true" /></span>
                      <strong>{stop}</strong>
                    </div>
                    {index < copy.journey.route.length - 1 && (
                      <span className="journey-route-arrow" aria-hidden="true"><ArrowRight size={19} /></span>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>
          <div className="journey-timeline">
            {copy.journey.steps.map(({ number, title, description }, index) => (
              <Reveal className="journey-step" delay={index * 0.06} key={number}>
                <article className="journey-step-card">
                  <div className="journey-step-photo">
                    <Image src={journeyImages[index][0]} alt={journeyImages[index][1]} fill sizes="(max-width: 760px) 90vw, 40vw" />
                  </div>
                  <div className="journey-step-copy">
                    <span className="service-number">{number}</span>
                    <h3>{title}</h3>
                    <p className="muted">{description}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section specialties-section" aria-labelledby="specialties-title">
        <div className="container split-section specialties-layout">
          <div className="specialties-copy">
            <p className="eyebrow">{copy.specialties.eyebrow}</p>
            <h2 id="specialties-title">{copy.specialties.heading}</h2>
            <p>{copy.specialties.description}</p>
            <p className="specialty-disclaimer"><ShieldCheck size={17} aria-hidden="true" /> {copy.specialties.clinicalNotice}</p>
          </div>
          <div className="specialties-visual">
            <div className="specialty-image-panel">
              <Image src="/images/doctor-white-coat.png" alt="" aria-hidden="true" fill sizes="(max-width: 760px) 90vw, 50vw" />
              <div className="specialty-image-content">
                <p className="specialty-panel-label">{copy.specialties.panelLabel}</p>
                <SpecialtyMarquee items={copy.specialties.items} label={copy.specialties.heading} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {doctorsSection}

      <section className="section section-muted" aria-labelledby="why-title">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">{copy.reasons.eyebrow}</p>
            <h2 id="why-title">{copy.reasons.heading}</h2>
          </div>
          <div className="why-visual-layout">
            <StaggerGrid className="why-reasons">
              {copy.reasons.items.slice(0, 3).map(({ title, description }, index) => {
                const Icon = reasonIcons[index];
                return (
                  <Tilt className="why-tilt" key={title}>
                    <article className="card why-item">
                      <Icon size={22} aria-hidden="true" />
                      <div><h3>{title}</h3><p>{description}</p></div>
                    </article>
                  </Tilt>
                );
              })}
            </StaggerGrid>
            <Reveal className="why-photo-reveal">
              <ImageReveal className="why-photo">
                <Image src="/images/slide-05.png" alt="Healthcare team coordinating patient support" fill sizes="(max-width: 760px) 90vw, 30vw" />
              </ImageReveal>
            </Reveal>
            <StaggerGrid className="why-reasons">
              {copy.reasons.items.slice(3).map(({ title, description }, index) => {
                const Icon = reasonIcons[index + 3];
                return (
                  <Tilt className="why-tilt" key={title}>
                    <article className="card why-item">
                      <Icon size={22} aria-hidden="true" />
                      <div><h3>{title}</h3><p>{description}</p></div>
                    </article>
                  </Tilt>
                );
              })}
            </StaggerGrid>
          </div>
        </div>
      </section>

      <section className="section metrics-section" aria-labelledby="metrics-title">
        <div className="container">
          <div className="section-heading section-heading--center">
            <p className="eyebrow">{copy.metrics.eyebrow}</p>
            <h2 id="metrics-title">{copy.metrics.heading}</h2>
          </div>
          <StaggerGrid className="metric-grid">
            {copy.metrics.items.map(({ value, label }) => (
              <article className="metric-card" key={label}>
                <Counter className="metric-value" value={value} />
                <h3>{label}</h3>
              </article>
            ))}
          </StaggerGrid>
        </div>
      </section>

      <section className="section stories-collage-section" aria-labelledby="stories-title">
        <div className="container stories-collage">
          <div className="stories-collage-photos stories-collage-photos--left" role="group" aria-label="Illustrative healthcare imagery">
            {storyCollageImages.slice(0, 3).map(({ src, alt, placement }) => (
              <div className={`stories-collage-photo stories-collage-photo--${placement}`} key={src}>
                <Image src={src} alt={alt} fill sizes="(max-width: 760px) 42vw, 18vw" />
              </div>
            ))}
          </div>
          <div className="stories-collage-copy">
            <p className="eyebrow">{copy.stories.eyebrow}</p>
            <h2 id="stories-title">{copy.stories.heading}</h2>
            <p>{copy.stories.description}</p>
            <Button variant="accent" href={localizedHref(locale, "quote")}>
              {copy.stories.primaryAction}<ArrowRight size={17} aria-hidden="true" />
            </Button>
          </div>
          <div className="stories-collage-photos stories-collage-photos--right" role="group" aria-label="Illustrative healthcare imagery">
            {storyCollageImages.slice(3).map(({ src, alt, placement }) => (
              <div className={`stories-collage-photo stories-collage-photo--${placement}`} key={src}>
                <Image src={src} alt={alt} fill sizes="(max-width: 760px) 42vw, 18vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="faq-title">
        <div className="container narrow-content">
          <div className="section-heading"><p className="eyebrow">{copy.faq.eyebrow}</p><h2 id="faq-title">{copy.faq.heading}</h2></div>
          <div className="faq-list">
            {copy.faq.items.map(({ question, answer }, index) => <Reveal key={question} delay={index * 0.055}><AnimatedAccordion className="faq-item" question={question} answer={answer} /></Reveal>)}
          </div>
          <Link className="text-link" href={localizedHref(locale, "faq")}>{copy.faq.link} <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="section cta-section" aria-labelledby="cta-title">
        <div className="container cta-panel cta-panel--with-image">
          <div className="cta-photo"><Image src="/images/slide-02.png" alt="" aria-hidden="true" fill sizes="100vw" /></div>
          <div><p className="eyebrow">{copy.cta.eyebrow}</p><h2 id="cta-title">{copy.cta.heading}</h2><p>{copy.cta.summary}</p></div>
          <div className="hero-actions">
            <Button variant="accent" href={`/${locale}/quote`}>{copy.cta.primaryAction}</Button>
            <Button variant="secondary" href={`/${locale}/contact`}>{copy.cta.secondaryAction}</Button>
          </div>
        </div>
      </section>

      <GoogleReviewsPanel copy={copy.reviews} />

    </main>
  );
}
