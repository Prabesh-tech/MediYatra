"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

type CounterProps = {
  value: number;
  className?: string;
  format?: (value: number) => string;
};

export function Counter({ value, className, format = (count) => Math.round(count).toLocaleString() }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 70, damping: 20 });
  const displayValue = useTransform(springValue, (current) => format(current));

  useEffect(() => {
    if (reduceMotion) {
      motionValue.jump(value);
      springValue.jump(value);
    } else if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, reduceMotion, springValue, value]);

  return (
    <motion.span
      ref={ref}
      className={className}
      aria-label={format(value)}
      aria-live="off"
    >
      {displayValue}
    </motion.span>
  );
}
