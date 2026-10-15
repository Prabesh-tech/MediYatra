import { notFound } from "next/navigation";
import { StaticPage } from "@/components/shared/static-page";
import { fetchCatalogItem } from "@/lib/catalog";

export default async function DoctorProfilePage({ params }: { params: { locale: string; slug: string } }) {
  const doctor = await fetchCatalogItem<{
    name: string; title: string; bio: string; photo: string | null; experienceYears: number;
    languages: string[]; qualifications: string[]; hospital: { name: string; city: string; country: string } | null;
    treatments: { treatment: { name: string; slug: string } }[];
  }>(`doctors/${encodeURIComponent(params.slug)}`);
  if (!doctor) notFound();

  return (
    <StaticPage eyebrow="Clinician profile" title={doctor.name} description={`${doctor.title}${doctor.hospital ? ` · ${doctor.hospital.name}, ${doctor.hospital.city}` : ""}`}>
      <div className="detail-layout">
        <div className="prose">
          <h2>Profile</h2>
          <p>{doctor.bio}</p>
          <h2>Qualifications</h2>
          <ul>{doctor.qualifications.map((item) => <li key={item}>{item}</li>)}</ul>
          <h2>Languages</h2>
          <p>{doctor.languages.join(", ") || "Not listed"}</p>
          <h2>Published care areas</h2>
          <ul>{doctor.treatments.map(({ treatment }) => <li key={treatment.slug}>{treatment.name}</li>)}</ul>
          <p className="disclaimer">Confirm current registration, credentials, availability, and treatment suitability directly with the clinician and facility.</p>
        </div>
      </div>
    </StaticPage>
  );
}
