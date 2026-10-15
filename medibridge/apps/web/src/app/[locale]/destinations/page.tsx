import Link from "next/link";
import { MapPin } from "lucide-react";
import { StaticPage } from "@/components/shared/static-page";
import { fetchCatalogList } from "@/lib/catalog";

export default async function DestinationsPage({ params }: { params: { locale: string } }) {
  const result = await fetchCatalogList<{ slug: string; country: string; city: string; overview: string }>("destinations");
  const destinations = result?.data ?? [];
  return (
    <StaticPage eyebrow="Travel planning" title="Destinations" description="Review practical travel information alongside a confirmed care plan. Details can change; use official sources for current requirements.">
      {destinations.length ? (
        <div className="grid grid-3">
          {destinations.map((destination) => (
            <article className="card" key={destination.slug}>
              <MapPin size={22} color="var(--teal)" aria-hidden="true" />
              <h2>{destination.city}, {destination.country}</h2>
              <p className="muted">{destination.overview}</p>
              <Link className="text-link" href={`/${params.locale}/destinations/${destination.slug}`}>Read destination guide</Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="grid grid-2">
          <article className="card destination-feature">
            <p className="eyebrow">Launch destination</p>
            <h2>Nepal</h2>
            <p className="muted">A practical guide to planning questions, local transport, accommodation, and recovery needs is being prepared.</p>
            <Link className="text-link" href={`/${params.locale}/destinations/nepal`}>Open Nepal guide</Link>
          </article>
          <aside className="disclaimer">Confirm visa, entry, health, accessibility, and travel requirements with official government sources before booking.</aside>
        </div>
      )}
    </StaticPage>
  );
}
