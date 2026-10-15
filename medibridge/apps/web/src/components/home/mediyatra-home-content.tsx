import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  FileCheck2,
  HeartHandshake,
  Home,
  MapPin,
  Plane,
  ShieldCheck,
  Star,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedAccordion } from "@/components/shared/animated-accordion";
import { ImageReveal, Reveal, RevealText, StaggerGrid } from "@/components/shared/reveal";
import { SpecialtyMarquee } from "@/components/shared/specialty-marquee";
import { DoctorCarousel, type DoctorProfile } from "@/components/shared/doctor-carousel";
import { GoogleReviewsPanel } from "@/components/home/google-reviews-panel";
import { HeroImageCarousel } from "@/components/home/hero-image-carousel";
import { HeroEyebrow, HeroHeadline, HeroSpotlight } from "@/components/home/hero-interactions";
import { HomeRequestForm } from "@/components/home/home-request-form";
import { localizedHref, siteConfig } from "@/config/site";

const services = [
  {
    number: "01",
    title: "Medical Tourism and Patient Coordination",
    summary: "Supporting your healthcare journey from Nepal to India.",
    image: "/images/slide-03.png",
    imageAlt: "Nurse supporting an older patient during a hospital stay",
    icon: Plane,
    href: "#medical-tourism",
  },
  {
    number: "02",
    title: "Nursing Care at Home",
    summary: "Professional nursing support delivered at your doorstep.",
    image: "/images/slide-02.png",
    imageAlt: "Nurse checking a patient's blood pressure",
    icon: Home,
    href: "#nursing-care",
  },
] as const;

const coordinationServices = [
  ["Medical case and report coordination", "Organize medical reports and share relevant information with your selected hospital or specialist."],
  ["Hospital and doctor appointment coordination", "Coordinate appointments with your preferred hospital and specialist."],
  ["Medical visa and documentation support", "Get guidance on required medical travel documentation."],
  ["Travel coordination", "Plan travel around the hospital schedule and confirmed appointments."],
  ["Airport pickup and local transportation", "Coordinate transport between the airport, accommodation, and hospital where required."],
  ["Accommodation assistance", "Arrange suitable accommodation for patients and accompanying family members."],
  ["Hospital coordination", "Support appointments, admission-related communication, and practical hospital processes."],
  ["Patient and family support", "Have one dedicated coordination point throughout the journey."],
  ["Post-treatment follow-up coordination", "Coordinate follow-up appointments, reports, communication, and return-home arrangements."],
] as const;

const journey = [
  ["01", "Share Your Requirement", "Tell us about your healthcare needs and share relevant medical reports or referral information."],
  ["02", "Coordinate the Case", "Our team organizes the available information and communicates with the selected hospital or specialist as required."],
  ["03", "Choose Your Hospital", "You remain in control of your healthcare decisions and choose the hospital and doctor you prefer."],
  ["04", "Plan Your Journey", "We coordinate appointments, documentation, travel, accommodation, and other practical requirements."],
  ["05", "Travel to India", "Our team coordinates your arrival, transportation, and hospital-related arrangements."],
  ["06", "Hospital and Treatment Support", "We remain available for practical coordination throughout your hospital journey."],
  ["07", "Return and Follow-up", "We assist with follow-up coordination and practical arrangements for returning home."],
] as const;

const journeyImages = [
  ["/images/slide-01.png", "Healthcare professional wearing a white coat"],
  ["/images/slide-02.png", "Nurse supporting an older patient during a hospital stay"],
  ["/images/slide-03.png", "Doctor and patient in a clinical consultation"],
  ["/images/slide-04.png", "Medical care and travel planning discussion"],
  ["/images/slide-05.png", "Healthcare team coordinating patient support"],
  ["/images/slide-06.png", "Nurse holding a tray with medication and care supplies"],
  ["/images/slide-07.png", "Patient follow-up and care coordination at home"],
] as const;

const reasonsToChoose = [
  [ClipboardCheck, "One point of coordination"],
  [CheckCircle2, "Patient choice"],
  [ArrowRight, "End-to-end support"],
  [HeartHandshake, "Personalized assistance"],
  [Home, "Family support"],
  [Plane, "Support beyond borders"],
] as const;

const journeyRoute = ["Nepal", "Medical referral or requirement", "MediYatra coordination", "Chosen hospital and doctor", "Travel and accommodation", "Treatment in India", "Follow-up and return home"] as const;

