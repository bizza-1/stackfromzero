"use client";

// ============================================================
// AnimatedCard — adds a GSAP-driven hover lift/glow to a card.
// Pointer events are quick and interruptible (overwrite: auto),
// and disabled entirely under reduced motion.
// ============================================================
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, EASE, DURATION, prefersReducedMotion } from "@/lib/animation/gsap";

type AnimatedCardProps = {
  children: ReactNode;
  className?: string;
};

export default function AnimatedCard({ children, className }: AnimatedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useRef(true);

  useGSAP(() => {
    enabled.current = !prefersReducedMotion();
  }, { scope: ref });

  const animate = (scale: number, y: number) => {
    if (!enabled.current || !ref.current) return;
    gsap.to(ref.current, {
      scale,
      y,
      duration: DURATION.fast,
      ease: EASE.soft,
      overwrite: "auto",
    });
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseEnter={() => animate(1.03, -4)}
      onMouseLeave={() => animate(1, 0)}
    >
      {children}
    </div>
  );
}
