import { EmptyDirectory } from "@/components/shared/empty-directory";
import { DoctorCarousel, type DoctorProfile } from "@/components/shared/doctor-carousel";
import { StaticPage } from "@/components/shared/static-page";
import { fetchAllCatalogItems } from "@/lib/catalog";

export default async function DoctorsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { q?: string; specialty?: string };
}) {
  const doctors = await fetchAllCatalogItems<DoctorProfile>("doctors", searchParams);
  return (
    <StaticPage eyebrow="Clinician directory" title="Doctor profiles" description="Profiles are published only after qualifications, affiliations, and listing permissions have been reviewed.">
      <form className="filter-bar" action={`/${params.locale}/doctors`} method="get">
        <label className="field"><span>Name or specialty</span><input name="q" defaultValue={searchParams.q ?? ""} /></label>
        <label className="field"><span>Care area</span><input name="specialty" defaultValue={searchParams.specialty ?? ""} /></label>
        <button className="button button-primary" type="submit">Search profiles</button>
      </form>
      {doctors?.length ? (
        <DoctorCarousel doctors={doctors} locale={params.locale} />
      ) : <EmptyDirectory title="No clinician profiles are published yet" locale={params.locale} />}
    </StaticPage>
  );
}
