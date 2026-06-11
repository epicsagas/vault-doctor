<p align="center">
  <a href="docs/i18n/ko/README.md">한국어</a> ·
  <a href="docs/i18n/ja/README.md">日本語</a> ·
  <a href="docs/i18n/zh-Hans/README.md">简体中文</a> ·
  <a href="docs/i18n/zh-Hant/README.md">繁體中文</a> ·
  <a href="docs/i18n/es/README.md">Español</a> ·
  <a href="docs/i18n/pt/README.md">Português</a> ·
  <a href="docs/i18n/fr/README.md">Français</a> ·
  <a href="docs/i18n/de/README.md">Deutsch</a> ·
  <a href="docs/i18n/ru/README.md">Русский</a> ·
  <a href="docs/i18n/it/README.md">Italiano</a>
</p>

<h1 align="center">vault-doctor</h1>

<p align="center">
  <a href="https://github.com/epicsagas/vault-doctor/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/epicsagas/vault-doctor/ci.yml?style=for-the-badge&labelColor=0d1117&color=58a6ff&logo=github&logoColor=white" /></a>
  <a href="https://www.npmjs.com/package/vault-doctor"><img alt="npm" src="https://img.shields.io/npm/v/vault-doctor?style=for-the-badge&labelColor=0d1117&color=cb3837&logo=npm&logoColor=white" /></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-Apache--2.0-3fb950?style=for-the-badge&labelColor=0d1117" /></a>
  <a href="https://github.com/epicsagas/vault-doctor/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/epicsagas/vault-doctor?style=for-the-badge&labelColor=0d1117&color=ffd700&logo=github&logoColor=white" /></a>
</p>

<p align="center"><b>Find and fix Obsidian vault problems before they break your notes</b></p>

<p align="center">
<code>vault-doctor</code> scans your Obsidian vault for broken wikilinks, malformed frontmatter, missing tags, orphan files, and stale markers — then auto-fixes what it can.
</p>

## Quick Start

```bash
npm install -g vault-doctor
vault-doctor scan /path/to/vault    # check vault health
```

## Usage

### Scan

```bash
vault-doctor scan /path/to/vault
vault-doctor scan /path/to/vault --json
vault-doctor scan /path/to/vault --severity high
vault-doctor scan /path/to/vault --format compact
```

### Fix

```bash
vault-doctor fix /path/to/vault           # auto-fix issues
vault-doctor fix /path/to/vault --dry-run  # preview without writing
```

## What it checks

| Check | Severity | Auto-fix |
|-------|----------|----------|
| Malformed YAML frontmatter | critical | Yes |
| Missing frontmatter | medium | Yes |
| Tag conflicts (mutually exclusive pairs) | high | Yes |
| Missing layer tags (`layer/raw`, `layer/wiki`) | medium | Yes |
| Missing `created` date on wiki notes | low | Yes |
| Broken wikilinks | medium | No |
| Orphan files (no inbound links) | low | No |
| Stale markers (DRAFT, OUTDATED, etc.) | low | No |

## Comparison

| | vault-doctor | obsidian-linter | lkits wikilinks checker |
|-|-------------|----------------|------------------------|
| Broken wikilinks | ✅ | ❌ | ✅ |
| Frontmatter repair | ✅ auto-fix | ✅ rules-based | ❌ |
| Tag conflict detection | ✅ | ✅ | ❌ |
| Orphan detection | ✅ | ❌ | ❌ |
| CLI / scriptable | ✅ headless | ❌ plugin only | ❌ plugin only |
| Config file | ✅ `vault-doctor.json` | ✅ plugin settings | ✅ plugin settings |

## Configuration

Create `vault-doctor.json` in your vault root:

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

Defaults work for Karpathy 3-layer (Raw/Wiki/Graph) vaults with PARA structure.

## Troubleshooting

<details>
<summary><code>command not found</code> after install</summary>

Make sure npm global bin is in your PATH:

```bash
npm config get prefix
# Add <prefix>/bin to your PATH
```
</details>

<details>
<summary>Too many issues on first scan</summary>

Start with high-severity only:

```bash
vault-doctor scan /path/to/vault --severity high
```
</details>

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). PRs welcome — check open issues labeled `good first issue`.

## License

[Apache-2.0](LICENSE) © 2026 epicsagas
