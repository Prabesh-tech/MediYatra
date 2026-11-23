"use client";

import { useEffect, useRef, useState, type FocusEvent, type PointerEvent } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { CheckCircle2, HeartHandshake, Plane, Route } from "lucide-react";

const slides = [
  { src: "/images/slide-02.png", alt: "Nurse comforting an elderly patient in a hospital room" },
  { src: "/images/slide-07.png", alt: "Emergency hospital entrance with a medical team and ambulance" },
  { src: "/images/slide-06.png", alt: "Healthcare professional carrying medicine and patient care supplies" },
  { src: "/images/slide-03.png", alt: "Medical staff working in a hospital ward with patients" },
  { src: "/images/slide-04.png", alt: "Medical emergency team moving a patient through a hospital entrance" },
  { src: "/images/slide-05.png", alt: "Doctor checking a patient's blood pressure" },
  { src: "/images/slide-01.png", alt: "Doctor in a white coat with a stethoscope" },
  { src: "/images/slide-08.png", alt: "Dentist performing a dental procedure on a patient" },
  { src: "/images/slide-09.png", alt: "Eye examination with specialist equipment" },
  { src: "/images/hero-medical-team.png", alt: "Medical team performing a procedure in a modern operating room" },
] as const;

const blurPlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='%230b4d9b'/%3E%3C/svg%3E";

export function HeroImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [isFineDesktop, setIsFineDesktop] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerXSpring = useSpring(pointerX, { stiffness: 90, damping: 24, mass: 0.6 });
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "end start"] });
  const scrollY = useTransform(scrollYProgress, [0, 1], [16, -16]);
  const isPaused = isHovered || hasFocus;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    const updateViewport = () => setIsFineDesktop(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (reduceMotion || isPaused) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(interval);
  }, [activeIndex, isPaused, reduceMotion]);

  function updatePointerParallax(event: PointerEvent<HTMLDivElement>) {
    if (!isFineDesktop || reduceMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 8);
  }

  function resetPointerParallax() {
    pointerX.set(0);
  }

  function resumeAfterFocusLeaves(event: FocusEvent<HTMLDivElement>) {
    const nextTarget = event.relatedTarget;
    if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
      setHasFocus(false);
    }
  }

  const activeSlide = slides[activeIndex];

  return (
    <div
      className="hero-carousel"
      role="region"
      aria-label="Healthcare journey images"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setHasFocus(true)}
      onBlurCapture={resumeAfterFocusLeaves}
      onPointerMove={updatePointerParallax}
      onPointerLeave={resetPointerParallax}
    >
      <motion.div
        className="hero-frame"
        ref={frameRef}
        style={{
          x: reduceMotion || !isFineDesktop ? 0 : pointerXSpring,
          y: reduceMotion || !isFineDesktop ? 0 : scrollY,
        }}
      >
        <span className="hero-frame-glow" aria-hidden="true" />
        <div className="hero-image-window">
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              className="hero-slide"
              key={activeSlide.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.65, ease: "easeOut" }}
            >
              <Image
                className="hero-image"
                src={activeSlide.src}
                alt={activeSlide.alt}
                fill
                priority={activeIndex === 0}
                placeholder="blur"
                blurDataURL={blurPlaceholder}
                sizes="(max-width: 760px) 92vw, (max-width: 1050px) 46vw, 43vw"
              />
            </motion.div>
          </AnimatePresence>
          <span className="hero-image-shade" aria-hidden="true" />

          <svg className="hero-route" viewBox="0 0 360 90" aria-hidden="true">
            <path className="hero-route-path" id="hero-route-path" d="M 22 64 C 112 18, 220 82, 338 28" />
            <circle className="hero-route-point" cx="22" cy="64" r="4" />
            <circle className="hero-route-point" cx="338" cy="28" r="4" />
            <g className="hero-route-plane">
              <path d="M 0 -5 L 14 0 L 0 5 L 3 1 L -4 1 L -4 -1 L 3 -1 Z" />
              <animateMotion dur="7s" repeatCount="indefinite" rotate="auto">
                <mpath href="#hero-route-path" />
              </animateMotion>
            </g>
          </svg>

          <div className="hero-carousel-controls">
            <div
              className="hero-carousel-progress"
              aria-hidden="true"
              data-paused={isPaused}
            >
              <span key={activeIndex} />
            </div>
            <div className="hero-carousel-dots" role="group" aria-label="Hero image slides">
              {slides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  className={index === activeIndex ? "is-active" : ""}
                  aria-label={`Show image ${index + 1} of ${slides.length}: ${slide.alt}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
            <span className="hero-carousel-counter" aria-live="off">
              {String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
          </div>
        </div>
        <div className="hero-floating-cards" role="group" aria-label="MediYatra support details">
          <div className="hero-floating-card hero-floating-card--one">
            <span className="hero-floating-icon"><CheckCircle2 size={18} aria-hidden="true" /></span>
            <span>Hospital choice: yours</span>
          </div>
          <div className="hero-floating-card hero-floating-card--two">
            <span className="hero-floating-icon"><Plane size={18} aria-hidden="true" /></span>
            <span>Travel + stay arranged</span>
          </div>
          <div className="hero-floating-card hero-floating-card--three">
            <span className="hero-floating-icon"><HeartHandshake size={18} aria-hidden="true" /></span>
            <span>Follow-up support</span>
          </div>
        </div>
        <span className="hero-frame-caption"><Route size={15} aria-hidden="true" /> Coordinated from Nepal to India</span>
      </motion.div>
    </div>
  );
}
