import { describe, it, expect } from "vitest";
import {
  parseFrontmatterText,
  fixFrontmatter,
  getTags,
} from "../core/frontmatter.js";
import { extractWikilinks, resolveWikilink } from "../core/links.js";
import { findConflicts, removeTag } from "../core/tags.js";

describe("frontmatter", () => {
  it("parses valid frontmatter", () => {
    const raw = "---\ntitle: Test\ntags:\n  - foo\n---\nContent";
    const result = parseFrontmatterText(raw);
    expect(result.hasFrontmatter).toBe(true);
    expect(result.malformed).toBe(false);
    expect(result.data.title).toBe("Test");
    expect(result.content.trim()).toBe("Content");
  });

  it("detects no frontmatter", () => {
    const raw = "# Just a title\nSome content";
    const result = parseFrontmatterText(raw);
    expect(result.hasFrontmatter).toBe(false);
    expect(result.malformed).toBe(false);
  });

  it("detects malformed closing --- merged into value", () => {
    const raw = "---\ntitle: Test---\nContent";
    const result = parseFrontmatterText(raw);
    expect(result.malformed).toBe(true);
    expect(result.malformedDetail).toContain("merged into value");
  });

  it("fixes malformed closing ---", () => {
    const raw = "---\ntitle: Test---\nContent";
    const { text, changed } = fixFrontmatter(raw);
    expect(changed).toBe(true);
    expect(text).toContain("title: Test\n---");
  });

  it("getTags returns array from array", () => {
    expect(getTags({ tags: ["a", "b"] })).toEqual(["a", "b"]);
  });

  it("getTags returns array from string", () => {
    expect(getTags({ tags: "single" })).toEqual(["single"]);
  });

  it("getTags returns empty for missing tags", () => {
    expect(getTags({})).toEqual([]);
  });
});

describe("links", () => {
  it("extracts wikilinks", () => {
    const text = "See [[Foo]] and [[Bar|alias]] and [[Baz/Qux]]";
    const links = extractWikilinks(text);
    expect(links).toEqual(["Foo", "Bar", "Baz/Qux"]);
  });

  it("resolves direct file path", () => {
    const files = new Set(["Home.md"]);
    expect(resolveWikilink("Home.md", "/tmp", files)).toBe(true);
  });

  it("resolves by stem match", () => {
    const files = new Set(["Home.md", "Home"]);
    expect(resolveWikilink("Home", "/nonexistent", files)).toBe(true);
  });

  it("returns false for missing target", () => {
    const files = new Set(["Other.md"]);
    expect(resolveWikilink("Missing", "/nonexistent", files)).toBe(false);
  });
});

describe("tags", () => {
  it("finds conflict when both tags present", () => {
    const fm = parseFrontmatterText("---\ntags:\n  - status/seed\n  - status/evergreen\n---\n");
    const conflict = findConflicts(fm, [["status/seed", "status/evergreen"]]);
    expect(conflict).toEqual(["status/seed", "status/evergreen"]);
  });

  it("returns null when no conflict", () => {
    const fm = parseFrontmatterText("---\ntags:\n  - status/seed\n---\n");
    const conflict = findConflicts(fm, [["status/seed", "status/evergreen"]]);
    expect(conflict).toBeNull();
  });

  it("removeTag removes tag and returns true", () => {
    const data = { tags: ["a", "b", "c"] };
    expect(removeTag(data, "b")).toBe(true);
    expect(data.tags).toEqual(["a", "c"]);
  });

  it("removeTag returns false when tag not found", () => {
    const data = { tags: ["a", "b"] };
    expect(removeTag(data, "z")).toBe(false);
  });
});
