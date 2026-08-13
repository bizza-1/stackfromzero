import type { Metadata } from "next";
import Link from "next/link";
import JavaToTsConverter from "@/components/ui/tools/JavaToTsConverter";

export const metadata: Metadata = {
  title: "Java → TypeScript Type Converter",
  description:
    "Paste a Spring Boot record, DTO class, or enum and get matching TypeScript interfaces instantly. Handles generics, collections, Optional, and Jackson @JsonProperty. Runs entirely in your browser.",
  alternates: { canonical: "/tools/java-to-typescript" },
};

export default function JavaToTypeScriptPage() {
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
          <i className="bi bi-braces-asterisk me-1" aria-hidden="true" />
          Type converter
        </span>
        <h1 className="display-6 fw-bold mb-3">Java → TypeScript</h1>
        <p className="lead text-secondary-custom mb-2" style={{ maxWidth: "680px" }}>
          Keep your React types in sync with your Spring Boot API. Paste a record,
          DTO class, or enum and get matching TypeScript interfaces  the way
          Jackson actually serialises them to JSON.
        </p>
        <p className="small text-secondary-custom mb-0">
          <i className="bi bi-shield-lock me-1" aria-hidden="true" />
          Runs entirely in your browser. Your code is never uploaded.
        </p>
      </div>

      <JavaToTsConverter />

      <div className="card bg-card border-custom rounded-4 mt-4">
        <div className="card-body p-4">
          <h2 className="h6 fw-bold mb-3">How the mapping works</h2>
          <div className="row g-3 small text-secondary-custom">
            <div className="col-md-6">
              <ul className="mb-0 ps-3">
                <li>
                  <code>String</code>, <code>UUID</code>, and date/time types
                  (<code>Instant</code>, <code>LocalDate</code>, …) → <code>string</code>,
                  because Jackson serialises them as ISO-8601 strings.
                </li>
                <li>
                  Every numeric type (<code>int</code>, <code>long</code>,{" "}
                  <code>BigDecimal</code>, …) → <code>number</code>.
                </li>
                <li>
                  <code>List</code>/<code>Set</code>/<code>Collection&lt;T&gt;</code> →{" "}
                  <code>T[]</code>; <code>Map&lt;K, V&gt;</code> →{" "}
                  <code>Record&lt;K, V&gt;</code>.
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <ul className="mb-0 ps-3">
                <li>
                  <code>Optional&lt;T&gt;</code> becomes an optional field
                  (<code>field?: T</code>).
                </li>
                <li>
                  <code>@JsonProperty(&quot;name&quot;)</code> renames the field;{" "}
                  <code>@JsonIgnore</code> drops it.
                </li>
                <li>
                  <code>enum</code> → a string-literal union. Unknown types are kept
                  by name and flagged so you can declare them too.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
