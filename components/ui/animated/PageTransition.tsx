"use client";

// ============================================================
// PageTransition — orchestrates the global page-load sequence.
// Runs a GSAP timeline on mount and on every route change:
// navbar slides down, then hero content staggers in.
// Elements opt in with data attributes / classes:
//   [data-animate="nav"]      -> navbar
//   .hero-badge, .hero-title, .hero-subtitle, .hero-cta, .hero-stats
// Missing targets are skipped gracefully.
// ============================================================
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { gsap, useGSAP, EASE, prefersReducedMotion } from "@/lib/animation/gsap";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const tl = gsap.timeline({ defaults: { ease: EASE.out } });

      // Navbar slides down + fades in.
      const nav = document.querySelector('[data-animate="nav"]');
      if (nav) {
        tl.from(nav, { y: -100, opacity: 0, duration: 0.8, ease: EASE.expo });
      }

      // Hero content staggers in — only present on pages with a hero.
      // gsap ignores selectors that match nothing, so guard each set.
      const add = (selector: string, vars: gsap.TweenVars, position: string) => {
        if (document.querySelector(selector)) tl.from(selector, vars, position);
      };

      add(".hero-badge", { y: 20, opacity: 0, scale: 0.9, duration: 0.6 }, "-=0.4");
      add(".hero-title", { y: 30, opacity: 0, duration: 0.8 }, "-=0.3");
      add(".hero-subtitle", { y: 30, opacity: 0, duration: 0.7 }, "-=0.4");
      add(
        ".hero-cta",
        { y: 20, opacity: 0, scale: 0.9, stagger: 0.15, duration: 0.6, ease: EASE.elastic },
        "-=0.5"
      );
      add(".hero-stats", { y: 30, opacity: 0, stagger: 0.1, duration: 0.7 }, "-=0.4");
    },
    { dependencies: [pathname] }
  );

  return <>{children}</>;
}
