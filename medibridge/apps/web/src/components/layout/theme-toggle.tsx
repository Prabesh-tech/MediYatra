"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const buttonLabel = !mounted ? "Toggle theme" : isDark ? "Switch to light theme" : "Switch to dark theme";
  const icon = !mounted ? <Moon size={19} aria-hidden="true" /> : isDark ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />;

  return (
    <button
      className="icon-button"
      type="button"
      disabled={!mounted}
      aria-label={buttonLabel}
      title={buttonLabel}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {icon}
    </button>
  );
}
