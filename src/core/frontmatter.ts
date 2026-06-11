import { readFileSync, writeFileSync } from "node:fs";
import matter from "gray-matter";

export interface FrontmatterResult {
  data: Record<string, unknown>;
  content: string;
  raw: string;
  hasFrontmatter: boolean;
  malformed: boolean;
  malformedDetail?: string;
}

export function parseFrontmatter(filePath: string): FrontmatterResult {
  const raw = readFileSync(filePath, "utf-8");
  return parseFrontmatterText(raw);
}

export function parseFrontmatterText(raw: string): FrontmatterResult {
  if (!raw.startsWith("---")) {
    return { data: {}, content: raw, raw, hasFrontmatter: false, malformed: false };
  }

  // Check for malformed --- merged into last value
  const lines = raw.split("\n");
  let foundClose = false;
  let malformed = false;
  let malformedDetail: string | undefined;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "---") {
      foundClose = true;
      break;
    }
    // --- appended to value line
    const trimmed = line.replace(/\s+$/, "");
    if (trimmed.endsWith("---") && trimmed !== "---") {
      malformed = true;
      malformedDetail = `line ${i + 1}: closing --- merged into value`;
      break;
    }
  }

  if (!foundClose && !malformed) {
    return { data: {}, content: raw, raw, hasFrontmatter: false, malformed: true, malformedDetail: "unclosed frontmatter" };
  }

  if (malformed) {
    // Try to parse what we can
    return { data: {}, content: raw, raw, hasFrontmatter: true, malformed: true, malformedDetail };
  }

  try {
    const parsed = matter(raw);
    return {
      data: parsed.data as Record<string, unknown>,
      content: parsed.content,
      raw,
      hasFrontmatter: true,
      malformed: false,
    };
  } catch {
    return { data: {}, content: raw, raw, hasFrontmatter: true, malformed: true, malformedDetail: "yaml parse error" };
  }
}

export function fixFrontmatter(raw: string): { text: string; changed: boolean } {
  if (!raw.startsWith("---")) return { text: raw, changed: false };

  const lines = raw.split("\n");
  let changed = false;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "---") break;

    const trimmed = line.replace(/\s+$/, "");
    if (trimmed.endsWith("---") && trimmed !== "---") {
      lines[i] = trimmed.slice(0, -3).replace(/\s+$/, "");
      lines.splice(i + 1, 0, "---");
      changed = true;
      break;
    }
  }

  return { text: lines.join("\n"), changed };
}

export function getTags(data: Record<string, unknown>): string[] {
  const tags = data.tags;
  if (Array.isArray(tags)) return tags.filter((t): t is string => typeof t === "string");
  if (typeof tags === "string") return [tags];
  return [];
}

export function setTags(data: Record<string, unknown>, tags: string[]): void {
  data.tags = tags;
}

export function writeWithFrontmatter(filePath: string, data: Record<string, unknown>, content: string): void {
  const serialized = matter.stringify(content, data);
  writeFileSync(filePath, serialized, "utf-8");
}
