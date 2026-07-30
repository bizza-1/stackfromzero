"use client";

// ============================================================
// AnimatedText — SplitText-based reveal for headings and lead
// copy. Splits into chars/words/lines and staggers them in.
// Falls back to plain rendering under reduced motion.
// ============================================================
import { useRef, createElement, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, SplitText, EASE, prefersReducedMotion } from "@/lib/animation/gsap";

type SplitType = "chars" | "words" | "lines";

type AnimatedTextProps = {
  children: ReactNode;
  /** Which tag to render (h1, h2, p, span...). Defaults to a div. */
  as?: ElementType;
  className?: string;
  /** Granularity of the reveal. */
  split?: SplitType;
  y?: number;
  stagger?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  /** When true, waits until scrolled into view instead of on mount. */
  onScroll?: boolean;
  start?: string;
};

export default function AnimatedText({
  children,
  as = "div",
  className,
  split = "chars",
  y = 40,
  stagger = 0.02,
  duration = 0.8,
  delay = 0,
  ease = EASE.out,
  onScroll = false,
  start = "top 85%",
}: AnimatedTextProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const splitter = new SplitText(el, {
        type: split,
        // Keep line wrapping stable during the split.
        linesClass: "split-line",
      });
      const targets =
        split === "chars"
          ? splitter.chars
          : split === "words"
            ? splitter.words
            : splitter.lines;

      gsap.set(el, { opacity: 1 });
      gsap.from(targets, {
        y,
        opacity: 0,
        duration,
        delay,
        ease,
        stagger,
        ...(onScroll
          ? { scrollTrigger: { trigger: el, start, once: true } }
          : {}),
      });

      // Revert the DOM split when the component unmounts / re-runs.
      return () => splitter.revert();
    },
    { scope: ref, dependencies: [] }
  );

  return createElement(
    as,
    // Start hidden so we never flash the un-split text before GSAP runs.
    { ref, className, style: prefersReducedMotion() ? undefined : { opacity: 0 } },
    children
  );
}
