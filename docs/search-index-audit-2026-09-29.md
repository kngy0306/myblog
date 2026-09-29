# kona4.com インデックス未登録の調査

調査日: 2026-09-29（日本時間）

Search Consoleのページ登録レポートは2026-09-21時点。公開サイトの確認とURLライブテストは2026-09-29に実施した。

## 9月29日の対応状況

- `sitemap-0.xml` をSearch Consoleへ送信し、「成功しました」「検出されたページ数39」を確認した。39ページの検出は登録完了とは異なる。
- `sitemap-index.xml` も送信・再試行したが「取得できませんでした」のまま。公開HTTP応答は200、XML形式・参照先も正常で、送信時刻付近のCloudflareサンプルログに該当する拒否は見つからなかった。原因は未確定。子サイトマップの直接送信により現行URL一覧の通知は成功している。
- 403対象15ページの「修正を検証」を実行し、「検証: 開始」「開始日: 2026/09/29」を確認した。
- 未認識だった `/blog/di/` の個別登録をリクエストし、Googleの「インデックス登録をリクエスト済み」「優先クロール キューに追加」を確認した。
- `public/_redirects` に旧サイトマップ、旧RSS2パス、対応が確認できた旧記事2件（末尾スラッシュ有無）の301を追加。Photoapp記事内のDocker記事リンクを現行URLへ修正した。コード変更は本番反映前。
- `bun run build` 成功。出力された転送設定、全転送先ファイルの存在、修正リンク、サイトマップ39 URLを確認した。Cloudflare上での実HTTP 301の確認は公開後に実施する。
- `/page/` は旧ページの内容を特定できていないため対応先を保留。wwwのDNS・転送整備も未実施。

以下の「確認結果」は対応前の調査記録。未送信などの記載は調査時点の状態を示す。

## 結論

主要な障害は、Googleのクロールに対して返されていたアクセスエラー。過去90日間の536リクエスト中、413回が「その他のクライアントエラー（4xx）」、20回が5xxだった。ページ登録レポートでは15ページが403により除外され、初検出日は2026-07-25。

現在はサイトマップの39ページすべてが監査用クライアントから200で取得でき、Googleのライブテストでも403対象の代表2ページが取得に成功した。

Cloudflareの監査ログから、9月2日までCloudflare自身のIPアドレスを配信先に指定したDNSレコードが存在し、同日21:41にPagesの正しいCNAMEへ変更されたことを確認した。公式資料がアクセスエラーの原因に挙げる設定と一致し、移行時の障害原因として有力。ただし、Googleが受け取った当時のエラー本文がなく、7月25日からの403すべてをこの設定で説明することはできない。現在のアカウントへのドメイン移管は9月2日で、移管元の履歴は現在のログインでは参照できない。

現在のCloudflareが正規のGooglebotを遮断している証拠は、確認した直近30日のサンプルログにはなかった。手元で再現したPythonクライアントへの403はBrowser Integrity Checkによる拒否と確定したが、過去のGooglebotへの403との同一視はできない。

別の問題として、現在のサイトマップがSearch Consoleに未送信、旧URLの移行用転送が不足、取得成功後も登録されない13ページ、Googleに未認識の現行記事を確認した。

## 登録率の基準

- 現在のサイトマップ: 39ページ（記事34、記事一覧4、About 1）。
- 目標: この39個の正規HTML URLのうち36ページ以上を登録（36 / 39 = 92.3%）。
- Search Consoleで確認できた登録済み現行URL: 2ページ。現在のサイトマップを分母とすると2 / 39 = 5.1%。
- 画面の2 / 35 = 5.7%は、Googleがレポートしている旧URLなども含む別の母集団。
- 登録率を上げるためだけに公開ページを対象から外さず、同じURLリストで推移を比較する。追加・削除時は分母の変更を記録する。
- 転送元、RSS、画像はHTMLページの登録率に含めない。

Googleの登録判断と反映には時間が必要。HTTP 200やライブテスト成功は登録完了を意味しない。

## 確認結果

