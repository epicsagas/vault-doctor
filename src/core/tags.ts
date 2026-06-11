import { getTags, setTags, type FrontmatterResult } from "./frontmatter.js";

export function findConflicts(
  fm: FrontmatterResult,
  pairs: string[][]
): string[] | null {
  const tags = getTags(fm.data);
  for (const pair of pairs) {
    const hasFirst = tags.some((t) => t === pair[0]);
    const hasSecond = tags.some((t) => t === pair[1]);
    if (hasFirst && hasSecond) return pair;
  }
  return null;
}

export function removeTag(
  data: Record<string, unknown>,
  tag: string
): boolean {
  const tags = getTags(data);
  const filtered = tags.filter((t) => t !== tag);
  if (filtered.length === tags.length) return false;
  setTags(data, filtered);
  return true;
}
