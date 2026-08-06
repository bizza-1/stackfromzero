"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, EASE, DURATION, prefersReducedMotion } from "@/lib/animation/gsap";

export default function BirthdaySurprise() {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !cardRef.current) return;

      const ctx = gsap.context(() => {
        const card = cardRef.current!;
        const timeline = gsap.timeline({ defaults: { duration: 0.9, ease: EASE.out } });

        timeline.from(card, {
          opacity: 0,
          y: 40,
          scale: 0.96,
        });

        timeline.from(
          card.querySelectorAll<HTMLElement>(".birthday-animate"),
          {
            opacity: 0,
            y: 26,
            stagger: 0.12,
            duration: 0.7,
          },
          "-=0.5"
        );

        gsap.to(card.querySelectorAll(".floating-heart"), {
          y: "-=18",
          rotation: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          duration: 1.5,
          stagger: {
            each: 0.25,
            from: "center",
          },
        });

        gsap.to(card.querySelectorAll(".heart-glow"), {
          opacity: 0.5,
          duration: 1.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }, cardRef);

      return () => ctx.revert();
    },
    { scope: cardRef, dependencies: [] }
  );

  return (
    <section className="birthday-surprise min-vh-100 d-flex align-items-center py-5 position-relative overflow-hidden">
      <div className="birthday-deco birthday-deco-1" />
      <div className="birthday-deco birthday-deco-2" />
      <div className="birthday-deco birthday-deco-3" />
      <div className="container"> 
        <div ref={cardRef} className="card birthday-card mx-auto shadow-lg border-0 overflow-hidden position-relative" style={{ maxWidth: 920 }}>
          <div className="card-body p-5 text-center position-relative">
            <div className="birthday-hearts" aria-hidden="true">
              <span className="floating-heart heart-1" />
              <span className="floating-heart heart-2" />
              <span className="floating-heart heart-3" />
              <span className="floating-heart heart-4" />
              <span className="floating-heart heart-5" />
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
              <Link href="/" className="btn btn-outline-light btn-lg px-4">
                Back to home
              </Link>
              <a href="#" className="btn btn-primary btn-lg px-4 text-white">
                Celebrate together 🥂
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
