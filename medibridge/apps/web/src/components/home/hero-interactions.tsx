"use client";

import { Fragment, type ReactNode } from "react";
import { useMotionValue, motion, useReducedMotion, useSpring, type Variants } from "framer-motion";
import { CheckCircle2, HeartHandshake, Plane, ArrowRight } from "lucide-react";
import type { PointerEvent } from "react";
import { Button } from "@/components/ui/button";
import { localizedHref } from "@/config/site";
import { motionDuration, motionEase, staggerChildren } from "@/lib/motion";
import type { HomeCopy } from "@/types/home-copy";
import { HeroImageCarousel } from "@/components/home/hero-image-carousel";

type HeroSpotlightProps = {
  children: ReactNode;
  labelledBy: string;
};

function createRevealItem(reduceMotion: boolean): Variants {
  return {
    hidden: { opacity: 0, y: 12, filter: "blur(5px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduceMotion ? 0 : motionDuration.slow, ease: motionEase },
    },
  };
}

const trustChips = [
  { label: "Clear coordination", Icon: CheckCircle2 },
  { label: "Travel support", Icon: Plane },
  { label: "Personal care", Icon: HeartHandshake },
] as const;

function HeroMagneticAction({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const revealItem = createRevealItem(Boolean(reduceMotion));
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 180, damping: 22, mass: 0.35 });
  const y = useSpring(pointerY, { stiffness: 180, damping: 22, mass: 0.35 });

  function pullTowardPointer(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType !== "mouse" || !window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left - bounds.width / 2) * 0.08);
    pointerY.set((event.clientY - bounds.top - bounds.height / 2) * 0.08);
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <motion.div
      className="hero-action-magnet"
      variants={revealItem}
      style={{ x: reduceMotion ? 0 : x, y: reduceMotion ? 0 : y }}
      onPointerMove={pullTowardPointer}
      onPointerLeave={resetPointer}
    >
      {children}
    </motion.div>
  );
}

export function HeroSpotlight({ children, labelledBy }: HeroSpotlightProps) {
  return <section className="hero hero-spotlight" aria-labelledby={labelledBy}>{children}</section>;
}

export function HeroStoryChapter({ children, labelledBy }: HeroSpotlightProps) {
  return <HeroSpotlight labelledBy={labelledBy}>{children}</HeroSpotlight>;
}

export function HeroIntro({ locale, copy }: { locale: string; copy: HomeCopy["hero"] }) {
  const reduceMotion = useReducedMotion();
  const revealItem = createRevealItem(Boolean(reduceMotion));
  const leadWords = copy.headlineLead.split(" ");
  const emphasisWords = copy.headlineEmphasis.split(" ");

  return (
    <motion.div
      className="hero-content"
      variants={staggerChildren}
      initial="hidden"
      animate="visible"
    >
      <motion.p className="eyebrow hero-eyebrow" variants={revealItem}>
        <span className="hero-kicker-dot" aria-hidden="true" />
        {copy.eyebrow}
      </motion.p>
      <motion.h1 id="home-title" variants={revealItem}>
        {leadWords.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span className="hero-headline-word" style={{ animationDelay: `${index * 0.07}s` }}>{word}</span>
            {index < leadWords.length - 1 ? " " : ""}
          </Fragment>
        ))}
        {" "}
        <span className="hero-headline-emphasis">
          {emphasisWords.map((word, index) => (
            <Fragment key={`${word}-${index}`}>
              <span className="hero-headline-word" style={{ animationDelay: `${(leadWords.length + index) * 0.07}s` }}>{word}</span>
              {index < emphasisWords.length - 1 ? " " : ""}
            </Fragment>
          ))}
        </span>
      </motion.h1>
      <motion.p className="hero-subtext" variants={revealItem}>{copy.subtext}</motion.p>
      <motion.div className="hero-actions" variants={revealItem}>
        <HeroMagneticAction>
          <Button variant="accent" href={localizedHref(locale, "quote")}>
            {copy.primaryAction}<ArrowRight className="hero-primary-arrow" size={18} aria-hidden="true" />
          </Button>
        </HeroMagneticAction>
        <HeroMagneticAction>
          <Button variant="secondary" href={localizedHref(locale, "nursing-care")}>
            {copy.secondaryAction}
          </Button>
        </HeroMagneticAction>
      </motion.div>
      <motion.div className="hero-trust-chips" variants={revealItem} aria-label="How MediYatra supports your journey">
        {trustChips.map(({ label, Icon }) => (
          <motion.span className="hero-trust-chip" key={label} variants={revealItem}>
            <Icon size={16} aria-hidden="true" />
            {label}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}

export { HeroImageCarousel };
