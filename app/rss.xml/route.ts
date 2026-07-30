import { getAllArticles } from "@/lib/mdx";
import { absoluteUrl, siteConfig, toISODate } from "@/lib/utils";

export const dynamic = "force-static";

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

export function GET() {
  const articles = getAllArticles();

  const items = articles
    .map(
      (a) => `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${absoluteUrl(a.url)}</link>
      <guid isPermaLink="true">${absoluteUrl(a.url)}</guid>
      <description>${escapeXml(a.description)}</description>
      <pubDate>${new Date(toISODate(a.date)).toUTCString()}</pubDate>
${a.tags.map((t) => `      <category>${escapeXml(t)}</category>`).join("\n")}
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${siteConfig.url}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-us</language>
    <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
