"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { localizedHref } from "@/config/site";
import type { HomeCopy } from "@/types/home-copy";

const requestPaths = {
  question: "contact",
  quote: "quote",
  appointment: "consultation",
} as const;

export function HomeRequestForm({ locale, copy }: { locale: string; copy: HomeCopy["request"] }) {
  const router = useRouter();
  const [requestType, setRequestType] = useState<keyof typeof requestPaths>("question");

  function continueToRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(localizedHref(locale, requestPaths[requestType]));
  }

  return (
    <aside className="hero-request-card" aria-labelledby="hero-request-title">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2 id="hero-request-title">{copy.heading}</h2>
      <form onSubmit={continueToRequest}>
        <div className="field">
          <label htmlFor="hero-request-type">{copy.label}</label>
          <select
            id="hero-request-type"
            value={requestType}
            onChange={(event) => setRequestType(event.target.value as keyof typeof requestPaths)}
          >
            <option value="question">{copy.options[0]}</option>
            <option value="quote">{copy.options[1]}</option>
            <option value="appointment">{copy.options[2]}</option>
          </select>
        </div>
        {requestType === "appointment" && (
          <p className="hero-request-help">{copy.appointmentNote}</p>
        )}
        <Button type="submit" variant="accent">
          {copy.action} <ArrowRight size={17} aria-hidden="true" />
        </Button>
      </form>
    </aside>
  );
}
