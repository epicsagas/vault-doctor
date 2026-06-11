import chalk from "chalk";
import ora from "ora";
import { loadConfig } from "../core/config.js";
import { scanVault } from "../core/scanner.js";
import { fixVault } from "../core/fixer.js";

export async function fixCommand(
  vaultPath: string,
  options: { dryRun?: boolean }
): Promise<void> {
  const config = loadConfig(vaultPath);
  const spinner = ora("Scanning vault...").start();

  let result;
  try {
    result = await scanVault(vaultPath, config);
  } catch (err: any) {
    spinner.fail(`Scan failed: ${err.message}`);
    process.exit(1);
  }

  const fixable = result.issues.filter((i) => i.fixable);
  if (fixable.length === 0) {
    spinner.succeed("No fixable issues found.");
    return;
  }

  spinner.info(`Found ${fixable.length} fixable issues. Applying fixes...`);

  const fixResult = fixVault(vaultPath, config, fixable, options.dryRun);

  if (options.dryRun) {
    console.log(chalk.bold("\nDry run — no changes written.\n"));
  }

  for (const fix of fixResult.fixes) {
    console.log(chalk.green("  + ") + fix);
  }

  console.log(
    chalk.bold(`\n${options.dryRun ? "Would fix" : "Fixed"} ${fixResult.filesFixed} files.`)
  );
}
