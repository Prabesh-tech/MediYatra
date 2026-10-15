import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Baby,
  Bone,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  HeartPulse,
  Microscope,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
  Plane,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";

const treatmentAreas = [
  { name: "Cardiac care", slug: "cardiac-care", Icon: HeartPulse },
  { name: "Orthopedics", slug: "orthopedics", Icon: Bone },
  { name: "Cancer care", slug: "cancer-care", Icon: Microscope },
  { name: "Fertility and IVF", slug: "fertility-ivf", Icon: Baby },
  { name: "Dental care", slug: "dental-care", Icon: Smile },
  { name: "Cosmetic care", slug: "cosmetic-care", Icon: Sparkles },
  { name: "Eye care", slug: "eye-care", Icon: Eye },
  { name: "Transplant consultation", slug: "transplant-consultation", Icon: Activity },
  { name: "Bariatric care", slug: "bariatric-care", Icon: Stethoscope },
  { name: "Wellness and Ayurveda", slug: "wellness-ayurveda", Icon: Sparkles },
];

const steps = [
  ["01", "Tell us what you need", "Share your goals and the kind of care you are exploring."],
  ["02", "Arrange a clinical review", "With your permission, relevant records can be shared securely for review."],
  ["03", "Review your options", "Compare written treatment information, provider credentials, and itemized estimates."],
  ["04", "Plan the journey", "Coordinate timing, travel questions, accessibility, and interpretation needs."],
  ["05", "Stay connected", "Keep your inquiry, appointments, documents, and follow-up questions together."],
] as const;

const guideCards = [
  ["Choosing a care provider", "Questions to ask when comparing hospitals and clinical teams."],
  ["Preparing medical records", "A practical checklist for organizing documents before a consultation."],
  ["Planning follow-up care", "Topics to discuss with your treating team before travelling home."],
] as const;

const faqs = [
  ["Does Mediyatra provide medical advice?", "No. Mediyatra helps organize information and care coordination. Diagnosis and treatment decisions belong to qualified clinicians who know your case."],
  ["Are hospitals and doctors already listed?", "Provider listings are being reviewed. We will publish profiles only after credentials, permissions, and listing details have been checked."],
  ["How much does treatment in Nepal cost?", "Costs depend on the individual case and provider. No prices are published in this launch build; request an estimate based on a written clinical plan."],
  ["Can I share reports securely?", "The inquiry flow supports short-lived, private upload links for PDF and JPG files. Avoid sending health records through ordinary email or chat."],
];

