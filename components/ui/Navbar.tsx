"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn, siteConfig } from "@/lib/utils";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/animation/gsap";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/newsletter", label: "Newsletter" },
];

const SOLID_BG = "rgba(15, 23, 42, 0.9)";
const TRANSPARENT_BG = "rgba(15, 23, 42, 0)";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Solidify the navbar background + add a shadow after scrolling past 50px.
  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav || prefersReducedMotion()) return;

      const st = ScrollTrigger.create({
        start: "top -50",
        end: 99999,
        onToggle: (self) => {
          gsap.to(nav, {
            backgroundColor: self.isActive ? SOLID_BG : TRANSPARENT_BG,
            boxShadow: self.isActive
              ? "0 8px 24px rgba(0, 0, 0, 0.35)"
              : "0 0 0 rgba(0, 0, 0, 0)",
            duration: 0.3,
            ease: "power2.out",
          });
        },
      });
      return () => st.kill();
    },
    { scope: navRef }
  );

  // Slide the mobile menu open and stagger its links in.
  useGSAP(
    () => {
      const menu = menuRef.current;
      if (!menu || prefersReducedMotion()) return;
      if (!open) return;

      const tl = gsap.timeline();
      tl.from(menu, { height: 0, opacity: 0, duration: 0.4, ease: "expo.inOut" });
      tl.from(
        menu.querySelectorAll(".nav-item"),
        { x: 20, opacity: 0, stagger: 0.05, duration: 0.3, ease: "power2.out" },
        "-=0.2"
      );
    },
    { scope: menuRef, dependencies: [open] }
  );

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      ref={navRef}
      data-animate="nav"
      className="navbar navbar-expand-lg sticky-top border-bottom border-custom"
      data-bs-theme="dark"
      style={{ backgroundColor: TRANSPARENT_BG, backdropFilter: "blur(10px)" }}
    >
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" href="/">
          <i className="bi bi-stack text-primary fs-4" aria-hidden="true" />
          <span>
            Stack<span className="text-primary">FromZero</span>
          </span>
        </Link>

        <button
          className={cn("navbar-toggler hamburger", open && "is-open")}
          type="button"
          aria-expanded={open}
          aria-controls="mainNav"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          ref={menuRef}
          className={cn("collapse navbar-collapse", open && "show")}
          id="mainNav"
        >
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-1">
            {navLinks.map((link) => (
              <li className="nav-item" key={link.href}>
                <Link
                  className={cn(
                    "nav-link nav-link-underline px-3",
                    isActive(link.href) && "active text-primary"
                  )}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
              <a
                className="btn btn-primary btn-sm px-3"
                href={`https://github.com/${siteConfig.author.github}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-github me-1" aria-hidden="true" />
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
