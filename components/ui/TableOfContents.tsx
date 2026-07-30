"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/mdx";
import { cn } from "@/lib/utils";

type TableOfContentsProps = {
  items: TocItem[];
};

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost heading currently intersecting the viewport band.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // Trigger when a heading is near the top of the viewport.
        rootMargin: "-90px 0px -70% 0px",
        threshold: 0,
      }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Update the hash without a jump.
      history.replaceState(null, "", `#${id}`);
      setActiveId(id);
    }
  };

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="toc">
      <p className="text-uppercase small fw-bold text-secondary-custom mb-3 letter-spacing">
        On this page
      </p>
      <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "ms-3" : ""}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={cn(
                "toc-link d-block ps-2 small",
                activeId === item.id && "active"
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
