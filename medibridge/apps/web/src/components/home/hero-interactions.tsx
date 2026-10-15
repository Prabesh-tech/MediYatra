"use client";

import type { PointerEvent, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type HeroSpotlightProps = {
  children: ReactNode;
  labelledBy: string;
};

export function HeroSpotlight({ children, labelledBy }: HeroSpotlightProps) {
  function updateSpotlight(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || !window.matchMedia("(min-width: 1024px)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--hero-pointer-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--hero-pointer-y", `${event.clientY - bounds.top}px`);
    event.currentTarget.dataset.spotlight = "true";
  }

  function clearSpotlight(event: PointerEvent<HTMLElement>) {
    event.currentTarget.dataset.spotlight = "false";
  }

  return (
    <section
      className="hero hero-spotlight"
      aria-labelledby={labelledBy}
      onPointerMove={updateSpotlight}
      onPointerLeave={clearSpotlight}
    >
      {children}
    </section>
  );
}

export function HeroHeadline() {
  const reduceMotion = useReducedMotion();
  const lead = "Your healthcare journey,";
  const emphasis = "coordinated with care.";
  const wordVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: "easeOut" as const } },
  };
  const wordsVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.075, delayChildren: 0.14 } },
  };

  return (
    <motion.h1
      id="home-title"
      aria-label={`${lead} ${emphasis}`}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
      variants={wordsVariants}
    >
      <span aria-hidden="true">
        {lead.split(" ").map((word, index) => (
          <motion.span className="hero-headline-word" key={word} variants={reduceMotion ? undefined : wordVariants}>
            {index > 0 ? " " : ""}{word}
          </motion.span>
        ))}
      </span>{" "}
      <span className="hero-headline-emphasis" aria-hidden="true">
        {emphasis.split(" ").map((word, index) => (
          <motion.span className="hero-headline-word" key={word} variants={reduceMotion ? undefined : wordVariants}>
            {index > 0 ? " " : ""}{word}
          </motion.span>
        ))}
      </span>
    </motion.h1>
  );
}

export function HeroEyebrow() {
  const reduceMotion = useReducedMotion();
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
  };
  const variants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
  };

  return (
    <motion.p
      className="eyebrow"
      aria-label="MediYatra, Nepal to India"
      variants={containerVariants}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "visible"}
    >
      <span className="hero-kicker-dot" aria-hidden="true" />
      <motion.span aria-hidden="true" variants={reduceMotion ? undefined : variants}>MEDIYATRA</motion.span>
      <motion.span aria-hidden="true" variants={reduceMotion ? undefined : variants}>/</motion.span>
      <motion.span aria-hidden="true" variants={reduceMotion ? undefined : variants}>NEPAL TO INDIA</motion.span>
    </motion.p>
  );
}
