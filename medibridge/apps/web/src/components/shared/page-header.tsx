import type { ReactNode } from "react";
import Image from "next/image";

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <header className="page-header">
      <Image className="page-header-image" src="/images/nurse-support.png" alt="" aria-hidden="true" fill sizes="100vw" />
      <div className="container page-header-content">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {children && <div className="page-header-copy">{children}</div>}
      </div>
    </header>
  );
}
