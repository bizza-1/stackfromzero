"use client";

// ============================================================
// AuthorPhoto — circular clip-path reveal on mount, then a
// gentle continuous float. Wraps next/image via children.
// ============================================================
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/animation/gsap";

export default function AuthorPhoto({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const tl = gsap.timeline();
      tl.from(el, {
        clipPath: "circle(0% at 50% 50%)",
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: "power3.out",
      });

      // Subtle float once revealed.
      tl.to(el, {
        y: -8,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className} style={{ display: "inline-block" }}>
      {children}
    </div>
  );
}
