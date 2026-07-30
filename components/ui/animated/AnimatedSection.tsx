"use client";

// ============================================================
// AnimatedSection — wraps a block of content and reveals it (or
// its staggered children) as it scrolls into view.
// ============================================================
import { createElement, type ElementType, type ReactNode } from "react";
import { useScrollReveal } from "@/lib/animation/hooks";

type AnimatedSectionProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Selector for children to stagger in; omit to animate the whole block. */
  selector?: string;
  y?: number;
  x?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  start?: string;
};

export default function AnimatedSection({
  children,
  as = "div",
  className,
  selector,
  y,
  x,
  duration,
  stagger,
  delay,
  start,
}: AnimatedSectionProps) {
  const ref = useScrollReveal<HTMLElement>({
    selector,
    y,
    x,
    duration,
    stagger,
    delay,
    start,
  });

  return createElement(as, { ref, className }, children);
}
