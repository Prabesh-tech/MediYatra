import { notFound } from "next/navigation";
import { StaticPage } from "@/components/shared/static-page";
import { travelChecklist } from "@/lib/site-content";
import { fetchCatalogItem } from "@/lib/catalog";

export default async function DestinationDetailPage({ params }: { params: { locale: string; slug: string } }) {
  const destination = await fetchCatalogItem<{
    country: string; city: string; overview: string; visaInfo: string; climate: string | null;
    transport: string | null; attractions: string[]; recoverySpots: string[];
  }>(`destinations/${encodeURIComponent(params.slug)}`);
  if (!destination && params.slug !== "nepal") notFound();
  const country = destination?.country ?? "Nepal";
  const city = destination?.city;
  return (
    <StaticPage eyebrow="Destination guide" title={city ? `${city}, ${country}` : country} description={destination?.overview ?? "Destination information is being prepared. Confirm current requirements with official sources and your care team."}>
      <div className="grid grid-2">
        <section className="card">
          <h2>Before you book</h2>
          <ul>{travelChecklist.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
        <section className="card">
          <h2>Travel information</h2>
          <h3>Entry requirements</h3><p className="muted">{destination?.visaInfo ?? "Check current visa and entry rules with the official Nepal immigration and consular services."}</p>
          <h3>Climate and transport</h3><p className="muted">{destination?.climate ?? "Seasonal conditions vary."} {destination?.transport ?? "Confirm accessible transport arrangements before travel."}</p>
        </section>
        {destination?.attractions.length ? <section className="card"><h2>Local places</h2><ul>{destination.attractions.map((item) => <li key={item}>{item}</li>)}</ul></section> : null}
        {destination?.recoverySpots.length ? <section className="card"><h2>Recovery-friendly areas</h2><ul>{destination.recoverySpots.map((item) => <li key={item}>{item}</li>)}</ul></section> : null}
      </div>
    </StaticPage>
  );
}
