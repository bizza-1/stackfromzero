import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import Script from "next/script";

// Compiled Bootstrap theme (SCSS), highlight.js theme, then our globals.
import "@/styles/bootstrap-custom.scss";
import "@/styles/highlight-dark.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import CookieConsent from "@/components/ui/CookieConsent";
import { PageTransition, BackToTop } from "@/components/ui/animated";
import { siteConfig } from "@/lib/utils";

const lato = Lato({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700", "900"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "React tutorial",
    "Spring Boot tutorial",
    "full-stack development",
    "learn to code Africa",
    "junior developer",
    "Java",
    "JavaScript",
  ],
  authors: [{ name: siteConfig.author.name }],
  creator: siteConfig.author.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: siteConfig.author.twitter,
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/rss.xml" },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  logo: `${siteConfig.url}/images/og-default.svg`,
  sameAs: [
    `https://github.com/${siteConfig.author.github}`,
    siteConfig.author.linkedin,
    `https://twitter.com/${siteConfig.author.twitter.replace("@", "")}`,
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-bs-theme="dark" className={lato.variable}>
      <body style={{ fontFamily: "var(--font-lato), system-ui, sans-serif" }}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <PageTransition>
          <main id="main-content">{children}</main>
        </PageTransition>
        <Footer />
        <BackToTop />

        <CookieConsent />

        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0000000000000000"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

        {/* Bootstrap JS bundle — only needed for interactive components (dropdown, modal, collapse). */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
