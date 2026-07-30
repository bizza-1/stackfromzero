import type { Metadata } from "next";
import NewsletterForm from "@/components/ui/NewsletterForm";
import { AnimatedText, AnimatedSection } from "@/components/ui/animated";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Join the StackFromZero newsletter for practical React and Spring Boot tutorials, delivered to your inbox. No spam, unsubscribe anytime.",
  alternates: { canonical: "/newsletter" },
};

const perks = [
  {
    icon: "bi-code-square",
    title: "Practical tutorials",
    text: "Full-stack guides you can follow along with, start to finish.",
  },
  {
    icon: "bi-cash-coin",
    title: "Budget-friendly",
    text: "Deploy and host real apps for free or close to it.",
  },
  {
    icon: "bi-lightning-charge",
    title: "First access",
    text: "New guides land in your inbox before anywhere else.",
  },
];

export default function NewsletterPage() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 text-center">
          <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary mb-3 px-3 py-2">
            <i className="bi bi-envelope-heart me-1" aria-hidden="true" />
            The StackFromZero Newsletter
          </span>
          <AnimatedText as="h1" split="lines" className="display-5 fw-bold mb-3" y={30} stagger={0.12}>
            Level up your full-stack skills, one email at a time.
          </AnimatedText>
          <p className="lead text-secondary-custom mb-4 mx-auto" style={{ maxWidth: "600px" }}>
            Get new React and Spring Boot tutorials the moment they&apos;re published.
            Written for students and junior devs who want to build real things.
          </p>

          <div className="card bg-card border-custom rounded-4 mx-auto" style={{ maxWidth: "560px" }}>
            <div className="card-body p-4 p-md-5">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      <AnimatedSection
        className="row row-cols-1 row-cols-md-3 g-4 mt-4 justify-content-center"
        selector=".col"
        y={40}
        stagger={0.12}
      >
        {perks.map((perk) => (
          <div className="col" key={perk.title}>
            <div className="card bg-card border-custom rounded-3 h-100 text-center">
              <div className="card-body p-4">
                <i className={`bi ${perk.icon} fs-2 text-primary mb-3 d-block`} aria-hidden="true" />
                <h2 className="h5 fw-bold">{perk.title}</h2>
                <p className="text-secondary-custom mb-0">{perk.text}</p>
              </div>
            </div>
          </div>
        ))}
      </AnimatedSection>
    </div>
  );
}
