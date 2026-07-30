import Link from "next/link";
import { tagToSlug } from "@/lib/utils";

type TagBadgeProps = {
  tag: string;
  /** When false, render a non-interactive badge (e.g. inside a linked card). */
  linked?: boolean;
};

export default function TagBadge({ tag, linked = true }: TagBadgeProps) {
  const className =
    "tag-badge badge rounded-pill text-primary border border-primary bg-transparent fw-normal";

  if (!linked) {
    return <span className={className}>{tag}</span>;
  }

  return (
    <Link
      href={`/tags/${tagToSlug(tag)}`}
      className={`${className} text-decoration-none`}
    >
      {tag}
    </Link>
  );
}
