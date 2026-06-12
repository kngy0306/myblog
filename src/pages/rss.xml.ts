import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: "こなぶろぐ",
    description: "学習のアウトプットとして運用している技術ブログ",
    site: context.site ?? "https://kona4.com",
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description ?? "",
      link: `/blog/${post.id}/`,
      categories: post.data.tags ?? [],
    })),
    customData: `<language>ja</language>`,
  });
};
