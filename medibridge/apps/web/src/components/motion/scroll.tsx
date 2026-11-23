"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, type MotionValue } from "framer-motion";

type ScrollChapterProps = {
  children: (progress: MotionValue<number>) => ReactNode;
  className?: string;
  sticky?: boolean;
};

export function ScrollChapter({ children, className, sticky = true }: ScrollChapterProps) {
  const chapterRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: chapterRef,
    offset: ["start start", "end end"],
  });
  const smoothedProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.25 });
  const finalProgress = useMotionValue(1);
  const progress = reduceMotion ? finalProgress : smoothedProgress;

  return (
    <motion.section
      ref={chapterRef}
      className={["scroll-chapter", className].filter(Boolean).join(" ")}
      style={{ minHeight: sticky && !reduceMotion ? "100svh" : undefined }}
    >
      <div className={sticky && !reduceMotion ? "scroll-chapter-sticky" : undefined}>{children(progress)}</div>
    </motion.section>
  );
}
