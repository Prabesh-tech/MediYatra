import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function EmptyDirectory({ title, locale }: { title: string; locale: string }) {
  return (
    <div className="empty-state">
      <ShieldCheck size={28} color="var(--teal)" aria-hidden="true" />
      <h2>{title}</h2>
      <p className="muted">We review providers and details before publishing. Ask our team about current options.</p>
      <Link className="text-link" href={`/${locale}/quote`}>Ask about your care options</Link>
    </div>
  );
}
