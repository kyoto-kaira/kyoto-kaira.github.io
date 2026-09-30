# kyoto-kaira.github.io
京都大学人工知能研究会KaiRAの公式Webサイトです。

ビルド不要の静的サイト（HTML / CSS / 少量の JavaScript）で、GitHub Pages から公開しています（デプロイ方法は後述）。
外部CSSフレームワークは使っていません。デザインの方針は [DESIGN.md](./DESIGN.md) を参照してください。

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
├── .github/workflows/      本番・PRプレビューのデプロイ（GitHub Actions）
├── assets/icons/sprite.svg 共通アイコン（SVGスプライト）
├── assets/decor/           ヒーローの抽象装飾（nodes / geometric / lines）
├── assets/images/          画像（内訳は下記）
├── assets/nfYYYY/          各年度のNF特設ページで使う作品画像・音声
├── assets/docs/            会誌のPDF
└── _templates/page.html    新規ページのひな形（公開対象外）
```

### 画像の置き場所と命名規則

```
assets/images/
├── brand/            KaiRAのロゴ、favicon、apple-touch-icon、SNS共有用画像（og-image.jpg）
├── logo/             外部サービス・協賛企業のロゴ（x, github, qiita, rist …）
├── advisor/          顧問の先生の写真
├── member/           運営メンバーの写真
├── past-president/   歴代会長の写真
├── book/             輪読本の表紙
├── journal/          会誌の表紙（nfYYYY.png）
├── photo/            活動写真の元画像（ニュース・紹介文で使う）
└── strip/            トップページのフォトストリップ用に高さ480pxへ縮小した写真
```

- ファイル名は英小文字・数字・ハイフンだけで付けます（例: `deep-learning-2.jpg`）。大文字やアンダースコアは使いません。
- 拡張子は小文字にし、JPEGは `.jpg` に統一します。
- 行事の写真は `nfYYYY-a.jpg`（11月祭）や `YYYYMMDD-a.jpg`（日付）のように、年度または日付がわかる名前にします。
- フォトストリップに載せる写真は、`photo/` の元画像と同じ名前で縮小版を `strip/` に置きます。

## よくある更新作業

### ニュースを追加する
`news.html` の該当する年の `<ol class="news-list">` の先頭に `<li class="news-item">` を追加します。
ファイル内のコメントにコピー用のひな形があります。新しい年になったら `<section class="news-year">` を複製し、上部の年別ナビにも1行追加してください。

### 今期の輪読本を差し替える
`index.html` の「〇〇年前期に読む本」セクションで、見出しと `<ol class="book-shelf__list">` 内の `<li class="book">`を書き換えます。表紙画像は `assets/images/book/` に置きます。
冊数に応じて列数（2〜4列）と全体の幅は自動で決まるので、`<li>` を増減するだけで済みます。表紙はトリミングせず原本の比率で表示されます。

### トップページの活動写真（フォトストリップ）を差し替える
`index.html` の `<ul class="photo-strip__group">` 内の `<li>` を増減します。写真は横に自動で流れ、ループ用の複製と速度の計算は `js/site.js` が自動で行います（PCではカーソルを乗せると一時停止）。
- 写真は `assets/images/strip/` に **高さ480pxのJPEG**（1枚50〜70KB程度）で置きます。元の大きな写真をそのまま使うと、トップページが重くなります。
- `<img>` には実際の `width`／`height`（高さ480のときの幅）と、写真の内容がわかる `alt` を付けます。
- 速さは `js/site.js` の `STRIP_SPEED`（px/秒）で変えられます。

### 運営メンバーを更新する
`about.html` の「運営メンバー」内の `<article class="profile">` を編集します。写真は `assets/images/member/` に置きます。退任した会長は「歴代会長」の `<details class="disclosure">` に追加し、写真を `assets/images/past-president/` へ移してください。
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

## デプロイ

GitHub Actions で `gh-pages` ブランチにデプロイしています。

- `master` への push: `.github/workflows/deploy.yml` がサイト本体を `gh-pages` ブランチのルートにデプロイします。
- Pull Request: `.github/workflows/pr-preview.yml` が PR ごとのプレビューを `gh-pages` ブランチの `pr-preview/pr-<番号>/` にデプロイします。
  - URL: `https://kyoto-kaira.github.io/pr-preview/pr-<番号>/`（PR にコメントで URL が投稿されます）
  - PR がクローズ/マージされるとプレビューは自動で削除されます。
  - フォークからの PR ではプレビューは作成されません。

### 初期設定（リポジトリ管理者向け）

1. `master` にマージ後、`Deploy site` ワークフローが実行され `gh-pages` ブランチが作成されるのを待つ。
2. Settings → Pages → Build and deployment で Source を「Deploy from a branch」、Branch を `gh-pages` / `/ (root)` に変更する。
3. Settings → Actions → General → Workflow permissions が「Read and write permissions」になっていることを確認する。

## ローカルで確認する

```sh
# 方法1: Python
cd .. && python3 -m http.server 8000
# → http://localhost:8000/kyoto-kaira.github.io/

# 方法2: Node（test/run.sh 参照）
npm install express --save-dev && node test/page.js
```

`file://` で直接開くとアイコン（SVGスプライト）が表示されないため、必ずローカルサーバー経由で確認してください。