| 項目 | 観測結果 | 判断 |
| --- | --- | --- |
| 公開サイトマップ39 URL | 39 / 39が200、転送なし | 現時点の通常取得は成功 |
| canonical | 39 / 39でサイトマップURLと一致 | 一括して誤ったURLを正規化する問題は見つからない |
| robots / X-Robots-Tag | 39 / 39でnoindexなし | 一括したインデックス禁止は見つからない |
| robots.txt | 200、User-agent: * にAllow: /、現行サイトマップを記載 | Googleのクロールを許可 |
| 内部リンク | トップから全39 URLへ到達可能 | 孤立ページは見つからない |
| 壊れた内部リンク | Photoapp記事から旧Docker記事へリンク、転送なしで404 | 修正対象 |
| 過去90日のクロール | 536回、4xxが413回（77%）、200は13%、5xxが20回（4%） | 過去の広範囲なアクセス障害 |
| 4xxの表示例の最新日時 | 2026-09-02 10:50、http://kona4.com/ | 全ログの最終発生日時とは断定しない |
| 5xxの表示例 | favicon.svg、favicon.ico、OGP画像など。表示例の最新は2026-08-24 | 配信基盤・接続障害も調査対象 |
| ホストの状態 | 過去にサーバー接続の不合格率がしきい値超過、最近は許容範囲 | 最近の正常化を示すが再発原因は未確定 |

### 403と現在のGoogleアクセス

`https://kona4.com/blog/type-object/` の保存済み検査結果:

- 2026-08-24 13:16:57、スマートフォン用Googlebot。
- クロール許可「はい」、ページ取得「403で失敗」。
- 参照元は `/2/`、参照元サイトマップは検出なし。

同URLのライブテスト（2026-09-29 09:37:40）:

- Google検査ツール（スマートフォン）から取得成功。
- クロール・インデックス登録を許可。
- 自己参照canonicalを認識。
- 「URLはGoogleに登録できます」。

記事一覧 `https://kona4.com/2/` も過去は403だったが、2026-09-29 09:41のライブテストで「URLはGoogleに登録できます」。ライブテストの取得元は通常のGooglebotとは異なるため、これだけで全Googlebotへの恒久的復旧とは判断しない。

手元の同一環境からUser-Agentを変えた比較:

| クライアント識別子 | トップ・type-object記事の応答 |
| --- | --- |
| Mozilla/5.0 (compatible; KonaSiteAudit/1.0) | 200 |
| Python-urllib/3.9 | 403、本文 `error code: 1010` |
| Googlebot desktop / smartphoneのUser-Agent | 代表記事・一覧・robots・サイトマップが200 |

Cloudflare公式資料は1010をブラウザの識別情報に基づく拒否と説明し、Browser Integrity Checkを案内している。これはCloudflareでクライアント依存の拒否がある根拠になる。ただし、GooglebotのUser-Agentを名乗るローカルリクエストはGoogleのIPからの実アクセスではない。Googleの過去の403も1010だったという証拠は得られていない。

### Cloudflare管理画面で確認した設定と拒否ログ

2026-09-29にログイン済み管理画面を確認した。

| 項目 | 現在の状態 |
| --- | --- |
| カスタムセキュリティルール | 0件 |
| レート制限ルール | 0件 |
| Bot Fight Mode | 無効 |
| Under Attack Mode | 無効 |
| Browser Integrity Check | 有効 |
| AIボットポリシー | 検索・エージェントは許可、トレーニングはDisallow |
| kona4.comの配信先 | CNAME → kona-myblog.pages.dev、プロキシ有効 |
| www.kona4.com | DNSレコードなし。旧www URLの到達性は別途対応対象 |

Security Eventsには、調査中の09:39台のPythonアクセスが「ブラウザ整合性チェック」でブロックされた記録があり、手元で再現した1010の発生源と一致した。

過去30日、User-AgentにGooglebotを含む条件では、表示されたブロック記録は9月17日20:25:31の1件。Cloudflareのネットワーク（AS13335、104.28.222.43）から `/wp-config.php` へのHEADリクエストで、管理ルールによる拒否だった。Googlebotを名乗ることだけでは正規のGoogleクロールと認定できず、この記録を検索クローラの誤ブロックの根拠にはしない。なお、カスタムルールが0件でもCloudflare組み込みの管理ルールは動作している。