export function HomeContent({ locale, title, eyebrow }: { locale: string; title: string; eyebrow: string }) {
  return (
    <main>
      <section className="hero" aria-labelledby="home-title">
        <div className="container hero-content">
          <p className="eyebrow">{eyebrow}</p>
          <h1 id="home-title">{title}</h1>
          <p>Explore care options in Nepal with clear information, thoughtful coordination, and control over what you share.</p>
          <div className="hero-actions">
            <Button variant="accent" href={`/${locale}/quote`}>Get a free quote</Button>
            <Button variant="secondary" href={`/${locale}/contact`}>Talk with our team</Button>
          </div>
        </div>
        <div className="container hero-visual">
          <Image
            className="hero-image"
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2400&q=85"
            alt="A clinician discussing care with a patient in a bright consultation room"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 1280px"
          />
        </div>
        <div className="container hero-search-wrap">
          <form className="hero-search" action={`/${locale}/treatments`} method="get">
            <div className="field">
              <label htmlFor="hero-treatment">What care are you exploring?</label>
              <select id="hero-treatment" name="q" defaultValue="">
                <option value="">Choose a treatment area</option>
                {treatmentAreas.map((treatment) => <option key={treatment.slug} value={treatment.name}>{treatment.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="hero-destination">Location</label>
              <select id="hero-destination" name="destination" defaultValue="Nepal">
                <option value="Nepal">Nepal</option>
              </select>
            </div>
            <button className="button button-primary" type="submit"><ArrowRight size={17} aria-hidden="true" /> Explore options</button>
          </form>
        </div>
      </section>

      <section className="trust-strip" aria-label="Mediyatra service commitments">
        <div className="container trust-items">
          <div className="trust-item"><ShieldCheck size={20} color="var(--teal)" aria-hidden="true" /> Privacy-aware coordination</div>
          <div className="trust-item"><ClipboardCheck size={20} color="var(--teal)" aria-hidden="true" /> Written options and estimates</div>
          <div className="trust-item"><CheckCircle2 size={20} color="var(--teal)" aria-hidden="true" /> Provider verification in progress</div>
          <div className="trust-item"><Plane size={20} color="var(--teal)" aria-hidden="true" /> Travel planning support</div>
        </div>
      </section>

      <section className="section" aria-labelledby="treatment-areas-title">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Explore care</p>
            <h2 id="treatment-areas-title">Start with the care you are looking for</h2>
            <p>These are broad areas for navigation, not treatment recommendations. A clinician must assess what is appropriate for you.</p>
          </div>
          <div className="grid grid-4">
            {treatmentAreas.map(({ name, slug, Icon }, index) => (
              <Reveal key={slug} delay={index * 0.025}>
                <Link className="card treatment-card" href={`/${locale}/treatments/${slug}`}>
                  <span className="treatment-icon"><Icon size={21} aria-hidden="true" /></span>
                  <span><strong>{name}</strong><br /><span className="muted">Explore information <ArrowRight size={14} aria-hidden="true" /></span></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section surface-blue" aria-labelledby="how-title" id="how-it-works">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">How it works</p>
            <h2 id="how-title">A clear process, one step at a time</h2>
            <p>You decide what to share and when. Clinical decisions stay with you and your qualified treating team.</p>
          </div>
          <div className="grid grid-3">
            {steps.map(([number, titleText, description]) => (
              <article className="card" key={number}>
                <span className="step-number">{number}</span>
                <h3 style={{ marginTop: "1rem" }}>{titleText}</h3>
                <p className="muted">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="providers-title">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Verified directory</p>
            <h2 id="providers-title">Hospitals and clinicians</h2>
            <p>We are preparing a directory with credential and listing checks. No provider profile is presented as verified before review.</p>
          </div>
          <div className="grid grid-2">
            <Reveal>
              <div className="empty-state">
                <ShieldCheck size={28} color="var(--teal)" aria-hidden="true" />
                <h3>Hospital directory in review</h3>
                <p className="muted">Verified listings will appear here when their details and permissions are confirmed.</p>
                <Link className="text-link" href={`/${locale}/hospitals`}>View directory status</Link>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="empty-state">
                <Stethoscope size={28} color="var(--blue)" aria-hidden="true" />
                <h3>Doctor profiles in review</h3>
                <p className="muted">Qualifications, specialties, and affiliations will be shown only after verification.</p>
                <Link className="text-link" href={`/${locale}/doctors`}>View directory status</Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section surface-teal" aria-labelledby="cost-title">
        <div className="container split-section">
          <div>
            <p className="eyebrow">Transparent planning</p>
            <h2 id="cost-title">Understand the full estimate before you decide</h2>
            <p className="muted">A responsible estimate depends on your records, the proposed clinical plan, provider charges, travel dates, and support needs. We do not publish unverified price comparisons.</p>
            <div className="disclaimer">A quote is an estimate, not a clinical recommendation or guarantee. Confirm the treatment plan and all charges directly with the treating provider.</div>
            <p style={{ marginTop: "1.25rem" }}><Button variant="accent" href={`/${locale}/quote`}>Request an estimate</Button></p>
          </div>
          <div className="card">
            <h3>What to ask for in writing</h3>
            <ul>
              <li>Clinical plan and what it includes</li>
              <li>Provider, facility, and clinician charges</li>
              <li>Possible additional tests or care</li>
              <li>Travel, accommodation, and follow-up costs</li>
              <li>Currency, payment schedule, and cancellation terms</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="nepal-title">
        <div className="container split-section">
          <div className="photo-frame">
            <Image
              src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
              alt="Mountain landscape in Nepal"
              fill
              sizes="(max-width: 760px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div>
            <p className="eyebrow">Destination guide</p>
            <h2 id="nepal-title">Plan for the journey as well as the appointment</h2>
            <p className="muted">Travel requirements, accessibility, accommodation, and recovery arrangements vary. Confirm current visa and travel information with official sources and your care team.</p>
            <p><Link className="text-link" href={`/${locale}/destinations/nepal`}>Explore Nepal planning information <ArrowRight size={15} aria-hidden="true" /></Link></p>
          </div>
        </div>
      </section>

      <section className="section surface-blue" aria-labelledby="stories-title">
        <div className="container split-section">
          <div>
            <p className="eyebrow">Patient stories</p>
            <h2 id="stories-title">Trust is built with permission and transparency</h2>
            <p className="muted">We do not use fictional testimonials or imply outcomes. Patient stories will be published only with documented, informed permission.</p>
          </div>
          <div className="empty-state">
            <ShieldCheck size={28} color="var(--teal)" aria-hidden="true" />
            <h3>No stories published yet</h3>
            <p className="muted">When consented stories are available, this space will include the patient’s own experience and its limitations.</p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="packages-title">
        <div className="container split-section">
          <div>
            <p className="eyebrow">Travel support</p>
            <h2 id="packages-title">Coordinate the details around your care</h2>
            <p className="muted">Depending on availability, assistance may include travel planning, accommodation questions, local transport, and interpretation coordination. Confirm scope and fees before booking.</p>
            <Button variant="secondary" href={`/${locale}/travel-assistance`}>Explore travel assistance</Button>
          </div>
          <div className="empty-state">
            <Plane size={28} color="var(--blue)" aria-hidden="true" />
            <h3>Packages are not priced yet</h3>
            <p className="muted">No bundled itinerary or provider rate is published until suppliers and terms are verified.</p>
            <Link className="text-link" href={`/${locale}/packages`}>See what a package may include</Link>
          </div>
        </div>
      </section>

      <section className="section surface-blue" aria-labelledby="guides-title">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Patient guides</p>
            <h2 id="guides-title">Questions worth asking before you travel</h2>
            <p>General planning information is not a substitute for advice from your clinician or official travel authorities.</p>
          </div>
          <div className="grid grid-3">
            {guideCards.map(([titleText, description]) => (
              <article className="card" key={titleText}>
                <Clock3 size={22} color="var(--teal)" aria-hidden="true" />
                <h3 style={{ marginTop: "0.8rem" }}>{titleText}</h3>
                <p className="muted">{description}</p>
                <Link className="text-link" href={`/${locale}/blog`}>Read guides <ArrowRight size={14} aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="faq-title">
        <div className="container split-section">
          <div>
            <p className="eyebrow">Helpful to know</p>
            <h2 id="faq-title">Common questions</h2>
            <p className="muted">If you need information specific to your case, ask your treating clinician and the provider directly.</p>
            <Link className="text-link" href={`/${locale}/faq`}>Visit the help center <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section surface-teal">
        <div className="container final-cta">
          <div>
            <p className="eyebrow">Start when you are ready</p>
            <h2>Get a clear next step, without pressure</h2>
            <p className="muted">Share only what is needed to begin. You can ask questions before making any decision.</p>
          </div>
          <Button variant="accent" href={`/${locale}/quote`}>Start a free inquiry <ArrowRight size={17} aria-hidden="true" /></Button>
        </div>
      </section>
    </main>
  );
}
