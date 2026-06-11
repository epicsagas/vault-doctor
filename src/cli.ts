import { Command } from "commander";
import { resolve } from "node:path";
import { scanCommand } from "./commands/scan.js";
import { fixCommand } from "./commands/fix.js";

const program = new Command();

program
  .name("vault-doctor")
  .description("Obsidian vault health diagnostics and auto-remediation")
  .version("0.1.0");

program
  .command("scan")
  .description("Scan vault for health issues")
  .argument("<vault-path>", "Path to Obsidian vault")
  .option("--json", "Output as JSON (shorthand for --format json)")
  .option("--format <type>", "Output format: pretty, compact, json", "pretty")
  .option("--severity <level>", "Minimum severity (critical|high|medium|low)")
  .action(async (vaultPath: string, opts: { json?: boolean; severity?: string; format?: string }) => {
    await scanCommand(resolve(vaultPath), opts);
  });

program
  .command("fix")
  .description("Auto-fix vault issues")
  .argument("<vault-path>", "Path to Obsidian vault")
  .option("--dry-run", "Preview fixes without writing")
  .action(async (vaultPath: string, opts: { dryRun?: boolean }) => {
    await fixCommand(resolve(vaultPath), opts);
  });

program.parse();
