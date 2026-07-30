"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

type NewsletterFormProps = {
  /** Compact layout for inline placement (e.g. bottom of an article). */
  compact?: boolean;
};

export default function NewsletterForm({ compact = false }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You're in. Check your inbox to confirm.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again in a moment.");
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className={compact ? "d-flex flex-column flex-sm-row gap-2" : "row g-2 justify-content-center"}
        noValidate
      >
        <div className={compact ? "flex-grow-1" : "col-12 col-sm-7 col-md-6"}>
          <label htmlFor="newsletter-email" className="visually-hidden">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            className="form-control form-control-lg bg-card border-custom text-body"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "loading"}
            aria-describedby="newsletter-help"
          />
        </div>
        <div className={compact ? "" : "col-12 col-sm-auto"}>
          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 px-4"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                Joining...
              </>
            ) : (
              "Subscribe"
            )}
          </button>
        </div>
      </form>

      <div id="newsletter-help" aria-live="polite" className="mt-3">
        {status === "success" && (
          <div className="alert alert-success d-flex align-items-center gap-2 mb-0" role="status">
            <i className="bi bi-check-circle-fill" aria-hidden="true" />
            {message}
          </div>
        )}
        {status === "error" && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-0" role="alert">
            <i className="bi bi-exclamation-circle-fill" aria-hidden="true" />
            {message}
          </div>
        )}
        {status === "idle" && !compact && (
          <p className="text-secondary-custom small text-center mb-0">
            No spam. Unsubscribe anytime.
          </p>
        )}
      </div>
    </div>
  );
}
