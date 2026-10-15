import type { ReactNode } from "react";
import { PageHeader } from "./page-header";

export function StaticPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title}><p>{description}</p></PageHeader>
      <main className="page-content">
        <div className="container">{children}</div>
      </main>
    </>
  );
}
