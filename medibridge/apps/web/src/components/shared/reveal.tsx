"use client";

import { Children, type ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { imageReveal, motionDuration, motionEase, revealUp, staggerChildren } from "@/lib/motion";

type RevealProps = HTMLMotionProps<"div"> & { delay?: number };
type RevealSectionProps = HTMLMotionProps<"section"> & { delay?: number };
type ImageRevealProps = HTMLMotionProps<"div"> & { children: ReactNode };
type StaggerGridProps = { children: ReactNode; className?: string };

function useRevealMotion(delay: number) {
  const reduceMotion = useReducedMotion();

  return {
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once: true, amount: 0.12 },
    variants: {
      hidden: revealUp.hidden,
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: reduceMotion ? 0 : motionDuration.base,
          delay: reduceMotion ? 0 : delay,
          ease: motionEase,
        },
      },
    },
  };
}

export function Reveal({ children, delay = 0, className, ...props }: RevealProps) {
  const motionProps = useRevealMotion(delay);
  return (
    <motion.div className={className ? `reveal ${className}` : "reveal"} {...motionProps} {...props}>
      {children}
    </motion.div>
  );
}

export function RevealSection({ children, delay = 0, className, ...props }: RevealSectionProps) {
  const motionProps = useRevealMotion(delay);
  return (
    <motion.section className={className ? `reveal-section ${className}` : "reveal-section"} {...motionProps} {...props}>
      {children}
    </motion.section>
  );
}

export function RevealText({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className="reveal-text"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
      variants={{
        hidden: revealUp.hidden,
        visible: {
          ...revealUp.visible,
          transition: {
            duration: reduceMotion ? 0 : motionDuration.fast,
            delay: reduceMotion ? 0 : delay,
            ease: motionEase,
          },
        },
      }}
    >
      {children}
    </motion.span>
  );
}

export function ImageReveal({ children, className, ...props }: ImageRevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className ? `motion-image-frame ${className}` : "motion-image-frame"}
      variants={{
        hidden: imageReveal.hidden,
        visible: {
          ...imageReveal.visible,
          transition: { duration: reduceMotion ? 0 : motionDuration.slow, ease: motionEase },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.16 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGrid({ children, className = "" }: StaggerGridProps) {
  const reduceMotion = useReducedMotion();
  const items = Children.toArray(children);

  return (
    <motion.div
      className={className}
      variants={staggerChildren}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
    >
      {items.map((child, index) => (
        <motion.div
          className="stagger-grid-item"
          key={index}
          variants={revealUp}
          transition={{ duration: reduceMotion ? 0 : motionDuration.base, ease: motionEase }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
