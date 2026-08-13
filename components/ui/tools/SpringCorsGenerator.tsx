"use client";

import { useMemo, useState } from "react";
import {
  generateSpringCors,
  parseList,
  DEFAULT_SPRING_CORS_OPTIONS,
  type SpringCorsVariant,
} from "@/lib/tools/springCors";
import CopyButton from "./CopyButton";

const ALL_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"];

export default function SpringCorsGenerator() {
  const [originsText, setOriginsText] = useState(
    DEFAULT_SPRING_CORS_OPTIONS.origins.join("\n"),
  );
  const [methods, setMethods] = useState<string[]>(DEFAULT_SPRING_CORS_OPTIONS.methods);
  const [allowedHeadersText, setAllowedHeadersText] = useState(
    DEFAULT_SPRING_CORS_OPTIONS.allowedHeaders.join(", "),
  );
  const [exposedHeadersText, setExposedHeadersText] = useState("");
  const [allowCredentials, setAllowCredentials] = useState(
    DEFAULT_SPRING_CORS_OPTIONS.allowCredentials,
  );
  const [maxAge, setMaxAge] = useState(DEFAULT_SPRING_CORS_OPTIONS.maxAge);
  const [mapping, setMapping] = useState(DEFAULT_SPRING_CORS_OPTIONS.mapping);
  const [activeTab, setActiveTab] = useState<SpringCorsVariant["id"]>("webmvc");

  const toggleMethod = (m: string) => {
    setMethods((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );
  };

  const { variants, warnings } = useMemo(
    () =>
      generateSpringCors({
        origins: parseList(originsText),
        methods,
        allowedHeaders: parseList(allowedHeadersText),
        exposedHeaders: parseList(exposedHeadersText),
        allowCredentials,
        maxAge,
        mapping: mapping.trim() || "/**",
      }),
    [originsText, methods, allowedHeadersText, exposedHeadersText, allowCredentials, maxAge, mapping],
  );

  const active = variants.find((v) => v.id === activeTab) ?? variants[0];

  return (
    <div className="row g-4">
      {/* Controls */}
      <div className="col-lg-5">
        <div className="card bg-card border-custom rounded-4 h-100">
          <div className="card-body p-4">
            <div className="mb-3">
              <label htmlFor="cors-origins" className="form-label fw-semibold">
                Allowed origins
              </label>
              <textarea
                id="cors-origins"
                className="form-control bg-card border-custom text-body font-monospace"
                rows={3}
                spellCheck={false}
                value={originsText}
                onChange={(e) => setOriginsText(e.target.value)}
                placeholder={"http://localhost:5173\nhttps://app.example.com"}
                aria-describedby="cors-origins-help"
              />
              <div id="cors-origins-help" className="form-text">
                One per line (or comma-separated). Your React dev server is usually{" "}
                <code>http://localhost:5173</code> (Vite) or <code>http://localhost:3000</code>{" "}
                (Next.js/CRA).
              </div>
            </div>

            <fieldset className="mb-3">
              <legend className="form-label fw-semibold fs-6">Allowed methods</legend>
              <div className="d-flex flex-wrap gap-3">
                {ALL_METHODS.map((m) => (
                  <div className="form-check" key={m}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`method-${m}`}
                      checked={methods.includes(m)}
                      onChange={() => toggleMethod(m)}
                    />
                    <label className="form-check-label font-monospace small" htmlFor={`method-${m}`}>
                      {m}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>

            <div className="mb-3">
              <label htmlFor="cors-allowed-headers" className="form-label fw-semibold">
                Allowed headers
              </label>
              <input
                id="cors-allowed-headers"
                type="text"
                className="form-control bg-card border-custom text-body font-monospace"
                value={allowedHeadersText}
                onChange={(e) => setAllowedHeadersText(e.target.value)}
                placeholder="* or Authorization, Content-Type"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="cors-exposed-headers" className="form-label fw-semibold">
                Exposed headers <span className="text-secondary-custom fw-normal">(optional)</span>
              </label>
              <input
                id="cors-exposed-headers"
                type="text"
                className="form-control bg-card border-custom text-body font-monospace"
                value={exposedHeadersText}
                onChange={(e) => setExposedHeadersText(e.target.value)}
                placeholder="Authorization, Location"
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-6">
                <label htmlFor="cors-maxage" className="form-label fw-semibold">
                  Max age (s)
                </label>
                <input
                  id="cors-maxage"
                  type="number"
                  min={0}
                  className="form-control bg-card border-custom text-body"
                  value={maxAge}
                  onChange={(e) => setMaxAge(Math.max(0, Number(e.target.value) || 0))}
                />
              </div>
              <div className="col-6">
                <label htmlFor="cors-mapping" className="form-label fw-semibold">
                  Path mapping
                </label>
                <input
                  id="cors-mapping"
                  type="text"
                  className="form-control bg-card border-custom text-body font-monospace"
                  value={mapping}
                  onChange={(e) => setMapping(e.target.value)}
                  placeholder="/**"
                />
              </div>
            </div>

            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="cors-credentials"
                checked={allowCredentials}
                onChange={(e) => setAllowCredentials(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="cors-credentials">
                Allow credentials
                <span className="text-secondary-custom ms-1 small">
                  (cookies / <code>Authorization</code> header)
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="col-lg-7">
        <div className="card bg-card border-custom rounded-4 h-100">
          <div className="card-body p-4 d-flex flex-column">
            <ul className="nav nav-pills gap-2 mb-3 flex-nowrap overflow-auto" role="tablist">
              {variants.map((v) => (
                <li className="nav-item" key={v.id} role="presentation">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === v.id}
                    className={`nav-link text-nowrap ${activeTab === v.id ? "active" : ""}`}
                    onClick={() => setActiveTab(v.id)}
                  >
                    {v.label}
                  </button>
                </li>
              ))}
            </ul>

            {active && (
              <>
                <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
                  <p className="small text-secondary-custom mb-0">{active.description}</p>
                  <CopyButton value={active.code} label="Copy" />
                </div>
                <pre
                  className="rounded-3 p-3 flex-grow-1 mb-0"
                  style={{ background: "#0d1117", overflow: "auto", fontSize: "0.85rem" }}
                >
                  <code>{active.code}</code>
                </pre>
              </>
            )}

            {warnings.length > 0 && (
              <div className="mt-3">
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
