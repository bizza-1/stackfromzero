"use client";

// ============================================================
// ArticleContent — wraps the rendered MDX prose and reveals its
// block elements as they scroll in. Headings slide from the left;
// everything else fades up. Uses ScrollTrigger.batch so a long
// article with many elements stays performant (one observer, not
// one trigger per node).
// ============================================================
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/animation/gsap";

export default function ArticleContent({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || prefersReducedMotion()) return;

      const headings = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("h2"));
      const blocks = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("p, ul, ol, pre, blockquote, img, .callout, h3")
      );

      // Hide up front so nothing flashes visible before its trigger fires.
      gsap.set(headings, { autoAlpha: 0, x: -30 });
      gsap.set(blocks, { autoAlpha: 0, y: 20 });

      // Headings slide in from the left.
      ScrollTrigger.batch(headings, {
        start: "top 85%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            x: 0,
            autoAlpha: 1,
            duration: 0.6,
            ease: "power2.out",
            overwrite: true,
          }),
      });

      // Body blocks fade up, lightly staggered per batch.
      ScrollTrigger.batch(blocks, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            overwrite: true,
          }),
      });

      ScrollTrigger.refresh();
    },
    { scope: ref }
  );

  return <div ref={ref}>{children}</div>;
}
