import Image from "next/image";
import {
  Activity,
  CalendarCheck,
  Clock3,
  ClipboardCheck,
  HeartPulse,
  Home,
  Stethoscope,
} from "lucide-react";
import messages from "@/i18n/messages/en.json";
import { NursingCareForm } from "@/components/forms/nursing-care-form";
import { StaticPage } from "@/components/shared/static-page";
import { ImageReveal, Reveal, RevealSection } from "@/components/shared/reveal";

const serviceIcons = [Home, ClipboardCheck, HeartPulse, Activity, CalendarCheck, Stethoscope] as const;
const journeyIcons = [ClipboardCheck, Clock3, CalendarCheck] as const;

export default function NursingCarePage({ params }: { params: { locale: string } }) {
  const copy = messages.nursingCarePage;

  return (
    <StaticPage eyebrow={copy.eyebrow} title={copy.title} description={copy.description}>
      <RevealSection className="section compact-section reveal-section">
        <div className="nursing-care-overview">
          <div className="nursing-care-intro">
            <div>
              <Stethoscope size={34} aria-hidden="true" />
              <h2>{copy.overview.heading}</h2>
              <p>{copy.overview.description} {copy.overview.scopeNotice}</p>
            </div>
            <Reveal delay={0.08}>
              <ImageReveal className="nursing-page-photo">
                <Image
                  src="/images/nurse-care.png"
                  alt={copy.overview.imageAlt}
                  fill
                  sizes="(max-width: 760px) 90vw, 42vw"
                />
              </ImageReveal>
            </Reveal>
          </div>

          <section aria-labelledby="nursing-services-title">
            <div className="section-heading">
              <p className="eyebrow">{copy.services.eyebrow}</p>
              <h2 id="nursing-services-title">{copy.services.heading}</h2>
            </div>
            <div className="grid grid-2 nursing-care-services">
              {copy.services.items.map((service, index) => {
                const Icon = serviceIcons[index];
                return (
                  <Reveal key={service.title} delay={index * 0.04}>
                    <details className="card nursing-care-service">
                      <summary>
                        <Icon size={22} aria-hidden="true" />
                        <span>
                          <h3>{service.title}</h3>
                          <span className="nursing-care-service-action">{copy.services.detailsAction}</span>
                        </span>
                      </summary>
                      <p className="muted">{service.description}</p>
                    </details>
                  </Reveal>
                );
              })}
            </div>
          </section>
        </div>
      </RevealSection>

      <RevealSection className="section section-muted compact-section reveal-section" aria-labelledby="nursing-journey-title">
        <div className="section-heading">
          <p className="eyebrow">{copy.journey.eyebrow}</p>
          <h2 id="nursing-journey-title">{copy.journey.heading}</h2>
        </div>
        <div className="grid grid-3 nursing-care-journey">
          {copy.journey.steps.map((step, index) => {
            const Icon = journeyIcons[index];
            return (
              <Reveal key={step.title} delay={index * 0.07}>
                <article className="card nursing-care-step">
                  <div className="nursing-care-step-topline">
                    <span className="service-number">{String(index + 1).padStart(2, "0")}</span>
                    <Icon size={23} aria-hidden="true" />
                  </div>
                  <h3>{step.title}</h3>
                  <p className="muted">{step.description}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </RevealSection>

      <RevealSection
        className="section compact-section reveal-section"
        aria-labelledby="book-nursing-title"
      >
        <div className="section-heading">
          <p className="eyebrow">{copy.form.eyebrow}</p>
          <h2 id="book-nursing-title">{copy.form.heading}</h2>
        </div>
        <NursingCareForm
          locale={params.locale}
          copy={copy.form}
          careTypes={copy.services.items.map(({ title }) => title)}
        />
      </RevealSection>

    </StaticPage>
  );
}
