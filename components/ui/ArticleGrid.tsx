"use client";

import type { Article } from "contentlayer/generated";
import ArticleCard from "./ArticleCard";
import { useScrollReveal } from "@/lib/animation/hooks";

type ArticleGridProps = {
  articles: Article[];
  emptyMessage?: string;
};

export default function ArticleGrid({
  articles,
  emptyMessage = "No articles yet. Check back soon.",
}: ArticleGridProps) {
  // Stagger each card in as the grid scrolls into view.
  const ref = useScrollReveal<HTMLDivElement>({
    selector: ".col",
    y: 60,
    stagger: 0.1,
    start: "top 85%",
  });

  if (articles.length === 0) {
    return (
      <div className="alert alert-secondary bg-card border-custom text-secondary-custom">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div ref={ref} className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {articles.map((article) => (
        <div className="col" key={article.slug}>
          <ArticleCard article={article} />
        </div>
      ))}
    </div>
  );
}
