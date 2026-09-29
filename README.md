# kyoto-kaira.github.io
京都大学人工知能研究会KaiRAの公式Webサイトです。

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
