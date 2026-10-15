"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const slides = [
  { src: "/images/slide-07.png", alt: "Emergency hospital entrance with a medical team and ambulance" },
  { src: "/images/slide-06.png", alt: "Healthcare professional carrying medicine and patient care supplies" },
  { src: "/images/slide-03.png", alt: "Medical staff working in a hospital ward with patients" },
  { src: "/images/slide-04.png", alt: "Medical emergency team moving a patient through a hospital entrance" },
  { src: "/images/slide-05.png", alt: "Doctor checking a patient's blood pressure" },
  { src: "/images/slide-02.png", alt: "Nurse comforting an elderly patient in a hospital room" },
  { src: "/images/slide-01.png", alt: "Doctor in a white coat with a stethoscope" },
  { src: "/images/slide-08.png", alt: "Dentist performing a dental procedure on a patient" },
  { src: "/images/slide-09.png", alt: "Eye examination with specialist equipment" },
  { src: "/images/hero-medical-team.png", alt: "Medical team performing a procedure in a modern operating room" },
] as const;

export function HeroImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 1000], [0, 90], { clamp: true });

  useEffect(() => {
    if (reduceMotion) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 2000);
    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  const activeSlide = slides[activeIndex];

  return (
    <motion.div className="hero-visual" style={{ y: reduceMotion ? 0 : parallaxY }} aria-live="off">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          className="hero-slide"
          key={activeSlide.src}
          initial={reduceMotion ? false : { opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, x: -18 }}
          transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
        >
          <Image
            className="hero-image"
            src={activeSlide.src}
            alt={activeSlide.alt}
            fill
            priority
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}