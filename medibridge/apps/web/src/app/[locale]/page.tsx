import messages from "@/i18n/messages/en.json";
import { MediYatraHomeContent } from "@/components/home/mediyatra-home-content";
import { DoctorCarousel, type DoctorProfile } from "@/components/shared/doctor-carousel";
import type { HomeCopy } from "@/types/home-copy";

function DoctorDirectorySection({ locale, copy }: { locale: string; copy: HomeCopy["doctors"] }) {
  return (
    <section className="section section-muted" aria-label="Meet our doctors">
      <div className="container">
        <DoctorCarousel doctors={[]} locale={locale} eyebrow={copy.eyebrow} heading={copy.heading} emptyMessage={copy.emptyMessage} copy={copy} />
      </div>
    </section>
  );
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  const copy: HomeCopy = messages.home;

  return (
    <MediYatraHomeContent
      locale={params.locale}
      copy={copy}
      doctorsSection={<DoctorDirectorySection locale={params.locale} copy={copy.doctors} />}
    />
  );
}
