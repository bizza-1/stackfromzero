"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type SearchBarProps = {
  /** Pre-fill the input — e.g. the current query on the results page. */
  defaultValue?: string;
  /** Wrapper class. Defaults to the hero placement (absolute, top-right). */
  className?: string;
  /** Focus the input on mount. */
  autoFocus?: boolean;
};

export default function SearchBar({
  defaultValue = "",
  className = "hero-search d-flex align-items-center",
  autoFocus = false,
}: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form className={className} onSubmit={submit} role="search" aria-label="Search site">
      <input
        className="form-control form-control-search me-2"
        type="search"
        placeholder="Search tutorials, posts, topics..."
        aria-label="Search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
      />
      <button type="submit" className="btn btn-success btn-search px-3" aria-label="Search">
        <i className="bi bi-search" aria-hidden="true" />
      </button>
    </form>
  );
}
