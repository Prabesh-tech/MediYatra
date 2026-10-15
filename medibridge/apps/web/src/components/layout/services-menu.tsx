"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Triangle } from "lucide-react";
import { localizedHref, siteConfig } from "@/config/site";

export function ServicesMenu({ locale }: { locale: string }) {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const prefetchedRoutes = useRef(new Set<string>());
  const router = useRouter();
  const pathname = usePathname().replace(/\/$/, "");
  const isCurrent = siteConfig.navigation.services.some(({ href }) => pathname === localizedHref(locale, href) || pathname.startsWith(`${localizedHref(locale, href)}/`));

  function prefetchRoute(href: string) {
    const destination = localizedHref(locale, href);
    if (prefetchedRoutes.current.has(destination)) return;
    prefetchedRoutes.current.add(destination);
    router.prefetch(destination);
  }

  useEffect(() => {
    function closeOnOutsidePointer(event: PointerEvent) {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) {
        menuRef.current?.removeAttribute("open");
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") menuRef.current?.removeAttribute("open");
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <details ref={menuRef} className="mega-menu" data-current={isCurrent ? "true" : undefined}>
      <summary aria-current={isCurrent ? "page" : undefined}>Services <Triangle className="services-chevron" size={12} aria-hidden="true" /></summary>
      <div className="mega-menu-panel">
        {siteConfig.navigation.services.map(({ label, href, description }) => (
          <Link
            key={href}
            href={localizedHref(locale, href)}
            onPointerEnter={() => prefetchRoute(href)}
            onFocus={() => prefetchRoute(href)}
            onClick={() => menuRef.current?.removeAttribute("open")}
          >
            <strong>{label}</strong>
            <span>{description}</span>
          </Link>
        ))}
      </div>
    </details>
  );
}