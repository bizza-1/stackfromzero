// ============================================================
// GSAP core setup — single place that registers plugins and
// exposes shared tokens + the reduced-motion guard.
// Import `gsap` from here (not directly from "gsap") in client
// components so plugin registration is guaranteed to have run.
// ============================================================
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// registerPlugin is idempotent and safe to call more than once. We only
// touch window-dependent config in the browser to stay SSR-safe.
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, SplitText);

if (typeof window !== "undefined") {
  // Defaults tuned for a snappy-but-calm feel across the site.
  gsap.defaults({ ease: "power3.out", duration: 0.8 });

  // Keep ScrollTrigger positions correct once fonts/images settle.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Shared easing tokens so every animation speaks the same language. */
export const EASE = {
  out: "power3.out",
  soft: "power2.out",
  inOut: "power2.inOut",
  expo: "expo.out",
  elastic: "elastic.out(1, 0.5)",
  none: "none",
} as const;

/** Shared durations (seconds). */
export const DURATION = {
  fast: 0.3,
  base: 0.6,
  slow: 0.8,
  slower: 1.2,
} as const;

/**
 * True when the user has asked the OS to reduce motion. Every animation
 * entry point checks this and bails so we ship an accessible experience
 * by default. Guarded for SSR (returns false on the server).
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger, ScrollToPlugin, SplitText, useGSAP };
