import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-6 text-center" style={{ minHeight: "60vh" }}>
      <div className="py-5">
        <p className="display-1 fw-bold hero-gradient mb-0">404</p>
        <h1 className="h3 fw-bold mb-2">Page not found</h1>
        <p className="text-secondary-custom mb-4 mx-auto" style={{ maxWidth: "440px" }}>
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
          Let&apos;s get you back on track.
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <Link href="/" className="btn btn-primary px-4">
            <i className="bi bi-house me-2" aria-hidden="true" />
            Home
          </Link>
          <Link href="/blog" className="btn btn-outline-light px-4">
            Browse the blog
          </Link>
        </div>
      </div>
    </div>
  );
}
