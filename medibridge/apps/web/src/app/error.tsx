"use client";

import { HeartPulse, RefreshCw } from "lucide-react";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="error-page">
      <HeartPulse size={30} color="var(--teal)" aria-hidden="true" />
      <p className="eyebrow">Mediyatra</p>
      <h1>We could not load this page</h1>
      <p className="muted">Your information has not been included in an error report.</p>
      <button className="button button-primary" type="button" onClick={() => reset()}><RefreshCw size={17} aria-hidden="true" /> Try again</button>
    </main>
  );
}
