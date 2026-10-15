import Link from "next/link";
import { PatientDashboard } from "@/components/shared/patient-dashboard";
import { StaticPage } from "@/components/shared/static-page";

export default function DashboardPage({ params }: { params: { locale: string } }) {
  return (
    <StaticPage eyebrow="Patient portal" title="Your dashboard" description="Review inquiry progress, appointment details, quotes, and documents.">
      <PatientDashboard />
      <p className="muted" style={{ marginTop: "2rem" }}>Need an account? <Link className="text-link" href={`/${params.locale}/login`}>Sign in</Link></p>
    </StaticPage>
  );
}
