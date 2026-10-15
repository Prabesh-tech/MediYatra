import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  asChild?: boolean;
  href?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  asChild = false,
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn("button", `button-${variant}`, className);
  if (asChild) {
    const Component = Slot;
    return <Component className={classes} {...props}>{children}</Component>;
  }
  if (href) return <Link className={classes} href={href}>{children}</Link>;
  return <button className={classes} {...props}>{children}</button>;
}
