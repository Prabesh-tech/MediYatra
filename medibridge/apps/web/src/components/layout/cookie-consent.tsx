"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "medibridge-cookie-preference";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem(STORAGE_KEY) === null);
  }, []);

  function choose(value: "essential" | "all") {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  }

  if (!visible) return null;
  return (
    <aside className="consent-banner" aria-label="Cookie preferences">
      <div className="consent-banner-inner">
        <div>
          <strong>Privacy choices</strong>
          <p className="muted" style={{ margin: "0.25rem 0 0" }}>
            This site uses essential storage for security and preferences. Optional analytics are not enabled.
          </p>
        </div>
        <div className="consent-actions">
          <Button variant="ghost" onClick={() => choose("essential")}>Essential only</Button>
          <Button variant="secondary" onClick={() => choose("all")}>Allow optional</Button>
        </div>
      </div>
    </aside>
  );
}