表示はサンプルログであり、Googlebotの拒否が存在しないと証明したわけではない。現状でBot対策やBrowser Integrity Checkを全体無効化する根拠は得られていない。

### DNS・ドメイン移行の履歴

| 日時（日本時間） | 確認できた事実 |
| --- | --- |
| 7月25日 | Search Consoleで403の初検出 |
| 8月25日20:28 | 現在のアカウントにkona4.comのゾーン作成、DNSスキャン |
| 9月2日10:50 | Search Consoleの4xx表示例にhttp://kona4.com/への失敗 |
| 9月2日21:24:37 | 別のCloudflareアカウントから現アカウントへのドメイン移管成功 |
| 9月2日21:41:41 | 下記4レコードを削除し、PagesへのCNAMEを作成 |
| 9月2日21:42〜21:44 | Pages独自ホスト名の有効化、証明書の作成・配信 |
| 9月29日 | 現行39 URLの200と代表2 URLのGoogleライブテスト成功 |

旧監査ログのDNS削除イベントに記録されていた値:

| 種別 | 名前 | 削除された配信先 | プロキシ |
| --- | --- | --- | --- |
| A | kona4.com | 172.67.144.117 | 有効 |
| A | kona4.com | 104.21.47.46 | 有効 |
| AAAA | kona4.com | 2606:4700:3034::6815:2f2e | 有効 |
| AAAA | kona4.com | 2606:4700:3031::ac43:9075 | 有効 |

同時刻に作成された新レコードは `CNAME kona4.com → kona-myblog.pages.dev`（プロキシ有効）。現在のDNS画面でもこの値を確認した。

旧IPはCloudflareの公開IP範囲に含まれる。Cloudflare公式は、CloudflareのIPをAレコードの接続先に指定する構成をError 1000の原因としている。そのため、旧DNSはアクセス障害につながる有力な問題設定だったと判断する。ただし、そのDNSの有効期間全体、移管元の設定、Googleが受け取ったエラー本文は未確認で、Error 1000の実発生や7月からの全403との因果関係は未確定。

現在のアカウント選択画面には1アカウントのみ表示され、移管元アカウントの履歴は参照できなかった。7〜8月の原因をさらに確定するには移管元の設定変更履歴・配信ログが必要。既知のDNS問題は9月2日に修正されており、再発監視とGoogleの再クロールを進める段階にある。

### サイトマップの移行漏れ

Search Consoleの送信済み一覧は次の2件のみ:

| 送信済みURL | 最終読み込み | 現在の通常取得 |
| --- | --- | --- |
| https://kona4.com/sitemap.xml | 2021-01-30 | 404 |
| https://kona4.com/index.xml | 2021-01-29 | 404 |

現行の `https://kona4.com/sitemap-index.xml` と子ファイル `https://kona4.com/sitemap-0.xml` は200で取得できる。robots.txtにも宣言されているが、Search Consoleには送信されていない。未送信だけでクロールできなくなるわけではないものの、Googleへの現行URL一覧の通知・把握を改善する明確な対応箇所。

### 404と旧リンク

Search Consoleの404は次の4件。通常の監査用User-Agentで現在の404も確認した。

| 旧URLパス | 対応案 |
| --- | --- |
| /page/ | 旧一覧ページの意味を確認し、対応する現行一覧へ301 |
| /page/index.xml | 旧フィードの意味を確認し、現行RSSへの301を検討 |
| /index.xml | /rss.xmlへの301を検討 |
| /post/2023/12/retrospective/ | 対応記事 /blog/retrospective_2023/ への301 |

現行Photoapp記事内にも `/post/2021/09/2021-09-26-docker/` へのリンクが残っており404。記事内リンクを `/blog/2021-09-26-docker/` に直し、旧URLにも301を用意する。

旧URLは記事単位で対応付ける。削除済みで対応内容のないURLは404/410を維持し、すべてをトップへ転送しない。

### クロール済み・インデックス未登録

13ページは403と別の登録状態。代表の `/blog/2022-01-22-fish/` は2026-06-15にGooglebotが取得成功、インデックス許可あり、Google選択canonicalも同URLだったが未登録。アクセス制限やcanonicalの誤設定だけでは説明できない。

