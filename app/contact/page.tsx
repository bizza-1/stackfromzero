import type { Metadata } from "next";
import ContactForm from "@/components/ui/ContactForm";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the StackFromZero team. Questions, feedback, corrections, or partnership enquiries are welcome.",
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    icon: "bi-envelope-fill",
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: "bi-twitter-x",
    label: "Twitter / X",
    value: siteConfig.author.twitter,
    href: `https://twitter.com/${siteConfig.author.twitter.replace("@", "")}`,
  },
  {
    icon: "bi-github",
    label: "GitHub",
    value: `@${siteConfig.author.github}`,
    href: `https://github.com/${siteConfig.author.github}`,
  },
];

export default function ContactPage() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 text-center mb-5">
          <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary mb-3 px-3 py-2">
            <i className="bi bi-chat-dots me-1" aria-hidden="true" />
            Get in touch
          </span>
          <h1 className="display-5 fw-bold mb-3">Contact us</h1>
          <p className="lead text-secondary-custom mb-0 mx-auto" style={{ maxWidth: "600px" }}>
            Have a question, spotted an error in a tutorial, or want to work with
            us? Send a message and we&apos;ll get back to you as soon as we can.
          </p>
        </div>
      </div>

      <div className="row justify-content-center g-4">
        <div className="col-lg-7">
          <div className="card bg-card border-custom rounded-4">
            <div className="card-body p-4 p-md-5">
              <h2 className="h5 fw-bold mb-4">Send us a message</h2>
              <ContactForm />
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card bg-card border-custom rounded-4 h-100">
            <div className="card-body p-4">
              <h2 className="h5 fw-bold mb-4">Other ways to reach us</h2>
              <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                {channels.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      target={c.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel={c.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                      className="d-flex align-items-center gap-3 text-decoration-none text-body"
                    >
                      <span className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10 text-primary" style={{ width: "2.5rem", height: "2.5rem" }}>
                        <i className={`bi ${c.icon}`} aria-hidden="true" />
                      </span>
                      <span>
                        <span className="d-block small text-secondary-custom">{c.label}</span>
                        <span className="fw-semibold">{c.value}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="text-secondary-custom small mt-4 mb-0">
                We typically respond within a few business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
