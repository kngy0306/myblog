// @ts-check
import {
  defineConfig,
  fontProviders,
  passthroughImageService,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import remarkBreaks from "remark-breaks";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://kona4.com",
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [remarkBreaks],
  },
  image: {
    service: passthroughImageService(),
  },

  integrations: [mdx(), react()],

  fonts: [
    {
      provider: fontProviders.google(),
      name: "Noto Sans JP",
      cssVariable: "--font-noto-sans-jp",
    },
  ],
});
