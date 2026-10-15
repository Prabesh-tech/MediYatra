import Image from "next/image";
import { Home, ShieldCheck, Stethoscope } from "lucide-react";
import { StaticPage } from "@/components/shared/static-page";
import { NursingCareForm } from "@/components/forms/nursing-care-form";
import { ImageReveal, Reveal, RevealSection } from "@/components/shared/reveal";

const services = [
  ["Home nursing visits", "Scheduled nursing support at the patient's home."],
  ["Post-hospital care", "Support after discharge, coordinated around the treating professional's instructions."],
  ["Elderly care support", "Assistance for elderly patients who require regular care and monitoring."],
  ["Wound and dressing care", "Appropriate wound and dressing support as prescribed."],
  ["Medication support", "Help with medication routines according to professional instructions."],
  ["Basic patient monitoring", "Monitoring and recording relevant patient observations as appropriate."],
] as const;

export default function NursingCarePage() {
  return (
    <StaticPage eyebrow="Nursing care at home" title="Professional nursing care, right at your doorstep." description="Tell us what kind of support you need, and our team will help arrange an appropriate nursing service where available.">
      <RevealSection className="section compact-section reveal-section">
        <div className="split-section">
          <div><Stethoscope size={34} aria-hidden="true" /><h2>Care arranged around your needs.</h2><p>MediYatra helps arrange nursing support at home through scheduled appointments, subject to availability.</p><p className="notice"><ShieldCheck size={17} aria-hidden="true" /> Nursing scope and availability are confirmed with qualified professionals before an appointment is arranged.</p><Reveal delay={0.08}><ImageReveal className="nursing-page-photo"><Image src="/images/nurse-care.png" alt="Nurse preparing care equipment" fill sizes="(max-width: 760px) 90vw, 42vw" /></ImageReveal></Reveal></div>
          <div className="grid grid-2">{services.map(([title, summary], index) => <Reveal key={title} delay={index * 0.06}><article className="card"><Home size={20} aria-hidden="true" /><h3>{title}</h3><p className="muted">{summary}</p></article></Reveal>)}</div>
        </div>
      </RevealSection>
      <RevealSection className="section compact-section reveal-section" aria-labelledby="book-nursing-title"><div className="section-heading"><p className="eyebrow">Online nursing appointment</p><h2 id="book-nursing-title">Book a nursing visit.</h2></div><NursingCareForm /></RevealSection>
    </StaticPage>
  );
}
