import Image from "next/image";
import { CheckCircle2, Plane, ShieldCheck } from "lucide-react";
import { StaticPage } from "@/components/shared/static-page";
import { Button } from "@/components/ui/button";
import { ImageReveal, Reveal, RevealSection } from "@/components/shared/reveal";

const services = [
  "Medical case and report coordination",
  "Hospital and doctor appointment coordination",
  "Medical visa and documentation support",
  "Travel coordination",
  "Airport pickup and local transportation",
  "Accommodation assistance",
  "Hospital coordination",
  "Patient and family support",
  "Post-treatment follow-up coordination",
] as const;

const journey = ["Share your requirement", "Coordinate the case", "Choose your hospital", "Plan your journey", "Travel to India", "Hospital and treatment support", "Return and follow-up"] as const;

export default function MedicalTourismPage() {
  return (
    <StaticPage eyebrow="Medical tourism and patient coordination" title="Your chosen hospital. One coordinated journey." description="MediYatra helps patients and families coordinate practical healthcare travel from Nepal to India and back home.">
      <RevealSection className="section compact-section reveal-section"><div className="medical-tourism-overview"><div className="medical-tourism-intro"><div><Plane size={34} aria-hidden="true" /><h2>Support around your treatment.</h2><p>You choose the hospital and healthcare provider. MediYatra coordinates the practical journey around the treatment, from reports and appointments to travel, accommodation, hospital assistance, and follow-up.</p><Button variant="accent" href="/en/quote">Plan Your Medical Journey</Button></div><Reveal delay={0.08}><ImageReveal className="medical-tourism-photo"><Image src="/images/slide-08.png" alt="Dentist examining a patient during an appointment" fill sizes="(max-width: 760px) 90vw, 42vw" /></ImageReveal></Reveal></div><div className="grid medical-tourism-services">{services.map((service, index) => <Reveal key={service} delay={index * 0.06}><article className="card"><CheckCircle2 size={20} aria-hidden="true" /><h3>{service}</h3><p className="muted">Support is discussed and confirmed according to your requirements and available services.</p></article></Reveal>)}</div></div></RevealSection>
      <RevealSection className="section section-muted compact-section reveal-section"><div className="section-heading"><p className="eyebrow">Patient journey</p><h2>From Nepal to India and back home.</h2></div><div className="grid grid-3">{journey.map((step, index) => <Reveal key={step} delay={index * 0.07}><article className="card"><span className="service-number">{String(index + 1).padStart(2, "0")}</span><h3>{step}</h3></article></Reveal>)}</div></RevealSection>
      <Reveal><p className="notice"><ShieldCheck size={17} aria-hidden="true" /> MediYatra does not provide diagnosis or treatment. Clinical decisions are made by qualified doctors and hospitals.</p></Reveal>
    </StaticPage>
  );
}
