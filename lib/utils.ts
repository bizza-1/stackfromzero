import { format, parseISO } from "date-fns";

/** Site-wide constants used for SEO, canonical URLs, and OG metadata. */
export const siteConfig = {
  name: "StackFromZero",
  title: "StackFromZero Learn React & Spring Boot from Zero",
  description:
    "Practical React and Spring Boot tutorials for African students and junior developers. Build real full-stack apps, deploy on a budget, and level up your career.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://stackfromzero.com",
  email: "Admin@stackfromzero.com",
  author: {
    name: "frontenddude",
    bio: "Full-stack engineer teaching the stack I wish I had when I started.",
    twitter: "@frontenddude",
    github: "bizza-1/stackfromzero",
    linkedin: "https://in.linkedin.com/company/stackzero",
  },
  ogImage: "/images/author.jpg",
} as const;

export const POSTS_PER_PAGE = 6;

/** Format an ISO date string as a human-readable date. */
export function formatDate(date: string): string {
  return format(parseISO(date), "MMMM d, yyyy");
}

/** Machine-readable ISO date (for <time dateTime> and structured data). */
export function toISODate(date: string): string {
  return parseISO(date).toISOString();
}

/** Build an absolute URL from a path, respecting the configured site URL. */
export function absoluteUrl(path: string): string {
  const base = siteConfig.url.replace(/\/$/, "");
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}

/** Turn an arbitrary tag into a URL-safe slug (matches TagBadge links). */
export function tagToSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/** Reverse a tag slug back to a display label for headings. */
export function slugToTagLabel(slug: string, knownTags: string[]): string {
  const match = knownTags.find((t) => tagToSlug(t) === slug);
  return match ?? slug.replace(/-/g, " ");
}

/** Combine class names, dropping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
