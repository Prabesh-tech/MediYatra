import { InquiryWizard } from "@/components/forms/inquiry-wizard";
import { Reveal } from "@/components/shared/reveal";
import { StaticPage } from "@/components/shared/static-page";
import { getWhatsAppHref, siteConfig } from "@/config/site";

export default function QuotePage() {
  return (
    <StaticPage eyebrow="Free inquiry" title="Tell us what you are exploring" description="Share the minimum information needed to begin. A request is not a booking or a medical recommendation.">
      <div className="form-layout">
        <Reveal><InquiryWizard /></Reveal>
        <Reveal delay={0.08}><aside className="card quote-card">
          <h2>Before you begin</h2>
          <ul>
            <li>Do not include passport or payment-card details.</li>
            <li>Reports are optional and limited to PDF/JPG, 10 MB each.</li>
            <li>Clinical decisions remain with your qualified treating team.</li>
          </ul>
          {siteConfig.contact.detailsConfirmed ? (
            <p className="muted">
              Need help? Call <a href={siteConfig.contact.phones[0].href}>{siteConfig.contact.phones[0].display}</a> or{" "}
              <a href={getWhatsAppHref()} target="_blank" rel="noreferrer">message us on WhatsApp</a>.
            </p>
          ) : (
            <p className="muted">Phone and WhatsApp contact details will be added after confirmation.</p>
          )}
        </aside></Reveal>
      </div>
    </StaticPage>
  );
}
