import Link from "next/link";
import { AdminContactInbox } from "@/components/shared/admin-contact-inbox";
import { AdminDashboard } from "@/components/shared/admin-dashboard";
import { StaticPage } from "@/components/shared/static-page";

export default function AdminPage({ params }: { params: { locale: string } }) {
  return (
    <StaticPage eyebrow="Operations" title="Inquiry administration" description="Restricted workspace for authorized coordinators and administrators.">
      <AdminDashboard />
      <div style={{ marginTop: "2rem" }}><AdminContactInbox /></div>
      <p className="muted" style={{ marginTop: "1.5rem" }}>Access is enforced by the API role guard. <Link className="text-link" href={`/${params.locale}/login`}>Sign in</Link></p>
    </StaticPage>
  );
}
