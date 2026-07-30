import Link from "next/link";
import Image from "next/image";
import type { Article } from "contentlayer/generated";
import { formatDate, toISODate } from "@/lib/utils";
import TagBadge from "./TagBadge";

type ArticleCardProps = {
  article: Article;
  /** Renders as a larger, prominent card for the homepage lead item. */
  featured?: boolean;
};

export default function ArticleCard({ article }: ArticleCardProps) {
  // Use the article's cover image when set; otherwise fall back to the
  // branded dynamic OG image so every card has a topic-relevant header.
  const cover =
    article.image ??
    `/api/og?title=${encodeURIComponent(article.title)}`;

  // SVG covers and the dynamic OG route are served as-is (Next's image
  // optimizer doesn't process SVG and the OG route is already an image).
  const unoptimized = !article.image || article.image.endsWith(".svg");

  return (
    <article className="card article-card h-100 bg-card border-custom rounded-3 overflow-hidden">
      <Link
        href={article.url}
        className="article-card-cover d-block position-relative"
        aria-hidden="true"
        tabIndex={-1}
      >
        <Image
          src={cover}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-fit-cover"
          // The OG route is a dynamic image; skip Next's optimizer for it.
          unoptimized={unoptimized}
        />
      </Link>

      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex flex-wrap gap-2 mb-3">
          {article.tags.slice(0, 3).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>

        <h3 className="card-title h5 fw-bold mb-2">
          <Link
            href={article.url}
            className="stretched-link text-body text-decoration-none"
          >
            {article.title}
          </Link>
        </h3>

        <p className="card-text text-secondary-custom flex-grow-1 mb-3">
          {article.description}
        </p>

        <div className="d-flex align-items-center gap-3 text-secondary-custom small mt-auto">
          <time dateTime={toISODate(article.date)}>
            <i className="bi bi-calendar3 me-1" aria-hidden="true" />
            {formatDate(article.date)}
          </time>
          <span>
            <i className="bi bi-clock me-1" aria-hidden="true" />
            {article.readingTime} min read
          </span>
        </div>
      </div>
    </article>
  );
}
