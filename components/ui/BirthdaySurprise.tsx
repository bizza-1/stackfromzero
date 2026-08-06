"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, useGSAP, EASE, prefersReducedMotion } from "@/lib/animation/gsap";

export default function BirthdaySurprise() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [dinnerDecision, setDinnerDecision] = useState<"yes" | "no" | null>(null);
  const [foodOption, setFoodOption] = useState<"rice" | "icecream" | null>(null);
  const [dinnerSubmitted, setDinnerSubmitted] = useState(false);

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

  useGSAP(
    () => {
      if (prefersReducedMotion() || !messageRef.current || !showMessage) return;

      const message = messageRef.current;
      const animation = gsap.timeline();

      animation.set(message, { visibility: "visible" });
      animation.fromTo(
        message,
        { autoAlpha: 0, y: 30, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.1, ease: EASE.out }
      );
      animation.from(
        message.querySelectorAll<HTMLElement>(".love-line"),
        {
          opacity: 0,
          y: 20,
          stagger: 0.08,
          duration: 0.5,
          ease: EASE.out,
        },
        "-=0.9"
      );
    },
    { scope: messageRef, dependencies: [showMessage, dinnerSubmitted] }
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
            <div className="birthday-photo-wrapper birthday-animate mb-4 mx-auto">
              <Image
                src="/images/birthday-photo.jpg"
                alt="Birthday portrait"
                width={180}
                height={180}
                className="birthday-photo"
                unoptimized
              />
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
              <button
                type="button"
                className="btn btn-primary btn-lg px-4 text-white birthday-cta"
                onClick={() => setShowMessage(true)}
              >
                Celebrate together 🥂
              </button>
            </div>
          </div>
        </div>
        <div
          ref={messageRef}
          className="birthday-love-note mt-5 mx-auto text-white px-4 py-5 rounded-4"
          style={{ maxWidth: 900, visibility: "hidden" }}
        >
          <div className="love-line mb-4">
            Sometimes I sit back and wonder what I did to deserve someone like you. You came into my life with a heart so full of love, care, and kindness. You never like seeing me hungry. Even when you don&apos;t have much, you still find a way to make sure I&apos;m okay. That kind of love is rare, and I pray I never take it for granted.
          </div>
          <div className="love-line mb-4">
            Thank you for every cake you&apos;ve baked with love, every small chop we&apos;ve made together, every warm hug that made my worries disappear, every kiss that reminded me I wasn&apos;t alone, and every moment we&apos;ve shared. Those moments may seem ordinary to the world, but to me, they are priceless memories that I will carry in my heart forever.
          </div>
          <div className="love-line mb-4">
            You have seen me at my best and at my weakest, yet you never stopped believing in me. Your support has given me strength on days when I felt like giving up. You may not even realize how much you&apos;ve changed my life just by being there.
          </div>
          <div className="love-line mb-4">
            Yes... sometimes you behave like a little witch. <span className="text-warning">😂</span> You can be stubborn, dramatic, and know exactly how to get on my nerves. But if I had the chance to choose again, I would still choose <strong>my own witch</strong> every single time. Because behind all that stubbornness is the most beautiful soul I know.
          </div>
          <div className="love-line mb-4">
            I don&apos;t know what the future holds, but I know one thing: meeting you is one of the best things that has ever happened to me. You&apos;ve shown me what genuine love, care, and companionship feel like. My prayer is that I never become the reason tears fall from your eyes except tears of joy.
          </div>
          <div className="love-line mb-4">
            On your birthday, I pray that God surrounds you with His endless love and protection. May He bless your beautiful heart, your dreams, your hands, and everything you do. May He reward you for every sacrifice you&apos;ve made, even the ones nobody knows about. May your smile never fade, your peace never be stolen, and your joy never run dry.
          </div>
          <div className="love-line mb-4">
            If I haven&apos;t said it enough, let me say it today:
            <br />
            <strong>Thank you for loving me.<br />
            Thank you for feeding me.<br />
            Thank you for believing in me.<br />
            Thank you for staying.</strong>
          </div>
          <div className="love-line mb-4">
            I promise to keep working towards becoming the man you can always be proud of. You deserve a love that is patient, intentional, and unwavering, and every day I want to love you better than the day before.
          </div>
          <div className="love-line mb-4">
            I love you more deeply than these words can express, and I hope this birthday reminds you of how incredibly precious you are not just to me, but to everyone whose life you touch.
          </div>
          <div className="love-line mb-0">
            Happy Birthday, my love, my peace, my favorite baker, my biggest supporter... and forever, my favorite &quot;little witch.&quot; ❤️
          </div>
          <div className="love-line mt-4 fw-semibold">I love you. Always.</div>
          <div className="love-line mt-5">
            <div className="fw-semibold mb-3">Would you like dinner as a birthday gift?</div>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <button
                type="button"
                className={`btn btn-outline-light btn-sm ${dinnerDecision === "yes" ? "active" : ""}`}
                onClick={() => {
                  setDinnerDecision("yes");
                  setDinnerSubmitted(false);
                }}
              >
                Yes
              </button>
              <button
                type="button"
                className={`btn btn-outline-light btn-sm ${dinnerDecision === "no" ? "active" : ""}`}
                onClick={() => {
                  setDinnerDecision("no");
                  setFoodOption(null);
                  setDinnerSubmitted(false);
                }}
              >
                No
              </button>
            </div>
          </div>
          {dinnerDecision === "yes" && (
            <div className="love-line mt-4">
              <div className="fw-semibold mb-3">If yes, what food would you love to eat?</div>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <button
                  type="button"
                  className={`btn btn-outline-light btn-sm ${foodOption === "rice" ? "active" : ""}`}
                  onClick={() => setFoodOption("rice")}
                >
                  Rice and chicken
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-light btn-sm ${foodOption === "icecream" ? "active" : ""}`}
                  onClick={() => setFoodOption("icecream")}
                >
                  Ice cream and chicken
                </button>
              </div>
            </div>
          )}
          {dinnerDecision && (
            <div className="love-line mt-4 text-center">
              <button
                type="button"
                className="btn btn-success btn-lg px-4"
                onClick={() => setDinnerSubmitted(true)}
                disabled={dinnerDecision === "yes" && !foodOption}
              >
                Submit dinner choice
              </button>
            </div>
          )}
          {dinnerSubmitted && (
            <div className="love-line mt-4 p-3 rounded-3 border border-success text-success bg-success bg-opacity-10">
              Dinner is fixed{dinnerDecision === "yes" && foodOption ? `: ${foodOption === "rice" ? "Rice and chicken" : "Ice cream and chicken"}.` : "."}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
