import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms and conditions that govern your use of the StackFromZero website and its content.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "July 21, 2026";

export default function TermsPage() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <header className="mb-4">
            <h1 className="display-6 fw-bold mb-2">Terms of Service</h1>
            <p className="text-secondary-custom mb-0">
              Last updated: {LAST_UPDATED}
            </p>
          </header>

          <div className="article-prose">
            <p>
              Welcome to {siteConfig.name}. These Terms of Service
              (&quot;Terms&quot;) govern your access to and use of{" "}
              {siteConfig.url} (the &quot;Site&quot;). By accessing or using the
              Site, you agree to be bound by these Terms. If you do not agree,
              please do not use the Site.
            </p>

            <h2>Use of the site</h2>
            <p>
              {siteConfig.name} provides educational tutorials and articles about
              software development, free of charge. You may read, share, and learn
              from this content for personal and educational purposes. You agree
              not to misuse the Site, including but not limited to attempting to
              gain unauthorized access, disrupting the Site&apos;s operation, or
              using automated systems to scrape content at scale.
            </p>

            <h2>Intellectual property</h2>
            <p>
              Unless otherwise stated, all written content, designs, and graphics
              on this Site are the property of {siteConfig.name} and are protected
              by applicable copyright laws. You may quote short excerpts with
              attribution and a link back to the original article. You may not
              republish substantial portions of our content as your own without
              written permission.
            </p>
            <p>
              Code samples included in our tutorials are provided for you to learn
              from and use freely in your own projects, including commercial ones,
              without attribution.
            </p>

            <h2>Educational content disclaimer</h2>
            <p>
              The tutorials and code on this Site are provided for educational
              purposes only. While we strive for accuracy, technology changes
              quickly and we make no guarantee that the information is current,
              complete, or error-free. You are responsible for testing and
              validating any code before using it in production. We are not liable
              for any damage, data loss, or costs resulting from following our
              tutorials.
            </p>

            <h2>Third-party links</h2>
            <p>
              Our content may link to third-party websites and tools that we do
              not control. We include these links for convenience and education.
              We are not responsible for the content, policies, or practices of
              any third-party sites. Visiting them is at your own risk.
            </p>

            <h2>Advertising</h2>
            <p>
              This Site is supported by advertising, including ads served by
              Google AdSense. Ads help keep our content free. Your interaction
              with advertisements is governed by the advertiser&apos;s own terms
              and privacy policies. See our{" "}
              <Link href="/privacy">Privacy Policy</Link> for details on
              advertising cookies.
            </p>

            <h2>Newsletter</h2>
            <p>
              If you subscribe to our newsletter, you agree to receive periodic
              emails about new tutorials and updates. You can unsubscribe at any
              time using the link in any email.
            </p>

            <h2>Limitation of liability</h2>
            <p>
              The Site and its content are provided &quot;as is&quot; without
              warranties of any kind, either express or implied. To the fullest
              extent permitted by law, {siteConfig.name} shall not be liable for
              any indirect, incidental, or consequential damages arising from your
              use of the Site.
            </p>

            <h2>Changes to these terms</h2>
            <p>
              We may revise these Terms from time to time. The most current
              version will always be posted on this page, with the &quot;Last
              updated&quot; date reflecting the latest revision. Your continued
              use of the Site after changes are posted constitutes acceptance of
              the updated Terms.
            </p>

            <h2>Contact us</h2>
            <p>
              If you have any questions about these Terms, please reach out via
              our <Link href="/contact">contact page</Link> or email{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
