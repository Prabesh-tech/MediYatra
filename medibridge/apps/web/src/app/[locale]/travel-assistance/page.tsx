import { Plane, Hotel, Languages, MapPinned } from "lucide-react";
import { StaticPage } from "@/components/shared/static-page";

const supports = [
  [Plane, "Travel planning", "Discuss timing after your care plan and provider availability are confirmed."],
  [Hotel, "Accommodation questions", "Share accessibility, length-of-stay, and recovery needs before making a booking."],
  [MapPinned, "Local transport", "Confirm pickup, distance, and mobility arrangements directly before travel."],
  [Languages, "Interpretation", "Ask which language support is available and whether it is included or separately arranged."],
] as const;

export default function TravelAssistancePage() {
  return (
    <StaticPage eyebrow="Travel support" title="Plan the practical details" description="Support options and supplier availability are confirmed case by case. No booking or supplier is implied by this information.">
      <div className="grid grid-2">
        {supports.map(([Icon, title, description]) => (
          <article className="card" key={title}>
            <span className="treatment-icon"><Icon size={21} aria-hidden="true" /></span>
            <h2 style={{ marginTop: "1rem" }}>{title}</h2>
            <p className="muted">{description}</p>
          </article>
        ))}
      </div>
      <p className="disclaimer" style={{ marginTop: "2rem" }}>Check current visa and entry requirements with official authorities. Confirm all travel arrangements, fees, and cancellation terms in writing.</p>
    </StaticPage>
  );
}
