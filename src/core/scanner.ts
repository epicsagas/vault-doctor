import { readFileSync } from "node:fs";
import { relative, basename } from "node:path";
import fg from "fast-glob";
import { parseFrontmatter, getTags } from "./frontmatter.js";
import { findConflicts } from "./tags.js";
import { extractWikilinks, resolveWikilink, buildFileIndex } from "./links.js";
import type { VaultConfig, Issue, ScanResult, IssueKind } from "../types.js";

export async function scanVault(
  vaultPath: string,
  config: VaultConfig
): Promise<ScanResult> {
  const issues: Issue[] = [];
  const summary: Record<string, number> = {};

  const excludePatterns = config.excludeDirs.map((d) => `**/${d}/**`);
  const mdFiles = await fg.glob("**/*.md", {
    cwd: vaultPath,
    ignore: excludePatterns,
    absolute: true,
  });

  const relativeFiles = mdFiles.map((f) => relative(vaultPath, f));
  const fileIndex = buildFileIndex(vaultPath, relativeFiles);

  // Inbound link map for orphan detection
  const inbound = new Map<string, string[]>();

  for (const absPath of mdFiles) {
    const rel = relative(vaultPath, absPath);
    const text = readFileSync(absPath, "utf-8");

    // Build inbound map
    const links = extractWikilinks(text);
    for (const target of links) {
      const arr = inbound.get(target) || [];
      arr.push(rel);
      inbound.set(target, arr);
    }

    // 1. YAML frontmatter
    const fm = parseFrontmatter(absPath);
    if (fm.malformed) {
      issues.push({
        kind: "yaml_malformed",
        severity: "critical",
        file: rel,
        detail: fm.malformedDetail || "malformed",
        fixable: true,
      });
    }

    if (!fm.hasFrontmatter) {
      issues.push({
        kind: "no_frontmatter",
        severity: "medium",
        file: rel,
        detail: "no frontmatter",
        fixable: true,
      });
      continue;
    }

    // 2. Tag conflicts
    const conflict = findConflicts(fm, config.mutuallyExclusiveTags);
    if (conflict) {
      issues.push({
        kind: "tag_conflict",
        severity: "high",
        file: rel,
        detail: `conflict: ${conflict.join(" + ")}`,
        fixable: true,
      });
    }

    // 3. Missing layer tag
    const tags = getTags(fm.data);
    const hasLayer = tags.some((t) => t.startsWith("layer/"));
    if (!hasLayer) {
      const isWiki = config.layers.wiki.some((l) => rel.startsWith(l));
      issues.push({
        kind: "missing_layer",
        severity: "medium",
        file: rel,
        detail: `missing ${isWiki ? "layer/wiki" : "layer/raw"}`,
        fixable: true,
      });
    }

    // 4. Missing created in wiki notes
    if (config.layers.wiki.some((l) => rel.startsWith(l))) {
      if (!fm.data.created) {
        issues.push({
          kind: "missing_created",
          severity: "low",
          file: rel,
          detail: "wiki note missing created date",
          fixable: true,
        });
      }
    }

    // 5. Broken links
    for (const target of links) {
      if (!resolveWikilink(target, vaultPath, fileIndex)) {
        issues.push({
          kind: "broken_link",
          severity: "medium",
          file: rel,
          detail: target,
          fixable: false,
        });
      }
    }

    // 7. Stale markers
    for (const marker of config.staleMarkers) {
      if (text.includes(marker)) {
        issues.push({
          kind: "stale_marker",
          severity: "low",
          file: rel,
          detail: marker,
          fixable: false,
        });
        break; // one per file
      }
    }
  }

  // 6. Orphan detection
  for (const rel of relativeFiles) {
    const stem = basename(rel, ".md");
    const hasInbound =
      inbound.has(rel) ||
      inbound.has(stem) ||
      inbound.has(rel.replace(/\.md$/, ""));
    if (!hasInbound) {
      issues.push({
        kind: "orphan",
        severity: "low",
        file: rel,
        detail: "no inbound links",
        fixable: false,
      });
    }
  }

  // Build summary
  for (const issue of issues) {
    summary[issue.kind] = (summary[issue.kind] || 0) + 1;
  }

  return {
    vaultPath,
    filesScanned: mdFiles.length,
    issues,
    summary: summary as Record<IssueKind, number>,
  };
}
