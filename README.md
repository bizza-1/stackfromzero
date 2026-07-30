# StackFromZero

A developer education blog teaching **React** and **Spring Boot** to African students and junior developers. Built with Next.js 14 (App Router), TypeScript, Bootstrap 5, and MDX content managed by Contentlayer.

## Features

- **MDX articles** with frontmatter, syntax-highlighted code blocks, and copy buttons
- **Dark-mode-first** custom Bootstrap 5 theme (compiled from SCSS)
- **SEO built in** — per-article metadata, Open Graph tags, JSON-LD structured data, dynamic OG images, `sitemap.xml`, `robots.txt`, and an RSS feed
- **Table of contents** with scroll-spy on every article
- **Tag pages** and related-article suggestions
- **Newsletter capture** with a file-backed API route
- **Fully static** article generation for fast loads and cheap hosting

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Bootstrap 5 (custom SCSS) + Bootstrap Icons |
| Content | MDX via Contentlayer2 |
| Code highlighting | rehype-highlight |
| Dates | date-fns |

## Getting started

Requirements: **Node.js 18+**.

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (optional for local dev)
cp .env.example .env.local
# then edit NEXT_PUBLIC_SITE_URL if needed

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Contentlayer generates types and content on the first run and watches for changes.

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Production build (runs Contentlayer, then `next build`) |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Writing an article

Create a new `.mdx` file in [content/](content/). The filename becomes the URL slug (`content/my-post.mdx` → `/blog/my-post`). Add frontmatter:

```mdx
---
title: "Your Article Title"
description: "A one-sentence summary used for SEO and cards."
date: 2026-07-20
tags: ["React", "Tutorial"]
series: "Optional Series Name"
seriesOrder: 1
image: "/images/optional-cover.jpg"
published: true
---

Your MDX content here.
```

### Frontmatter fields

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Article title |
| `description` | yes | Used for SEO and card previews |
| `date` | yes | `YYYY-MM-DD` |
| `tags` | yes | List of strings; drives tag pages |
| `series` | no | Groups related articles |
| `seriesOrder` | no | Order within a series |
| `image` | no | Custom OG/cover image; falls back to a generated one |
| `published` | no | Set `false` to keep a draft out of listings (default `true`) |

### Callouts

A custom `<Callout>` component is available inside MDX:

```mdx
<Callout type="tip" title="Pro tip">
Content goes here. Types: info, tip, warning, danger.
</Callout>
```

## Project structure

```plaintext
app/                 # Next.js App Router pages, API routes, SEO files
  api/newsletter/    # Newsletter capture endpoint
  api/og/            # Dynamic Open Graph image generation
  blog/[slug]/       # Individual article pages
  tags/[tag]/        # Tag archive pages
components/ui/       # Reusable React components
content/             # MDX articles
data/                # Newsletter subscribers (file-backed store)
lib/                 # Content queries and helpers
public/images/       # Static assets
styles/              # SCSS theme, highlight theme, global CSS
```

## Newsletter storage

The `/api/newsletter` route appends subscribers to [data/subscribers.json](data/subscribers.json). This works for local development and single-instance hosting. On serverless or read-only hosting the write will fail gracefully — swap the file store for a real provider (Mailchimp, ConvertKit, a database) before production.

## Deployment

The site builds to static output for articles and runs API routes on the server. It deploys cleanly to **Vercel** (recommended for Next.js) or any Node host. Set `NEXT_PUBLIC_SITE_URL` to your production domain so canonical URLs, the sitemap, and OG images resolve correctly.

## License

MIT — use it, learn from it, build on it.
"# stackfromzero" 
