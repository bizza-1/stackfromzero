import type { MetadataRoute } from "next";
import { getAllArticles, getAllTags } from "@/lib/mdx";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/newsletter"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.3 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: absoluteUrl(a.url),
    lastModified: new Date(a.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const tagRoutes: MetadataRoute.Sitemap = getAllTags().map((t) => ({
    url: absoluteUrl(`/tags/${t.slug}`),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...articleRoutes, ...tagRoutes];
}
