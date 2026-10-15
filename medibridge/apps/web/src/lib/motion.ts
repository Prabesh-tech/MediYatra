import type { Variants } from "framer-motion";

export const motionDuration = {
  fast: 0.4,
  base: 0.55,
  slow: 0.75,
} as const;

export const motionEase = [0.22, 1, 0.36, 1] as const;

export const revealUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDuration.base, ease: motionEase },
  },
};

export const staggerChildren: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.035 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: motionDuration.slow, ease: motionEase },
  },
};
