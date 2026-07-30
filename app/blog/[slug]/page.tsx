import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MDX from "@/components/ui/MDX";
import TableOfContents from "@/components/ui/TableOfContents";
import TagBadge from "@/components/ui/TagBadge";
import ArticleGrid from "@/components/ui/ArticleGrid";
import NewsletterForm from "@/components/ui/NewsletterForm";
import {
  AnimatedText,
  AnimatedSection,
  ArticleContent,
  ReadingProgress,
} from "@/components/ui/animated";
import {
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
  extractToc,
} from "@/lib/mdx";
import { absoluteUrl, formatDate, siteConfig, toISODate } from "@/lib/utils";

type ArticlePageProps = {
  params: { slug: string };
};

/** Statically generate every published article at build time. */
export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }: ArticlePageProps): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};

  const ogImage = article.image
    ? absoluteUrl(article.image)
    : absoluteUrl(`/api/og?title=${encodeURIComponent(article.title)}`);
  const url = absoluteUrl(article.url);

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: article.url },
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: article.description,
      publishedTime: toISODate(article.date),
      authors: [siteConfig.author.name],
      tags: article.tags,
      images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [ogImage],
    },
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const toc = extractToc(article.body.raw);
  const related = getRelatedArticles(article);

  const ogImage = article.image
    ? absoluteUrl(article.image)
    : absoluteUrl(`/api/og?title=${encodeURIComponent(article.title)}`);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: toISODate(article.date),
    dateModified: toISODate(article.date),
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: absoluteUrl("/about"),
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/images/og-default.svg"),
      },
    },
    image: ogImage,
    url: absoluteUrl(article.url),
    keywords: article.tags.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(article.url),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <ReadingProgress />

      <div className="container py-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small mb-0">
            <li className="breadcrumb-item">
              <Link href="/" className="text-secondary-custom">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/blog" className="text-secondary-custom">
                Blog
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {article.title}
            </li>
          </ol>
        </nav>

        <div className="row g-5">
          {/* Main content */}
          <div className="col-lg-8">
            <header className="mb-4">
              <AnimatedSection
                className="article-tags d-flex flex-wrap gap-2 mb-3"
                selector=".tag-badge"
                y={0}
                stagger={0.06}
                duration={0.4}
                start="top 95%"
              >
                {article.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </AnimatedSection>
              <AnimatedText as="h1" split="lines" className="display-5 fw-bold mb-3" y={30} stagger={0.12}>
                {article.title}
              </AnimatedText>
              <p className="lead text-secondary-custom">{article.description}</p>
              <div className="d-flex flex-wrap align-items-center gap-3 text-secondary-custom small border-top border-custom pt-3 mt-3">
                <span className="d-flex align-items-center gap-2">
                  <i className="bi bi-person-circle fs-5" aria-hidden="true" />
                  {siteConfig.author.name}
                </span>
                <time dateTime={toISODate(article.date)}>
                  <i className="bi bi-calendar3 me-1" aria-hidden="true" />
                  {formatDate(article.date)}
                </time>
                <span>
                  <i className="bi bi-clock me-1" aria-hidden="true" />
                  {article.readingTime} min read
                </span>
              </div>
            </header>

            {/* Mobile TOC (collapsible) */}
            {toc.length > 0 && (
              <details className="d-lg-none card bg-card border-custom rounded-3 mb-4">
                <summary className="card-body py-3 fw-semibold" style={{ cursor: "pointer" }}>
                  On this page
                </summary>
                <div className="card-body pt-0">
                  <TableOfContents items={toc} />
                </div>
              </details>
            )}

            <ArticleContent>
              <MDX code={article.body.code} />
            </ArticleContent>

            {/* Inline newsletter */}
            <div className="card bg-card border-custom rounded-4 mt-5">
              <div className="card-body p-4">
                <h2 className="h4 fw-bold mb-2">Enjoyed this tutorial?</h2>
                <p className="text-secondary-custom mb-3">
                  Get the next one delivered straight to your inbox.
                </p>
                <NewsletterForm compact />
              </div>
            </div>
          </div>

          {/* Sticky TOC sidebar (desktop) */}
          <aside className="col-lg-4 d-none d-lg-block">
            <div className="position-sticky" style={{ top: "100px" }}>
              <TableOfContents items={toc} />
            </div>
          </aside>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="mt-6 pt-5 border-top border-custom">
            <h2 className="fw-bold mb-4">Related articles</h2>
            <ArticleGrid articles={related} />
          </section>
        )}
      </div>
    </>
  );
}
