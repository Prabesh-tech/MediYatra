import Link from "next/link";
import { ArrowRight, HeartPulse } from "lucide-react";
import { EmptyDirectory } from "@/components/shared/empty-directory";
import { StaticPage } from "@/components/shared/static-page";
import { treatmentAreas } from "@/lib/site-content";
import { fetchCatalogList } from "@/lib/catalog";

type Treatment = { slug: string; name: string; summary: string; specialty?: { name: string } };
type TreatmentCard = { slug: string; title: string; summary: string; specialty?: { name: string } };

export default async function TreatmentsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { q?: string };
}) {
  const locale = params.locale;
  const result = await fetchCatalogList<Treatment>("treatments", searchParams.q ?? "");
  const cards: TreatmentCard[] = result?.data.length
    ? result.data.map((item) => ({ slug: item.slug, title: item.name, summary: item.summary, specialty: item.specialty }))
    : treatmentAreas.map((item) => ({ slug: item.slug, title: item.title, summary: item.summary }));

  return (
    <StaticPage eyebrow="Care information" title="Explore treatment areas" description="Browse broad areas of care and prepare questions for a qualified clinician. This information is not a diagnosis or treatment recommendation.">
      <form className="catalog-search" action={`/${locale}/treatments`} method="get">
        <label className="field">
          <span>Search treatment areas</span>
          <input name="q" defaultValue={searchParams.q ?? ""} placeholder="For example, orthopedics" />
        </label>
        <button className="button button-primary" type="submit">Search</button>
      </form>
      {cards.length ? (
        <div className="grid grid-3">
          {cards.map((item) => (
            <article className="card catalog-card" key={item.slug}>
              <span className="treatment-icon"><HeartPulse size={20} aria-hidden="true" /></span>
              <p className="eyebrow">{item.specialty?.name ?? "Care information"}</p>
              <h2>{item.title}</h2>
              <p className="muted">{item.summary}</p>
              <Link className="text-link" href={`/${locale}/treatments/${item.slug}`}>View information <ArrowRight size={15} aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
      ) : <EmptyDirectory title="No matching treatment information" locale={locale} />}
      <p className="disclaimer" style={{ marginTop: "2rem" }}>Treatment availability and suitability vary. Confirm all clinical information with the treating provider.</p>
    </StaticPage>
  );
}
