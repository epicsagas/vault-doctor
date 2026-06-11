<p align="center"><a href="../../../README.md">English</a> · <b>한국어</b> · <a href="../ja/README.md">日本語</a> · <a href="../zh-Hans/README.md">简体中文</a> · <a href="../zh-Hant/README.md">繁體中文</a> · <a href="../es/README.md">Español</a> · <a href="../pt/README.md">Português</a> · <a href="../fr/README.md">Français</a> · <a href="../de/README.md">Deutsch</a> · <a href="../ru/README.md">Русский</a> · <a href="../it/README.md">Italiano</a></p>

<p align="center"><em>이 문서는 <a href="../../../README.md">README.md</a>의 번역입니다.<br/>영어 버전이 원본이며 더 최신일 수 있습니다.</em></p>


<h1 align="center">vault-doctor</h1>

<p align="center">
  <a href="https://github.com/epicsagas/vault-doctor/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/epicsagas/vault-doctor/ci.yml?style=for-the-badge&labelColor=0d1117&color=58a6ff&logo=github&logoColor=white" /></a>
  <a href="https://www.npmjs.com/package/vault-doctor"><img alt="npm" src="https://img.shields.io/npm/v/vault-doctor?style=for-the-badge&labelColor=0d1117&color=cb3837&logo=npm&logoColor=white" /></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-Apache--2.0-3fb950?style=for-the-badge&labelColor=0d1117" /></a>
  <a href="https://github.com/epicsagas/vault-doctor/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/epicsagas/vault-doctor?style=for-the-badge&labelColor=0d1117&color=ffd700&logo=github&logoColor=white" /></a>
  <a href="https://buymeacoffee.com/epicsagas"><img alt="Buy Me A Coffee" src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-ffdd00?style=for-the-badge&labelColor=0d1117&logo=buy-me-a-coffee&logoColor=ffdd00" /></a>
</p>

<p align="center"><b>Obsidian 볼트의 문제를 찾고, 노트가 망가지기 전에 수정하세요</b></p>

<p align="center">
`vault-doctor`는 Obsidian 볼트에서 끊어진 wikilinks, 잘못된 형식의 frontmatter, 누락된 태그, 고아 파일, 오래된 마커를 스캔한 후, 수정 가능한 항목을 자동으로 고칩니다.
</p>

## 빠른 시작

```bash
npm install -g vault-doctor
vault-doctor scan /path/to/vault    # 볼트 상태 확인
```

## 사용법

### 스캔

```bash
vault-doctor scan /path/to/vault
vault-doctor scan /path/to/vault --json
vault-doctor scan /path/to/vault --severity high
vault-doctor scan /path/to/vault --format compact
```

### 수정

```bash
vault-doctor fix /path/to/vault           # 문제 자동 수정
vault-doctor fix /path/to/vault --dry-run  # 실제 반영 없이 미리보기
```

## 검사 항목

| 검사 항목 | 심각도 | 자동 수정 |
|-------|----------|----------|
| 잘못된 형식의 YAML frontmatter | critical | Yes |
| frontmatter 누락 | medium | Yes |
| 태그 충돌 (상호 배타적 태그 쌍) | high | Yes |
| 레이어 태그 누락 (`layer/raw`, `layer/wiki`) | medium | Yes |
| wiki 노트의 `created` 날짜 누락 | low | Yes |
| 끊어진 wikilinks | medium | No |
| 고아 파일 (유입 링크 없음) | low | No |
| 오래된 마커 (DRAFT, OUTDATED 등) | low | No |

## 비교

| | vault-doctor | obsidian-linter | lkits wikilinks checker |
|-|-------------|----------------|------------------------|
| 끊어진 wikilinks | ✅ | ❌ | ✅ |
| Frontmatter 복구 | ✅ 자동 수정 | ✅ 규칙 기반 | ❌ |
| 태그 충돌 감지 | ✅ | ✅ | ❌ |
| 고아 파일 감지 | ✅ | ❌ | ❌ |
| CLI / 스크립트 활용 | ✅ 헤드리스 | ❌ 플러그인 전용 | ❌ 플러그인 전용 |
| 설정 파일 | ✅ `vault-doctor.json` | ✅ 플러그인 설정 | ✅ 플러그인 설정 |

## 설정

볼트 루트에 `vault-doctor.json`을 생성하세요:

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

기본값은 PARA 구조를 사용하는 Karpathy 3-레이어(Raw/Wiki/Graph) 볼트에 맞춰져 있습니다.

## 문제 해결

<details>
<summary>설치 후 <code>command not found</code> 오류</summary>

npm 글로벌 bin이 PATH에 포함되어 있는지 확인하세요:

```bash
npm config get prefix
# <prefix>/bin을 PATH에 추가
```
</details>

<details>
<summary>첫 스캔에서 문제가 너무 많이 나오는 경우</summary>

높은 심각도만 먼저 확인하세요:

```bash
vault-doctor scan /path/to/vault --severity high
```
</details>

## 기여하기

[CONTRIBUTING.md](CONTRIBUTING.md)를 참고하세요. PR을 환영합니다 — `good first issue` 라벨이 있는 오픈 이슈를 확인해 보세요.

## 라이선스

[Apache-2.0](LICENSE) © 2026 epicsagas
