import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  HeartHandshake,
  Home,
  MapPin,
  Plane,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StaticPage } from "@/components/shared/static-page";
import { Reveal, RevealSection } from "@/components/shared/reveal";
import { localizedHref } from "@/config/site";
import messages from "@/i18n/messages/en.json";

const journeyIcons = [ClipboardList, HeartHandshake, UserRound] as const;
const serviceIcons = [Plane, Home] as const;
const valueIcons = [HeartHandshake, ShieldCheck, ClipboardList] as const;
const journeyStops = [
  { title: "Plan", detail: "Share what support you need", icon: ClipboardList },
  { title: "Coordinate", detail: "Organize practical arrangements", icon: Plane },
  { title: "Continue", detail: "Plan support for the return home", icon: Home },
] as const;

export default function AboutPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const copy = messages.aboutPage;

  return (
    <StaticPage eyebrow={copy.eyebrow} title={copy.title} description={copy.description}>
      <div className="about-page">
        <RevealSection className="about-intro reveal-section" aria-labelledby="about-intro-title">
          <div className="about-intro-copy">
            <p className="eyebrow">{copy.story.eyebrow}</p>
            <h2 id="about-intro-title">{copy.story.heading}</h2>
            <p className="about-intro-description">{copy.story.description}</p>
            <ul className="about-story-list">
              {copy.story.bullets.map((item) => (
                <li key={item}><CheckCircle2 size={18} aria-hidden="true" />{item}</li>
              ))}
            </ul>
            <Link className="text-link about-inline-link" href={localizedHref(locale, "medical-tourism")}>
              {copy.story.action}<ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="about-intro-visual">
            <div className="about-intro-photo">
              <Image
                src="/images/slide-02.png"
                alt="Nurse supporting an older patient during a hospital stay"
                fill
                sizes="(max-width: 760px) 90vw, 40vw"
                priority
              />
            </div>
            <div className="about-route-panel" aria-label={copy.route.ariaLabel}>
              <span className="about-route-label"><MapPin size={16} aria-hidden="true" />{copy.route.label}</span>
              <div className="about-route-stops">
                {copy.route.stops.map((stop, index) => {
                  const Icon = index === 0 ? MapPin : index === 1 ? Plane : Home;
                  return (
                    <Fragment key={stop.title}>
                      <span className="about-route-stop">
                        <span className="about-route-icon"><Icon size={21} aria-hidden="true" /></span>
                        <strong>{stop.title}</strong>
                        <small>{stop.description}</small>
                      </span>
                      {index < copy.route.stops.length - 1 && (
                        <span className="about-route-line" aria-hidden="true"><ArrowRight size={19} /></span>
                      )}
                    </Fragment>
                  );
                })}
              </div>
              <p className="about-route-footnote">{copy.route.footnote}</p>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="about-principles-section reveal-section" aria-labelledby="about-principles-title">
          <div className="about-principles-image">
            <Image
              src="/images/slide-05.png"
              alt="Healthcare professionals coordinating practical support"
              fill
              sizes="(max-width: 760px) 90vw, 43vw"
            />
            <span>{copy.principles.imageCaption}</span>
          </div>
          <div className="about-principles-copy">
            <p className="eyebrow">{copy.principles.eyebrow}</p>
            <h2 id="about-principles-title">{copy.principles.heading}</h2>
            <p>{copy.principles.description}</p>
            <div className="about-purpose-grid">
              <article>
                <span className="about-purpose-label">{copy.principles.missionLabel}</span>
                <p>{copy.principles.mission}</p>
              </article>
              <article>
                <span className="about-purpose-label">{copy.principles.visionLabel}</span>
                <p>{copy.principles.vision}</p>
              </article>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="about-choice reveal-section" aria-labelledby="about-choice-title">
          <span className="about-choice-icon"><ShieldCheck size={25} aria-hidden="true" /></span>
          <div>
            <p className="eyebrow">{copy.choice.eyebrow}</p>
            <h2 id="about-choice-title">{copy.choice.heading}</h2>
            <p>{copy.choice.clinicalNotice}</p>
          </div>
        </RevealSection>

        <RevealSection className="about-values-section reveal-section" aria-labelledby="about-values-title">
          <div className="section-heading">
            <p className="eyebrow">{copy.values.eyebrow}</p>
            <h2 id="about-values-title">{copy.values.heading}</h2>
            <p>{copy.values.description}</p>
          </div>
          <div className="about-values-grid">
            {copy.values.items.map((value, index) => {
              const Icon = valueIcons[index];
              return (
                <Reveal key={value.title} delay={index * 0.06}>
                  <article className="about-value-card">
                    <span className="about-value-icon"><Icon size={21} aria-hidden="true" /></span>
                    <h3>{value.title}</h3>
                    <p>{value.description}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </RevealSection>

        <RevealSection className="about-journey-band reveal-section" aria-labelledby="about-band-title">
          <div className="about-journey-band-heading">
            <p className="eyebrow">{copy.journeyBand.eyebrow}</p>
            <h2 id="about-band-title">{copy.journeyBand.heading}</h2>
            <p>{copy.journeyBand.description}</p>
          </div>
          <div className="about-journey-band-stops">
            {journeyStops.map(({ title, detail, icon: Icon }, index) => (
              <div className="about-journey-band-stop" key={title}>
                <span className="about-journey-band-icon"><Icon size={21} aria-hidden="true" /></span>
                <span className="about-journey-band-number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{detail}</p>
              </div>
            ))}
          </div>
        </RevealSection>

        <RevealSection className="about-journey-section reveal-section" aria-labelledby="about-journey-title">
          <div className="section-heading">
            <p className="eyebrow">{copy.journey.eyebrow}</p>
            <h2 id="about-journey-title">{copy.journey.heading}</h2>
          </div>
          <div className="grid grid-3 about-journey-grid">
            {copy.journey.steps.map((step, index) => {
              const Icon = journeyIcons[index];
              return (
                <Reveal key={step.title} delay={index * 0.08}>
                  <article className="card about-step-card">
                    <div className="about-step-topline">
                      <span className="service-number">{String(index + 1).padStart(2, "0")}</span>
                      <Icon size={24} aria-hidden="true" />
                    </div>
                    <h3>{step.title}</h3>
                    <p className="muted">{step.description}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </RevealSection>

        <RevealSection className="about-services-section reveal-section" aria-labelledby="about-services-title">
          <div className="section-heading">
            <p className="eyebrow">{copy.services.eyebrow}</p>
            <h2 id="about-services-title">{copy.services.heading}</h2>
          </div>
          <div className="grid grid-2 about-services-grid">
            {copy.services.items.map((service, index) => {
              const Icon = serviceIcons[index];
              const href = index === 0 ? "medical-tourism" : "nursing-care";
              return (
                <Reveal key={service.title} delay={index * 0.08}>
                  <Link className="card about-service-card" href={localizedHref(locale, href)}>
                    <span className="about-service-icon"><Icon size={24} aria-hidden="true" /></span>
                    <span className="service-number">{String(index + 1).padStart(2, "0")}</span>
                    <h3>{service.title}</h3>
                    <p className="muted">{service.description}</p>
                    <span className="text-link">{service.action}<ArrowRight size={16} aria-hidden="true" /></span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </RevealSection>

        <RevealSection className="about-team-note reveal-section" aria-labelledby="about-team-title">
          <div className="about-team-note-icon"><UserRound size={23} aria-hidden="true" /></div>
          <div>
            <p className="eyebrow">{copy.team.eyebrow}</p>
            <h2 id="about-team-title">{copy.team.heading}</h2>
            <p className="about-team-description">{copy.team.description}</p>
          </div>
          <Link className="text-link about-team-link" href={localizedHref(locale, "team")}>
            {copy.team.action}<ArrowRight size={16} aria-hidden="true" />
          </Link>
          <div className="about-team-gallery" aria-label={copy.team.imageGalleryLabel}>
            {copy.team.images.map((image) => (
              <figure className="about-team-image" key={image.src}>
                <Image src={image.src} alt={image.alt} fill sizes="(max-width: 680px) 50vw, 33vw" />
                <figcaption>{copy.team.imageLabel}</figcaption>
              </figure>
            ))}
          </div>
        </RevealSection>

        <RevealSection className="about-stories-feature reveal-section" aria-labelledby="about-stories-title">
          <div className="about-stories-image">
            <Image
              src="/images/slide-03.png"
              alt="Patient and doctor in a consultation"
              fill
              sizes="(max-width: 760px) 90vw, 38vw"
            />
          </div>
          <div>
            <p className="eyebrow">{copy.stories.eyebrow}</p>
            <h2 id="about-stories-title">{copy.stories.heading}</h2>
            <p>{copy.stories.description}</p>
            <Link className="text-link" href={localizedHref(locale, "success-stories")}>
              {copy.stories.action}<ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </RevealSection>

        <RevealSection className="about-cta reveal-section" aria-labelledby="about-cta-title">
          <div>
            <p className="eyebrow">{copy.cta.eyebrow}</p>
            <h2 id="about-cta-title">{copy.cta.heading}</h2>
            <p>{copy.cta.summary}</p>
          </div>
          <div className="hero-actions">
            <Button variant="accent" href={localizedHref(locale, "quote")}>
              {copy.cta.primaryAction}<ArrowRight size={17} aria-hidden="true" />
            </Button>
            <Button variant="secondary" href={localizedHref(locale, "contact")}>
              {copy.cta.secondaryAction}
            </Button>
          </div>
        </RevealSection>
      </div>
    </StaticPage>
  );
}
