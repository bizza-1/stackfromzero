import Link from "next/link";
import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  /** Builds the href for a given page number (e.g. page => `/blog?page=${page}`). */
  hrefForPage: (page: number) => string;
};

export default function Pagination({
  currentPage,
  totalPages,
  hrefForPage,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label="Blog pagination" className="mt-5">
      <ul className="pagination justify-content-center">
        <li className={cn("page-item", !hasPrev && "disabled")}>
          <Link
            className="page-link bg-card border-custom"
            href={hasPrev ? hrefForPage(currentPage - 1) : "#"}
            aria-disabled={!hasPrev}
            tabIndex={hasPrev ? undefined : -1}
          >
            <i className="bi bi-chevron-left" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </Link>
        </li>

        {pages.map((page) => (
          <li
            key={page}
            className={cn("page-item", page === currentPage && "active")}
            aria-current={page === currentPage ? "page" : undefined}
          >
            <Link
              className={cn(
                "page-link border-custom",
                page === currentPage ? "bg-primary border-primary" : "bg-card"
              )}
              href={hrefForPage(page)}
            >
              {page}
            </Link>
          </li>
        ))}

        <li className={cn("page-item", !hasNext && "disabled")}>
          <Link
            className="page-link bg-card border-custom"
            href={hasNext ? hrefForPage(currentPage + 1) : "#"}
            aria-disabled={!hasNext}
            tabIndex={hasNext ? undefined : -1}
          >
            <i className="bi bi-chevron-right" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
