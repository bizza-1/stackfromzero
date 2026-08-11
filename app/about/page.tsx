import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AnimatedText, AnimatedSection, AuthorPhoto } from "@/components/ui/animated";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind StackFromZero and why it exists — teaching React and Spring Boot to African students and junior developers.",
  alternates: { canonical: "/about" },
};

const socials = [
  { label: "GitHub", icon: "bi-github", href: `https://github.com/${siteConfig.author.github}` },
  {
    label: "Twitter",
    icon: "bi-twitter-x",
    href: `https://twitter.com/${siteConfig.author.twitter.replace("@", "")}`,
  },
  {
    label: "LinkedIn",
    icon: "bi-linkedin",
    href: siteConfig.author.linkedin,
  },
];

export default function AboutPage() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <AuthorPhoto className="mb-3">
              <Image
                src="/images/image-download.png"
                alt={siteConfig.author.name}
                width={140}
                height={140}
                className="rounded-circle border border-primary border-3"
                priority
              />
            </AuthorPhoto>
            <AnimatedText as="h1" split="chars" className="display-6 fw-bold mb-1" y={30}>
              {siteConfig.author.name}
            </AnimatedText>
            <p className="text-secondary-custom lead mb-3">{siteConfig.author.bio}</p>
            <div className="d-flex justify-content-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-light btn-sm"
                  aria-label={s.label}
                >
                  <i className={`bi ${s.icon} me-1`} aria-hidden="true" />
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <AnimatedSection
            as="div"
            className="article-prose"
            selector="h2, p"
            y={20}
            stagger={0.08}
            duration={0.6}
          >
            <h2>Why StackFromZero exists</h2>
            <p>
              I learned to code with a patchy internet connection, a second-hand
              laptop, and a stack of browser tabs that never quite added up to a
              real project. The tutorials I found either assumed I already knew
              everything, or stopped right before the interesting part — actually
              shipping something people could use.
            </p>
            <p>
              StackFromZero is the resource I wish I had back then. Every guide here
              takes you all the way from an empty folder to a deployed, working
              application. No skipped steps, no &quot;left as an exercise for the
              reader,&quot; and no assumption that you have a company credit card for
              cloud hosting.
            </p>

            <h2>Who this is for</h2>
            <p>
              This site is built for African students and junior developers who want
              to become confident full-stack engineers. If you know a little
              JavaScript and you&apos;re curious about how real apps are built with
              React and Spring Boot, you&apos;re in the right place.
            </p>

            <h2>The stack I teach</h2>
            <p>
              I focus on <strong>React</strong> on the front end and{" "}
              <strong>Spring Boot</strong> on the back end because that combination
              is battle-tested, widely hired for, and generous with free tooling.
              Along the way we cover deployment, payments, security, and the small
              production details that separate a demo from a real product.
            </p>

            <h2>Let&apos;s build together</h2>
            <p>
              The best way to keep up is the{" "}
              <Link href="/newsletter">newsletter</Link> — I send new tutorials as
              soon as they&apos;re published. Or jump straight into the{" "}
              <Link href="/blog">blog</Link> and start building.
            </p>
          </AnimatedSection>

          <div className="card bg-card border-custom rounded-4 mt-5 text-center">
            <div className="card-body p-4">
              <h3 className="h5 fw-bold mb-2">Ready to start?</h3>
              <p className="text-secondary-custom mb-3">
                Pick a tutorial and build something real today.
              </p>
              <Link href="/blog" className="btn btn-primary px-4">
                Browse tutorials
                <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
