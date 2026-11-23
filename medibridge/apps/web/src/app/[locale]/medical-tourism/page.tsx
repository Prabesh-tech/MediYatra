import Image from "next/image";
import {
  Building2,
  CalendarDays,
  Car,
  CheckCircle2,
  ClipboardList,
  FileText,
  HeartHandshake,
  Plane,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import messages from "@/i18n/messages/en.json";
import { StaticPage } from "@/components/shared/static-page";
import { Button } from "@/components/ui/button";
import { ImageReveal, Reveal, RevealSection } from "@/components/shared/reveal";

const serviceIcons = [
  ClipboardList,
  CalendarDays,
  FileText,
  Plane,
  Car,
  Building2,
  HeartHandshake,
  RefreshCw,
] as const;

const journeyIcons = [UserRound, ClipboardList, HeartHandshake] as const;

export default function MedicalTourismPage({ params }: { params: { locale: string } }) {
  const copy = messages.medicalTourismPage;

  return (
    <StaticPage eyebrow={copy.eyebrow} title={copy.title} description={copy.description}>
      <RevealSection className="section compact-section reveal-section">
        <div className="medical-tourism-overview">
          <div className="medical-tourism-intro">
            <div>
              <Plane size={34} aria-hidden="true" />
              <h2>{copy.overview.heading}</h2>
              <p>{copy.overview.description}</p>
              <Button variant="accent" href={`/${params.locale}/quote`}>{copy.overview.action}</Button>
            </div>
            <Reveal delay={0.08}>
              <ImageReveal className="medical-tourism-photo">
                <Image
                  src="/images/slide-08.png"
                  alt={copy.overview.imageAlt}
                  fill
                  sizes="(max-width: 760px) 90vw, 42vw"
                />
              </ImageReveal>
            </Reveal>
          </div>
          <section aria-labelledby="medical-tourism-services-title">
            <div className="section-heading">
              <p className="eyebrow">{copy.services.eyebrow}</p>
              <h2 id="medical-tourism-services-title">{copy.services.heading}</h2>
            </div>
            <div className="grid medical-tourism-services">
              {copy.services.items.map((service, index) => {
                const Icon = serviceIcons[index];
                return (
                  <Reveal key={service} delay={index * 0.04}>
                    <article className="card">
                      <Icon size={22} aria-hidden="true" />
                      <h3>{service}</h3>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </section>
        </div>
      </RevealSection>

      <RevealSection className="section section-muted compact-section reveal-section" aria-labelledby="medical-tourism-journey-title">
        <div className="section-heading">
          <p className="eyebrow">{copy.journey.eyebrow}</p>
          <h2 id="medical-tourism-journey-title">{copy.journey.heading}</h2>
        </div>
        <div className="grid grid-3 medical-tourism-journey">
          {copy.journey.steps.map((step, index) => {
            const Icon = journeyIcons[index];
            return (
              <Reveal key={step.title} delay={index * 0.07}>
                <article className="card medical-tourism-step">
                  <div className="medical-tourism-step-topline">
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

      <Reveal>
        <p className="notice">
          <ShieldCheck size={17} aria-hidden="true" />
          {copy.safety.notice}
        </p>
      </Reveal>
    </StaticPage>
  );
}
