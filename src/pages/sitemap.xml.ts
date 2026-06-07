import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const SITE = "https://kona4.com";

export const GET: APIRoute = async () => {
  const posts = await getCollection("blog");

  const staticPaths = ["/", "/about/"];
  const postPaths = posts.map((p) => `/blog/${p.id}/`);

  const urls = [
    ...staticPaths.map((path) => ({
      loc: `${SITE}${path}`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: path === "/" ? "1.0" : "0.7",
    })),
    ...posts.map((post, i) => ({
      loc: `${SITE}${postPaths[i]}`,
      lastmod: (post.data.updatedDate ?? post.data.date).toISOString(),
      changefreq: "monthly",
      priority: "0.8",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
