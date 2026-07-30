"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setFeedback(data.message || "Thanks! We'll be in touch.");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
        setFeedback(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setFeedback("Network error. Please try again in a moment.");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-3">
        <label htmlFor="contact-name" className="form-label">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          className="form-control form-control-lg bg-card border-custom text-body"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={status === "loading"}
          autoComplete="name"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="contact-email" className="form-label">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          className="form-control form-control-lg bg-card border-custom text-body"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "loading"}
          autoComplete="email"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="contact-message" className="form-label">
          Message
        </label>
        <textarea
          id="contact-message"
          className="form-control bg-card border-custom text-body"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          disabled={status === "loading"}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-lg px-4"
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            />
            Sending...
          </>
        ) : (
          <>
            <i className="bi bi-send me-2" aria-hidden="true" />
            Send message
          </>
        )}
      </button>

      <div aria-live="polite" className="mt-3">
        {status === "success" && (
          <div className="alert alert-success d-flex align-items-center gap-2 mb-0" role="status">
            <i className="bi bi-check-circle-fill" aria-hidden="true" />
            {feedback}
          </div>
        )}
        {status === "error" && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-0" role="alert">
            <i className="bi bi-exclamation-circle-fill" aria-hidden="true" />
            {feedback}
          </div>
        )}
      </div>
    </form>
  );
}
