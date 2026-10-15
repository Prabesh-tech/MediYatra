import { RegisterForm } from "@/components/forms/auth-forms";
import { StaticPage } from "@/components/shared/static-page";

export default function RegisterPage({ params }: { params: { locale: string } }) {
  return <StaticPage eyebrow="Patient portal" title="Create an account" description="Patient accounts are created with the patient role. Verify your email before signing in."><RegisterForm locale={params.locale} /></StaticPage>;
}
