"use client";

import { useReducedMotion } from "framer-motion";

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
};

export function SplitText({ text, className, delay = 0 }: SplitTextProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <span className={className}>{text}</span>;

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, index) => (
          <span
            className="hero-headline-word"
            key={`${word}-${index}`}
            style={{ animationDelay: `${delay + index * 0.075}s` }}
          >
            {word}
          </span>
        ))}
      </span>
    </span>
  );
}
