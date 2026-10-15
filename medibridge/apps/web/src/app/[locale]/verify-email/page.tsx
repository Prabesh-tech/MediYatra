import { VerifyEmailForm } from "@/components/forms/auth-forms";
import { StaticPage } from "@/components/shared/static-page";

export default function VerifyEmailPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { token?: string };
}) {
  return <StaticPage eyebrow="Patient portal" title="Verify your email address" description="Email verification links are single-use and expire."><VerifyEmailForm token={searchParams.token ?? ""} locale={params.locale} /></StaticPage>;
}