内容の充実度・独自性・情報の更新状況・関連する内部リンクをページごとに評価する必要がある。Googleは詳細な登録見送り理由を開示していないため、品質不足と断定しない。確認した記事には個人の振り返り、過去バージョンの技術解説、チュートリアル実践記が含まれる。バージョンや再検証日、実際に遭遇した問題と解決結果を必要に応じて追記する。

### レポートの対象外にある現行URL

現行39 URLのうち、今回読み取った登録済み・403・クロール済み未登録の計30 URLに現れなかったURLは9件。

- /4/
- /blog/2021-01-08-first/
- /blog/2021-01-11-retrospective/
- /blog/2021-01-12-dns/
- /blog/2021-01-13-gooutput/
- /blog/2021-01-16-gooutput/
- /blog/2021-01-18-retrospective/
- /blog/di/
- /blog/usecontext/

このうち `/blog/di/` を個別検査したところ「URLがGoogleに認識されていません」、過去のクロール・参照サイトマップともなし。他の8件も未認識と断定するには個別検査が必要。

## 対応の優先順位と完了条件

1. **正常な配信状態を維持する。** 現在のPages向けCNAMEを維持し、Googleの実アクセスと403・5xxの再発を確認する。現在の設定・ログ確認は実施済みで、広範囲なセキュリティ解除は推奨しない。拒否が再発した場合は正規Googleクローラであることと拒否した機能を特定し、必要な例外を限定する。7〜8月の厳密な原因確定には移管元アカウントの履歴が必要だが、サイトマップ送信と再クロールは並行して進められる。
2. **現行サイトマップを送信する。** `https://kona4.com/sitemap-index.xml` をSearch Consoleへ送信。取得成功と39ページの認識を確認する。旧 `/sitemap.xml` の301も整備する。
3. **旧URL移行と内部リンクを修正する。** 内容が対応する旧記事から現行記事への301、旧RSSの転送、Photoapp記事のリンク修正を実施する。旧www URLについてもDNS・証明書・https://kona4.com/への転送を整備する。公開後に転送先の200とcanonicalを確認する。
4. **403対象を再評価する。** 対象URLのライブテストとCloudflareログで取得成功を確認後、403レポートの「修正を検証」を開始。主要記事の登録リクエストを実施する。
5. **クロール済み未登録13ページとレポートにない9ページを追跡する。** サイトマップ送信後の検出・再クロールを確認し、再取得されても未登録が続く記事を個別改善する。登録のためだけの更新日変更は避ける。
6. **登録率を確認する。** 同じ39 URLリストで週次に登録数、403件数、未認識件数を確認。36ページ以上を達成条件とする。Googleの処理には日数・週数がかかることがあり、達成時期や登録自体を保証できない。

調査時点では90%の目標は未達成。Cloudflareの現行設定・拒否ログ・移行履歴の調査を完了し、9月2日に修正済みの問題DNS設定を確認した。7月からの全403の発生源は、移管元の記録不足により未確定。続行依頼を受けて実施したGoogleへの送信・修正検証・コード変更は冒頭に記録する。

## 参照

- [Search Console ページ登録レポート](https://search.google.com/search-console/index?resource_id=sc-domain%3Akona4.com)
- [Search Console サイトマップ](https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Akona4.com)
- [Search Console クロール統計](https://search.google.com/search-console/settings/crawl-stats?resource_id=sc-domain%3Akona4.com)
- [Google: HTTPステータスとクロールへの影響](https://developers.google.com/crawling/docs/troubleshooting/http-status-codes)
- [Google: ページのインデックス登録レポート](https://support.google.com/webmasters/answer/7440203)
- [Cloudflare: Error 1010](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1010/)
- [Cloudflare: Error 1000](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1000/)
- [Cloudflare: 公開IP範囲](https://www.cloudflare.com/ips/)
- [Cloudflare: Browser Integrity Check](https://developers.cloudflare.com/waf/tools/browser-integrity-check/)
- [Cloudflare: 検証済みボットを許可するルール](https://developers.cloudflare.com/waf/custom-rules/use-cases/allow-traffic-from-verified-bots/)
