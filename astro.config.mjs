// @ts-check
import { defineConfig, passthroughImageService } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import remarkBreaks from "remark-breaks";
import remarkLinkPreview from "./src/plugins/remark-link-preview.js";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [remarkBreaks, remarkLinkPreview],
  },
  image: {
    service: passthroughImageService(),
  },

  integrations: [
    mdx({
      remarkPlugins: [remarkBreaks, remarkLinkPreview],
    })
  ],
});
