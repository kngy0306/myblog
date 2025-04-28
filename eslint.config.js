import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["**/dist", "**/node_modules", "**/.astro"],
  },

  ...eslintPluginAstro.configs.recommended,
  ...tseslint.configs.recommended,

  {
    plugins: {
      "jsx-a11y": jsxA11y,
    },
  },
  ...eslintPluginAstro.configs["jsx-a11y-recommended"],

  eslintConfigPrettier,
];
