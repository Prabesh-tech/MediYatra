"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function AnimatedCounter({ value, label }: { value: number; label: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const element = counterRef.current;
    if (!element || !Number.isFinite(value) || value < 0) return;

    if (reduceMotion || value === 0) {
      setDisplayValue(value);
      return;
    }

    let frameId = 0;
    let startedAt: number | null = null;
    let didStart = false;
    const duration = 650;

    const animate = (timestamp: number) => {
      if (startedAt === null) startedAt = timestamp;
      const progress = Math.min((timestamp - startedAt) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayValue(Math.round(value * eased));
      if (progress < 1) frameId = window.requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || didStart) return;
      didStart = true;
      frameId = window.requestAnimationFrame(animate);
      observer.disconnect();
    }, { threshold: 0.4 });

    observer.observe(element);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, [reduceMotion, value]);

  return <span ref={counterRef} aria-label={`${value.toLocaleString("en")} ${label}`}>{displayValue.toLocaleString("en")}</span>;
}
