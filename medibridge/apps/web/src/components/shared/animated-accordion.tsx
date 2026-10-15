"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { motionDuration, motionEase } from "@/lib/motion";

export function AnimatedAccordion({
  question,
  answer,
  className = "",
}: {
  question: string;
  answer: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const answerId = useId();
  const reduceMotion = useReducedMotion();

  return (
    <article className={`animated-accordion ${className}`.trim()}>
      <h3 className="animated-accordion-heading">
        <button
          className="animated-accordion-trigger"
          type="button"
          id={`${answerId}-trigger`}
          aria-expanded={isOpen}
          aria-controls={answerId}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span>{question}</span>
          <ChevronDown className="animated-accordion-icon" size={19} aria-hidden="true" />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="animated-accordion-panel"
            id={answerId}
            role="region"
            aria-labelledby={`${answerId}-trigger`}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : motionDuration.base, ease: motionEase }}
          >
            <p>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
