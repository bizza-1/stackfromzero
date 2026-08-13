"use client";

import { useState } from "react";

type CopyButtonProps = {
  /** The text to place on the clipboard. */
  value: string;
  /** Optional extra classes for layout. */
  className?: string;
  /** Label shown next to the icon (defaults to "Copy"). */
  label?: string;
};

/**
 * Small copy-to-clipboard button for tool output. Mirrors the look of the
 * MDX code-block copy button but takes its text from a prop rather than DOM.
 */
export default function CopyButton({ value, className, label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — fail quietly.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!value}
      className={`btn btn-sm btn-outline-light ${className ?? ""}`.trim()}
      aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
    >
      {copied ? (
        <>
          <i className="bi bi-check-lg me-1" aria-hidden="true" />
          Copied
        </>
      ) : (
        <>
          <i className="bi bi-clipboard me-1" aria-hidden="true" />
          {label}
        </>
      )}
    </button>
  );
}
