<p align="center"><a href="../../../README.md">English</a> · <a href="../ko/README.md">한국어</a> · <a href="../ja/README.md">日本語</a> · <b>简体中文</b> · <a href="../zh-Hant/README.md">繁體中文</a> · <a href="../es/README.md">Español</a> · <a href="../pt/README.md">Português</a> · <a href="../fr/README.md">Français</a> · <a href="../de/README.md">Deutsch</a> · <a href="../ru/README.md">Русский</a> · <a href="../it/README.md">Italiano</a></p>

<p align="center"><em>This is a translation of <a href="../../../README.md">README.md</a>.<br/>The English version is the authoritative source and may be more up-to-date.</em></p>


<h1 align="center">vault-doctor</h1>

<p align="center">
  <a href="https://github.com/epicsagas/vault-doctor/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/epicsagas/vault-doctor/ci.yml?style=for-the-badge&labelColor=0d1117&color=58a6ff&logo=github&logoColor=white" /></a>
  <a href="https://www.npmjs.com/package/vault-doctor"><img alt="npm" src="https://img.shields.io/npm/v/vault-doctor?style=for-the-badge&labelColor=0d1117&color=cb3837&logo=npm&logoColor=white" /></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-Apache--2.0-3fb950?style=for-the-badge&labelColor=0d1117" /></a>
  <a href="https://github.com/epicsagas/vault-doctor/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/epicsagas/vault-doctor?style=for-the-badge&labelColor=0d1117&color=ffd700&logo=github&logoColor=white" /></a>
</p>

<p align="center"><b>在笔记出问题之前，发现并修复 Obsidian 仓库中的问题</b></p>

<p align="center">
`vault-doctor` 会扫描你的 Obsidian 仓库，查找损坏的 wikilink、格式错误的 frontmatter、缺失的标签、孤立文件和过期标记——然后尽可能自动修复。
</p>

## 快速开始

```bash
npm install -g vault-doctor
vault-doctor scan /path/to/vault    # 检查仓库健康状况
```

## 用法

### 扫描

```bash
vault-doctor scan /path/to/vault
vault-doctor scan /path/to/vault --json
vault-doctor scan /path/to/vault --severity high
vault-doctor scan /path/to/vault --format compact
```

### 修复

```bash
vault-doctor fix /path/to/vault           # 自动修复问题
vault-doctor fix /path/to/vault --dry-run  # 预览而不实际写入
```

## 检查项目

| 检查项 | 严重程度 | 自动修复 |
|-------|----------|----------|
| 格式错误的 YAML frontmatter | critical | 是 |
| 缺失 frontmatter | medium | 是 |
| 标签冲突（互斥标签对） | high | 是 |
| 缺失 layer 标签（`layer/raw`、`layer/wiki`） | medium | 是 |
| wiki 笔记缺少 `created` 日期 | low | 是 |
| 损坏的 wikilink | medium | 否 |
| 孤立文件（无入站链接） | low | 否 |
| 过期标记（DRAFT、OUTDATED 等） | low | 否 |

## 对比

| | vault-doctor | obsidian-linter | lkits wikilinks checker |
|-|-------------|----------------|------------------------|
| 损坏的 wikilink | ✅ | ❌ | ✅ |
| frontmatter 修复 | ✅ 自动修复 | ✅ 基于规则 | ❌ |
| 标签冲突检测 | ✅ | ✅ | ❌ |
| 孤立文件检测 | ✅ | ❌ | ❌ |
| CLI / 可脚本化 | ✅ 无头模式 | ❌ 仅插件 | ❌ 仅插件 |
| 配置文件 | ✅ `vault-doctor.json` | ✅ 插件设置 | ✅ 插件设置 |

## 配置

在你的仓库根目录创建 `vault-doctor.json`：

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

默认配置适用于采用 PARA 结构的 Karpathy 三层仓库（Raw/Wiki/Graph）。

## 故障排除

<details>
<summary>安装后提示 <code>command not found</code></summary>

确保 npm 全局 bin 目录在你的 PATH 中：

```bash
npm config get prefix
# 将 <prefix>/bin 添加到你的 PATH 中
```
</details>

<details>
<summary>首次扫描发现问题太多</summary>

先只查看高严重程度的问题：

```bash
vault-doctor scan /path/to/vault --severity high
```
</details>

## 贡献

参见 [CONTRIBUTING.md](CONTRIBUTING.md)。欢迎提交 PR——请查看标记为 `good first issue` 的未解决问题。

## 许可证

[Apache-2.0](LICENSE) © 2026 epicsagas
