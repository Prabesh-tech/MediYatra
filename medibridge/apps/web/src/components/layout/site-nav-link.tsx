"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteNavLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const pathname = usePathname().replace(/\/$/, "");
  const normalizedHref = href.replace(/\/$/, "");
  const isHome = /^\/[^/]+$/.test(normalizedHref);
  const isCurrent = pathname === normalizedHref || (!isHome && pathname.startsWith(`${normalizedHref}/`));

  return <Link className={className} href={href} aria-current={isCurrent ? "page" : undefined}>{children}</Link>;
}