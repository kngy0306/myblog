import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import satori, { type SatoriOptions } from "satori";
import sharp from "sharp";
import fs from "fs/promises";
import type { ReactElement } from "react";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { id: post.id },
  }));
}

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  // Get blog post
  const posts = await getCollection("blog");
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return new Response("Post not found", { status: 404 });
  }

  // Load fonts
  const fontRegular = await fs.readFile("./public/fonts/NotoSansJP-Regular.ttf");
  const fontBold = await fs.readFile("./public/fonts/NotoSansJP-Bold.ttf");

  const titleFontSize = 55;

  // Align the line with the visible edge of the first glyph, including its side bearing.
  const firstGlyphSvg = await satori(
    {
      type: "div",
      props: {
        style: { fontFamily: "Noto Sans JP", fontSize: titleFontSize, fontWeight: 700 },
        children: Array.from(post.data.title)[0],
      },
    } as ReactElement,
    {
      width: titleFontSize * 2,
      height: titleFontSize * 2,
      fonts: [{ name: "Noto Sans JP", data: fontBold, weight: 700, style: "normal" }],
    },
  );
  const { info: firstGlyphBounds } = await sharp(Buffer.from(firstGlyphSvg))
    .trim()
    .toBuffer({ resolveWithObject: true });
  const titleInkOffset = Math.abs(firstGlyphBounds.trimOffsetLeft ?? 0);

  // Use the same artwork as the site favicon.
  const logoBuffer = await sharp("./public/favicon.svg").resize(80, 80).png().toBuffer();
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
          backgroundColor: "#e4e7eeff",
          color: "#1E293B",
          padding: "54px 72px",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                width: "100%",
                justifyContent: "center",
                flex: 1,
                paddingBottom: "24px",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      width: "180px",
                      height: "6px",
                      backgroundColor: "#812990",
                      marginBottom: "12px",
                      marginLeft: titleInkOffset,
                    },
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      width: "100%",
                      fontSize: titleFontSize,
                      fontWeight: 700,
                      lineHeight: 1.3,
                      wordBreak: "break-word",
                    },
                    children: post.data.title,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexShrink: 0,
              },
              children: [
                {
                  type: "img",
                  props: {
                    src: logoBase64,
                    style: {
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                    },
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "32px",
                      fontWeight: 700,
                    },
                    children: "こなぶろぐ",
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
