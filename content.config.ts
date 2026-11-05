import { defineCollection, defineContentConfig, z } from "@nuxt/content";

const image = z.object({
  src: z.string().startsWith("/images/").editor({ input: "media" }),
  alt: z
    .string()
    .min(1)
    .describe("Describe the image for readers using a screen reader."),
});
const reference = (collection: string) =>
  z
    .string()
    .min(1)
    .editor({ input: "reference", collection, valueField: "slug" });
const studio = z
  .object({
    blocks: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        type: z.enum(["markdown", "fields"]),
        component: z.string().optional(),
        slot: z.string().optional(),
        field: z.string().optional(),
      }),
    ),
  })
  .optional()
  .editor({ hidden: true });
const asset = {
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(2),
  description: z.string().optional(),
  categories: z.array(z.string()).default([]),
  credit: z.string().default(""),
  visible: z.boolean().default(true),
  order: z.number().nonnegative().default(0),
  creator: z.string().optional(),
  creatorUrl: z.string().url().optional(),
  sourceUrl: z.string().url().optional(),
  originalUrl: z.string().url().optional(),
  license: z.string().optional(),
  licenseUrl: z.string().url().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  changes: z.string().optional(),
  duration: z.string().optional(),
  lesson: reference("blog").optional(),
};
export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: "page",
      source: { include: "pages/**/*.md", prefix: "/" },
      schema: z.object({
        slug: z.string().min(1),
        title: z.string().min(5).max(100),
        description: z.string().min(20).max(200),
        hero: image.optional(),
        callToAction: z
          .object({
            label: z.string().min(1),
            href: z.string().startsWith("/").editor({ input: "internal-link" }),
          })
          .optional(),
      }),
    }),
    blog: defineCollection({
      type: "page",
      source: "blog/**/*.md",
      schema: z.object({
        slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
        title: z.string().min(5).max(100),
        description: z.string().min(20).max(200),
        chapter: z.number().min(1).optional(),
        pubDate: z.string().date(),
        updatedDate: z.string().date().optional(),
        status: z.enum(["draft", "published"]).default("draft"),
        author: reference("authors"),
        categories: z.array(reference("categories")).min(1),
        videos: z.array(reference("videos")).default([]),
        tags: z.array(z.string().min(1)).default([]),
        featured: z.boolean().default(false),
        readingMinutes: z.number().min(1).max(60),
        hero: image.optional(),
        relatedPosts: z.array(reference("blog")).default([]),
        studio,
      }),
    }),
    photos: defineCollection({
      type: "data",
      source: "photos/*.json",
      schema: z.object({ ...asset, image, thumbnail: image.optional() }),
    }),
    videos: defineCollection({
      type: "data",
      source: "videos/*.json",
      schema: z.object({
        ...asset,
        image: image.optional(),
        youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
      }),
    }),
    authors: defineCollection({
      type: "data",
      source: "authors/*.json",
      schema: z.object({
        slug: z.string().min(1),
        name: z.string().min(2),
        role: z.string().min(2),
        bio: z.string().min(20),
        avatar: image.optional(),
        website: z.string().url().optional(),
      }),
    }),
    categories: defineCollection({
      type: "data",
      source: { include: "categories/*.yml", exclude: ["**/.navigation.yml"] },
      schema: z.object({
        slug: z.string().min(1),
        title: z.string().min(2),
        description: z.string().min(20),
        order: z.number().min(1),
      }),
    }),
  },
});
