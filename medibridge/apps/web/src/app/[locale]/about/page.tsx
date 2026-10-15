import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
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

const journeySteps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Share your requirement",
    description: "Tell us what support you are looking for and share relevant referral information.",
  },
  {
    number: "02",
    icon: HeartHandshake,
    title: "Coordinate the details",
    description: "We help organize the practical steps around appointments, travel, documents, and accommodation.",
  },
  {
    number: "03",
    icon: UserRound,
    title: "Choose your care team",
    description: "You choose your preferred hospital and healthcare provider. We support the journey around your decision.",
  },
] as const;

export default function AboutPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;

  return (
    <StaticPage
      eyebrow="About MediYatra"
      title="Your healthcare journey, coordinated with care."
      description="MediYatra is a healthcare coordination and medical travel support company based in Nepal, helping patients and families navigate care in India with greater clarity and convenience."
    >
      <div className="about-page">
        <RevealSection className="about-intro reveal-section" aria-labelledby="about-intro-title">
          <div className="about-intro-copy">
            <p className="eyebrow">A steady point of support</p>
            <h2 id="about-intro-title">Practical help for a journey that can feel complicated.</h2>
            <p>
              Choosing a hospital, coordinating appointments, arranging travel and accommodation,
              preparing documentation, and finding local support can involve many moving parts.
              MediYatra brings these practical details together under one coordinated journey.
            </p>
            <p>
              From the first enquiry through hospital coordination, travel planning, and follow-up
              support, we help patients and families understand and organize the next steps.
            </p>
            <Link className="text-link about-inline-link" href={`/${locale}/medical-tourism`}>
              Explore medical tourism coordination <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="about-intro-visual">
            <div className="about-intro-photo">
              <Image src="/images/slide-02.png" alt="Nurse supporting an older patient during a hospital stay" fill sizes="(max-width: 760px) 90vw, 40vw" priority />
            </div>
            <div className="about-route-panel" aria-label="A coordinated journey from Nepal to India and home">
              <span className="about-route-label"><MapPin size={16} aria-hidden="true" /> NEPAL TO INDIA AND BACK HOME</span>
              <div className="about-route-stops">
                <span className="about-route-stop"><span className="about-route-icon"><MapPin size={21} aria-hidden="true" /></span><strong>Nepal</strong><small>Start with your needs</small></span>
                <span className="about-route-line" aria-hidden="true"><ArrowRight size={19} /></span>
                <span className="about-route-stop"><span className="about-route-icon"><Plane size={21} aria-hidden="true" /></span><strong>India</strong><small>Your chosen provider</small></span>
                <span className="about-route-line" aria-hidden="true"><ArrowRight size={19} /></span>
                <span className="about-route-stop"><span className="about-route-icon"><Home size={21} aria-hidden="true" /></span><strong>Home</strong><small>Follow-up coordination</small></span>
              </div>
              <p className="about-route-footnote">One point of coordination for the practical parts of your journey.</p>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="about-choice reveal-section" aria-labelledby="about-choice-title">
          <span className="about-choice-icon"><ShieldCheck size={25} aria-hidden="true" /></span>
          <div>
            <p className="eyebrow">Your choice comes first</p>
            <h2 id="about-choice-title">You choose the hospital and healthcare provider.</h2>
            <p>
              MediYatra coordinates practical arrangements around your care. Qualified doctors
              and hospitals make all diagnosis, treatment, and clinical decisions.
            </p>
          </div>
        </RevealSection>

        <RevealSection className="about-journey-section reveal-section" aria-labelledby="about-journey-title">
          <div className="section-heading">
            <p className="eyebrow">How we support your journey</p>
            <h2 id="about-journey-title">Clear steps. Your decisions at the center.</h2>
            <p>We help bring the practical details into view, so you and your family can plan the next step with greater clarity.</p>
          </div>
          <div className="grid grid-3 about-journey-grid">
            {journeySteps.map(({ number, icon: Icon, title, description }, index) => (
              <Reveal key={number} delay={index * 0.08}>
                <article className="card about-step-card">
                  <div className="about-step-topline">
                    <span className="service-number">{number}</span>
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <h3>{title}</h3>
                  <p className="muted">{description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </RevealSection>

        <RevealSection className="about-services-section reveal-section" aria-labelledby="about-services-title">
          <div className="section-heading">
            <p className="eyebrow">How we can help</p>
            <h2 id="about-services-title">Coordination for travel and support at home.</h2>
          </div>
          <div className="grid grid-2 about-services-grid">
            <Reveal delay={0}><Link className="card about-service-card" href={`/${locale}/medical-tourism`}>
              <span className="about-service-icon"><Plane size={24} aria-hidden="true" /></span>
              <span className="service-number">01</span>
              <h3>Medical tourism and patient coordination</h3>
              <p className="muted">Assistance with appointments, documentation, travel, accommodation, and practical hospital coordination for your chosen provider.</p>
              <span className="text-link">Explore coordination <ArrowRight size={16} aria-hidden="true" /></span>
            </Link></Reveal>
            <Reveal delay={0.08}><Link className="card about-service-card" href={`/${locale}/nursing-care`}>
              <span className="about-service-icon"><Home size={24} aria-hidden="true" /></span>
              <span className="service-number">02</span>
              <h3>Nursing care at home</h3>
              <p className="muted">Request scheduled nursing support at home. The team can discuss your needs and service availability.</p>
              <span className="text-link">Explore nursing care <ArrowRight size={16} aria-hidden="true" /></span>
            </Link></Reveal>
          </div>
        </RevealSection>

        <RevealSection className="about-team-note reveal-section" aria-labelledby="about-team-title">
          <div className="about-team-note-icon"><UserRound size={23} aria-hidden="true" /></div>
          <div>
            <p className="eyebrow">People and credentials</p>
            <h2 id="about-team-title">We share details when they are verified.</h2>
            <p>
              Team profiles and company credentials are being confirmed before publication.
              MediYatra does not claim hospital accreditation on behalf of any provider.
            </p>
          </div>
          <Link className="text-link about-team-link" href={`/${locale}/team`}>
            Meet the team <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </RevealSection>

        <RevealSection className="about-cta reveal-section" aria-labelledby="about-cta-title">
          <div>
            <p className="eyebrow">We are here to help you plan</p>
            <h2 id="about-cta-title">Tell us what support you need.</h2>
            <p>Start a conversation about your healthcare journey or request nursing care at home.</p>
          </div>
          <div className="hero-actions">
            <Button variant="accent" href={`/${locale}/quote`}>Plan your medical journey <ArrowRight size={17} aria-hidden="true" /></Button>
            <Button variant="secondary" href={`/${locale}/contact`}>Talk to our team</Button>
          </div>
        </RevealSection>
      </div>
    </StaticPage>
  );
}
