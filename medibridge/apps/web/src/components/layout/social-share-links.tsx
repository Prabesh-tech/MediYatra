"use client";

import { siteConfig } from "@/config/site";

const shareOptions = [
  { name: "Facebook", mark: "f" },
  { name: "LinkedIn", mark: "in" },
  { name: "X", mark: "X" },
  { name: "WhatsApp", mark: "WA" },
] as const;

export function SocialShareLinks({ locale }: { locale: string }) {
  function share(name: (typeof shareOptions)[number]["name"]) {
    const pageUrl = `${window.location.origin}/${locale}`;
    const encodedUrl = encodeURIComponent(pageUrl);
    const message = encodeURIComponent(`${siteConfig.brand.name} | ${siteConfig.brand.tagline}`);
    const targets = {
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      X: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${message}`,
      WhatsApp: `https://wa.me/?text=${message}%20${encodedUrl}`,
    };
    window.open(targets[name], "_blank", "noopener,noreferrer");
  }

  return (
    <div className="footer-social" role="group" aria-label="Share MediYatra">
      {shareOptions.map(({ name, mark }) => (
        <button key={name} type="button" aria-label={`Share MediYatra on ${name}`} title={`Share on ${name}`} onClick={() => share(name)}>
          <span aria-hidden="true">{mark}</span>
        </button>
      ))}
    </div>
  );
}
