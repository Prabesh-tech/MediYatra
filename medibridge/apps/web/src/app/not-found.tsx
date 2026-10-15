import Link from "next/link";
import { ArrowLeft, HeartPulse } from "lucide-react";

export default function NotFound() {
  return (
    <main className="error-page">
      <HeartPulse size={30} color="var(--teal)" aria-hidden="true" />
      <p className="eyebrow">Mediyatra</p>
      <h1>This page is not available</h1>
      <p className="muted">The address may have changed, or the information has not been published.</p>
      <Link className="button button-primary" href="/en"><ArrowLeft size={17} aria-hidden="true" /> Return home</Link>
    </main>
  );
}
