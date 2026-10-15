import { ResetPasswordForm } from "@/components/forms/auth-forms";
import { StaticPage } from "@/components/shared/static-page";

export default function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { token?: string };
}) {
  return <StaticPage eyebrow="Patient portal" title="Set a new password" description="Choose a strong password of at least 12 characters."><ResetPasswordForm token={searchParams.token ?? ""} locale={params.locale} /></StaticPage>;
}
