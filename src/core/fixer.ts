import { readFileSync, writeFileSync } from "node:fs";
import {
  parseFrontmatterText,
  fixFrontmatter,
  getTags,
  setTags,
  writeWithFrontmatter,
} from "./frontmatter.js";
import { removeTag } from "./tags.js";
import type { VaultConfig, Issue, FixResult } from "../types.js";

export function fixVault(
  vaultPath: string,
  config: VaultConfig,
  issues: Issue[],
  dryRun = false
): FixResult {
  const fixes: string[] = [];
  let filesFixed = 0;

  const fixable = issues.filter((i) => i.fixable);
  const byFile = new Map<string, Issue[]>();
  for (const issue of fixable) {
    const arr = byFile.get(issue.file) || [];
    arr.push(issue);
    byFile.set(issue.file, arr);
  }

  for (const [file, fileIssues] of byFile) {
    const absPath = `${vaultPath}/${file}`;
    const raw = readFileSync(absPath, "utf-8");
    let modified = raw;
    let changed = false;

    const kinds = new Set(fileIssues.map((i) => i.kind));

    // 1. Fix malformed YAML
    if (kinds.has("yaml_malformed")) {
      const result = fixFrontmatter(modified);
      if (result.changed) {
        modified = result.text;
        changed = true;
        fixes.push(`fixed YAML: ${file}`);
      }
    }

    // 2. Add frontmatter if missing
    if (kinds.has("no_frontmatter")) {
      const layer = config.layers.wiki.some((l) => file.startsWith(l))
        ? "wiki"
        : "raw";
      const tags = config.requiredTags[layer];
      const fm = `---\ntags:\n${tags.map((t) => `  - ${t}`).join("\n")}\ncreated: "${new Date().toISOString().slice(0, 10)}"\n---\n`;
      modified = fm + modified;
      changed = true;
      fixes.push(`added frontmatter: ${file}`);
    }

    // Re-parse after potential fixes
    const parsed = parseFrontmatterText(modified);
    if (!parsed.hasFrontmatter || parsed.malformed) {
      if (changed && !dryRun) writeFileSync(absPath, modified, "utf-8");
      continue;
    }

    const data = { ...parsed.data };

    // 3. Resolve tag conflicts
    if (kinds.has("tag_conflict")) {
      for (const pair of config.mutuallyExclusiveTags) {
        const tags = getTags(data);
        const hasBoth = tags.some((t) => t === pair[0]) && tags.some((t) => t === pair[1]);
        if (hasBoth) {
          removeTag(data, pair[1]);
          changed = true;
          fixes.push(`resolved tag conflict (${pair[0]} + ${pair[1]}): ${file}`);
        }
      }
    }

    // 4. Add missing layer tag
    if (kinds.has("missing_layer")) {
      const tags = getTags(data);
      const layer = config.layers.wiki.some((l) => file.startsWith(l))
        ? "wiki"
        : "raw";
      const requiredTag = config.requiredTags[layer][0];
      if (!tags.includes(requiredTag)) {
        tags.push(requiredTag);
        setTags(data, tags);
        changed = true;
        fixes.push(`added ${requiredTag}: ${file}`);
      }
    }

    // 5. Add missing created date for wiki notes
    if (kinds.has("missing_created")) {
      if (!data.created) {
        data.created = new Date().toISOString().slice(0, 10);
        changed = true;
        fixes.push(`added created date: ${file}`);
      }
    }

    if (changed) {
      filesFixed++;
      if (!dryRun) {
        writeWithFrontmatter(absPath, data, parsed.content);
      }
    }
  }

  return { filesFixed, fixes };
}
