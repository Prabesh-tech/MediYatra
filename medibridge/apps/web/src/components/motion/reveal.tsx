"use client";

import { Children, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { imageReveal, motionDuration, motionEase, revealUp, staggerChildren } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const classes = ["reveal", className].filter(Boolean).join(" ");

  return (
    <motion.div
      className={classes}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={{
        hidden: revealUp.hidden,
        visible: {
          ...revealUp.visible,
          transition: { duration: reduceMotion ? 0 : motionDuration.base, delay: reduceMotion ? 0 : delay, ease: motionEase },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={reduceMotion ? {} : staggerChildren}
    >
      {children}
    </motion.div>
  );
}

type StaggerGridProps = {
  children: ReactNode;
  className?: string;
};

export function StaggerGrid({ children, className }: StaggerGridProps) {
  const reduceMotion = useReducedMotion();
  const items = Children.toArray(children);

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={reduceMotion ? {} : staggerChildren}
    >
      {items.map((child, index) => (
        <motion.div
          className="stagger-grid-item"
          key={index}
          variants={{
            hidden: revealUp.hidden,
            visible: {
              ...revealUp.visible,
              transition: { duration: reduceMotion ? 0 : motionDuration.base, ease: motionEase },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

type ImageRevealProps = {
  children: ReactNode;
  className?: string;
};

export function ImageReveal({ children, className }: ImageRevealProps) {
  const reduceMotion = useReducedMotion();
  const classes = ["motion-image-frame", className].filter(Boolean).join(" ");

  return (
    <motion.div
      className={classes}
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
    >
      {children}
    </motion.div>
  );
}
