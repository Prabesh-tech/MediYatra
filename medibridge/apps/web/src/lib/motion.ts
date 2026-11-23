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

export const reveal = revealUp;
export const stagger = staggerChildren;

type Bounds = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function tilt(pointerX: number, pointerY: number, bounds: Bounds, maxDegrees = 6) {
  if (bounds.width <= 0 || bounds.height <= 0) return { rotateX: 0, rotateY: 0 };

  const x = Math.max(0, Math.min(1, (pointerX - bounds.left) / bounds.width));
  const y = Math.max(0, Math.min(1, (pointerY - bounds.top) / bounds.height));

  return {
    rotateX: (0.5 - y) * 2 * maxDegrees,
    rotateY: (x - 0.5) * 2 * maxDegrees,
  };
}

export function magnetic(pointerX: number, pointerY: number, bounds: Bounds, strength = 0.12) {
  if (bounds.width <= 0 || bounds.height <= 0) return { x: 0, y: 0 };

  return {
    x: (pointerX - (bounds.left + bounds.width / 2)) * strength,
    y: (pointerY - (bounds.top + bounds.height / 2)) * strength,
  };
}

export function counter(progress: number, target: number, start = 0) {
  const boundedProgress = Math.max(0, Math.min(1, progress));
  return Math.round(start + (target - start) * boundedProgress);
}
