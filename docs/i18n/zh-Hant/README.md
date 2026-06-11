<p align="center"><a href="../../../README.md">English</a> · <a href="../ko/README.md">한국어</a> · <a href="../ja/README.md">日本語</a> · <a href="../zh-Hans/README.md">简体中文</a> · <b>繁體中文</b> · <a href="../es/README.md">Español</a> · <a href="../pt/README.md">Português</a> · <a href="../fr/README.md">Français</a> · <a href="../de/README.md">Deutsch</a> · <a href="../ru/README.md">Русский</a> · <a href="../it/README.md">Italiano</a></p>

<p align="center"><em>這是 <a href="../../../README.md">README.md</a> 的翻譯版本。<br/>英文版本為權威來源，可能更為最新。</em></p>


<h1 align="center">vault-doctor</h1>

<p align="center">
  <a href="https://github.com/epicsagas/vault-doctor/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/epicsagas/vault-doctor/ci.yml?style=for-the-badge&labelColor=0d1117&color=58a6ff&logo=github&logoColor=white" /></a>
  <a href="https://www.npmjs.com/package/vault-doctor"><img alt="npm" src="https://img.shields.io/npm/v/vault-doctor?style=for-the-badge&labelColor=0d1117&color=cb3837&logo=npm&logoColor=white" /></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-Apache--2.0-3fb950?style=for-the-badge&labelColor=0d1117" /></a>
  <a href="https://github.com/epicsagas/vault-doctor/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/epicsagas/vault-doctor?style=for-the-badge&labelColor=0d1117&color=ffd700&logo=github&logoColor=white" /></a>
</p>

<p align="center"><b>在筆記出問題之前，發現並修復 Obsidian 庫中的問題</b></p>

<p align="center">
`vault-doctor` 會掃描你的 Obsidian 庫，查找損壞的 wikilink、格式錯誤的 frontmatter、缺失的標籤、孤立檔案和過期標記——然後盡可能自動修復。
</p>

## 快速開始

```bash
npm install -g vault-doctor
vault-doctor scan /path/to/vault    # 檢查庫健康狀況
```

## 用法

### 掃描

```bash
vault-doctor scan /path/to/vault
vault-doctor scan /path/to/vault --json
vault-doctor scan /path/to/vault --severity high
vault-doctor scan /path/to/vault --format compact
```

### 修復

```bash
vault-doctor fix /path/to/vault           # 自動修復問題
vault-doctor fix /path/to/vault --dry-run  # 預覽而不實際寫入
```

## 檢查項目

| 檢查項 | 嚴重程度 | 自動修復 |
|-------|----------|----------|
| 格式錯誤的 YAML frontmatter | critical | 是 |
| 缺失 frontmatter | medium | 是 |
| 標籤衝突（互斥標籤對） | high | 是 |
| 缺失 layer 標籤（`layer/raw`、`layer/wiki`） | medium | 是 |
| wiki 筆記缺少 `created` 日期 | low | 是 |
| 損壞的 wikilink | medium | 否 |
| 孤立檔案（無入站連結） | low | 否 |
| 過期標記（DRAFT、OUTDATED 等） | low | 否 |

## 對比

| | vault-doctor | obsidian-linter | lkits wikilinks checker |
|-|-------------|----------------|------------------------|
| 損壞的 wikilink | ✅ | ❌ | ✅ |
| frontmatter 修復 | ✅ 自動修復 | ✅ 基於規則 | ❌ |
| 標籤衝突偵測 | ✅ | ✅ | ❌ |
| 孤立檔案偵測 | ✅ | ❌ | ❌ |
| CLI / 可腳本化 | ✅ 無頭模式 | ❌ 僅外掛 | ❌ 僅外掛 |
| 設定檔 | ✅ `vault-doctor.json` | ✅ 外掛設定 | ✅ 外掛設定 |

## 設定

在你的庫根目錄建立 `vault-doctor.json`：

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

預設設定適用於採用 PARA 結構的 Karpathy 三層庫（Raw/Wiki/Graph）。

## 疑難排解

<details>
<summary>安裝後提示 <code>command not found</code></summary>

確保 npm 全域 bin 目錄在你的 PATH 中：

```bash
npm config get prefix
# 將 <prefix>/bin 加入你的 PATH 中
```
</details>

<details>
<summary>首次掃描發現問題太多</summary>

先只檢視高嚴重程度的問題：

```bash
vault-doctor scan /path/to/vault --severity high
```
</details>

## 貢獻

參見 [CONTRIBUTING.md](CONTRIBUTING.md)。歡迎提交 PR——請檢視標記為 `good first issue` 的未解決問題。

## 授權

[Apache-2.0](LICENSE) © 2026 epicsagas
