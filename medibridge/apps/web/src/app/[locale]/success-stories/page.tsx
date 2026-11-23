import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  FileCheck2,
  HeartHandshake,
  Home,
  LockKeyhole,
  MapPin,
  MessageCircleHeart,
  ShieldCheck,
} from "lucide-react";
import { Reveal, RevealSection, StaggerGrid } from "@/components/shared/reveal";
import { localizedHref } from "@/config/site";
import messages from "@/i18n/messages/en.json";

const storyIcons = [FileCheck2, HeartHandshake, MessageCircleHeart] as const;
const privacyIcons = [LockKeyhole, ShieldCheck, FileCheck2] as const;

export default function SuccessStoriesPage({ params }: { params: { locale: string } }) {
  const copy = messages.successStoriesPage;

  return (
    <>
      <header className="success-stories-hero">
        <div className="container success-stories-hero-layout">
          <div className="success-stories-hero-copy">
            <nav className="success-stories-breadcrumbs" aria-label="Breadcrumb">
              <Link href={localizedHref(params.locale, "")}>{copy.hero.home}</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{copy.eyebrow}</span>
            </nav>
            <p className="eyebrow">{copy.hero.eyebrow}</p>
            <h1>{copy.title}</h1>
            <p className="success-stories-hero-description">{copy.description}</p>
            <div className="success-stories-hero-actions">
              <Link className="button button-accent" href={localizedHref(params.locale, "contact")}>
                {copy.hero.action}<ArrowRight size={17} aria-hidden="true" />
              </Link>
              <a className="success-stories-text-action" href="#stories-collection-title">
                {copy.hero.secondaryAction}<ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
            <p className="success-stories-hero-note">
              <ShieldCheck size={17} aria-hidden="true" />
              {copy.hero.privacyNote}
            </p>
          </div>
          <div className="success-stories-hero-visual">
            <Image
              src="/images/slide-05.png"
              alt={copy.hero.imageAlt}
              fill
              sizes="(max-width: 760px) 90vw, 48vw"
              priority
            />
            <div className="success-stories-hero-image-shade" />
            <span className="success-stories-hero-image-label">
              <span className="success-stories-hero-image-icon"><HeartHandshake size={19} aria-hidden="true" /></span>
              <span><strong>{copy.hero.imageLabel}</strong><small>{copy.hero.imageCaption}</small></span>
            </span>
            <div className="success-stories-journey-stamp" aria-hidden="true">
              <span><MapPin size={15} /></span>
              <span className="success-stories-stamp-line" />
              <span><Home size={15} /></span>
            </div>
          </div>
        </div>
      </header>
      <main className="page-content success-stories-main">
        <div className="container">
          <div className="success-stories-page">
        <RevealSection className="success-stories-feature" aria-labelledby="stories-feature-title">
          <div className="success-stories-feature-copy">
            <p className="eyebrow">{copy.feature.eyebrow}</p>
            <h2 id="stories-feature-title">{copy.feature.heading}</h2>
            <p>{copy.feature.description}</p>
            <div className="success-stories-feature-points">
              {copy.feature.points.map((point) => (
                <span key={point}><ShieldCheck size={16} aria-hidden="true" />{point}</span>
              ))}
            </div>
            <Link className="text-link" href={localizedHref(params.locale, "contact")}>
              {copy.feature.action}<ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </RevealSection>

        <section className="success-stories-collection" aria-labelledby="stories-collection-title">
          <div className="section-heading">
            <p className="eyebrow">{copy.collection.eyebrow}</p>
            <h2 id="stories-collection-title">{copy.collection.heading}</h2>
            <p>{copy.collection.description}</p>
          </div>
          <StaggerGrid className="success-stories-card-grid">
            {copy.collection.items.map((item, index) => {
              const Icon = storyIcons[index];
              return (
                <article className="success-stories-card" key={item.title}>
                  <div className="success-stories-card-media">
                    <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 760px) 90vw, 30vw" />
                    <span className="success-stories-media-label">{copy.collection.imageLabel}</span>
                    <span className="success-stories-placeholder-badge">{copy.collection.placeholderBadge}</span>
                  </div>
                  <div className="success-stories-card-copy">
                    <span className="success-stories-card-icon"><Icon size={20} aria-hidden="true" /></span>
                    <p className="eyebrow">{item.category}</p>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              );
            })}
          </StaggerGrid>
        </section>

        <section className="success-stories-privacy" aria-labelledby="stories-privacy-title">
          <div className="section-heading">
            <p className="eyebrow">{copy.privacy.eyebrow}</p>
            <h2 id="stories-privacy-title">{copy.privacy.heading}</h2>
          </div>
          <div className="success-stories-privacy-grid">
            {copy.privacy.items.map((item, index) => {
              const Icon = privacyIcons[index];
              return (
                <Reveal key={item.title} delay={index * 0.06}>
                  <article className="success-stories-privacy-card">
                    <span className="success-stories-card-icon"><Icon size={20} aria-hidden="true" /></span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
          <p className="success-stories-disclaimer">
            <ShieldCheck size={18} aria-hidden="true" />
            {copy.privacy.notice}
          </p>
        </section>

        <section className="success-stories-cta" aria-labelledby="stories-cta-title">
          <div>
            <p className="eyebrow">{copy.cta.eyebrow}</p>
            <h2 id="stories-cta-title">{copy.cta.heading}</h2>
            <p>{copy.cta.description}</p>
          </div>
          <Link className="button button-accent" href={localizedHref(params.locale, "contact")}>
            {copy.cta.action}<ArrowRight size={17} aria-hidden="true" />
          </Link>
        </section>
          </div>
        </div>
      </main>
    </>
  );
}
