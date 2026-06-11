<p align="center"><a href="../../../README.md">English</a> · <a href="../ko/README.md">한국어</a> · <a href="../ja/README.md">日本語</a> · <a href="../zh-Hans/README.md">简体中文</a> · <a href="../zh-Hant/README.md">繁體中文</a> · <a href="../es/README.md">Español</a> · <a href="../pt/README.md">Português</a> · <a href="../fr/README.md">Français</a> · <a href="../de/README.md">Deutsch</a> · <b>Русский</b> · <a href="../it/README.md">Italiano</a></p>

<p align="center"><em>Это перевод <a href="../../../README.md">README.md</a>.<br/>Английская версия является авторитетным источником и может быть более актуальной.</em></p>


<h1 align="center">vault-doctor</h1>

<p align="center">
  <a href="https://github.com/epicsagas/vault-doctor/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/epicsagas/vault-doctor/ci.yml?style=for-the-badge&labelColor=0d1117&color=58a6ff&logo=github&logoColor=white" /></a>
  <a href="https://www.npmjs.com/package/vault-doctor"><img alt="npm" src="https://img.shields.io/npm/v/vault-doctor?style=for-the-badge&labelColor=0d1117&color=cb3837&logo=npm&logoColor=white" /></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-Apache--2.0-3fb950?style=for-the-badge&labelColor=0d1117" /></a>
  <a href="https://github.com/epicsagas/vault-doctor/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/epicsagas/vault-doctor?style=for-the-badge&labelColor=0d1117&color=ffd700&logo=github&logoColor=white" /></a>
</p>

<p align="center"><b>Находите и исправляйте проблемы в Obsidian-хранилище до того, как они сломают ваши заметки</b></p>

<p align="center">
`vault-doctor` сканирует ваше Obsidian-хранилище на наличие сломанных вики-ссылок, некорректного frontmatter, отсутствующих тегов, потерянных файлов и устаревших меток — затем автоматически исправляет то, что может.
</p>

## Быстрый старт

```bash
npm install -g vault-doctor
vault-doctor scan /путь/к/хранилищу    # проверить состояние хранилища
```

## Использование

### Сканирование

```bash
vault-doctor scan /путь/к/хранилищу
vault-doctor scan /путь/к/хранилищу --json
vault-doctor scan /путь/к/хранилищу --severity high
vault-doctor scan /путь/к/хранилищу --format compact
```

### Исправление

```bash
vault-doctor fix /путь/к/хранилищу           # автоисправление проблем
vault-doctor fix /путь/к/хранилищу --dry-run  # предпросмотр без изменений
```

## Что проверяется

| Проверка | Критичность | Автоисправление |
|----------|-------------|-----------------|
| Некорректный YAML frontmatter | critical | Да |
| Отсутствующий frontmatter | medium | Да |
| Конфликты тегов (взаимоисключающие пары) | high | Да |
| Отсутствующие теги слоёв (`layer/raw`, `layer/wiki`) | medium | Да |
| Отсутствующая дата `created` в вики-заметках | low | Да |
| Сломанные вики-ссылки | medium | Нет |
| Потерянные файлы (нет входящих ссылок) | low | Нет |
| Устаревшие метки (DRAFT, OUTDATED и т. д.) | low | Нет |

## Сравнение

| | vault-doctor | obsidian-linter | lkits wikilinks checker |
|-|-------------|----------------|------------------------|
| Сломанные вики-ссылки | ✅ | ❌ | ✅ |
| Восстановление frontmatter | ✅ автоисправление | ✅ на основе правил | ❌ |
| Обнаружение конфликтов тегов | ✅ | ✅ | ❌ |
| Обнаружение потерянных файлов | ✅ | ❌ | ❌ |
| CLI / автоматизация | ✅ автономный | ❌ только плагин | ❌ только плагин |
| Файл конфигурации | ✅ `vault-doctor.json` | ✅ настройки плагина | ✅ настройки плагина |

## Конфигурация

Создайте `vault-doctor.json` в корне хранилища:

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

Значения по умолчанию подходят для хранилищ Karpathy с 3 слоями (Raw/Wiki/Graph) и структурой PARA.

## Устранение неполадок

<details>
<summary><code>command not found</code> после установки</summary>

Убедитесь, что глобальный bin-каталог npm добавлен в ваш PATH:

```bash
npm config get prefix
# Добавьте <prefix>/bin в ваш PATH
```
</details>

<details>
<summary>Слишком много проблем при первом сканировании</summary>

Начните только с высокой критичностью:

```bash
vault-doctor scan /путь/к/хранилищу --severity high
```
</details>

## Участие в разработке

См. [CONTRIBUTING.md](CONTRIBUTING.md). PR приветствуются — проверьте открытые issues с меткой `good first issue`.

## Лицензия

[Apache-2.0](LICENSE) © 2026 epicsagas
