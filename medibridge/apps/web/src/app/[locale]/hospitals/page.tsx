import Link from "next/link";
import { StaticPage } from "@/components/shared/static-page";
import { EmptyDirectory } from "@/components/shared/empty-directory";
import { fetchCatalogList } from "@/lib/catalog";

type Hospital = { slug: string; name: string; city: string; country: string; rating: number; accreditations: string[]; _count: { doctors: number; treatments: number } };

export default async function HospitalsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { q?: string; city?: string; country?: string; accreditation?: string; minRating?: string };
}) {
  const result = await fetchCatalogList<Hospital>("hospitals", searchParams);
  return (
    <StaticPage eyebrow="Provider directory" title="Hospitals in review" description="Search published facilities only. A hospital appears here only after its profile and credentials have been reviewed.">
      <form className="filter-bar" action={`/${params.locale}/hospitals`} method="get">
        <label className="field"><span>Name or location</span><input name="q" defaultValue={searchParams.q ?? ""} /></label>
        <label className="field"><span>City</span><input name="city" defaultValue={searchParams.city ?? ""} /></label>
        <label className="field"><span>Accreditation</span><input name="accreditation" defaultValue={searchParams.accreditation ?? ""} placeholder="For example, JCI" /></label>
        <button className="button button-primary" type="submit">Apply filters</button>
      </form>
      {result?.data.length ? (
        <div className="grid grid-2">
          {result.data.map((hospital) => (
            <article className="card" key={hospital.slug}>
              <p className="eyebrow">{hospital.city}, {hospital.country}</p>
              <h2>{hospital.name}</h2>
              <p className="muted">{hospital._count.treatments} published care areas · {hospital._count.doctors} clinician profiles</p>
              <div className="badge-row">{hospital.accreditations.map((badge) => <span className="badge" key={badge}>{badge}</span>)}</div>
              <Link className="text-link" href={`/${params.locale}/hospitals/${hospital.slug}`}>View facility profile</Link>
            </article>
          ))}
        </div>
      ) : <EmptyDirectory title="No verified hospital profiles are published yet" locale={params.locale} />}
      <p className="disclaimer" style={{ marginTop: "2rem" }}>Accreditation status and service availability can change. Confirm current details with the accrediting body and provider.</p>
    </StaticPage>
  );
}
