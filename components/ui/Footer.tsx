import Link from "next/link";
import { siteConfig } from "@/lib/utils";

const socials = [
  {
    label: "GitHub",
    icon: "bi-github",
    href: `https://github.com/${siteConfig.author.github}`,
  },
  {
    label: "Twitter",
    icon: "bi-twitter-x",
    href: `https://twitter.com/${siteConfig.author.twitter.replace("@", "")}`,
  },
  {
    label: "LinkedIn",
    icon: "bi-linkedin",
    href: `https://linkedin.com/in/${siteConfig.author.linkedin}`,
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-top border-custom mt-5 py-4 flex-shrink-0">
      <div className="container">
        <div className="row gy-3 align-items-center">
          <div className="col-12 col-md-6 text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
              <i className="bi bi-stack text-primary" aria-hidden="true" />
              <span className="fw-bold">
                Stack<span className="text-primary">FromZero</span>
              </span>
            </div>
            <p className="text-secondary-custom small mb-0">
              &copy; {year} {siteConfig.name}. Built for developers, from zero.
            </p>
          </div>

          <div className="col-12 col-md-6">
            <div className="d-flex align-items-center justify-content-center justify-content-md-end gap-3 flex-wrap">
              <Link href="/blog" className="text-secondary-custom small">
                Blog
              </Link>
              <Link href="/about" className="text-secondary-custom small">
                About
              </Link>
              <Link href="/contact" className="text-secondary-custom small">
                Contact
              </Link>
              <a
                href="/rss.xml"
                className="text-secondary-custom small d-inline-flex align-items-center gap-1"
              >
                <i className="bi bi-rss-fill" aria-hidden="true" /> RSS
              </a>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-custom fs-5"
                  aria-label={s.label}
                >
                  <i className={`bi ${s.icon}`} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Legal row */}
        <div className="row mt-3 pt-3 border-top border-custom">
          <div className="col-12 d-flex justify-content-center justify-content-md-start gap-3 flex-wrap">
            <Link href="/privacy" className="text-secondary-custom small">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-secondary-custom small">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-secondary-custom small">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
