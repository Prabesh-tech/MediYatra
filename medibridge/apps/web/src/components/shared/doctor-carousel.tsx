"use client";

import { useCallback, useEffect, useRef, useState, type FocusEvent, type TouchEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, HeartPulse, Phone, Stethoscope, UserRound } from "lucide-react";
import { placeholderDoctors } from "@/data/doctors-placeholder";

export type DoctorProfile = {
  slug: string;
  name: string;
  title: string;
  bio: string;
  photo: string | null;
  experienceYears: number;
  languages: string[];
  hospital: { name: string; city: string; country: string } | null;
  treatments: { treatment: { name: string } }[];
};

const placeholderProfiles: DoctorProfile[] = placeholderDoctors.map(({ slug, name, role, image }) => ({
  slug,
  name,
  title: role,
  bio: "",
  photo: image,
  experienceYears: 0,
  languages: [],
  hospital: null,
  treatments: [],
}));

const copyVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

const copyItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: "easeOut" as const } },
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase())
    .join("");
}

export function DoctorPortrait({ doctor, compact = false }: { doctor: DoctorProfile; compact?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className={`doctor-portrait${compact ? " doctor-portrait--compact" : ""}`} role="img" aria-label={`Portrait placeholder for ${doctor.name}`}>
      {!imageFailed && doctor.photo ? (
        <Image
          className="doctor-portrait-image"
          src={doctor.photo}
          alt={`Portrait of ${doctor.name}`}
          fill
          sizes={compact ? "135px" : "(max-width: 760px) 88vw, 360px"}
          unoptimized
          onError={() => setImageFailed(true)}
        />
      ) : (
        <svg className="doctor-silhouette" viewBox="0 0 320 410" aria-hidden="true">
          <circle cx="160" cy="106" r="54" fill="var(--doctor-silhouette)" />
          <path d="M80 198c17-31 47-48 80-48s63 17 80 48l37 167H43l37-167Z" fill="var(--doctor-coat)" />
          <path d="m128 159 32 39 32-39 20 20-31 71h-42l-31-71 20-20Z" fill="var(--doctor-shirt)" />
          <path d="m80 198 50 45-26 38-49-39 25-44Zm160 0-50 45 26 38 49-39-25-44Z" fill="var(--doctor-coat-shade)" />
          <path d="M154 237h12v95h-12z" fill="var(--doctor-shirt)" />
        </svg>
      )}
      <span className="doctor-initials" aria-hidden="true">{getInitials(doctor.name) || <UserRound size={16} />}</span>
    </div>
  );
}

function getSideDoctors(doctors: DoctorProfile[], activeIndex: number, direction: -1 | 1) {
  const side: { doctor: DoctorProfile; index: number; distance: number }[] = [];
  const seen = new Set<number>([activeIndex]);

  for (let distance = 1; distance <= 2; distance += 1) {
    const index = (activeIndex + direction * distance + doctors.length) % doctors.length;
    if (seen.has(index)) continue;
    seen.add(index);
    side.push({ doctor: doctors[index], index, distance });
  }

  return side;
}

