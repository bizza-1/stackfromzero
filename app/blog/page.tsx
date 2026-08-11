import type { Metadata } from "next";
import ArticleGrid from "@/components/ui/ArticleGrid";
import Pagination from "@/components/ui/Pagination";
import AdsenseAd from "@/components/ui/AdsenseAd";
import { AnimatedText } from "@/components/ui/animated";
import { getAllArticles } from "@/lib/mdx";
import { POSTS_PER_PAGE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Browse all StackFromZero tutorials on React, Spring Boot, deployment, and full-stack development.",
  alternates: { canonical: "/blog" },
};

type BlogPageProps = {
  searchParams: { page?: string };
};

export default function BlogPage({ searchParams }: BlogPageProps) {
  const articles = getAllArticles();
  const totalPages = Math.max(1, Math.ceil(articles.length / POSTS_PER_PAGE));

  const requested = Number.parseInt(searchParams.page ?? "1", 10);
  const currentPage = Math.min(
    Math.max(Number.isNaN(requested) ? 1 : requested, 1),
    totalPages
  );

  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const pageArticles = articles.slice(start, start + POSTS_PER_PAGE);

  return (
    <div className="container py-5">
      <header className="mb-5">
        <AnimatedText as="h1" split="words" className="display-5 fw-bold mb-2" y={30} stagger={0.05}>
          The Blog
        </AnimatedText>
        <p className="lead text-secondary-custom mb-0">
          {articles.length} tutorial{articles.length === 1 ? "" : "s"} on building
          and shipping full-stack apps.
        </p>
      </header>

      <div className="mb-4">
        <AdsenseAd className="mx-auto" style={{ maxWidth: 728 }} slotId="1234567890" />
      </div>

      <ArticleGrid articles={pageArticles} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        hrefForPage={(page) => (page === 1 ? "/blog" : `/blog?page=${page}`)}
      />
    </div>
  );
}
