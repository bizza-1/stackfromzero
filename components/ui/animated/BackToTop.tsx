"use client";

// ============================================================
// BackToTop — floating button that fades in after 500px of
// scroll and smooth-scrolls to the top when clicked.
// ============================================================
import { useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/animation/gsap";

export default function BackToTop() {
  const ref = useRef<HTMLButtonElement>(null);
  const [reduced, setReduced] = useState(false);

  useGSAP(() => {
    if (!ref.current) return;

    if (prefersReducedMotion()) {
      // Toggle visibility with a class instead of tweening.
      setReduced(true);
      const onScroll = () => {
        ref.current?.classList.toggle("is-visible", window.scrollY > 500);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }

    gsap.set(ref.current, { autoAlpha: 0, y: 20 });
    const st = ScrollTrigger.create({
      start: "top -500",
      end: 99999,
      onToggle: (self) => {
        gsap.to(ref.current, {
          autoAlpha: self.isActive ? 1 : 0,
          y: self.isActive ? 0 : 20,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      },
    });
    return () => st.kill();
  });

  const handleClick = () => {
    if (prefersReducedMotion()) {
      window.scrollTo(0, 0);
      return;
    }
    gsap.to(window, {
      duration: 1.2,
      ease: "power3.inOut",
      scrollTo: { y: 0 },
    });
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      className={`back-to-top btn btn-primary rounded-circle${reduced ? " back-to-top--reduced" : ""}`}
      aria-label="Back to top"
    >
      <i className="bi bi-arrow-up" aria-hidden="true" />
    </button>
  );
}
