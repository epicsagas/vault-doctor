**[English](../../../README.md)** | [한국어](../../../README.md) | [日本語](../../../README.md) | [简体中文](../zh-Hans/README.md) | [繁體中文](../zh-Hant/README.md) | [Español](../../../README.md) | [Português](../../../README.md) | **[Français](../../../README.md)** | [Deutsch](../../../README.md) | [Русский](../../../README.md) | [Italiano](../../../README.md)

> Ceci est une traduction de [README.md](../../../README.md).
> La version anglaise est la source faisant autorité et peut être plus à jour.

<h1 align="center">vault-doctor</h1>

<p align="center">
  <a href="https://github.com/epicsagas/vault-doctor/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/epicsagas/vault-doctor/ci.yml?style=for-the-badge&labelColor=0d1117&color=58a6ff&logo=github&logoColor=white" /></a>
  <a href="https://www.npmjs.com/package/vault-doctor"><img alt="npm" src="https://img.shields.io/npm/v/vault-doctor?style=for-the-badge&labelColor=0d1117&color=cb3837&logo=npm&logoColor=white" /></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-Apache--2.0-3fb950?style=for-the-badge&labelColor=0d1117" /></a>
  <a href="https://github.com/epicsagas/vault-doctor/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/epicsagas/vault-doctor?style=for-the-badge&labelColor=0d1117&color=ffd700&logo=github&logoColor=white" /></a>
</p>

<p align="center"><b>Trouvez et corrigez les problèmes de votre coffre Obsidian avant qu'ils n'endommagent vos notes</b></p>

<p align="center">
`vault-doctor` analyse votre coffre Obsidian à la recherche de wikilinks cassés, de frontmatter malformé, de tags manquants, de fichiers orphelins et de marqueurs obsolètes — puis corrige automatiquement ce qu'il peut.
</p>

## Démarrage rapide

```bash
npm install -g vault-doctor
vault-doctor scan /chemin/vers/coffre    # vérifier l'état du coffre
```

## Utilisation

### Analyse

```bash
vault-doctor scan /chemin/vers/coffre
vault-doctor scan /chemin/vers/coffre --json
vault-doctor scan /chemin/vers/coffre --severity high
vault-doctor scan /chemin/vers/coffre --format compact
```

### Correction

```bash
vault-doctor fix /chemin/vers/coffre           # corriger les problèmes automatiquement
vault-doctor fix /chemin/vers/coffre --dry-run  # prévisualiser sans écrire
```

## Ce qui est vérifié

| Vérification | Sévérité | Auto-fix |
|-------------|---------|----------|
| YAML frontmatter malformé | critical | Oui |
| Frontmatter manquant | medium | Oui |
| Conflits de tags (paires mutuellement exclusives) | high | Oui |
| Tags de couche manquants (`layer/raw`, `layer/wiki`) | medium | Oui |
| Date `created` manquante sur les notes wiki | low | Oui |
| Wikilinks cassés | medium | Non |
| Fichiers orphelins (sans liens entrants) | low | Non |
| Marqueurs obsolètes (DRAFT, OUTDATED, etc.) | low | Non |

## Comparaison

| | vault-doctor | obsidian-linter | lkits wikilinks checker |
|-|-------------|----------------|------------------------|
| Wikilinks cassés | ✅ | ❌ | ✅ |
| Réparation du frontmatter | ✅ auto-fix | ✅ basé sur des règles | ❌ |
| Détection de conflits de tags | ✅ | ✅ | ❌ |
| Détection d'orphelins | ✅ | ❌ | ❌ |
| CLI / scriptable | ✅ headless | ❌ plugin uniquement | ❌ plugin uniquement |
| Fichier de configuration | ✅ `vault-doctor.json` | ✅ paramètres du plugin | ✅ paramètres du plugin |

## Configuration

Créez `vault-doctor.json` à la racine de votre coffre :

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

Les valeurs par défaut fonctionnent pour les coffres Karpathy à 3 couches (Raw/Wiki/Graph) avec une structure PARA.

## Dépannage

<details>
<summary><code>command not found</code> après l'installation</summary>

Assurez-vous que le répertoire bin global de npm est dans votre PATH :

```bash
npm config get prefix
# Ajoutez <prefix>/bin à votre PATH
```
</details>

<details>
<summary>Trop de problèmes lors de la première analyse</summary>

Commencez par les problèmes de haute sévérité uniquement :

```bash
vault-doctor scan /chemin/vers/coffre --severity high
```
</details>

## Contribuer

Voir [CONTRIBUTING.md](CONTRIBUTING.md). Les PR sont les bienvenues — consultez les issues ouverts marqués `good first issue`.

## Licence

[Apache-2.0](LICENSE) © 2026 epicsagas
