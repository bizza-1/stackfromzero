import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ArticleGrid from "@/components/ui/ArticleGrid";
import NewsletterForm from "@/components/ui/NewsletterForm";
import AdsenseAd from "@/components/ui/AdsenseAd";
import { AnimatedText, AnimatedSection } from "@/components/ui/animated";
import { getAllArticles } from "@/lib/mdx";

export default function HomePage() {
  const featured = getAllArticles().slice(0, 6);

  return (
    <>
      <HeroSection />

      {/* Featured articles */}
      <section className="container py-5">
        <div className="d-flex flex-wrap align-items-end justify-content-between gap-2 mb-4">
          <div>
            <h2 className="fw-bold mb-1">Latest tutorials</h2>
            <p className="text-secondary-custom mb-0">
              Practical fullstack guides for students and junior devs.
            </p>
          </div>
          <Link href="/blog" className="btn btn-outline-primary">
            View all
            <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
          </Link>
        </div>

        <ArticleGrid articles={featured} />
      </section>

      <section className="container pb-4">
        <AdsenseAd className="mx-auto" style={{ maxWidth: 728 }} slotId="1234567890" />
      </section>

      {/* What you'll learn */}
      <section className="container pb-5">
        <AnimatedSection className="row g-4" selector=".col-12" y={50} stagger={0.15}>
          {[
            {
              icon: "bi-filetype-jsx",
              title: "Modern React",
              text: "Hooks, components, data fetching, and clean architecture with React 18.",
            },
            {
              icon: "bi-cup-hot-fill",
              title: "Spring Boot 3",
              text: "REST APIs, JPA, security, and payments with production-grade Java.",
            },
            {
              icon: "bi-rocket-takeoff-fill",
              title: "Real deployment",
              text: "Ship to Render, Vercel, and beyond  on a student budget.",
            },
          ].map((item) => (
            <div className="col-12 col-md-4" key={item.title}>
              <div className="card bg-card border-custom rounded-3 h-100">
                <div className="card-body p-4">
                  <i className={`bi ${item.icon} fs-2 text-primary mb-3 d-block`} aria-hidden="true" />
                  <h3 className="h5 fw-bold">{item.title}</h3>
                  <p className="text-secondary-custom mb-0">{item.text}</p>
                </div>
              </div>
            </div>
          ))}
        </AnimatedSection>
      </section>

      {/* Newsletter CTA */}
      <section className="container pb-6 mb-4">
        <div className="card bg-card border-custom rounded-4 overflow-hidden">
          <div className="card-body text-center p-4 p-md-5">
            <h2 className="fw-bold mb-2">Get practical tutorials in your inbox</h2>
            <p className="text-secondary-custom mb-4 mx-auto" style={{ maxWidth: "520px" }}>
              Weekly React + Spring Boot guides with real projects, deployment
              notes, and student friendly explanations.
            </p>
            <div className="mx-auto" style={{ maxWidth: "560px" }}>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