export function DoctorCarousel({
  doctors,
  locale,
  eyebrow = "Meet our doctors",
  heading = "Experienced Doctors Supporting Compassionate Care",
  showDetailLink = true,
}: {
  doctors: DoctorProfile[];
  locale: string;
  eyebrow?: string;
  heading?: string;
  showDetailLink?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasFocus, setHasFocus] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const pointerInteraction = useRef(false);
  const carouselRef = useRef<HTMLElement>(null);
  const mobilePickerRef = useRef<HTMLDivElement>(null);
  const mobileCardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const reduceMotion = useReducedMotion();
  const profiles = doctors.length > 0 ? doctors : placeholderProfiles;
  const doctor = profiles[activeIndex] ?? profiles[0];
  const isPlaceholder = doctors.length === 0;
  const rightDoctors = getSideDoctors(profiles, activeIndex, 1);
  const rightDoctorIndices = new Set(rightDoctors.map(({ index }) => index));
  const leftDoctors = getSideDoctors(profiles, activeIndex, -1).filter(({ index }) => !rightDoctorIndices.has(index));
  const detailHref = isPlaceholder
    ? `/${locale}/team/${doctor.slug}`
    : `/${locale}/doctors/${doctor.slug}`;
  const consultHref = `/${locale}/quote?doctor=${encodeURIComponent(doctor.slug)}`;
  const callbackHref = `/${locale}/contact?request=callback&doctor=${encodeURIComponent(doctor.slug)}`;

  const selectDoctor = useCallback((index: number) => {
    setActiveIndex((index + profiles.length) % profiles.length);
  }, [profiles.length]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(carousel);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (profiles.length < 2 || reduceMotion || hasFocus || !isVisible) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % profiles.length);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [profiles.length, hasFocus, isVisible, reduceMotion]);

  useEffect(() => {
    if (window.matchMedia("(min-width: 761px)").matches) return;

    const picker = mobilePickerRef.current;
    const activeCard = mobileCardRefs.current[activeIndex];
    if (!picker || !activeCard) return;

    const targetLeft = activeCard.offsetLeft - picker.offsetLeft - (picker.clientWidth - activeCard.clientWidth) / 2;
    picker.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [activeIndex, reduceMotion]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectDoctor(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      selectDoctor(activeIndex + 1);
    }
  }

  function handleBlur(event: FocusEvent<HTMLElement>) {
    const nextTarget = event.relatedTarget;
    if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
      setHasFocus(false);
    }
  }

  function handlePointerDown() {
    pointerInteraction.current = true;
    setHasFocus(false);
  }

  function handlePointerUp() {
    window.setTimeout(() => {
      pointerInteraction.current = false;
    }, 0);
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (startX === null || endX === undefined || Math.abs(endX - startX) < 48) return;
    selectDoctor(activeIndex + (endX < startX ? 1 : -1));
  }

  function renderSideCards(items: ReturnType<typeof getSideDoctors>, side: "left" | "right") {
    return (
      <div className={`doctor-showcase-side doctor-showcase-side--${side}`} aria-label={`${side === "left" ? "Previous" : "Next"} doctor profiles`}>
        {items.map(({ doctor: item, index, distance }) => (
          <motion.button
            className="doctor-showcase-side-card"
            type="button"
            key={item.slug}
            layout
            layoutId={`doctor-card-${item.slug}`}
            aria-label={`Show ${item.name}`}
            onClick={() => selectDoctor(index)}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { delay: reduceMotion ? 0 : distance * 0.04, duration: reduceMotion ? 0 : 0.35 } }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease: "easeOut" }}
            whileHover={reduceMotion ? undefined : { y: -6, boxShadow: "0 18px 35px rgba(11, 77, 155, 0.2)" }}
          >
            <motion.span className="doctor-showcase-side-photo" layoutId={`doctor-portrait-${item.slug}`}>
              <DoctorPortrait doctor={item} compact />
            </motion.span>
            <span className="doctor-showcase-side-name">{item.name}</span>
          </motion.button>
        ))}
      </div>
    );
  }

  return (
    <section
      className="doctor-showcase"
      aria-label="Doctor profiles"
      aria-roledescription="carousel"
      tabIndex={0}
      ref={carouselRef}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onFocusCapture={() => {
        if (!pointerInteraction.current) setHasFocus(true);
      }}
      onBlurCapture={handleBlur}
    >
      <motion.header
        className="doctor-showcase-header"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: reduceMotion ? 0 : 0.55, ease: "easeOut" }}
      >
        <div className="doctor-showcase-eyebrow">
          <span aria-hidden="true" />
          <p>{eyebrow}</p>
          <span aria-hidden="true" />
        </div>
        <h2>{heading}</h2>
        <HeartPulse className="doctor-showcase-decoration" size={92} strokeWidth={0.8} aria-hidden="true" />
      </motion.header>

      <motion.div
        className="doctor-showcase-stage"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut" }}
      >
        {renderSideCards(leftDoctors, "left")}

        <motion.div
          className="doctor-showcase-feature-photo"
          layout
          layoutId={`doctor-portrait-${doctor.slug}`}
          transition={{ layout: { duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] } }}
          role="group"
          aria-label={`Featured profile: ${doctor.name}`}
        >
          <span className="doctor-showcase-line-art" aria-hidden="true" />
          <motion.div
            className="doctor-showcase-portrait-wrap"
            initial={reduceMotion ? false : { scale: 1.04 }}
            animate={{ scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut" }}
          >
            <DoctorPortrait doctor={doctor} />
          </motion.div>
          <span className="doctor-showcase-photo-label">Doctor profile</span>
        </motion.div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="doctor-showcase-copy"
            key={doctor.slug}
            variants={reduceMotion ? undefined : copyVariants}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          >
            <motion.p className="eyebrow" variants={reduceMotion ? undefined : copyItemVariants}>Independent clinician profile</motion.p>
            <motion.h3 variants={reduceMotion ? undefined : copyItemVariants}>{doctor.name}</motion.h3>
            <motion.p className="doctor-showcase-role" variants={reduceMotion ? undefined : copyItemVariants}>{doctor.title}</motion.p>
            <motion.div className="doctor-showcase-actions" variants={reduceMotion ? undefined : copyItemVariants}>
              <Link className="doctor-showcase-consult" href={consultHref}><Stethoscope size={17} aria-hidden="true" /> Consult Now</Link>
              <Link className="doctor-showcase-text-link" href={callbackHref}><Phone size={16} aria-hidden="true" /> Call Back Request</Link>
              {showDetailLink && <Link className="doctor-showcase-text-link" href={detailHref}>View Detail <ArrowRight size={15} aria-hidden="true" /></Link>}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {renderSideCards(rightDoctors, "right")}
      </motion.div>

      <div className="doctor-showcase-mobile-picker" ref={mobilePickerRef} aria-label="Choose a doctor profile">
        {profiles.map((item, index) => (
          <button
            className="doctor-showcase-mobile-card"
            type="button"
            key={item.slug}
            ref={(element) => { mobileCardRefs.current[index] = element; }}
            aria-label={`Show ${item.name}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => selectDoctor(index)}
          >
            <span className="doctor-showcase-mobile-photo"><DoctorPortrait doctor={item} compact /></span>
            <span>{item.name}</span>
          </button>
        ))}
      </div>

      <div className="doctor-showcase-controls" aria-label="Carousel controls">
        <button type="button" aria-label="Previous doctor" onClick={() => selectDoctor(activeIndex - 1)}>
          <ArrowLeft size={19} aria-hidden="true" />
        </button>
        <div className="doctor-showcase-dots" aria-label="Select a doctor profile">
          {profiles.map((item, index) => (
            <button
              type="button"
              key={item.slug}
              aria-label={`Show profile ${index + 1}: ${item.name}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => selectDoctor(index)}
            />
          ))}
        </div>
        <button type="button" aria-label="Next doctor" onClick={() => selectDoctor(activeIndex + 1)}>
          <ArrowRight size={19} aria-hidden="true" />
        </button>
      </div>

      <p className="doctor-showcase-note">Doctor profiles are shown for information. Treatment decisions are made by the treating doctor and hospital.</p>
    </section>
  );
}
