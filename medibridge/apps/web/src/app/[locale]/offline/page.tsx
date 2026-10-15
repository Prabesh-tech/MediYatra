import Link from "next/link";
import { WifiOff } from "lucide-react";
import { StaticPage } from "@/components/shared/static-page";

export default function OfflinePage() {
  return (
    <StaticPage eyebrow="Offline" title="You are offline" description="Reconnect to continue. Private account and medical information is never cached for offline use.">
      <div className="empty-state offline-state">
        <WifiOff size={30} color="var(--teal)" aria-hidden="true" />
        <p className="muted">Your saved browser preferences remain on this device. Inquiry forms and documents need a secure connection.</p>
        <Link className="button button-primary" href="/en">Try the home page again</Link>
      </div>
    </StaticPage>
  );
}