const specialties = [
  "Oncology and cancer care",
  "Cardiology and cardiac care",
  "Neurology and neurosurgery",
  "Orthopaedics and joint care",
  "Gastroenterology",
  "Nephrology and kidney care",
  "Urology",
  "Pulmonology",
  "Women's health",
  "Pediatric care",
  "General and multispecialty care",
] as const;

const nursingServices = [
  ["Home nursing visits", "Scheduled nursing support at the patient's home."],
  ["Post-hospital care", "Support for patients who require nursing assistance after discharge."],
  ["Elderly care support", "Assistance for elderly patients who require regular care and monitoring."],
  ["Wound and dressing care", "Support for appropriate wound and dressing care as prescribed."],
  ["Medication support", "Assistance with medication routines according to professional instructions."],
  ["Basic patient monitoring", "Monitoring and recording relevant patient observations as appropriate."],
] as const;

const patientStories = [
  { quote: "The whole process felt much easier than I expected. We had one team helping us with travel and appointments.", name: "A. Rana", detail: "Nepal to India care journey" },
  { quote: "They explained the steps clearly, which helped us feel confident when planning treatment abroad.", name: "B. Shrestha", detail: "Cardiac treatment support" },
  { quote: "The coordination was thoughtful and practical. It reduced stress for our family during a difficult time.", name: "S. Bhandari", detail: "Family support coordination" },
] as const;

const faqs = [
  ["Is MediYatra a hospital?", "No. MediYatra is a healthcare coordination and medical travel support company. Medical diagnosis, treatment, and clinical decisions are provided by qualified doctors and hospitals."],
  ["Can I choose my own hospital?", "Yes. Patients choose their preferred hospital and healthcare provider. MediYatra assists with coordination and practical arrangements around the journey."],
  ["Do you provide treatment in India?", "Medical treatment is provided by the selected hospital and qualified healthcare professionals in India. MediYatra coordinates travel and support services."],
  ["What services do you arrange for medical travel?", "Depending on your requirements, MediYatra can assist with hospital and doctor coordination, documentation, travel planning, accommodation, local transportation, hospital assistance, and follow-up coordination."],
  ["Can I book nursing care at home?", "Yes. Nursing care can be requested through our appointment system. Our team will discuss the requirement and arrange an appropriate nursing service where available."],
  ["Can my family member travel with me?", "Yes. Accommodation and travel-related coordination can also be arranged for accompanying family members, depending on your requirements."],
] as const;

