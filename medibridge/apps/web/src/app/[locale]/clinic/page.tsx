import { Building2, ClipboardCheck, MapPin } from "lucide-react";
import { StaticPage } from "@/components/shared/static-page";
import { Button } from "@/components/ui/button";

const support = [
  [MapPin, "Location and access", "Review practical location, accessibility, transport, and accommodation questions before travelling."],
  [ClipboardCheck, "Hospital coordination", "Organize appointment requests, documentation, communication, and admission-related questions."],
  [Building2, "Your chosen provider", "You choose the hospital and doctor. MediYatra supports the practical coordination around your decision."],
] as const;

export default function ClinicPage() {
  return (
    <StaticPage eyebrow="Clinic coordination" title="Practical support around your chosen clinic or hospital." description="MediYatra helps patients coordinate questions, appointments, documents, travel, and local arrangements. Treatment is provided by qualified healthcare professionals.">
      <div className="grid grid-3">{support.map(([Icon, title, description]) => <article className="card" key={title}><Icon size={28} color="var(--teal)" aria-hidden="true" /><h2 style={{ marginTop: "1rem" }}>{title}</h2><p className="muted">{description}</p></article>)}</div>
      <section className="section compact-section"><div className="cta-panel"><div><p className="eyebrow">Need help planning?</p><h2>Start with your requirement.</h2><p>Share what you are exploring and our team can help coordinate the next practical steps.</p></div><Button variant="accent" href="/en/quote">Plan Your Medical Journey</Button></div></section>
    </StaticPage>
  );
}
