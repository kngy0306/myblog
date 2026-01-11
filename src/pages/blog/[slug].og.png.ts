import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import satori, { type SatoriOptions } from "satori";
import sharp from "sharp";
import fs from "fs/promises";
import type { ReactElement } from "react";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.slug },
  }));
}

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;

  // Get blog post
  const posts = await getCollection("blog");
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return new Response("Post not found", { status: 404 });
  }

  // Load fonts
  const fontRegular = await fs.readFile("./public/fonts/NotoSansJP-Regular.ttf");
  const fontBold = await fs.readFile("./public/fonts/NotoSansJP-Bold.ttf");

  // Load logo and convert to base64
  const logoBuffer = await fs.readFile("./public/logo.png");
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  // Create SVG using satori
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "1200px",
          height: "630px",
          display: "flex",
          fontFamily: "Noto Sans JP",
          flexDirection: "column",
          backgroundImage: "linear-gradient(135deg, #e8d4ff, #c8f8f0)",
          padding: "60px",
          position: "relative",
        },
        children: [
          // Main title
          {
            type: "div",
            props: {
              style: {
                fontSize: "60px",
                fontWeight: 700,
                color: "#000",
                marginBottom: "auto",
              },
              children: post.data.title,
            },
          },
          // Footer area
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                // justifyContent: "space-between",
                justifyContent: "flex-start",
                alignItems: "flex-end",
                width: "100%",
                gap: "20px",
              },
              children: [
                // Right bottom: Logo
                {
                  type: "img",
                  props: {
                    src: logoBase64,
                    style: {
                      width: "80px",
                      height: "80px",
                    },
                  },
                },
                // Left bottom: Blog name and URL
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: "32px",
                            fontWeight: 500,
                            color: "#000",
                          },
                          children: "こなぶろぐ",
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: "24px",
                            color: "#555555",
                          },
                          children: "https://kona4.com/",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    } as ReactElement,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Noto Sans JP",
          data: fontRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Noto Sans JP",
          data: fontBold,
          weight: 700,
          style: "normal",
        },
      ],
    } as SatoriOptions,
  );

  // Convert SVG to PNG
  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
