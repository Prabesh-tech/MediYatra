import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { StaticPage } from "@/components/shared/static-page";
import { Reveal, RevealSection } from "@/components/shared/reveal";

export default function SuccessStoriesPage() {
  return (
    <StaticPage eyebrow="Success stories" title="Real journeys, shared with permission." description="Patient experiences will be published only after a completed journey, verified consent, and careful moderation.">
      <RevealSection className="card review-card reveal-section"><Star size={28} color="var(--teal)" aria-hidden="true" /><h2 style={{ marginTop: "1rem" }}>Stories are being prepared.</h2><p className="muted">MediYatra will share practical experiences from patients and families when they have chosen to publish them. We will never invent outcomes, promise results, or publish personal health details without permission.</p><Link className="text-link" href="/en/contact">Talk to our team <ArrowRight size={15} aria-hidden="true" /></Link></RevealSection>
      <RevealSection className="section compact-section reveal-section"><div className="grid grid-3">
        <Reveal delay={0}><article className="card"><h3>What we will share</h3><p className="muted">The coordination experience, practical steps, and lessons that may help another family plan.</p></article></Reveal>
        <Reveal delay={0.08}><article className="card"><h3>What we will protect</h3><p className="muted">Private medical records, unnecessary identifying details, and any information shared without clear consent.</p></article></Reveal>
        <Reveal delay={0.16}><article className="card"><h3>What we cannot promise</h3><p className="muted">A cure, a specific outcome, or that any hospital or treatment is right for every patient.</p></article></Reveal>
      </div></RevealSection>
    </StaticPage>
  );
}
