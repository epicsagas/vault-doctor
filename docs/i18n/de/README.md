<p align="center"><a href="../../../README.md">English</a> · <a href="../ko/README.md">한국어</a> · <a href="../ja/README.md">日本語</a> · <a href="../zh-Hans/README.md">简体中文</a> · <a href="../zh-Hant/README.md">繁體中文</a> · <a href="../es/README.md">Español</a> · <a href="../pt/README.md">Português</a> · <a href="../fr/README.md">Français</a> · <b>Deutsch</b> · <a href="../ru/README.md">Русский</a> · <a href="../it/README.md">Italiano</a></p>

<p align="center"><em>Dies ist eine Übersetzung von <a href="../../../README.md">README.md</a>.<br/>Die englische Version ist die maßgebliche Quelle und kann aktueller sein.</em></p>


<h1 align="center">vault-doctor</h1>

<p align="center">
  <a href="https://github.com/epicsagas/vault-doctor/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/epicsagas/vault-doctor/ci.yml?style=for-the-badge&labelColor=0d1117&color=58a6ff&logo=github&logoColor=white" /></a>
  <a href="https://www.npmjs.com/package/vault-doctor"><img alt="npm" src="https://img.shields.io/npm/v/vault-doctor?style=for-the-badge&labelColor=0d1117&color=cb3837&logo=npm&logoColor=white" /></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-Apache--2.0-3fb950?style=for-the-badge&labelColor=0d1117" /></a>
  <a href="https://github.com/epicsagas/vault-doctor/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/epicsagas/vault-doctor?style=for-the-badge&labelColor=0d1117&color=ffd700&logo=github&logoColor=white" /></a>
  <a href="https://buymeacoffee.com/epicsagas"><img alt="Buy Me A Coffee" src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-ffdd00?style=for-the-badge&labelColor=0d1117&logo=buy-me-a-coffee&logoColor=ffdd00" /></a>
</p>

<p align="center"><b>Finden und beheben Sie Obsidian-Vault-Probleme, bevor sie Ihre Notizen beschädigen</b></p>

<p align="center">
`vault-doctor` durchsucht Ihren Obsidian-Vault nach fehlerhaften Wikilinks, fehlerhaftem Frontmatter, fehlenden Tags, verwaisten Dateien und veralteten Markierungen — und behebt dann automatisch, was möglich ist.
</p>

## Schnellstart

```bash
npm install -g vault-doctor
vault-doctor scan /pfad/zum/vault    # Vault-Zustand prüfen
```

## Verwendung

### Scan

```bash
vault-doctor scan /pfad/zum/vault
vault-doctor scan /pfad/zum/vault --json
vault-doctor scan /pfad/zum/vault --severity high
vault-doctor scan /pfad/zum/vault --format compact
```

### Fix

```bash
vault-doctor fix /pfad/zum/vault           # Probleme automatisch beheben
vault-doctor fix /pfad/zum/vault --dry-run  # Vorschau ohne Änderungen
```

## Was geprüft wird

| Prüfung | Schweregrad | Auto-Fix |
|---------|-------------|----------|
| Fehlerhaftes YAML-Frontmatter | critical | Ja |
| Fehlendes Frontmatter | medium | Ja |
| Tag-Konflikte (gegenseitig ausschließende Paare) | high | Ja |
| Fehlende Layer-Tags (`layer/raw`, `layer/wiki`) | medium | Ja |
| Fehlendes `created`-Datum bei Wiki-Notizen | low | Ja |
| Fehlerhafte Wikilinks | medium | Nein |
| Verwaiste Dateien (keine eingehenden Links) | low | Nein |
| Veraltete Markierungen (DRAFT, OUTDATED usw.) | low | Nein |

## Vergleich

| | vault-doctor | obsidian-linter | lkits wikilinks checker |
|-|-------------|----------------|------------------------|
| Fehlerhafte Wikilinks | ✅ | ❌ | ✅ |
| Frontmatter-Reparatur | ✅ Auto-Fix | ✅ regelbasiert | ❌ |
| Tag-Konflikt-Erkennung | ✅ | ✅ | ❌ |
| Erkennung verwaister Dateien | ✅ | ❌ | ❌ |
| CLI / skriptbar | ✅ Headless | ❌ nur Plugin | ❌ nur Plugin |
| Konfigurationsdatei | ✅ `vault-doctor.json` | ✅ Plugin-Einstellungen | ✅ Plugin-Einstellungen |

## Konfiguration

Erstellen Sie `vault-doctor.json` im Vault-Stammverzeichnis:

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

Die Standardeinstellungen funktionieren für Karpathy 3-Layer-Vaults (Raw/Wiki/Graph) mit PARA-Struktur.

## Fehlerbehebung

<details>
<summary><code>command not found</code> nach der Installation</summary>

Stellen Sie sicher, dass das globale npm-Bin-Verzeichnis in Ihrem PATH ist:

```bash
npm config get prefix
# Fügen Sie <prefix>/bin zu Ihrem PATH hinzu
```
</details>

<details>
<summary>Zu viele Probleme beim ersten Scan</summary>

Beginnen Sie nur mit hoher Schwere:

```bash
vault-doctor scan /pfad/zum/vault --severity high
```
</details>

## Mitwirken

Siehe [CONTRIBUTING.md](CONTRIBUTING.md). PRs willkommen — prüfen Sie offene Issues mit dem Label `good first issue`.

## Lizenz

[Apache-2.0](LICENSE) © 2026 epicsagas
