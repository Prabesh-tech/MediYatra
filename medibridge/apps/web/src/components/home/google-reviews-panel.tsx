import { ExternalLink, Star } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { siteConfig } from "@/config/site";

export function GoogleReviewsPanel() {
  return (
    <section className="google-reviews-section" aria-labelledby="google-reviews-title">
      <div className="container google-reviews-layout">
        <Reveal><div className="google-review-card google-review-submit">
          <div className="google-review-profile" aria-hidden="true">MY</div>
          <p className="eyebrow">Google reviews</p>
          <h2 id="google-reviews-title">Share your experience with MediYatra.</h2>
          <p className="muted">Your feedback helps patients and families understand the coordination experience.</p>
          <a className="button button-accent" href={siteConfig.googleReviewUrl} target="_blank" rel="noreferrer">Write a Google review <ExternalLink size={16} aria-hidden="true" /></a>
        </div></Reveal>
        <Reveal delay={0.08}><div className="google-review-card google-review-list">
          <div className="google-review-heading"><div><p className="eyebrow">Community feedback</p><h2>What the community is saying</h2></div><span className="google-review-count">0</span></div>
          <div className="google-review-empty"><div className="google-review-empty-stars" aria-hidden="true"><Star /><Star /><Star /><Star /><Star /></div><h3>Reviews are on their way.</h3><p className="muted">Google reviews will appear here after the MediYatra Business Profile is connected.</p><a className="text-link" href={siteConfig.googleReviewUrl} target="_blank" rel="noreferrer">View Google profile <ExternalLink size={15} aria-hidden="true" /></a></div>
        </div></Reveal>
      </div>
    </section>
  );
}
