# CLAUDE.md

このファイルはClaude Codeがこのリポジトリを理解するためのコンテキストを提供します。

## プロジェクト概要

「こなぶろぐ」- Astro 5を使用した個人技術ブログサイト。学習のアウトプットとして運用されている。

## 技術スタック

- **フレームワーク**: Astro 5.7.4
- **UI**: React 19 + Tailwind CSS 4
- **コンテンツ**: MDX (Markdown + JSX)
- **スタイリング**: Tailwind CSS + @tailwindcss/typography
- **フォント**: Noto Sans JP
- **リンター/フォーマッター**: ESLint + Prettier

## ディレクトリ構造

```
src/
├── components/          # UIコンポーネント
│   ├── Header.astro     # サイトヘッダー（ナビゲーション）
│   ├── Footer.astro     # サイトフッター
│   ├── LinkCard.astro   # OGP対応リンクカード
│   └── ui/              # shadcn/ui風コンポーネント（pagination, button）
├── content/
│   ├── config.ts        # コンテンツコレクション定義
│   └── blog/            # ブログ記事（34記事）
├── layouts/
│   ├── Layout.astro     # ベースレイアウト
│   └── BlogLayout.astro # ブログ記事用レイアウト
├── pages/
│   ├── [...page].astro  # トップページ（ページネーション付き記事一覧）
│   ├── 404.astro        # 404エラーページ
│   ├── about/           # Aboutページ
│   └── blog/            # ブログ記事ルーティング
├── styles/
│   └── global.css       # グローバルスタイル（Tailwind設定含む）
├── lib/
│   └── utils.ts         # ユーティリティ関数（cn関数）
└── images/              # 静的画像
```

## 開発コマンド

```bash
pnpm dev      # 開発サーバー起動
pnpm build    # 本番ビルド
pnpm preview  # ビルド結果のプレビュー
pnpm format   # Prettierでフォーマット
```

## コンテンツ管理

### ブログ記事のスキーマ（src/content/config.ts）

```typescript
{
  title: string,        // 必須: 記事タイトル
  date: Date,           // 必須: 公開日
  tags: string[],       // オプション: タグ
  description: string,  // オプション: 説明文
}
```

### 新規記事の追加

1. `src/content/blog/` に新しいディレクトリを作成（例: `2025-01-01-article-name/`）
2. `index.mdx` ファイルを作成
3. フロントマターに `title` と `date` を設定

## パスエイリアス

- `@/*` → `./src/*`（tsconfig.jsonで設定）

## 主要な機能

- **ページネーション**: 10記事/ページでトップページに表示
- **LinkCard**: URLからOGP情報を取得してカード表示（open-graph-scraper使用）
- **レスポンシブ**: モバイル対応レイアウト
- **Markdown拡張**: remark-breaksで改行対応

## 注意事項

- 日本語サイト（lang="ja"）
- サイト名: 「こなぶろぐ」（kona blog）
- Tailwind CSS 4を使用（@tailwindcss/viteプラグイン経由）
