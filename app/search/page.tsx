import type { Metadata } from "next";
import ArticleGrid from "@/components/ui/ArticleGrid";
import SearchBar from "@/components/ui/SearchBar";
import { searchArticles } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search StackFromZero tutorials on React, Spring Boot, deployment, and full-stack development.",
  alternates: { canonical: "/search" },
  // Query-string result pages shouldn't be indexed.
  robots: { index: false, follow: true },
};

type SearchPageProps = {
  searchParams: { q?: string };
};

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = (searchParams.q ?? "").trim();
  const results = query ? searchArticles(query) : [];

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 text-center mb-5">
          <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary mb-3 px-3 py-2">
            <i className="bi bi-search me-1" aria-hidden="true" />
            Search
          </span>
          <h1 className="display-5 fw-bold mb-3">
            {query ? (
              <>
                Results for <span className="text-primary">&ldquo;{query}&rdquo;</span>
              </>
            ) : (
              "Search the site"
            )}
          </h1>
          <p className="lead text-secondary-custom mb-4 mx-auto" style={{ maxWidth: "600px" }}>
            {query
              ? `${results.length} ${results.length === 1 ? "tutorial matches" : "tutorials match"} your search.`
              : "Find tutorials on React, Spring Boot, deployment, and full-stack development."}
          </p>
          <div className="d-flex justify-content-center">
            <SearchBar
              className="site-search d-flex align-items-center"
              defaultValue={query}
              autoFocus
            />
          </div>
        </div>
      </div>

      {query ? (
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <ArticleGrid
              articles={results}
              emptyMessage={`No tutorials match “${query}”. Try a different keyword, or browse the full blog.`}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
