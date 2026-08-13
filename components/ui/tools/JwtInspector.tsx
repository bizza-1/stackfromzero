"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { decodeJwt, relativeFromNow } from "@/lib/tools/jwt";
import CopyButton from "./CopyButton";

// A self-contained example token (HS256, Spring-Security-style authorities).
// The signature is illustrative only — this tool never verifies signatures.
const EXAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkYSIsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiIsIlJPTEVfQURNSU4iXSwiaXNzIjoic3RhY2tmcm9temVyby1hcGkiLCJpYXQiOjE3MzU2ODk2MDAsImV4cCI6NDEwMjQ0NDgwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

const transparentTable: CSSProperties = {
  // Neutralise Bootstrap's default light table background inside the dark card.
  ["--bs-table-bg" as string]: "transparent",
  ["--bs-table-color" as string]: "inherit",
};

function formatValue(value: unknown): string {
  return typeof value === "string" ? value : JSON.stringify(value);
}

export default function JwtInspector() {
  const [token, setToken] = useState(EXAMPLE);
  // now starts at 0 so SSR and first client render match; set on mount.
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const result = useMemo(() => decodeJwt(token), [token]);
  const mounted = now > 0;

  // Validity window (only meaningful once mounted and when exp/nbf are present).
  const status = useMemo(() => {
    if (!result.ok || !mounted) return null;
    const exp = result.payload.exp;
    const nbf = result.payload.nbf;
    if (typeof exp === "number" && exp * 1000 < now) {
      return { kind: "expired" as const, text: `Expired ${relativeFromNow(exp * 1000, now)}` };
    }
    if (typeof nbf === "number" && nbf * 1000 > now) {
      return { kind: "future" as const, text: `Not valid until ${relativeFromNow(nbf * 1000, now)}` };
    }
    if (typeof exp === "number") {
      return { kind: "active" as const, text: `Within its validity window (expires ${relativeFromNow(exp * 1000, now)})` };
    }
    return null;
  }, [result, now, mounted]);

  return (
    <div className="row g-4">
      {/* Input */}
      <div className="col-12">
        <div className="card bg-card border-custom rounded-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <label htmlFor="jwt-input" className="h6 fw-bold mb-0">
                Encoded token
              </label>
              <button
                type="button"
                className="btn btn-sm btn-outline-light"
                onClick={() => setToken(EXAMPLE)}
              >
                <i className="bi bi-arrow-counterclockwise me-1" aria-hidden="true" />
                Load example
              </button>
            </div>
            <textarea
              id="jwt-input"
              className="form-control bg-card border-custom text-body font-monospace"
              style={{ minHeight: "120px", fontSize: "0.85rem", wordBreak: "break-all" }}
              spellCheck={false}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste a JWT (header.payload.signature)…"
            />
          </div>
        </div>
      </div>

      {!result.ok ? (
        token.trim() && (
          <div className="col-12">
            <div className="alert alert-danger d-flex align-items-start gap-2 mb-0" role="alert">
              <i className="bi bi-x-octagon-fill mt-1" aria-hidden="true" />
              <span>{result.error}</span>
            </div>
          </div>
        )
      ) : (
        <>
          {/* Status row */}
          <div className="col-12">
            <div className="d-flex flex-wrap align-items-center gap-2">
              {result.algorithm && (
                <span className="badge bg-secondary-subtle text-secondary-emphasis border">
                  <i className="bi bi-fingerprint me-1" aria-hidden="true" />
                  alg: {result.algorithm}
                </span>
              )}
              {status && (
                <span
                  className={`badge ${
                    status.kind === "expired"
                      ? "bg-danger"
                      : status.kind === "future"
                        ? "bg-warning text-dark"
                        : "bg-success"
                  }`}
                >
                  <i
                    className={`bi me-1 ${
                      status.kind === "active" ? "bi-check-circle-fill" : "bi-clock-fill"
                    }`}
                    aria-hidden="true"
                  />
                  {status.text}
                </span>
              )}
              <span className="badge bg-primary bg-opacity-10 text-primary border border-primary">
                <i className="bi bi-shield-slash me-1" aria-hidden="true" />
                Signature not verified
              </span>
            </div>
          </div>

          {/* Header + Payload JSON */}
          <div className="col-lg-6">
            <div className="card bg-card border-custom rounded-4 h-100">
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h2 className="h6 fw-bold mb-0">Header</h2>
                  <CopyButton value={result.headerJson} />
                </div>
                <pre
                  className="rounded-3 p-3 mb-0 flex-grow-1"
                  style={{ background: "#0d1117", overflow: "auto", fontSize: "0.85rem" }}
                >
                  <code>{result.headerJson}</code>
                </pre>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card bg-card border-custom rounded-4 h-100">
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h2 className="h6 fw-bold mb-0">Payload</h2>
                  <CopyButton value={result.payloadJson} />
                </div>
                <pre
                  className="rounded-3 p-3 mb-0 flex-grow-1"
                  style={{ background: "#0d1117", overflow: "auto", fontSize: "0.85rem" }}
                >
                  <code>{result.payloadJson}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Claims table */}
          <div className="col-12">
            <div className="card bg-card border-custom rounded-4">
              <div className="card-body p-4">
                <h2 className="h6 fw-bold mb-3">Claims</h2>
                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0" style={transparentTable}>
                    <thead>
                      <tr className="text-secondary-custom small">
                        <th scope="col">Claim</th>
                        <th scope="col">Value</th>
                        <th scope="col">Meaning</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.claims.map((c) => (
                        <tr key={c.key}>
                          <td className="font-monospace fw-semibold">{c.key}</td>
                          <td>
                            <code className="text-body" style={{ wordBreak: "break-word" }}>
                              {formatValue(c.value)}
                            </code>
                            {c.isTimestamp && typeof c.value === "number" && mounted && (
                              <div className="small text-secondary-custom mt-1">
                                {new Date(c.value * 1000).toLocaleString()}{" "}
                                <span className="fst-italic">
                                  ({relativeFromNow(c.value * 1000, now)})
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="small text-secondary-custom">{c.description ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="col-12">
              {result.warnings.map((w) => (
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
        </>
      )}
    </div>
  );
}
