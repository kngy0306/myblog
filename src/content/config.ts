import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      tags: z.array(z.string()).optional(),
      description: z.string().optional(),
      ogImage: image().optional(),
    }),
});

export const collections = {
  blog: blogCollection,
};
