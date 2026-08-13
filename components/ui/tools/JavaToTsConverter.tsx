"use client";

import { useMemo, useState } from "react";
import {
  convertJavaToTypeScript,
  DEFAULT_JAVA_TO_TS_OPTIONS,
} from "@/lib/tools/javaToTs";
import CopyButton from "./CopyButton";

const EXAMPLE = `public record UserDto(
    Long id,
    String username,
    @JsonProperty("email_address") String email,
    List<String> roles,
    Optional<String> bio,
    Instant createdAt,
    boolean active
) {}`;

export default function JavaToTsConverter() {
  const [java, setJava] = useState(EXAMPLE);
  const [exportDeclarations, setExportDeclarations] = useState(
    DEFAULT_JAVA_TO_TS_OPTIONS.exportDeclarations,
  );
  const [boxedOptional, setBoxedOptional] = useState(
    DEFAULT_JAVA_TO_TS_OPTIONS.boxedOptional,
  );

  const { output, warnings } = useMemo(
    () => convertJavaToTypeScript(java, { exportDeclarations, boxedOptional }),
    [java, exportDeclarations, boxedOptional],
  );

  return (
    <div className="row g-4">
      {/* Input */}
      <div className="col-lg-6">
        <div className="card bg-card border-custom rounded-4 h-100">
          <div className="card-body p-4 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <label htmlFor="java-input" className="h6 fw-bold mb-0">
                Java source
              </label>
              <button
                type="button"
                className="btn btn-sm btn-outline-light"
                onClick={() => setJava(EXAMPLE)}
              >
                <i className="bi bi-arrow-counterclockwise me-1" aria-hidden="true" />
                Load example
              </button>
            </div>

            <textarea
              id="java-input"
              className="form-control bg-card border-custom text-body font-monospace flex-grow-1"
              style={{ minHeight: "320px", fontSize: "0.9rem" }}
              spellCheck={false}
              value={java}
              onChange={(e) => setJava(e.target.value)}
              placeholder="Paste a Spring Boot record, class, or enum…"
              aria-describedby="java-input-help"
            />
            <div id="java-input-help" className="form-text">
              Records, POJO/DTO classes, and enums. Handles generics, collections,
              <code className="ms-1">Optional</code>,{" "}
              <code>@JsonProperty</code>, and <code>@JsonIgnore</code>.
            </div>

            <div className="d-flex flex-wrap gap-4 mt-3">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="opt-export"
                  checked={exportDeclarations}
                  onChange={(e) => setExportDeclarations(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="opt-export">
                  <code>export</code> declarations
                </label>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="opt-boxed"
                  checked={boxedOptional}
                  onChange={(e) => setBoxedOptional(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="opt-boxed">
                  Boxed types optional
                  <span className="text-secondary-custom ms-1">
                    (<code>Integer</code> → <code>?</code>)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="col-lg-6">
        <div className="card bg-card border-custom rounded-4 h-100">
          <div className="card-body p-4 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h6 fw-bold mb-0">TypeScript</h2>
              <CopyButton value={output} label="Copy" />
            </div>

            <pre
              className="rounded-3 p-3 flex-grow-1 mb-0"
              style={{
                background: "#0d1117",
                overflow: "auto",
                minHeight: "320px",
                fontSize: "0.9rem",
              }}
              aria-live="polite"
            >
              <code>{output || "// Your TypeScript types will appear here."}</code>
            </pre>

            {warnings.length > 0 && (
              <div className="mt-3" aria-live="polite">
                {warnings.map((w) => (
                  <div
                    key={w}
                    className="alert alert-warning d-flex align-items-start gap-2 mb-2 py-2"
                    role="status"
                  >
                    <i className="bi bi-exclamation-triangle-fill mt-1" aria-hidden="true" />
                    <span className="small">{w}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
