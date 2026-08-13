import type { Metadata } from "next";
import Link from "next/link";
import SpringCorsGenerator from "@/components/ui/tools/SpringCorsGenerator";

export const metadata: Metadata = {
  title: "Spring Boot CORS Config Generator",
  description:
    "Generate correct Spring Boot CORS configuration for WebMvcConfigurer, Spring Security's SecurityFilterChain, and @CrossOrigin  with the allowCredentials + wildcard-origin pitfall handled for you.",
  alternates: { canonical: "/tools/spring-cors-generator" },
};

export default function SpringCorsGeneratorPage() {
  return (
    <div className="container py-5">
      <nav aria-label="Breadcrumb" className="mb-4">
        <Link href="/tools" className="text-decoration-none small text-secondary-custom">
          <i className="bi bi-arrow-left me-1" aria-hidden="true" />
          All tools
        </Link>
      </nav>

      <div className="mb-4">
        <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary mb-3 px-3 py-2">
          <i className="bi bi-shield-check me-1" aria-hidden="true" />
          Spring Boot
        </span>
        <h1 className="display-6 fw-bold mb-3">Spring Boot CORS generator</h1>
        <p className="lead text-secondary-custom mb-2" style={{ maxWidth: "720px" }}>
          &ldquo;Blocked by CORS policy&rdquo; is the wall almost every React +
          Spring Boot beginner hits. Fill in your origins and get correct config
          for all three ways Spring does CORS  including the credentials pitfall
          that makes most copy-pasted snippets fail at startup.
        </p>
        <p className="small text-secondary-custom mb-0">
          <i className="bi bi-shield-lock me-1" aria-hidden="true" />
          Generated in your browser  nothing is sent anywhere.
        </p>
      </div>

      <SpringCorsGenerator />

      <div className="card bg-card border-custom rounded-4 mt-4">
        <div className="card-body p-4">
          <h2 className="h6 fw-bold mb-3">Which one do I use?</h2>
          <ul className="small text-secondary-custom mb-3 ps-3">
            <li>
              <strong>No Spring Security?</strong> Use the{" "}
              <code>WebMvcConfigurer</code> version  it applies CORS globally.
            </li>
            <li>
              <strong>Using Spring Security?</strong> Use the{" "}
              <code>SecurityFilterChain</code> version. This is the #1 gotcha:
              a <code>WebMvcConfigurer</code> alone is ignored once Security is on
              the classpath, because the security filter runs first and blocks the
              request before MVC ever sees it.
            </li>
            <li>
              <strong>Just one controller?</strong> The <code>@CrossOrigin</code>{" "}
              annotation is the quickest, most local option.
            </li>
          </ul>
          <div className="alert alert-info d-flex align-items-start gap-2 mb-0 py-2">
            <i className="bi bi-info-circle-fill mt-1" aria-hidden="true" />
            <span className="small mb-0">
              The big one: <code>allowCredentials(true)</code> is{" "}
              <em>incompatible</em> with an <code>allowedOrigins(&quot;*&quot;)</code>{" "}
              wildcard  Spring throws at startup. This tool automatically switches
              to <code>allowedOriginPatterns</code> when it sees a wildcard, which is
              the supported way.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
