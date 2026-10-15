import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { ConsultationRequestForm } from "@/components/forms/consultation-request-form";
import { StaticPage } from "@/components/shared/static-page";

export default function ConsultationPage() {
  return (
    <StaticPage eyebrow="Consultation request" title="Request a conversation" description="Choose a preferred time for the team to check. This is a request, not a confirmed booking.">
      <div className="form-layout">
        <ConsultationRequestForm />
        <aside className="card">
          <CalendarClock size={25} color="var(--teal)" aria-hidden="true" />
          <h2 style={{ marginTop: "1rem" }}>Availability is confirmed separately</h2>
          <p className="muted">The request is available to signed-in patients. A coordinator must confirm the time and clinician before it is booked.</p>
          <p><Link className="text-link" href="/en/login">Sign in to request a time</Link></p>
        </aside>
      </div>
    </StaticPage>
  );
}
