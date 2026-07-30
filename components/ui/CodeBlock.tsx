"use client";

import { useRef, useState, type ReactNode } from "react";

type CodeBlockProps = {
  children?: ReactNode;
  [key: string]: unknown;
};

/**
 * Wraps rehype-highlight <pre> output with a copy-to-clipboard button.
 * The children already contain the highlighted <code> element.
 */
export default function CodeBlock({ children, ...props }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = preRef.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — fail quietly.
    }
  };

  return (
    <div className="code-block-wrapper">
      <button
        type="button"
        onClick={handleCopy}
        className="copy-btn btn btn-sm btn-outline-light"
        aria-label={copied ? "Copied" : "Copy code to clipboard"}
      >
        {copied ? (
          <>
            <i className="bi bi-check-lg" aria-hidden="true" /> Copied
          </>
        ) : (
          <>
            <i className="bi bi-clipboard" aria-hidden="true" /> Copy
          </>
        )}
      </button>
      <pre ref={preRef} {...props}>
        {children}
      </pre>
    </div>
  );
}
