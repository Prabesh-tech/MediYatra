import { notFound } from "next/navigation";
import { ExternalLink, MapPin } from "lucide-react";
import { StaticPage } from "@/components/shared/static-page";
import { ReviewForm } from "@/components/forms/review-form";
import { fetchCatalogItem, fetchCatalogList } from "@/lib/catalog";

export default async function HospitalDetailPage({ params }: { params: { locale: string; slug: string } }) {
  const hospital = await fetchCatalogItem<{
    id: string;
    name: string; city: string; country: string; address: string; accreditations: string[];
    facilities: string[]; gallery: string[];
  }>(`hospitals/${encodeURIComponent(params.slug)}`);
  if (!hospital) notFound();
  const reviews = await fetchCatalogList<{
    id: string; authorName: string; rating: number; title: string | null; body: string; createdAt: string;
  }>(`hospitals/${encodeURIComponent(hospital.id)}/reviews`);
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hospital.address}, ${hospital.city}, ${hospital.country}`)}`;

  return (
    <StaticPage eyebrow="Verified facility profile" title={hospital.name} description={`${hospital.city}, ${hospital.country}`}>
      <div className="detail-layout">
        <div className="prose">
          <h2>Facility information</h2>
          <p>{hospital.address}</p>
          <p><a className="text-link" href={mapUrl} target="_blank" rel="noreferrer">Open map directions <ExternalLink size={15} aria-hidden="true" /></a></p>
          <h2>Accreditations and facilities</h2>
          {hospital.accreditations.length ? <div className="badge-row">{hospital.accreditations.map((item) => <span className="badge" key={item}>{item}</span>)}</div> : <p className="muted">No accreditation details have been published.</p>}
          <ul>{hospital.facilities.map((item) => <li key={item}>{item}</li>)}</ul>
          <p className="disclaimer"><MapPin size={16} aria-hidden="true" /> Contact the facility directly to confirm location, services, accessibility, and current accreditation.</p>
          <section className="hospital-reviews">
            <h2>Patient reviews</h2>
            {reviews?.data.length ? reviews.data.map((review) => (
              <article className="card review-card" key={review.id}>
                <p aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)} <span className="muted">· {review.authorName}</span></p>
                {review.title && <h3>{review.title}</h3>}
                <p>{review.body}</p>
              </article>
            )) : <p className="muted">No approved patient reviews are published yet.</p>}
            <h3>Share an experience</h3>
            <p className="muted">Only patients with a completed appointment can submit. Reviews are moderated before publication.</p>
            <ReviewForm hospitalId={hospital.id} />
          </section>
        </div>
      </div>
    </StaticPage>
  );
}
