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

## 保存時のESLint

VS Code / Cursorで推奨拡張機能のESLintとAstroをインストールすると、
JavaScript・TypeScript・Astroファイルの保存時にESLintが実行されます。
手動保存（Cmd+S / Ctrl+S）では、自動修正できる項目も修正します。
修正できない問題はエディターの「問題」パネルに表示されます。
