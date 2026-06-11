import { existsSync } from "node:fs";
import { join, basename } from "node:path";

const WIKILINK_RE = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;

function normalize(s: string): string {
  return s.replace(/\.md$/, "").replace(/[-\s]+/g, " ").toLowerCase().trim();
}

export function extractWikilinks(text: string): string[] {
  const links: string[] = [];
  let m: RegExpExecArray | null;
  const re = new RegExp(WIKILINK_RE.source, "g");
  while ((m = re.exec(text)) !== null) {
    links.push(m[1].trim());
  }
  return links;
}

export function resolveWikilink(
  target: string,
  vaultPath: string,
  allFiles: Set<string>
): boolean {
  // Direct path
  if (existsSync(join(vaultPath, target))) return true;
  if (existsSync(join(vaultPath, target + ".md"))) return true;

  const normTarget = normalize(basename(target));

  for (const f of allFiles) {
    const normFile = normalize(f);
    // Exact stem
    if (normFile === normTarget) return true;
    // Relative path match (e.g. "10-Zettelkasten/Rust" matches "10-Zettelkasten/Rust-Agent-Runtime-Tradeoffs")
    if (normTarget.includes("/")) {
      const normPath = normalize(f);
      if (normPath === normalize(target)) return true;
    }
    // Substring: target stem contained in file stem (handles "Rust" matching "Rust-Agent-Runtime-Tradeoffs")
    if (!normTarget.includes(" ") && normFile.startsWith(normTarget)) return true;
  }

  return false;
}

export function buildFileIndex(vaultPath: string, mdFiles: string[]): Set<string> {
  const index = new Set<string>();
  for (const f of mdFiles) {
    index.add(f);
    index.add(basename(f, ".md"));
  }
  return index;
}