export function MediYatraHomeContent({ locale, doctors }: { locale: string; doctors: DoctorProfile[] }) {
  return (
    <main>
      <HeroSpotlight labelledBy="home-title">
        <HeroImageCarousel />
        <span className="hero-glow hero-glow--one" aria-hidden="true" />
        <span className="hero-glow hero-glow--two" aria-hidden="true" />
        <span className="hero-spotlight-glow" aria-hidden="true" />
        <div className="container hero-layout">
          <div className="hero-content">
            <HeroEyebrow />
            <HeroHeadline />
            <p>From Nepal to India and back home, one team helps coordinate hospitals, travel, documentation, and support at every step.</p>
            <div className="hero-actions">
              <Button variant="accent" href={localizedHref(locale, "quote")}>Plan your medical journey <ArrowRight size={17} aria-hidden="true" /></Button>
              <Button variant="secondary" href={localizedHref(locale, "nursing-care")}>Book nursing care</Button>
            </div>
            <p className="hero-service-line">Medical tourism <span aria-hidden="true">/</span> Patient coordination <span aria-hidden="true">/</span> Nursing care at home</p>
            <div className="hero-floating-cards" aria-hidden="true">
              <div className="hero-floating-card hero-floating-card--primary">
                <span className="hero-floating-icon"><ShieldCheck size={18} aria-hidden="true" /></span>
                <div>
                  <strong>Coordination support</strong>
                  <span>Travel, hospital & care coordination</span>
                </div>
              </div>
              <div className="hero-floating-card hero-floating-card--secondary">
                <span className="hero-floating-icon"><Star size={18} aria-hidden="true" /></span>
                <div>
                  <strong>Patient-first care</strong>
                  <span>Personalized journeys from Nepal to India</span>
                </div>
              </div>
            </div>
            <a className="hero-scroll-indicator" href="#trust-strip" aria-label="Scroll to coordination details">
              <span>Scroll to explore</span>
              <ChevronDown size={17} aria-hidden="true" />
            </a>
          </div>
          <HomeRequestForm locale={locale} />
        </div>
        <div className="container hero-journey">
          <span className="hero-journey-icon"><HeartHandshake size={20} aria-hidden="true" /></span>
          <span className="hero-journey-copy"><strong>Your chosen hospital</strong><span>Nepal <ArrowRight size={13} aria-hidden="true" /> India <ArrowRight size={13} aria-hidden="true" /> Home</span></span>
        </div>
      </HeroSpotlight>

      <section className="trust-strip" id="trust-strip" aria-label="Patient trust metrics">
        <div className="container trust-items">
          <div className="trust-item"><ClipboardCheck size={18} aria-hidden="true" /> Clear case coordination</div>
          <div className="trust-item"><ShieldCheck size={18} aria-hidden="true" /> Safe and guided support</div>
          <div className="trust-item"><Plane size={18} aria-hidden="true" /> Travel and treatment planning</div>
          <div className="trust-item"><HeartHandshake size={18} aria-hidden="true" /> Personal care at every step</div>
        </div>
      </section>

      <section className="section" aria-labelledby="about-title">
        <div className="container home-about">
          <div className="home-about-copy">
            <p className="eyebrow">About MediYatra</p>
            <h2 id="about-title">A clearer way to navigate care across borders.</h2>
            <p>MediYatra is a healthcare coordination and medical travel support company based in Nepal, helping patients and families navigate their healthcare journey in India with greater clarity and convenience.</p>
            <p>When specialized treatment requires travel, choosing a hospital, coordinating appointments, arranging travel, accommodation, documentation, and local support can feel complicated. MediYatra brings these essential services together under one coordinated journey.</p>
            <p><strong>You choose the hospital and healthcare provider.</strong> We coordinate the practical journey around the treatment.</p>
          </div>
          <Reveal delay={0.08}>
            <ImageReveal className="home-about-photo">
              <Image
                src="/images/hero-medical-team.png"
                alt="Healthcare team coordinating a patient journey"
                fill
                sizes="(max-width: 760px) 90vw, 42vw"
              />
              <span className="home-about-badge"><HeartHandshake size={18} aria-hidden="true" /><span><strong>One point of support</strong><small>Coordination for patients and families</small></span></span>
            </ImageReveal>
          </Reveal>
        </div>
      </section>

      <section className="section section-muted" aria-labelledby="services-title">
        <div className="container">
          <div className="section-heading"><p className="eyebrow">Our two main services</p><h2 id="services-title">Support for the journey and care at home.</h2></div>
          <div className="services-showcase">
            {services.map(({ number, title, summary, image, imageAlt, icon: Icon, href }, index) => (
              <Reveal className="service-showcase-item" delay={index * 0.08} key={number}>
                <Link className="card service-card service-card--image" href={href}>
                  <span className="service-card-image">
                    <Image src={image} alt={imageAlt} fill sizes="(max-width: 760px) 90vw, 42vw" />
                    <span className="service-number">{number}</span>
                  </span>
                  <span className="service-card-body">
                    <Icon size={25} aria-hidden="true" />
                    <h3>{title}</h3>
                    <p className="muted">{summary}</p>
                    <span className="text-link">Explore service <ArrowRight size={15} aria-hidden="true" /></span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="medical-tourism" aria-labelledby="medical-tourism-title">
        <div className="container">
          <div className="section-heading"><p className="eyebrow">Medical tourism and patient coordination</p><h2 id="medical-tourism-title">Your chosen hospital. One coordinated journey.</h2><p>When specialized treatment requires travel to India, MediYatra helps coordinate the journey from Nepal to your chosen hospital.</p></div>
          <div className="medical-coordination-layout">
            <Reveal>
              <ImageReveal className="medical-coordination-photo">
                <Image src="/images/slide-08.png" alt="Patient support and medical travel coordination" fill sizes="(max-width: 760px) 90vw, 32vw" />
                <span>Support around your chosen care team</span>
              </ImageReveal>
            </Reveal>
            <StaggerGrid className="grid grid-3 medical-coordination-grid">{coordinationServices.map(([title, summary]) => <article className="card" key={title}><CheckCircle2 size={22} aria-hidden="true" /><h3>{title}</h3><p className="muted">{summary}</p></article>)}</StaggerGrid>
          </div>
        </div>
      </section>

      <section className="section section-muted" id="journey" aria-labelledby="journey-title">
        <div className="container"><div className="section-heading"><p className="eyebrow">How it works</p><h2 id="journey-title">A patient journey with a steady point of contact.</h2></div>
          <div className="journey-timeline">
            {journey.map(([number, title, summary], index) => (
              <Reveal className="journey-step" key={number}>
                <article className="journey-step-card">
                  <div className="journey-step-photo">
                    <Image src={journeyImages[index][0]} alt={journeyImages[index][1]} fill sizes="(max-width: 760px) 90vw, 40vw" />
                  </div>
                  <div className="journey-step-copy">
                    <span className="service-number">{number}</span>
                    <h3>{title}</h3>
                    <p className="muted">{summary}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="journey-path" role="group" aria-label="Patient journey from Nepal to India and back home">{journeyRoute.map((step, index) => <span key={step}><RevealText delay={index * 0.06}>{step}</RevealText>{index < journeyRoute.length - 1 && <ArrowRight aria-hidden="true" />}</span>)}</div>
        </div>
      </section>

      <section className="section" aria-labelledby="specialties-title">
        <div className="container split-section"><div><p className="eyebrow">Specialized treatment coordination</p><h2 id="specialties-title">Coordinate care with the right clinical team.</h2></div><div><div className="specialty-image-panel"><Image src="/images/doctor-white-coat.png" alt="" aria-hidden="true" fill sizes="(max-width: 760px) 90vw, 50vw" /><div className="specialty-image-content"><SpecialtyMarquee items={specialties} label="Specialties supported by coordination services" /></div></div><p className="notice specialty-disclaimer"><ShieldCheck size={17} aria-hidden="true" /> Treatment options, diagnosis, and medical decisions are made by qualified doctors and hospitals. MediYatra coordinates the journey and related support services.</p></div></div>
      </section>

      <section className="section section-muted" aria-label="Meet our doctors">
        <div className="container">
          <DoctorCarousel doctors={doctors} locale={locale} eyebrow="Meet our doctors" heading="Experienced Doctors Supporting Compassionate Care" />
        </div>
      </section>

      <section className="section section-muted" aria-labelledby="why-title"><div className="container"><div className="section-heading"><p className="eyebrow">Why MediYatra</p><h2 id="why-title">Practical support throughout your care journey.</h2></div><div className="why-visual-layout"><StaggerGrid className="why-reasons">{reasonsToChoose.slice(0, 3).map(([Icon, title]) => <article className="card why-item" key={title}><Icon size={22} aria-hidden="true" /><h3>{title}</h3></article>)}</StaggerGrid><Reveal><ImageReveal className="why-photo"><Image src="/images/slide-05.png" alt="Healthcare team coordinating patient support" fill sizes="(max-width: 760px) 90vw, 30vw" /></ImageReveal></Reveal><StaggerGrid className="why-reasons">{reasonsToChoose.slice(3).map(([Icon, title]) => <article className="card why-item" key={title}><Icon size={22} aria-hidden="true" /><h3>{title}</h3></article>)}</StaggerGrid></div></div></section>

      <section className="section section-muted" aria-labelledby="location-title"><div className="container"><div className="section-heading"><p className="eyebrow">Locations</p><h2 id="location-title">One coordinated journey between Nepal and India.</h2><p>Our team is based in Nepal and supports practical coordination around treatment in India.</p></div><StaggerGrid className="grid grid-2 location-grid"><article className="card location-card"><div className="location-photo"><Image src="/images/slide-09.png" alt="Nepal-based care coordination and travel planning" fill sizes="(max-width: 760px) 90vw, 40vw" /><span>Illustrative image</span></div><div><MapPin size={25} aria-hidden="true" /><h3>Nepal</h3><p className="muted">{siteConfig.contact.addressDisplay}. Your starting point for enquiries, documentation, planning, and follow-up.</p></div></article><article className="card location-card"><div className="location-photo"><Image src="/images/doctor-white-coat.png" alt="Doctor-led treatment planning in India" fill sizes="(max-width: 760px) 90vw, 40vw" /><span>Illustrative image</span></div><div><Plane size={25} aria-hidden="true" /><h3>India</h3><p className="muted">Your selected hospital and qualified healthcare team provide treatment. {siteConfig.brand.name} coordinates the journey around your care.</p></div></article></StaggerGrid></div></section>

      <section className="section section-muted" id="nursing-care" aria-labelledby="nursing-title">
        <div className="container"><div className="nursing-home-heading"><div className="nursing-home-copy"><p className="eyebrow">Nursing care at home</p><h2 id="nursing-title">Professional nursing care, right at your doorstep.</h2><p>MediYatra helps arrange appropriate nursing support at home through scheduled appointments, subject to availability.</p><Button variant="accent" href={`/${locale}/nursing-care`}>Book a Nursing Visit</Button></div></div><div className="nursing-home-layout"><Reveal><ImageReveal className="nursing-home-photo"><Image src="/images/nurse-care.png" alt="Nurse preparing care equipment" fill sizes="(max-width: 760px) 90vw, 42vw" /><span><ShieldCheck size={17} aria-hidden="true" /> Support arranged around your needs</span></ImageReveal></Reveal><StaggerGrid className="grid grid-2 nursing-home-services">{nursingServices.map(([title, summary]) => <article className="card" key={title}><Stethoscope size={21} aria-hidden="true" /><h3>{title}</h3><p className="muted">{summary}</p></article>)}</StaggerGrid></div></div>
      </section>

      <section className="section section-muted" aria-labelledby="reviews-title">
        <div className="container narrow-content">
          <div className="section-heading">
            <p className="eyebrow">Patient feedback</p>
            <h2 id="reviews-title">Families value clarity, support, and a calmer process.</h2>
            <p>We aim to make each step more understandable, dependable, and easier to manage.</p>
          </div>
          <StaggerGrid className="grid grid-3">
            {patientStories.map(({ quote, name, detail }) => (
              <article className="card review-card" key={name}>
                <span className="review-avatar" aria-hidden="true">{name.charAt(0)}</span>
                <Star size={24} aria-hidden="true" />
                <p className="muted">“{quote}”</p>
                <div>
                  <strong>{name}</strong>
                  <p className="muted">{detail}</p>
                </div>
              </article>
            ))}
          </StaggerGrid>
        </div>
      </section>

      <GoogleReviewsPanel />

      <section className="section" aria-labelledby="faq-title"><div className="container narrow-content"><div className="section-heading"><p className="eyebrow">Frequently asked questions</p><h2 id="faq-title">Clear answers before you begin.</h2></div><div className="faq-list">{faqs.map(([question, answer], index) => <Reveal key={question} delay={index * 0.055}><AnimatedAccordion className="faq-item" question={question} answer={answer} /></Reveal>)}</div></div></section>

      <section className="section cta-section" aria-labelledby="cta-title"><div className="container cta-panel cta-panel--with-image"><div className="cta-photo"><Image src="/images/slide-02.png" alt="" aria-hidden="true" fill sizes="100vw" /></div><div><p className="eyebrow">Start your healthcare journey</p><h2 id="cta-title">Planning treatment in India?</h2><p>You do not have to navigate the journey alone. Share your requirement with MediYatra and let our team help coordinate the next steps.</p></div><div className="hero-actions"><Button variant="accent" href={`/${locale}/quote`}>Start Your Medical Journey</Button><Button variant="secondary" href={`/${locale}/contact`}>Talk to Our Team</Button></div></div></section>

      <section className="section contact-band" aria-labelledby="contact-title"><div className="container contact-band-layout"><Reveal><ImageReveal className="contact-band-photo"><Image src="/images/nurse-support.png" alt="Nurse listening to a patient in a care setting" fill sizes="(max-width: 760px) 90vw, 38vw" /></ImageReveal></Reveal><div><p className="eyebrow">Contact {siteConfig.brand.name}</p><h2 id="contact-title">Start your healthcare journey.</h2><p>Have a question or need help planning your medical journey? Talk to the {siteConfig.brand.displayName} team.</p><div className="contact-details"><p><strong>{siteConfig.contact.addressDisplay}</strong></p><p>{siteConfig.contact.phones.map((phone, index) => <span key={phone.href}>{index > 0 && " / "}<a href={phone.href}>{phone.nationalDisplay}</a></span>)}</p><p><a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></p><Button variant="primary" href={localizedHref(locale, "contact")}>Send Enquiry</Button></div></div></div></section>
    </main>
  );
}
