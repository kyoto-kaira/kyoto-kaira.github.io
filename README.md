# kyoto-kaira.github.io
京都大学人工知能研究会KaiRAの公式Webサイトです。

ビルド不要の静的サイト（HTML / CSS / 少量の JavaScript）で、GitHub Pages から公開しています。
外部CSSフレームワークは使わず、`css/` 以下の小さなデザインシステムで見た目を統一しています。

## ディレクトリ構成

```
├── index.html / about.html / news.html / works.html / contact.html
├── works/                  NF特設ページ・会誌一覧
├── css/
│   ├── main.css            エントリーポイント（各ページはこれだけを読み込む）
│   ├── tokens.css          色・文字・余白・角丸などのデザイントークン（唯一の定義元）
│   ├── base.css            要素の既定スタイル
│   ├── layout.css          container / section / grid / split などの骨組み
│   ├── utilities.css       例外用の単機能クラス
│   └── components/         部品ごとのスタイル（button, card, profile, news …）
├── js/site.js              ヘッダー・フッター・ナビ・GA・お知らせバー・NF年度ナビ
├── assets/icons/sprite.svg 共通アイコン（SVGスプライト）
├── assets/                 画像・PDF・音声
└── _templates/page.html    新規ページのひな形（公開対象外）
```

## デザインの約束事

- **ブランドカラーは KaiRA Blue `#0171C0`**（`--blue-500`）。
- 色は役割で使い分けます。1つの色に2つの意味を持たせないでください。
  - `--color-accent-*` … 操作できるもの（リンク・ボタン・現在地）
  - `--color-brand-*` … ブランドの「面」（ページ上部の帯・CTA帯・アイコンタイル）
  - それ以外（見出し・本文など）はニュートラル
- 生の値（`#0171C0`、`24px` など）をコンポーネントやHTMLに直接書かず、`tokens.css` の変数を使います。
- ボタンの重要度はサイズではなくスタイルで示します。
  - `button--primary`（塗り）… 1画面に1〜2個まで
  - `button--tinted` … カード内の主操作（「〇〇を試す」など）
  - `button--secondary` … 補助操作（GitHub など）
- 形はシャープに保ちます。角丸は小さく（ボタン 4px／カード 8px が基本）、カプセル形・円形・大きなぼかし影は使いません。
- 書体は本文・見出しが Noto Sans JP、英字ラベル・日付・番号が IBM Plex Mono（`--font-mono`）です。
- タップできる要素は最小 44×44px（`--tap-target`）。
- インライン `style=""` は使わず、既存のクラスか新しいコンポーネントで表現します。
- ダークモード・高コントラスト設定には `tokens.css` で自動対応しています。

## よくある更新作業

### ニュースを追加する
`news.html` の該当する年の `<ol class="news-list">` の先頭に `<li class="news-item">` を追加します。
ファイル内のコメントにコピー用のひな形があります。新しい年になったら `<section class="news-year">` を複製し、上部の年別ナビにも1行追加してください。

### 今期の輪読本を差し替える
`index.html` の「〇〇年前期に勉強する本」セクションで、見出しと `<article class="card">` を書き換えます。表紙画像は `assets/images/book/` に置きます。

### 運営メンバーを更新する
`about.html` の「運営メンバー」内の `<article class="profile">` を編集します。写真は `assets/images/member/` に置きます。退任した会長は「歴代会長」の `<details class="disclosure">` に追加してください。
連絡先の代表者名（`contact.html`）も忘れずに更新します。

### NF特設ページを追加する（毎年）
1. 前年の `works/nfYYYY.html` を複製して内容を書き換える（`<nav data-year-pager="YYYY">` の年も変更）
2. `js/site.js` の `SITE.nfYears` の先頭に1行追加
3. `works.html` の「最新年度」カードを差し替え、前年を「過去のNF特設サイト」へ移動
4. `works/collection_of_journals.html` に会誌を追加
5. `sitemap.xml` に URL を追加

### 全ページにお知らせを出す
`js/site.js` の `SITE.announcement` にオブジェクトを設定すると、全ページ上部にお知らせバーが出ます。不要になったら `null` に戻します。

```js
announcement: { text: "11月祭に出展します！", linkLabel: "特設ページ", href: "works/nf2025.html" }
```

### メニュー・SNSリンクを変える
`js/site.js` の `SITE.nav` / `SITE.social` を編集します（全ページに反映されます）。

## ローカルで確認する

```sh
# 方法1: Python
cd .. && python3 -m http.server 8000
# → http://localhost:8000/kyoto-kaira.github.io/

# 方法2: Node（test/run.sh 参照）
npm install express --save-dev && node test/page.js
```

`file://` で直接開くとアイコン（SVGスプライト）が表示されないため、必ずローカルサーバー経由で確認してください。
