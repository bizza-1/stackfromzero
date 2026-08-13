import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Developer Tools",
  description:
    "Free, accurate, browser-based tools for React + Spring Boot developers: convert Java DTOs to TypeScript, generate correct Spring Boot CORS config, and decode JWTs. Nothing is uploaded.",
  alternates: { canonical: "/tools" },
};

const tools = [
  {
    href: "/tools/java-to-typescript",
    icon: "bi-braces-asterisk",
    title: "Java → TypeScript",
    description:
      "Turn a Spring Boot record, DTO, or enum into matching TypeScript interfaces — the way Jackson actually serialises them. Handles generics, collections, Optional, and @JsonProperty.",
    tag: "Type converter",
  },
  {
    href: "/tools/spring-cors-generator",
    icon: "bi-shield-check",
    title: "Spring Boot CORS generator",
    description:
      "Beat “blocked by CORS policy.” Generate correct config for WebMvcConfigurer, Spring Security, and @CrossOrigin with the allowCredentials + wildcard pitfall handled automatically.",
    tag: "Spring Boot",
  },
  {
    href: "/tools/jwt-decoder",
    icon: "bi-key",
    title: "JWT decoder & inspector",
    description:
      "Decode a JWT’s header and payload, read every claim in plain English, and see exp/iat/nbf as real dates with live countdowns. Fully client-side.",
    tag: "Auth & tokens",
  },
  {
    href: "/tools/background-remover",
    icon: "bi-image-alt",
    title: "Background remover",
    description: "Remove a photo background with a local AI model and download a transparent PNG. Your image stays on your device.",
    tag: "Image editing",
  },
  {
    href: "/tools/image-resizer",
    icon: "bi-aspect-ratio",
    title: "Image resizer",
    description: "Resize images to exact pixel dimensions, keep their aspect ratio, and export JPEG, PNG, or WebP locally.",
    tag: "Image editing",
  },
];

export default function ToolsPage() {
  return (
    <section className="container py-5">
      <div className="mb-5 text-center">
        <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary mb-3 px-3 py-2">
          <i className="bi bi-tools me-1" aria-hidden="true" />
          Developer tools
        </span>
        <h1 className="display-5 fw-bold mb-3">Tools for React + Spring Boot builders</h1>
        <p className="lead text-secondary-custom mx-auto" style={{ maxWidth: "640px" }}>
          Small, accurate utilities for the exact friction points of full stack
          development. Every tool runs entirely in your browser  nothing you paste
          is ever uploaded.
        </p>
      </div>

      <div className="row g-4">
        {tools.map((tool) => (
          <div className="col-12 col-md-6 col-lg-4" key={tool.href}>
            <Link
              href={tool.href}
              className="card bg-card border-custom rounded-4 h-100 text-decoration-none text-body tool-card"
            >
              <div className="card-body p-4 d-flex flex-column">
                <span
                  className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10 text-primary mb-3"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <i className={`bi ${tool.icon} fs-4`} aria-hidden="true" />
                </span>
                <p className="text-primary small fw-semibold mb-1">{tool.tag}</p>
                <h2 className="h5 fw-bold mb-2">{tool.title}</h2>
                <p className="text-secondary-custom flex-grow-1 mb-3">{tool.description}</p>
                <span className="fw-semibold text-primary">
                  Open tool
                  <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
