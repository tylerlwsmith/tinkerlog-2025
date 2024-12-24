import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const journal = defineCollection({
  // Load Markdown and MDX files in the `src/content/journal/` directory.
  loader: glob({ base: "./src/content/journal", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string().nullable().optional(),

    tags: z.string().nullable().optional(),
    slug: z.string(),
    published: z.coerce.date(),
  }),
});

export const collections = { journal };
