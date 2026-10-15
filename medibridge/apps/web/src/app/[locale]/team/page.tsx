import { HeartHandshake, MapPin, ShieldCheck, Stethoscope, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DoctorCarousel, type DoctorProfile } from "@/components/shared/doctor-carousel";
import { StaticPage } from "@/components/shared/static-page";
import { Reveal, RevealSection } from "@/components/shared/reveal";
import { fetchAllCatalogItems } from "@/lib/catalog";

const values = [
  [HeartHandshake, "Patient-first coordination", "We listen carefully, explain the practical next steps, and keep the patient and family informed."],
  [Stethoscope, "Respect for clinical expertise", "Doctors and hospitals make diagnosis and treatment decisions. Our role is to support the journey around that care."],
  [ShieldCheck, "Responsible support", "We protect sensitive information, avoid guarantees, and confirm service details before publishing them."],
] as const;

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase())
    .join("");
}

export default async function TeamPage({ params }: { params: { locale: string } }) {
  const doctors = await fetchAllCatalogItems<DoctorProfile>("doctors");

  return (
    <StaticPage eyebrow="Our team" title="People focused on making healthcare journeys easier." description="Behind MediYatra is a dedicated coordination team helping patients and families manage the practical side of care across Nepal and India.">
      <RevealSection className="section compact-section reveal-section" aria-label="Meet our doctors">
        <DoctorCarousel doctors={doctors ?? []} locale={params.locale} eyebrow="Meet our doctors" heading="Experienced Doctors Supporting Compassionate Care" />
      </RevealSection>
      <div className="grid grid-3">{values.map(([Icon, title, description], index) => <Reveal key={title} delay={index * 0.08}><article className="card"><Icon size={28} color="var(--teal)" aria-hidden="true" /><h2 style={{ marginTop: "1rem" }}>{title}</h2><p className="muted">{description}</p></article></Reveal>)}</div>
      {doctors?.length ? (
        <RevealSection className="section compact-section reveal-section" aria-labelledby="team-directory-title">
          <div className="section-heading">
            <p className="eyebrow">Clinician directory</p>
            <h2 id="team-directory-title">Browse published profiles</h2>
            <p>Explore the clinician information currently available and request coordination support from our team.</p>
          </div>
          <div className="doctor-team-grid">
            {doctors.map((doctor, index) => (
              <Reveal key={doctor.slug} delay={(index % 3) * 0.07}>
                <article className="doctor-team-card">
                  <div className="doctor-team-media">
                    {doctor.photo ? (
                      <Image
                        src={doctor.photo}
                        alt={`Portrait of ${doctor.name}`}
                        fill
                        sizes="(max-width: 680px) 100vw, (max-width: 1050px) 50vw, 33vw"
                        unoptimized
                      />
                    ) : (
                      <div className="doctor-team-placeholder" role="img" aria-label={`No photo available for ${doctor.name}`}>
                        <span>{getInitials(doctor.name) || <UserRound size={54} strokeWidth={1.2} aria-hidden="true" />}</span>
                      </div>
                    )}
                    <div className="doctor-team-overlay">
                      <Link className="button button-primary" href={`/${params.locale}/doctors/${doctor.slug}`}>Consult Now</Link>
                      <Link className="button button-secondary" href={`/${params.locale}/quote`}>Call Back Request</Link>
                    </div>
                  </div>
                  <div className="doctor-team-card-copy">
                    <h3>{doctor.name}</h3>
                    <p>{doctor.title}</p>
                    {doctor.hospital && (
                      <p className="doctor-team-location">
                        <MapPin size={15} aria-hidden="true" />
                        <span>{doctor.hospital.name} · {doctor.hospital.city}, {doctor.hospital.country}</span>
                      </p>
                    )}
                    {doctor.bio && <p className="doctor-team-bio">{doctor.bio}</p>}
                    {doctor.treatments.length > 0 && (
                      <div className="doctor-team-tags" aria-label="Published care areas">
                        {doctor.treatments.slice(0, 3).map(({ treatment }) => <span key={treatment.name}>{treatment.name}</span>)}
                      </div>
                    )}
                    <Link className="doctor-team-detail" href={`/${params.locale}/doctors/${doctor.slug}`}>View Detail</Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </RevealSection>
      ) : null}
      <RevealSection className="section compact-section reveal-section"><div className="section-heading"><p className="eyebrow">Meet MediYatra</p><h2>A steady point of contact for patients and families.</h2><p>Team profiles and company credentials will be published after they are confirmed. MediYatra does not replace doctors, hospitals, or qualified nursing professionals.</p></div></RevealSection>
    </StaticPage>
  );
}
