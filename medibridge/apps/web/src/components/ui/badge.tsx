import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";

export function Badge({ children, verified = false }: { children: ReactNode; verified?: boolean }) {
  return (
    <span className="badge">
      {verified && <CheckCircle2 size={14} aria-hidden="true" />}
      {children}
    </span>
  );
}
