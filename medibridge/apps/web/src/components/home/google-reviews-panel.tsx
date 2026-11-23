import { ExternalLink, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { siteConfig } from "@/config/site";
import type { HomeCopy } from "@/types/home-copy";

export function GoogleReviewsPanel({ copy }: { copy: HomeCopy["reviews"] }) {
  return (
    <section className="google-reviews-section" aria-labelledby="google-reviews-title">
      <div className="container google-reviews-layout">
        <Reveal><div className="google-review-card google-review-submit">
          <div className="google-review-profile" aria-hidden="true">MY</div>
          <p className="eyebrow">{copy.writeEyebrow}</p>
          <h2 id="google-reviews-title">{copy.writeHeading}</h2>
          <p className="muted">{copy.writeText}</p>
          <a className="button button-accent" href={siteConfig.googleReviewUrl} target="_blank" rel="noreferrer">{copy.writeAction} <ExternalLink size={16} aria-hidden="true" /></a>
        </div></Reveal>
        <Reveal delay={0.08}><div className="google-review-card google-review-list">
          <div className="google-review-heading"><div><p className="eyebrow">{copy.feedbackEyebrow}</p><h2>{copy.feedbackHeading}</h2></div></div>
          <div className="google-review-empty"><MessageCircle size={24} aria-hidden="true" /><h3>{copy.emptyTitle}</h3><p className="muted">{copy.emptyMessage}</p><a className="text-link" href={siteConfig.googleReviewUrl} target="_blank" rel="noreferrer">{copy.viewAction} <ExternalLink size={15} aria-hidden="true" /></a></div>
        </div></Reveal>
      </div>
    </section>
  );
}
