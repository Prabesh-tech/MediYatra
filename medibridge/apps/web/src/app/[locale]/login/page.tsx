import { LoginForm } from "@/components/forms/auth-forms";
import { StaticPage } from "@/components/shared/static-page";

export default function LoginPage({ params }: { params: { locale: string } }) {
  return <StaticPage eyebrow="Patient portal" title="Your care workspace" description="Sign in to view inquiry progress, appointments, quotes, and documents."><LoginForm locale={params.locale} /></StaticPage>;
}
