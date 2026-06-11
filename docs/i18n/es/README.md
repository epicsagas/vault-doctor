<p align="center"><a href="../../../README.md">English</a> · <a href="../ko/README.md">한국어</a> · <a href="../ja/README.md">日本語</a> · <a href="../zh-Hans/README.md">简体中文</a> · <a href="../zh-Hant/README.md">繁體中文</a> · <b>Español</b> · <a href="../pt/README.md">Português</a> · <a href="../fr/README.md">Français</a> · <a href="../de/README.md">Deutsch</a> · <a href="../ru/README.md">Русский</a> · <a href="../it/README.md">Italiano</a></p>

<p align="center"><em>Esta es una traducción de <a href="../../../README.md">README.md</a>.<br/>La versión en inglés es la fuente autorizada y puede estar más actualizada.</em></p>


<h1 align="center">vault-doctor</h1>

<p align="center">
  <a href="https://github.com/epicsagas/vault-doctor/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/epicsagas/vault-doctor/ci.yml?style=for-the-badge&labelColor=0d1117&color=58a6ff&logo=github&logoColor=white" /></a>
  <a href="https://www.npmjs.com/package/vault-doctor"><img alt="npm" src="https://img.shields.io/npm/v/vault-doctor?style=for-the-badge&labelColor=0d1117&color=cb3837&logo=npm&logoColor=white" /></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-Apache--2.0-3fb950?style=for-the-badge&labelColor=0d1117" /></a>
  <a href="https://github.com/epicsagas/vault-doctor/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/epicsagas/vault-doctor?style=for-the-badge&labelColor=0d1117&color=ffd700&logo=github&logoColor=white" /></a>
</p>

<p align="center"><b>Encuentra y repara los problemas de tu vault de Obsidian antes de que arruinen tus notas</b></p>

<p align="center">
`vault-doctor` escanea tu vault de Obsidian en busca de wikilinks rotos, frontmatter malformado, etiquetas faltantes, archivos huérfanos y marcadores obsoletos, y luego corrige automáticamente lo que puede.
</p>

## Inicio rápido

```bash
npm install -g vault-doctor
vault-doctor scan /ruta/al/vault    # verificar el estado del vault
```

## Uso

### Escanear

```bash
vault-doctor scan /ruta/al/vault
vault-doctor scan /ruta/al/vault --json
vault-doctor scan /ruta/al/vault --severity high
vault-doctor scan /ruta/al/vault --format compact
```

### Corregir

```bash
vault-doctor fix /ruta/al/vault           # corregir problemas automáticamente
vault-doctor fix /ruta/al/vault --dry-run  # previsualizar sin escribir cambios
```

## Qué verifica

| Verificación | Severidad | Auto-fix |
|-------------|-----------|----------|
| YAML frontmatter malformado | critical | Sí |
| Frontmatter faltante | medium | Sí |
| Conflictos de etiquetas (pares mutuamente excluyentes) | high | Sí |
| Etiquetas de capa faltantes (`layer/raw`, `layer/wiki`) | medium | Sí |
| Fecha `created` faltante en notas wiki | low | Sí |
| Wikilinks rotos | medium | No |
| Archivos huérfanos (sin enlaces entrantes) | low | No |
| Marcadores obsoletos (DRAFT, OUTDATED, etc.) | low | No |

## Comparación

| | vault-doctor | obsidian-linter | lkits wikilinks checker |
|-|-------------|----------------|------------------------|
| Wikilinks rotos | ✅ | ❌ | ✅ |
| Reparación de frontmatter | ✅ auto-fix | ✅ basado en reglas | ❌ |
| Detección de conflictos de etiquetas | ✅ | ✅ | ❌ |
| Detección de huérfanos | ✅ | ❌ | ❌ |
| CLI / scriptable | ✅ headless | ❌ solo plugin | ❌ solo plugin |
| Archivo de configuración | ✅ `vault-doctor.json` | ✅ ajustes del plugin | ✅ ajustes del plugin |

## Configuración

Crea `vault-doctor.json` en la raíz de tu vault:

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

Los valores predeterminados funcionan para vaults de estilo Karpathy de 3 capas (Raw/Wiki/Graph) con estructura PARA.

## Solución de problemas

<details>
<summary><code>command not found</code> después de instalar</summary>

Asegúrate de que el directorio bin global de npm esté en tu PATH:

```bash
npm config get prefix
# Agrega <prefix>/bin a tu PATH
```
</details>

<details>
<summary>Demasiados problemas en el primer escaneo</summary>

Comienza solo con los de alta severidad:

```bash
vault-doctor scan /ruta/al/vault --severity high
```
</details>

## Contribuir

Consulta [CONTRIBUTING.md](CONTRIBUTING.md). Se aceptan PR — revisa los issues abiertos etiquetados como `good first issue`.

## Licencia

[Apache-2.0](LICENSE) © 2026 epicsagas
