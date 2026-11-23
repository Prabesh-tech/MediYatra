import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  ClipboardCheck,
  FileText,
  MapPinned,
  ShieldCheck,
} from "lucide-react";
import { StaticPage } from "@/components/shared/static-page";
import { localizedHref } from "@/config/site";
import { Button } from "@/components/ui/button";

const coordinationSupport = [
  {
    icon: CalendarDays,
    title: "Appointment requests",
    description: "Coordinate appointment requests with the provider you select.",
  },
  {
    icon: FileText,
    title: "Records and documents",
    description: "Organize reports and documentation for sharing with your provider.",
  },
  {
    icon: MapPinned,
    title: "Travel arrangements",
    description: "Plan practical travel, accommodation, and local transport details.",
  },
] as const;

const visitSteps = [
  {
    title: "Choose your provider",
    description: "Select the clinic or hospital that fits your needs.",
  },
  {
    title: "Share your request",
    description: "Tell us what practical coordination you are looking for.",
  },
  {
    title: "Confirm the details",
    description: "Check appointments, availability, fees, and arrangements with the provider.",
  },
  {
    title: "Prepare for your visit",
    description: "Organize documents and travel after the plans are confirmed.",
  },
] as const;

export default function ClinicPage({ params }: { params: { locale: string } }) {
  return (
    <StaticPage
      eyebrow="Clinic coordination"
      title="Support for visits to your chosen clinic"
      description="MediYatra helps coordinate practical arrangements around care with a provider you choose. We are not a clinic or hospital."
    >
      <div className="clinic-coordination-page">
        <section className="clinic-coordination-intro" aria-labelledby="clinic-intro-title">
          <div className="clinic-coordination-intro-copy">
            <p className="eyebrow">Your provider, your decision</p>
            <h2 id="clinic-intro-title">A clearer path to your appointment</h2>
            <p>
              From appointment requests and document organization to travel planning,
              MediYatra can support the practical details around a visit to your chosen
              provider.
            </p>
            <Button variant="accent" href={localizedHref(params.locale, "quote")}>
              Request coordination <ArrowRight size={17} aria-hidden="true" />
            </Button>
          </div>
          <div className="clinic-coordination-image">
            <Image
              src="/images/slide-04.png"
              alt="Patient and care team discussing care and travel arrangements"
              fill
              sizes="(max-width: 760px) 90vw, 45vw"
            />
          </div>
        </section>

        <section className="clinic-coordination-support" aria-labelledby="clinic-support-title">
          <div className="section-heading">
            <p className="eyebrow">Practical help</p>
            <h2 id="clinic-support-title">Coordination for the details around care</h2>
            <p>Support options depend on your request and are confirmed before arrangements are made.</p>
          </div>
          <div className="clinic-coordination-support-grid">
            {coordinationSupport.map(({ icon: Icon, title, description }) => (
              <article className="clinic-coordination-card" key={title}>
                <span className="clinic-coordination-icon"><Icon size={21} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="clinic-coordination-steps" aria-labelledby="clinic-steps-title">
          <div className="section-heading">
            <p className="eyebrow">How it works</p>
            <h2 id="clinic-steps-title">Plan your visit in clear steps</h2>
          </div>
          <ol className="clinic-coordination-step-list">
            {visitSteps.map((step, index) => (
              <li className="clinic-coordination-step" key={step.title}>
                <span className="clinic-coordination-step-number">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="clinic-coordination-boundary" aria-labelledby="clinic-boundary-title">
          <span className="clinic-coordination-icon"><ShieldCheck size={22} aria-hidden="true" /></span>
          <div>
            <p className="eyebrow">Clear roles</p>
            <h2 id="clinic-boundary-title">Clinical decisions stay with your care team</h2>
            <p>
              MediYatra supports practical coordination; your chosen clinic or hospital
              and qualified doctors provide medical care. Treatment decisions are made
              by your doctor and hospital.
            </p>
          </div>
          <ClipboardCheck className="clinic-coordination-boundary-mark" size={38} aria-hidden="true" />
        </section>

        <section className="clinic-coordination-cta" aria-labelledby="clinic-cta-title">
          <div>
            <p className="eyebrow">Take the next step</p>
            <h2 id="clinic-cta-title">Tell us what support you need</h2>
            <p>We can discuss practical coordination for your planned visit.</p>
          </div>
          <div className="clinic-coordination-cta-actions">
            <Button variant="accent" href={localizedHref(params.locale, "quote")}>
              Request coordination <ArrowRight size={17} aria-hidden="true" />
            </Button>
            <Button variant="secondary" href={localizedHref(params.locale, "contact")}>
              Contact MediYatra
            </Button>
          </div>
        </section>
      </div>
    </StaticPage>
  );
}
