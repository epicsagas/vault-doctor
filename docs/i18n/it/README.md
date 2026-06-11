**[English](../../../README.md)** | [한국어](../../../README.md) | [日本語](../../../README.md) | [简体中文](../zh-Hans/README.md) | [繁體中文](../zh-Hant/README.md) | [Español](../../../README.md) | [Português](../../../README.md) | [Français](../../../README.md) | [Deutsch](../../../README.md) | [Русский](../../../README.md) | **[Italiano](../../../README.md)**

> Questa è una traduzione di [README.md](../../../README.md).
> La versione in inglese è la fonte autorevole e potrebbe essere più aggiornata.

<h1 align="center">vault-doctor</h1>

<p align="center">
  <a href="https://github.com/epicsagas/vault-doctor/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/epicsagas/vault-doctor/ci.yml?style=for-the-badge&labelColor=0d1117&color=58a6ff&logo=github&logoColor=white" /></a>
  <a href="https://www.npmjs.com/package/vault-doctor"><img alt="npm" src="https://img.shields.io/npm/v/vault-doctor?style=for-the-badge&labelColor=0d1117&color=cb3837&logo=npm&logoColor=white" /></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-Apache--2.0-3fb950?style=for-the-badge&labelColor=0d1117" /></a>
  <a href="https://github.com/epicsagas/vault-doctor/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/epicsagas/vault-doctor?style=for-the-badge&labelColor=0d1117&color=ffd700&logo=github&logoColor=white" /></a>
</p>

<p align="center"><b>Trova e risolvi i problemi del tuo vault Obsidian prima che danneggino le tue note</b></p>

<p align="center">
`vault-doctor` analizza il tuo vault Obsidian alla ricerca di wikilink interrotti, frontmatter malformato, tag mancanti, file orfani e marcatori obsoleti — per poi correggere automaticamente ciò che può.
</p>

## Avvio rapido

```bash
npm install -g vault-doctor
vault-doctor scan /percorso/del/vault    # verifica lo stato del vault
```

## Utilizzo

### Scan

```bash
vault-doctor scan /percorso/del/vault
vault-doctor scan /percorso/del/vault --json
vault-doctor scan /percorso/del/vault --severity high
vault-doctor scan /percorso/del/vault --format compact
```

### Fix

```bash
vault-doctor fix /percorso/del/vault           # correzione automatica
vault-doctor fix /percorso/del/vault --dry-run  # anteprima senza modifiche
```

## Cosa viene controllato

| Controllo | Gravità | Auto-fix |
|-----------|---------|----------|
| Frontmatter YAML malformato | critical | Sì |
| Frontmatter mancante | medium | Sì |
| Conflitti di tag (coppie mutuamente esclusive) | high | Sì |
| Tag dei livelli mancanti (`layer/raw`, `layer/wiki`) | medium | Sì |
| Data `created` mancante nelle note wiki | low | Sì |
| Wikilink interrotti | medium | No |
| File orfani (nessun collegamento in entrata) | low | No |
| Marcatori obsoleti (DRAFT, OUTDATED, ecc.) | low | No |

## Confronto

| | vault-doctor | obsidian-linter | lkits wikilinks checker |
|-|-------------|----------------|------------------------|
| Wikilink interrotti | ✅ | ❌ | ✅ |
| Riparazione frontmatter | ✅ auto-fix | ✅ basato su regole | ❌ |
| Rilevamento conflitti di tag | ✅ | ✅ | ❌ |
| Rilevamento file orfani | ✅ | ❌ | ❌ |
| CLI / automatizzabile | ✅ headless | ❌ solo plugin | ❌ solo plugin |
| File di configurazione | ✅ `vault-doctor.json` | ✅ impostazioni plugin | ✅ impostazioni plugin |

## Configurazione

Crea `vault-doctor.json` nella radice del tuo vault:

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

I valori predefiniti funzionano per i vault Karpathy a 3 livelli (Raw/Wiki/Graph) con struttura PARA.

## Risoluzione dei problemi

<details>
<summary><code>command not found</code> dopo l'installazione</summary>

Assicurati che la directory bin globale di npm sia nel tuo PATH:

```bash
npm config get prefix
# Aggiungi <prefix>/bin al tuo PATH
```
</details>

<details>
<summary>Troppi problemi al primo scan</summary>

Inizia solo con gravità alta:

```bash
vault-doctor scan /percorso/del/vault --severity high
```
</details>

## Contribuire

Vedi [CONTRIBUTING.md](CONTRIBUTING.md). I PR sono benvenuti — controlla le issue aperte con l'etichetta `good first issue`.

## Licenza

[Apache-2.0](LICENSE) © 2026 epicsagas
