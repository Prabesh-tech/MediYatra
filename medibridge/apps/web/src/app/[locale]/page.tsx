import { MediYatraHomeContent } from "@/components/home/mediyatra-home-content";
import type { DoctorProfile } from "@/components/shared/doctor-carousel";
import { fetchAllCatalogItems } from "@/lib/catalog";

export default async function HomePage({ params }: { params: { locale: string } }) {
  const doctors = await fetchAllCatalogItems<DoctorProfile>("doctors");
  return <MediYatraHomeContent locale={params.locale} doctors={doctors ?? []} />;
}
