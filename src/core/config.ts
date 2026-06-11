import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { DEFAULT_CONFIG, type VaultConfig } from "../types.js";

export function loadConfig(vaultPath: string): VaultConfig {
  const configPath = join(vaultPath, "vault-doctor.json");
  if (!existsSync(configPath)) return DEFAULT_CONFIG;
  try {
    const raw = JSON.parse(readFileSync(configPath, "utf-8"));
    return { ...DEFAULT_CONFIG, ...raw };
  } catch {
    return DEFAULT_CONFIG;
  }
}
