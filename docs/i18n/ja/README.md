<p align="center"><a href="../../../README.md">English</a> · <a href="../ko/README.md">한국어</a> · <b>日本語</b> · <a href="../zh-Hans/README.md">简体中文</a> · <a href="../zh-Hant/README.md">繁體中文</a> · <a href="../es/README.md">Español</a> · <a href="../pt/README.md">Português</a> · <a href="../fr/README.md">Français</a> · <a href="../de/README.md">Deutsch</a> · <a href="../ru/README.md">Русский</a> · <a href="../it/README.md">Italiano</a></p>

<p align="center"><em>これは<a href="../../../README.md">README.md</a>の翻訳です。<br/>英語版が原文であり、より最新の情報が含まれている場合があります。</em></p>


<h1 align="center">vault-doctor</h1>

<p align="center">
  <a href="https://github.com/epicsagas/vault-doctor/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/epicsagas/vault-doctor/ci.yml?style=for-the-badge&labelColor=0d1117&color=58a6ff&logo=github&logoColor=white" /></a>
  <a href="https://www.npmjs.com/package/vault-doctor"><img alt="npm" src="https://img.shields.io/npm/v/vault-doctor?style=for-the-badge&labelColor=0d1117&color=cb3837&logo=npm&logoColor=white" /></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-Apache--2.0-3fb950?style=for-the-badge&labelColor=0d1117" /></a>
  <a href="https://github.com/epicsagas/vault-doctor/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/epicsagas/vault-doctor?style=for-the-badge&labelColor=0d1117&color=ffd700&logo=github&logoColor=white" /></a>
</p>

<p align="center"><b>Obsidian vaultの問題を見つけて、ノートが壊れる前に修正</b></p>

<p align="center">
`vault-doctor` は、Obsidian vault内の壊れたwikilinks、不正なfrontmatter、欠落したタグ、孤立ファイル、古いマーカーをスキャンし、可能なものは自動修正します。
</p>

## クイックスタート

```bash
npm install -g vault-doctor
vault-doctor scan /path/to/vault    # vaultの健全性をチェック
```

## 使い方

### スキャン

```bash
vault-doctor scan /path/to/vault
vault-doctor scan /path/to/vault --json
vault-doctor scan /path/to/vault --severity high
vault-doctor scan /path/to/vault --format compact
```

### 修正

```bash
vault-doctor fix /path/to/vault           # 問題を自動修正
vault-doctor fix /path/to/vault --dry-run  # 書き込まずにプレビュー
```

## チェック項目

| チェック | 重要度 | 自動修正 |
|-------|----------|----------|
| 不正なYAML frontmatter | critical | はい |
| frontmatterの欠落 | medium | はい |
| タグの競合（相互排他的なペア） | high | はい |
| レイヤータグの欠落（`layer/raw`、`layer/wiki`） | medium | はい |
| wikiノートの`created`日付欠落 | low | はい |
| 壊れたwikilinks | medium | いいえ |
| 孤立ファイル（被リンクなし） | low | いいえ |
| 古いマーカー（DRAFT、OUTDATEDなど） | low | いいえ |

## 比較

| | vault-doctor | obsidian-linter | lkits wikilinks checker |
|-|-------------|----------------|------------------------|
| 壊れたwikilinks | ✅ | ❌ | ✅ |
| frontmatterの修復 | ✅ 自動修正 | ✅ ルールベース | ❌ |
| タグ競合の検出 | ✅ | ✅ | ❌ |
| 孤立ファイルの検出 | ✅ | ❌ | ❌ |
| CLI / スクリプト実行 | ✅ ヘッドレス | ❌ プラグインのみ | ❌ プラグインのみ |
| 設定ファイル | ✅ `vault-doctor.json` | ✅ プラグイン設定 | ✅ プラグイン設定 |

## 設定

vaultのルートに `vault-doctor.json` を作成します：

```json
{
  "excludeDirs": [".obsidian", ".git", ".alcove", "_template"],
  "layers": {
    "raw": ["99-Archives", "00-Inbox", "02-Areas", "03-Resources"],
    "wiki": ["10-Zettelkasten"]
  },
  "requiredTags": {
    "raw": ["layer/raw"],
    "wiki": ["layer/wiki"]
  },
  "mutuallyExclusiveTags": [
    ["status/seed", "status/evergreen"],
    ["layer/raw", "layer/wiki"]
  ],
  "staleMarkers": ["DRAFT", "OUTDATED", "DEPRECATED", "DO NOT USE"]
}
```

デフォルトはPARA構造を持つKarpathy 3層（Raw/Wiki/Graph）vault向けに設定されています。

## トラブルシューティング

<details>
<summary>インストール後に <code>command not found</code> と表示される</summary>

npmのグローバルbinがPATHに含まれていることを確認してください：

```bash
npm config get prefix
# <prefix>/bin をPATHに追加
```
</details>

<details>
<summary>初回スキャンで問題が多すぎる</summary>

重要度が高いもののみを確認してください：

```bash
vault-doctor scan /path/to/vault --severity high
```
</details>

## コントリビュート

[CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。PRを歓迎します — `good first issue` ラベルのオープンなissueを確認してください。

## ライセンス

[Apache-2.0](LICENSE) © 2026 epicsagas
