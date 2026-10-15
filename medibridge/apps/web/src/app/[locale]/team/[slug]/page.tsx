import Link from "next/link";
import { notFound } from "next/navigation";
import { DoctorPortrait, type DoctorProfile } from "@/components/shared/doctor-carousel";
import { placeholderDoctors } from "@/data/doctors-placeholder";

export default function PlaceholderDoctorPage({ params }: { params: { locale: string; slug: string } }) {
  const doctor = placeholderDoctors.find((item) => item.slug === params.slug);
  if (!doctor) notFound();

  const profile: DoctorProfile = {
    slug: doctor.slug,
    name: doctor.name,
    title: doctor.role,
    bio: "",
    photo: doctor.image,
    experienceYears: 0,
    languages: [],
    hospital: null,
    treatments: [],
  };
  const query = `doctor=${encodeURIComponent(doctor.slug)}`;

  return (
    <main className="section">
      <div className="container">
        <article className="doctor-detail-card">
          <div className="doctor-detail-portrait">
            <DoctorPortrait doctor={profile} />
          </div>
          <div className="doctor-detail-copy">
            <p className="eyebrow">Doctor profile</p>
            <h1>{doctor.name}</h1>
            <p className="doctor-detail-role">{doctor.role}</p>
            <p>This is a placeholder profile. Approved doctor information can be added here before publication.</p>
            <div className="doctor-showcase-actions">
              <Link className="doctor-showcase-consult" href={`/${params.locale}/quote?${query}`}>Consult Now</Link>
              <Link className="doctor-showcase-text-link" href={`/${params.locale}/contact?request=callback&${query}`}>Call Back Request</Link>
              <Link className="doctor-showcase-text-link" href={`/${params.locale}/team`}>Meet our doctors</Link>
            </div>
          </div>
        </article>
        <p className="doctor-showcase-note">Doctor profiles are shown for information. Treatment decisions are made by the treating doctor and hospital.</p>
      </div>
    </main>
  );
}
