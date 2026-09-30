# kyoto-kaira.github.io
京都大学人工知能研究会KaiRAの公式Webサイトです。

ビルド不要の静的サイト（HTML / CSS / 少量の JavaScript）で、GitHub Pages から公開しています（デプロイ方法は後述）。
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
├── .github/workflows/      本番・PRプレビューのデプロイ（GitHub Actions）
├── assets/icons/sprite.svg 共通アイコン（SVGスプライト）
├── assets/decor/           ヒーローの抽象装飾（nodes / geometric / lines）
├── assets/                 画像・PDF・音声
└── _templates/page.html    新規ページのひな形（公開対象外）
```

## デザインの約束事

目指すのは「AI学生団体らしさ」を記号で表すことではなく、**情報設計が整理されていて、技術・研究を扱う団体らしい知性を感じるサイト**です。
写真素材や装飾ではなく、タイポグラフィ・余白・色・構造で見せます。

### 色
- **ブランドカラーは KaiRA Blue `#0171C0`**（`--blue-500`）。青は「強調」に使い、強調したい箇所すべてを青にはしません。
- 大面積の青背景はヒーロー（ページ上部の帯）だけに使います。通常のコンテンツは白〜薄いグレーが基本です。
- 役割ごとのトークンを使います：`--color-accent-*`（リンク・ボタン・現在地）／`--color-brand-*`（ヒーロー等のブランドの面）／それ以外はニュートラル。
- 生の値（`#0171C0`、`24px` など）をコンポーネントやHTMLに直接書かず、`tokens.css` の変数を使います。

### 書体
- 日本語は Noto Sans JP、英字の見出し・UI は Inter（`--font-sans` で自動的に使い分け）。
- 英字ラベル（ABOUT など）は Inter・12px・600・字間 0.08em。**等幅書体や広すぎる字間は使いません**（CLI風・テンプレート風に見えるため）。
- 等幅書体 Geist Mono（`--font-mono`）は、手順番号（STEP 01）など一部の技術的アクセントにだけ使います。

### ヒーロー
- 写真は使いません。全ページ共通で「青系グラデーション＋ごく薄いグリッド＋右端に寄せた抽象装飾」です。
- ページごとの差は装飾の種類だけ：`page-hero--nodes`（About・トップ）／`--geometric`（作品・NF・会誌）／`--lines`（入会案内・News）。装飾は `assets/decor/*.svg`。

### 形・影・カード
- 角丸は 8px（ナビ・画像）／10px（ボタン）／12px（カード）／16px（CTAなど大きな面）。ピル型はタグ・ステータスなど小さな補助UIに限ります。
- 影はごく控えめ（`0 8px 30px rgba(15,23,42,.04)`）。構造は基本的に1pxの薄い枠線で表します。
- カードは必要な箇所に限定し、カードの中にカードやピルUIを多数入れません。
- 書籍は `book-card` で「カードではなく本を目立たせる」：表紙を大きく原本の比率で表示し、影は表紙そのものに薄く付けます。

### ナビゲーション・操作
- ページ内ジャンプは `section-nav`（文字中心・背景透明・選択中のみ青文字＋下線）。操作ボタンのようには見せません。
- ボタンの重要度はサイズではなくスタイルで示します：`button--primary`（1画面に1〜2個まで）／`button--tinted`（カード内の主操作）／`button--secondary`（補助）。
- 入会案内への導線は白背景の `join-card`。広告バナーのような大きな青い帯は使いません。
- タップできる要素は最小 44×44px（`--tap-target`）。

### その他
- インライン `style=""` は使わず、既存のクラスか新しいコンポーネントで表現します。
- ダークモード・高コントラスト設定には `tokens.css` で自動対応しています。

## よくある更新作業

### ニュースを追加する
`news.html` の該当する年の `<ol class="news-list">` の先頭に `<li class="news-item">` を追加します。
ファイル内のコメントにコピー用のひな形があります。新しい年になったら `<section class="news-year">` を複製し、上部の年別ナビにも1行追加してください。

### 今期の輪読本を差し替える
`index.html` の「〇〇年前期に勉強する本」セクションで、見出しと `<ul class="book-shelf__grid">` 内の `<li>`（`book-card`）を書き換えます。表紙画像は `assets/images/book/` に置きます。
冊数に応じて列数（2〜4列）と全体の幅は自動で決まるので、`<li>` を増減するだけで済みます。表紙はトリミングせず原本の比率で表示されます。

### トップページの活動写真（フォトストリップ）を差し替える
`index.html` の `<ul class="photo-strip__group">` 内の `<li>` を増減します。写真は横に自動で流れ、ループ用の複製と速度の計算は `js/site.js` が自動で行います（PCではカーソルを乗せると一時停止）。
- 写真は `assets/images/strip/` に **高さ480pxのJPEG**（1枚50〜70KB程度）で置きます。元の大きな写真をそのまま使うと、トップページが重くなります。
- `<img>` には実際の `width`／`height`（高さ480のときの幅）と、写真の内容がわかる `alt` を付けます。
- 速さは `js/site.js` の `STRIP_SPEED`（px/秒）で変えられます。

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
