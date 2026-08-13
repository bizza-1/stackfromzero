import type { Metadata } from "next";
import Link from "next/link";
import JwtInspector from "@/components/ui/tools/JwtInspector";

export const metadata: Metadata = {
  title: "JWT Decoder & Inspector",
  description:
    "Paste a JSON Web Token to decode its header and payload, read every claim in plain English, and see exp/iat/nbf as real dates. Fully client-side  your token never leaves your browser.",
  alternates: { canonical: "/tools/jwt-decoder" },
};

export default function JwtDecoderPage() {
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
          <i className="bi bi-key me-1" aria-hidden="true" />
          Auth &amp; tokens
        </span>
        <h1 className="display-6 fw-bold mb-3">JWT decoder &amp; inspector</h1>
        <p className="lead text-secondary-custom mb-2" style={{ maxWidth: "720px" }}>
          When your Spring Security login returns a token and the frontend can&apos;t
          tell why it&apos;s being rejected, decode it here. See the header, every
          claim explained, and exactly when it expires.
        </p>
        <p className="small text-secondary-custom mb-0">
          <i className="bi bi-shield-lock me-1" aria-hidden="true" />
          100% client-side. Your token is decoded in your browser and never uploaded.
        </p>
      </div>

      <JwtInspector />

      <div className="card bg-card border-custom rounded-4 mt-4">
        <div className="card-body p-4">
          <div className="alert alert-warning d-flex align-items-start gap-2 mb-3 py-2">
            <i className="bi bi-shield-slash-fill mt-1" aria-hidden="true" />
            <span className="small mb-0">
              <strong>Decoding is not verifying.</strong> A JWT&apos;s payload is only
              base64-encoded, not encrypted  anyone can read it. This tool shows what&apos;s
              inside, but it does <em>not</em> check the signature (that needs your secret
              or public key, which should stay on your server). Never trust a token&apos;s
              claims until your backend has verified its signature.
            </span>
          </div>
          <h2 className="h6 fw-bold mb-2">Good to know</h2>
          <ul className="small text-secondary-custom mb-0 ps-3">
            <li>
              The three parts are <code>header.payload.signature</code>, each base64url-encoded.
            </li>
            <li>
              <code>exp</code>, <code>iat</code>, and <code>nbf</code> are Unix timestamps in
              <em> seconds</em>  a frequent bug is comparing them against JavaScript&apos;s
              millisecond <code>Date.now()</code>.
            </li>
            <li>
              Because decoding happens locally, you can safely inspect real tokens without
              sending them to a third-party website.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
