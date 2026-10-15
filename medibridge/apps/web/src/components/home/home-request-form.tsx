"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { localizedHref } from "@/config/site";

const requestPaths = {
  question: "contact",
  quote: "quote",
  appointment: "consultation",
} as const;

export function HomeRequestForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [requestType, setRequestType] = useState<keyof typeof requestPaths>("question");

  function continueToRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(localizedHref(locale, requestPaths[requestType]));
  }

  return (
    <aside className="hero-request-card" aria-labelledby="hero-request-title">
      <p className="eyebrow">Start here</p>
      <h2 id="hero-request-title">How can we help?</h2>
      <form onSubmit={continueToRequest}>
        <div className="field">
          <label htmlFor="hero-request-type">Choose a request</label>
          <select
            id="hero-request-type"
            value={requestType}
            onChange={(event) => setRequestType(event.target.value as keyof typeof requestPaths)}
          >
            <option value="question">Ask a question</option>
            <option value="quote">Plan medical travel or request a quote</option>
            <option value="appointment">Request an appointment time</option>
          </select>
        </div>
        {requestType === "appointment" && (
          <p className="hero-request-help">Appointment time requests are available to signed-in patients.</p>
        )}
        <Button type="submit" variant="accent">
          Continue <ArrowRight size={17} aria-hidden="true" />
        </Button>
      </form>
    </aside>
  );
}
