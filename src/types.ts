export interface VaultConfig {
  excludeDirs: string[];
  layers: {
    raw: string[];
    wiki: string[];
  };
  requiredTags: {
    raw: string[];
    wiki: string[];
  };
  mutuallyExclusiveTags: string[][];
  staleMarkers: string[];
  coreDocs: string[];
}

export interface Issue {
  kind: IssueKind;
  severity: "critical" | "high" | "medium" | "low";
  file: string;
  detail: string;
  fixable: boolean;
}

export type IssueKind =
  | "yaml_malformed"
  | "yaml_unclosed"
  | "no_frontmatter"
  | "tag_conflict"
  | "missing_layer"
  | "missing_created"
  | "broken_link"
  | "orphan"
  | "stale_marker";

export interface ScanResult {
  vaultPath: string;
  filesScanned: number;
  issues: Issue[];
  summary: Record<IssueKind, number>;
}

export interface FixResult {
  filesFixed: number;
  fixes: string[];
}

export const DEFAULT_CONFIG: VaultConfig = {
  excludeDirs: [
    ".obsidian",
    ".git",
    ".alcove",
    ".claude",
    "_template",
    "obsidian-templates",
    "node_modules",
  ],
  layers: {
    raw: ["99-Archives", "00-Inbox", "02-Areas", "03-Resources"],
    wiki: ["10-Zettelkasten"],
  },
  requiredTags: {
    raw: ["layer/raw"],
    wiki: ["layer/wiki"],
  },
  mutuallyExclusiveTags: [
    ["status/seed", "status/evergreen"],
    ["layer/raw", "layer/wiki"],
  ],
  staleMarkers: ["DRAFT", "OUTDATED", "DEPRECATED", "DO NOT USE"],
  coreDocs: [
    "PRD.md",
    "ARCHITECTURE.md",
    "PROGRESS.md",
    "DECISIONS.md",
    "CONVENTIONS.md",
    "DEBT.md",
    "SECRETS_MAP.md",
  ],
};
