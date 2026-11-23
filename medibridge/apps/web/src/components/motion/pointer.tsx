"use client";

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { magnetic, tilt } from "@/lib/motion";

type PointerEffectProps = {
  children: ReactNode;
  className?: string;
};

const springConfig = { stiffness: 180, damping: 24, mass: 0.3 };

export function Parallax({ children, className, distance = 32 }: PointerEffectProps & { distance?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    const updateDesktopState = () => setIsDesktop(mediaQuery.matches);
    updateDesktopState();
    mediaQuery.addEventListener("change", updateDesktopState);
    return () => mediaQuery.removeEventListener("change", updateDesktopState);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduceMotion || !isDesktop ? undefined : { y }}
    >
      {children}
    </motion.div>
  );
}

export function Tilt({ children, className }: PointerEffectProps) {
  const reduceMotion = useReducedMotion();
  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  const rotateX = useSpring(rotateXValue, springConfig);
  const rotateY = useSpring(rotateYValue, springConfig);

  function updateTilt(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType !== "mouse" || !window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const rotation = tilt(event.clientX, event.clientY, bounds, 5);
    rotateXValue.set(rotation.rotateX);
    rotateYValue.set(rotation.rotateY);
  }

  function resetTilt() {
    rotateXValue.set(0);
    rotateYValue.set(0);
  }

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={updateTilt}
      onPointerLeave={resetTilt}
      onBlur={resetTilt}
    >
      {children}
    </motion.div>
  );
}

export function Magnetic({ children, className }: PointerEffectProps) {
  const reduceMotion = useReducedMotion();
  const xValue = useMotionValue(0);
  const yValue = useMotionValue(0);
  const x = useSpring(xValue, springConfig);
  const y = useSpring(yValue, springConfig);

  function updatePosition(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType !== "mouse" || !window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const position = magnetic(event.clientX, event.clientY, bounds, 0.06);
    xValue.set(position.x);
    yValue.set(position.y);
  }

  function resetPosition() {
    xValue.set(0);
    yValue.set(0);
  }

  return (
    <motion.div
      className={className}
      style={{ x, y }}
      onPointerMove={updatePosition}
      onPointerLeave={resetPosition}
      onBlur={resetPosition}
    >
      {children}
    </motion.div>
  );
}
