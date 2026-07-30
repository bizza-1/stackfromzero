"use client";

// ============================================================
// ReadingProgress — thin bar fixed to the top of the viewport
// whose width is scrubbed to the reading progress of `article`.
// Renders nothing until it finds an <article> on the page.
// ============================================================
import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/animation/gsap";

export default function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const article = document.querySelector("article, .article-content, .article-prose");
    if (!article || !barRef.current) return;

    // Reduced motion: leave the bar hidden rather than scrubbing it.
    if (prefersReducedMotion()) return;

    const tween = gsap.fromTo(
      barRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: article as HTMLElement,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      }
    );

    // Recalculate once layout settles (fonts, code blocks, images).
    ScrollTrigger.refresh();
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  });

  return (
    <div
      ref={barRef}
      className="reading-progress"
      role="progressbar"
      aria-label="Article reading progress"
      aria-hidden="true"
    />
  );
}
