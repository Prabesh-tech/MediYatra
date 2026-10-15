"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function SiteExperience() {
  const pathname = usePathname();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    function updateProgress() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0);
      });
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [pathname]);

  return (
    <div className="site-scroll-progress" aria-hidden="true">
      <span style={{ transform: `scaleX(${scrollProgress})` }} />
    </div>
  );
}
