import { RequestResetForm } from "@/components/forms/auth-forms";
import { StaticPage } from "@/components/shared/static-page";

export default function RequestPasswordResetPage() {
  return <StaticPage eyebrow="Patient portal" title="Request a reset link" description="If an eligible account matches, we will send a one-time password-reset link."><RequestResetForm /></StaticPage>;
}
