import Link from "next/link";
import StatCounter from "@/components/ui/animated/StatCounter";

type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
};

const stats: Stat[] = [
  { value: 3, label: "In-depth tutorials" },
  { value: 6.5, suffix: "k+", decimals: 1, label: "Words per guide" },
  { value: 0, prefix: "$", label: "Cost to follow along" },
  { value: 100, suffix: "%", label: "Beginner friendly" },
];

export default function HeroSection() {
  return (
    <section className="bg-hero py-5 py-lg-6">
      <div className="container py-4 py-lg-5">
        <div className="row justify-content-center text-center">
          <div className="col-lg-9">
            <span className="hero-badge badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary mb-4 px-3 py-2">
              <i className="bi bi-mortarboard-fill me-1" aria-hidden="true" />
              Built for  students &amp; junior devs
            </span>

            <h1 className="hero-title display-3 fw-bold mb-3">
              Learn <span className="hero-gradient">React</span> &amp;{" "}
              <span className="hero-gradient">Spring Boot</span> from zero.
            </h1>

            <p className="hero-subtitle lead text-secondary-custom mb-4 mx-auto" style={{ maxWidth: "640px" }}>
              Practical full stack tutorials that take you from your
              first component to a deployed production app. Real code, real
              deployments, zero gatekeeping.
            </p>

            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mb-5">
              <Link href="/blog" className="hero-cta btn btn-primary btn-lg px-4">
                <i className="bi bi-book-half me-2" aria-hidden="true" />
                Start Reading
              </Link>
              <Link href="/newsletter" className="hero-cta btn btn-outline-light btn-lg px-4">
                <i className="bi bi-envelope-heart me-2" aria-hidden="true" />
                Join the Newsletter
              </Link>
            </div>
          </div>
        </div>

        <div className="row row-cols-2 row-cols-md-4 g-4 text-center mt-2">
          {stats.map((stat) => (
            <div className="col hero-stats" key={stat.label}>
              <div className="card bg-card border-custom rounded-3 h-100 py-3">
                <div className="card-body">
                  <div className="h2 fw-bold text-primary mb-1">
                    <StatCounter
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  </div>
                  <div className="text-secondary-custom small">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
