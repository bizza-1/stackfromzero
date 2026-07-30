"use client";

// ============================================================
// Reusable animation hooks. Each one is a thin wrapper around
// useGSAP so cleanup (killing tweens + ScrollTriggers) happens
// automatically on unmount, and each respects reduced motion.
// ============================================================
import { useRef, type RefObject } from "react";
import { gsap, useGSAP, EASE, DURATION, prefersReducedMotion } from "./gsap";

type RevealOptions = {
  /** Selector for children to stagger; if omitted the element itself animates. */
  selector?: string;
  y?: number;
  x?: number;
  opacity?: number;
  scale?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  ease?: string;
  /** Viewport position that triggers the reveal, e.g. "top 85%". */
  start?: string;
  /** Animate only once (default true) — don't replay on scroll-back. */
  once?: boolean;
};

/**
 * Reveal an element (or its children) as it scrolls into view.
 * Returns a ref to attach to the container.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: RevealOptions = {}
): RefObject<T> {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;

      const {
        selector,
        y = 40,
        x = 0,
        opacity = 0,
        scale = 1,
        duration = DURATION.slow,
        stagger = 0.1,
        delay = 0,
        ease = EASE.out,
        start = "top 85%",
        once = true,
      } = options;

      const targets = selector
        ? ref.current.querySelectorAll(selector)
        : ref.current;

      gsap.from(targets, {
        y,
        x,
        opacity,
        scale,
        duration,
        stagger,
        delay,
        ease,
        scrollTrigger: { trigger: ref.current, start, once },
      });
    },
    { scope: ref, dependencies: [] }
  );

  return ref;
}

type CounterOptions = {
  /** Final numeric value to count to. */
  value: number;
  duration?: number;
  /** Text appended after the number, e.g. "+", "k+", "%". */
  suffix?: string;
  /** Text shown before the number, e.g. "$". */
  prefix?: string;
  /** Decimal places to keep (default 0, integer). */
  decimals?: number;
  start?: string;
};

/**
 * Count a number up from 0 when it scrolls into view. Attach the
 * returned ref to the element whose textContent should animate.
 */
export function useCounter<T extends HTMLElement = HTMLSpanElement>(
  options: CounterOptions
): RefObject<T> {
  const ref = useRef<T>(null);
  const {
    value,
    duration = 2,
    suffix = "",
    prefix = "",
    decimals = 0,
    start = "top 80%",
  } = options;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const format = (n: number) => `${prefix}${n.toFixed(decimals)}${suffix}`;

      // Reduced motion: show the final value immediately.
      if (prefersReducedMotion()) {
        el.textContent = format(value);
        return;
      }

      const counter = { val: 0 };
      gsap.to(counter, {
        val: value,
        duration,
        ease: EASE.soft,
        snap: decimals === 0 ? { val: 1 } : undefined,
        onUpdate: () => {
          el.textContent = format(counter.val);
        },
        scrollTrigger: { trigger: el, start, once: true },
      });
    },
    { scope: ref, dependencies: [value] }
  );

  return ref;
}

type ParallaxOptions = {
  /** How far to shift, as a percent of the element's own height. */
  yPercent?: number;
  /** Scrub value passed to ScrollTrigger (true or seconds). */
  scrub?: boolean | number;
};

/**
 * Subtle parallax tied to scroll. The element drifts slower/faster
 * than the page as its trigger passes through the viewport.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  options: ParallaxOptions = {}
): RefObject<T> {
  const ref = useRef<T>(null);
  const { yPercent = -15, scrub = true } = options;

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;

      gsap.to(ref.current, {
        yPercent,
        ease: EASE.none,
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub,
        },
      });
    },
    { scope: ref, dependencies: [] }
  );

  return ref;
}

export { useGSAP, gsap };
