**[English](../../../README.md)** | [한국어](../../../README.md) | [日本語](../../../README.md) | [简体中文](../zh-Hans/README.md) | [繁體中文](../zh-Hant/README.md) | [Español](../../../README.md) | **[Português](../../../README.md)** | [Français](../../../README.md) | [Deutsch](../../../README.md) | [Русский](../../../README.md) | [Italiano](../../../README.md)

> Esta é uma tradução de [README.md](../../../README.md).
> A versão em inglês é a fonte autorizada e pode estar mais atualizada.

<h1 align="center">vault-doctor</h1>

<p align="center">
  <a href="https://github.com/epicsagas/vault-doctor/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/epicsagas/vault-doctor/ci.yml?style=for-the-badge&labelColor=0d1117&color=58a6ff&logo=github&logoColor=white" /></a>
  <a href="https://www.npmjs.com/package/vault-doctor"><img alt="npm" src="https://img.shields.io/npm/v/vault-doctor?style=for-the-badge&labelColor=0d1117&color=cb3837&logo=npm&logoColor=white" /></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-Apache--2.0-3fb950?style=for-the-badge&labelColor=0d1117" /></a>
  <a href="https://github.com/epicsagas/vault-doctor/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/epicsagas/vault-doctor?style=for-the-badge&labelColor=0d1117&color=ffd700&logo=github&logoColor=white" /></a>
</p>

<p align="center"><b>Encontre e corrija problemas do seu vault Obsidian antes que eles estraguem suas notas</b></p>

<p align="center">
`vault-doctor` escaneia seu vault Obsidian em busca de wikilinks quebrados, frontmatter malformado, tags ausentes, arquivos órfãos e marcadores obsoletos — e então corrige automaticamente o que pode.
</p>

## Início rápido

```bash
npm install -g vault-doctor
vault-doctor scan /caminho/para/vault    # verificar a saúde do vault
```

## Uso

### Escanear

```bash
vault-doctor scan /caminho/para/vault
vault-doctor scan /caminho/para/vault --json
vault-doctor scan /caminho/para/vault --severity high
vault-doctor scan /caminho/para/vault --format compact
```

### Corrigir

```bash
vault-doctor fix /caminho/para/vault           # corrigir problemas automaticamente
vault-doctor fix /caminho/para/vault --dry-run  # previsualizar sem gravar alterações
```

## O que verifica

| Verificação | Severidade | Auto-fix |
|------------|-----------|----------|
| YAML frontmatter malformado | critical | Sim |
| Frontmatter ausente | medium | Sim |
| Conflitos de tags (pares mutuamente exclusivos) | high | Sim |
| Tags de camada ausentes (`layer/raw`, `layer/wiki`) | medium | Sim |
| Data `created` ausente em notas wiki | low | Sim |
| Wikilinks quebrados | medium | Não |
| Arquivos órfãos (sem links de entrada) | low | Não |
| Marcadores obsoletos (DRAFT, OUTDATED, etc.) | low | Não |

## Comparação

| | vault-doctor | obsidian-linter | lkits wikilinks checker |
|-|-------------|----------------|------------------------|
| Wikilinks quebrados | ✅ | ❌ | ✅ |
| Reparação de frontmatter | ✅ auto-fix | ✅ baseado em regras | ❌ |
| Detecção de conflito de tags | ✅ | ✅ | ❌ |
| Detecção de órfãos | ✅ | ❌ | ❌ |
| CLI / programável | ✅ headless | ❌ apenas plugin | ❌ apenas plugin |
| Arquivo de configuração | ✅ `vault-doctor.json` | ✅ configurações do plugin | ✅ configurações do plugin |

## Configuração

Crie `vault-doctor.json` na raiz do seu vault:

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

Os valores padrão funcionam para vaults de 3 camadas do estilo Karpathy (Raw/Wiki/Graph) com estrutura PARA.

## Solução de problemas

<details>
<summary><code>command not found</code> após a instalação</summary>

Certifique-se de que o diretório bin global do npm esteja no seu PATH:

```bash
npm config get prefix
# Adicione <prefix>/bin ao seu PATH
```
</details>

<details>
<summary>Muitos problemas no primeiro scan</summary>

Comece apenas com os de alta severidade:

```bash
vault-doctor scan /caminho/para/vault --severity high
```
</details>

## Contribuindo

Consulte [CONTRIBUTING.md](CONTRIBUTING.md). PRs são bem-vindos — confira as issues abertas marcadas como `good first issue`.

## Licença

[Apache-2.0](LICENSE) © 2026 epicsagas
