import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export const Article = defineDocumentType(() => ({
  name: "Article",
  filePathPattern: "**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    tags: { type: "list", of: { type: "string" }, required: true },
    series: { type: "string", required: false },
    seriesOrder: { type: "number", required: false },
    image: { type: "string", required: false },
    published: { type: "boolean", required: false, default: true },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace(/^.*\//, ""),
    },
    url: {
      type: "string",
      resolve: (doc) =>
        `/blog/${doc._raw.flattenedPath.replace(/^.*\//, "")}`,
    },
    readingTime: {
      type: "number",
      resolve: (doc) => {
        const words = doc.body.raw.trim().split(/\s+/).length;
        return Math.max(1, Math.ceil(words / 200));
      },
    },
    wordCount: {
      type: "number",
      resolve: (doc) => doc.body.raw.trim().split(/\s+/).length,
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Article],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeHighlight, { detect: true, ignoreMissing: true }],
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: { className: ["heading-anchor"] },
        },
      ],
    ],
  },
});
