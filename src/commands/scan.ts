import chalk from "chalk";
import ora from "ora";
import { scanVault } from "../core/scanner.js";
import { loadConfig } from "../core/config.js";
import type { ScanResult, Issue } from "../types.js";

const SEVERITY_COLOR: Record<string, chalk.Chalk> = {
  critical: chalk.red.bold,
  high: chalk.red,
  medium: chalk.yellow,
  low: chalk.gray,
};

const KIND_LABEL: Record<string, string> = {
  yaml_malformed: "Malformed YAML",
  yaml_unclosed: "Unclosed frontmatter",
  no_frontmatter: "Missing frontmatter",
  tag_conflict: "Tag conflict",
  missing_layer: "Missing layer tag",
  missing_created: "Missing created date",
  broken_link: "Broken wikilink",
  orphan: "Orphan file",
  stale_marker: "Stale marker",
};

function formatIssue(i: Issue, mode: "pretty" | "compact"): string {
  const fixable = i.fixable ? "fix" : "manual";
  if (mode === "compact") {
    return `${i.severity}\t${i.kind}\t${i.file}\t${i.detail}\t${fixable}`;
  }
  const color = SEVERITY_COLOR[i.severity] || chalk.white;
  const label = KIND_LABEL[i.kind] || i.kind;
  const fixTag = i.fixable ? chalk.green("fixable") : chalk.dim("manual");
  return `  ${color(i.severity.padEnd(8))} ${label.padEnd(22)} ${chalk.dim(i.file)} ${chalk.dim(i.detail)} [${fixTag}]`;
}

export async function scanCommand(
  vaultPath: string,
  options: { json?: boolean; severity?: string; format?: string }
): Promise<void> {
  const config = loadConfig(vaultPath);
  const spinner = ora("Scanning vault...").start();

  let result: ScanResult;
  try {
    result = await scanVault(vaultPath, config);
  } catch (err: any) {
    spinner.fail(`Scan failed: ${err.message}`);
    process.exit(1);
  }

  spinner.succeed(
    `Scanned ${result.filesScanned} files, found ${result.issues.length} issues`
  );

  const format = options.format || "pretty";
  if (format === "json" || options.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  const severityOrder = ["critical", "high", "medium", "low"];
  const minSeverity = options.severity
    ? severityOrder.indexOf(options.severity)
    : 3;

  let filtered = result.issues;
  if (options.severity) {
    filtered = result.issues.filter(
      (i) => severityOrder.indexOf(i.severity) <= minSeverity
    );
  }

  const mode = format === "compact" ? "compact" : "pretty";

  // Summary
  console.log(chalk.bold("\nSummary:"));
  const summary = result.summary;
  const kinds = Object.keys(summary) as Array<keyof typeof summary>;
  if (kinds.length === 0) {
    console.log(chalk.green("  No issues found. Vault is healthy."));
    return;
  }

  for (const kind of kinds) {
    if (!summary[kind]) continue;
    const label = KIND_LABEL[kind] || kind;
    console.log(`  ${label}: ${chalk.bold(summary[kind])}`);
  }

  // Group by severity
  const bySeverity = new Map<string, Issue[]>();
  for (const issue of filtered) {
    const arr = bySeverity.get(issue.severity) || [];
    arr.push(issue);
    bySeverity.set(issue.severity, arr);
  }

  for (const sev of ["critical", "high", "medium", "low"]) {
    const issues = bySeverity.get(sev);
    if (!issues?.length) continue;
    if (mode === "pretty") {
      const color = SEVERITY_COLOR[sev] || chalk.white;
      console.log(`\n${color(`${sev.toUpperCase()} (${issues.length})`)}`);
    }
    for (const issue of issues) {
      console.log(formatIssue(issue, mode));
    }
  }

  const fixable = result.issues.filter((i) => i.fixable).length;
  if (mode === "pretty") {
    console.log(
      chalk.dim(`\n${fixable} fixable issues. Run `) +
        chalk.cyan("vault-doctor fix") +
        chalk.dim(" to auto-remediate.")
    );
  }
}
