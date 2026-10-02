// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import remarkBreaks from "remark-breaks";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://kona4.com",
  prefetch: true,
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkBreaks],
    }),
  },

  integrations: [
    mdx(),
    react(),
    sitemap({
      filter: (page) => !page.includes("/404"),
    }),
  ],

  fonts: [
    {
      provider: fontProviders.google(),
      name: "Noto Sans JP",
      cssVariable: "--font-noto-sans-jp",
      display: "optional",
      // 日本語フォントのメトリクスによる代替欧文フォントの過剰な拡大を防ぐ。
      optimizedFallbacks: false,
    },
  ],
});
