import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How StackFromZero collects, uses, and protects your information, including cookies and third-party advertising.",
  alternates: { canonical: "/privacy" },
};

// Keep this in sync with the last substantive edit to the policy.
const LAST_UPDATED = "July 21, 2026";

export default function PrivacyPage() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <header className="mb-4">
            <h1 className="display-6 fw-bold mb-2">Privacy Policy</h1>
            <p className="text-secondary-custom mb-0">
              Last updated: {LAST_UPDATED}
            </p>
          </header>

          <div className="article-prose">
            <p>
              At {siteConfig.name} (&quot;we&quot;, &quot;us&quot;, or
              &quot;our&quot;), accessible from {siteConfig.url}, your privacy is
              important to us. This Privacy Policy explains what information we
              collect, how we use it, and the choices you have. By using this
              website, you consent to the practices described here.
            </p>

            <h2>Information we collect</h2>
            <p>
              We aim to collect as little personal information as possible. The
              information we may collect includes:
            </p>
            <ul>
              <li>
                <strong>Email address</strong> — only if you voluntarily
                subscribe to our newsletter. We use it solely to send you new
                tutorials and updates.
              </li>
              <li>
                <strong>Usage data</strong> — standard, non-identifying
                information your browser sends, such as pages visited, time spent,
                approximate region, browser type, and device type. This helps us
                understand what content is useful.
              </li>
              <li>
                <strong>Cookies</strong> — small files stored on your device, as
                described below.
              </li>
            </ul>

            <h2>How we use your information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Deliver and improve our tutorials and website;</li>
              <li>Send newsletter emails you have explicitly requested;</li>
              <li>Understand how visitors use the site so we can make it better;</li>
              <li>Display relevant advertising to keep the content free.</li>
            </ul>

            <h2>Cookies</h2>
            <p>
              Like most websites, {siteConfig.name} uses cookies. Cookies are
              small text files placed on your device to help the site function
              and to gather usage information. You can disable cookies through
              your browser settings, though some parts of the site may not work
              as intended if you do.
            </p>

            <h2>Advertising and third-party vendors</h2>
            <p>
              We may display advertising served by third parties, including{" "}
              <strong>Google AdSense</strong>. These vendors use cookies to serve
              ads based on your prior visits to this and other websites.
            </p>
            <ul>
              <li>
                Google, as a third-party vendor, uses cookies to serve ads on our
                site. Google&apos;s use of advertising cookies enables it and its
                partners to serve ads to you based on your visit to our site
                and/or other sites on the internet.
              </li>
              <li>
                You may opt out of personalized advertising by visiting{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Ads Settings
                </a>
                .
              </li>
              <li>
                You can also opt out of some third-party vendors&apos; use of
                cookies for personalized advertising by visiting{" "}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  aboutads.info
                </a>
                .
              </li>
            </ul>
            <p>
              Third-party ad servers or ad networks use technologies like
              cookies, JavaScript, or web beacons in their respective
              advertisements and links. They automatically receive your IP
              address when this occurs. {siteConfig.name} has no access to or
              control over these cookies used by third-party advertisers.
            </p>

            <h2>Analytics</h2>
            <p>
              We may use privacy-respecting analytics to measure traffic and
              understand which content resonates. Any analytics data is
              aggregated and is not used to personally identify you.
            </p>

            <h2>Third-party privacy policies</h2>
            <p>
              Our Privacy Policy does not apply to other advertisers or websites.
              We advise you to consult the respective privacy policies of these
              third-party ad servers for more detailed information, including
              their practices and instructions about how to opt out of certain
              options.
            </p>

            <h2>Your data rights</h2>
            <p>
              You have the right to access, correct, or delete the personal
              information we hold about you. If you subscribed to our newsletter,
              every email includes an unsubscribe link, and you can request
              deletion of your address at any time by contacting us.
            </p>

            <h2>Children&apos;s information</h2>
            <p>
              {siteConfig.name} does not knowingly collect any personally
              identifiable information from children under the age of 13. If you
              believe your child provided this kind of information on our website,
              please contact us and we will promptly remove it.
            </p>

            <h2>Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes are
              effective as soon as they are posted on this page, and the
              &quot;Last updated&quot; date above will reflect the most recent
              revision.
            </p>

            <h2>Contact us</h2>
            <p>
              If you have questions about this Privacy Policy, please reach out
              through our <Link href="/contact">contact page</Link> or email us at{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
