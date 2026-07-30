import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleGrid from "@/components/ui/ArticleGrid";
import { getAllArticles, getAllTags, getArticlesByTag } from "@/lib/mdx";
import { slugToTagLabel } from "@/lib/utils";

type TagPageProps = {
  params: { tag: string };
};

export function generateStaticParams() {
  return getAllTags().map((t) => ({ tag: t.slug }));
}

export function generateMetadata({ params }: TagPageProps): Metadata {
  const knownTags = getAllArticles().flatMap((a) => a.tags);
  const label = slugToTagLabel(params.tag, knownTags);
  return {
    title: `${label} articles`,
    description: `All StackFromZero tutorials tagged "${label}".`,
    alternates: { canonical: `/tags/${params.tag}` },
  };
}

export default function TagPage({ params }: TagPageProps) {
  const articles = getArticlesByTag(params.tag);
  if (articles.length === 0) notFound();

  const knownTags = getAllArticles().flatMap((a) => a.tags);
  const label = slugToTagLabel(params.tag, knownTags);
  const allTags = getAllTags();

  return (
    <div className="container py-5">
      <header className="mb-4">
        <Link href="/blog" className="text-secondary-custom small text-decoration-none">
          <i className="bi bi-arrow-left me-1" aria-hidden="true" />
          All articles
        </Link>
        <h1 className="display-5 fw-bold mt-2 mb-1">
          <span className="text-secondary-custom fw-normal fs-4 d-block">Tagged</span>
          {label}
        </h1>
        <p className="text-secondary-custom">
          {articles.length} article{articles.length === 1 ? "" : "s"}
        </p>
      </header>

      {/* Tag cloud */}
      <div className="d-flex flex-wrap gap-2 mb-5">
        {allTags.map((t) => (
          <Link
            key={t.slug}
            href={`/tags/${t.slug}`}
            className={`badge rounded-pill text-decoration-none px-3 py-2 ${
              t.slug === params.tag
                ? "bg-primary"
                : "bg-card border border-custom text-secondary-custom"
            }`}
          >
            {t.tag} <span className="opacity-75">({t.count})</span>
          </Link>
        ))}
      </div>

      <ArticleGrid articles={articles} />
    </div>
  );
}
