# MyBlog

This is a my personal blog built with [Astro](https://astro.build/)

[https://kona4.com/](https://kona4.com/)

## Formatting

Use Bun 1.4.4 or later (`mise install` installs the version pinned in `mise.toml`).

```sh
bun install --frozen-lockfile
bun run format        # Format files with bun fmt
bun run format:check  # Check formatting without writing files
```

`bun fmt` uses `.prettierrc.json`. Keep `prettier` and `prettier-plugin-astro` installed:
Astro files are formatted through Bun's Prettier fallback.
