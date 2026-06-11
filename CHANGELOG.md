# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-05-14

### Added

- `scan` command — detect vault health issues (malformed frontmatter, tag conflicts, broken wikilinks, orphans, stale markers)
- `fix` command — auto-remediate fixable issues with `--dry-run` support
- `--json` and `--severity` output filters
- Configurable rules via `vault-doctor.json`
- Default config for Karpathy 3-layer (Raw/Wiki/Graph) vaults with PARA structure
