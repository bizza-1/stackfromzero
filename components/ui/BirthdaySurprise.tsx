"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, EASE, prefersReducedMotion } from "@/lib/animation/gsap";

export default function BirthdaySurprise() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !sectionRef.current || !cardRef.current) return;

      const ctx = gsap.context(() => {
        const section = sectionRef.current!;
        const card = cardRef.current!;
        const timeline = gsap.timeline({ defaults: { duration: 0.9, ease: EASE.expo } });

        timeline.from(card, {
          opacity: 0,
          y: 60,
          scale: 0.92,
          rotation: -2,
        });

        timeline.from(
          card.querySelectorAll<HTMLElement>(".birthday-animate"),
          {
            opacity: 0,
            y: 28,
            stagger: 0.14,
            duration: 0.75,
            ease: EASE.out,
          },
          "-=0.6"
        );

        timeline.from(
          card.querySelectorAll<HTMLElement>(".birthday-cta"),
          {
            opacity: 0,
            y: 18,
            scale: 0.97,
            stagger: 0.12,
            duration: 0.6,
            ease: EASE.out,
          },
          "-=0.45"
        );

        gsap.to(section.querySelectorAll<HTMLElement>(".birthday-deco"), {
          y: -14,
          x: 12,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: {
            each: 0.2,
            from: "edges",
          },
        });

        gsap.to(card.querySelectorAll<HTMLElement>(".floating-heart"), {
          y: "-=22",
          x: "+=4",
          rotation: 10,
          scale: 1.04,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          duration: 1.65,
          stagger: {
            each: 0.22,
            from: "center",
          },
        });

        gsap.to(card.querySelectorAll<HTMLElement>(".sparkle"), {
          opacity: 1,
          scale: 1.2,
          duration: 1.1,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          stagger: {
            each: 0.18,
            from: "random",
          },
        });

        gsap.to(card.querySelectorAll<HTMLElement>(".birthday-card-glow"), {
          opacity: 0.35,
          duration: 1.7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section ref={sectionRef} className="birthday-surprise min-vh-100 d-flex align-items-center py-5 position-relative overflow-hidden">
      <div className="birthday-deco birthday-deco-1" />
      <div className="birthday-deco birthday-deco-2" />
      <div className="birthday-deco birthday-deco-3" />
      <div className="container">
        <div ref={cardRef} className="card birthday-card mx-auto shadow-lg border-0 overflow-hidden position-relative" style={{ maxWidth: 920 }}>
          <div className="birthday-card-glow" aria-hidden="true" />
          <div className="card-body p-5 text-center position-relative">
            <div className="birthday-hearts" aria-hidden="true">
              <span className="floating-heart heart-1" />
              <span className="floating-heart heart-2" />
              <span className="floating-heart heart-3" />
              <span className="floating-heart heart-4" />
              <span className="floating-heart heart-5" />
            </div>
            <div className="birthday-sparkles" aria-hidden="true">
              <span className="sparkle sparkle-1" />
              <span className="sparkle sparkle-2" />
              <span className="sparkle sparkle-3" />
              <span className="sparkle sparkle-4" />
            </div>
            <div className="mb-4 birthday-animate">
              <span className="badge rounded-pill bg-danger bg-opacity-15 text-danger fs-6 px-4 py-2">
                Happy Birthday, my love ❤️
              </span>
            </div>
            <h1 className="display-5 fw-bold mb-4 birthday-animate">Adebesin Roheemat Ajoke</h1>
            <p className="lead text-secondary-custom mb-4 mx-auto birthday-animate" style={{ maxWidth: 640 }}>
              Today I celebrate the most caring, loving, and supportive woman in my life. Thank you for always making sure I never go hungry, for the delicious cakes you bake, and for all the small chops we&apos;ve made together.
            </p>
            <div className="bg-white bg-opacity-10 border border-white border-opacity-20 rounded-4 p-4 mb-4 text-start text-white birthday-animate" style={{ backdropFilter: "blur(10px)" }}>
              <p className="mb-3">Every meal, every laugh, every cuddle, and every kiss we&apos;ve shared has become a beautiful memory that I will always treasure.</p>
              <p className="mb-3">You&apos;ve stood by me through so much, and your love and support mean more to me than words can express. I truly appreciate everything you do, even the little things that often go unnoticed.</p>
              <p className="mb-0">Now, I have to say this... sometimes you behave like a little witch <span className="text-warning">😅</span>, but you&apos;re my favorite witch, and I wouldn&apos;t trade you for anyone else.</p>
            </div>
            <p className="text-secondary-custom mb-4 birthday-animate" style={{ maxWidth: 680, margin: "0 auto" }}>
              I pray that this new year brings you endless happiness, good health, peace, success, and countless reasons to smile. May God bless everything you lay your hands on and grant every good desire of your heart.
            </p>
            <p className="fw-semibold text-white mb-5 birthday-animate">Thank you for being you. I love you more than words can ever describe.</p>
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 birthday-buttons birthday-animate">
              <Link href="/" className="btn btn-outline-light btn-lg px-4 birthday-cta">
                Back to home
              </Link>
              <a href="#" className="btn btn-primary btn-lg px-4 text-white birthday-cta">
                Celebrate together 🥂
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
