export const SCHEMA_VERSION = 1;
export const DEFAULT_PACKAGE_NAME = "@king/openspec-cli";
export const DEFAULT_PROFILE = "default";
export const DEFAULT_MANAGED_ROOTS = [".codex/skills", ".agents", ".claude", "openspec"];
export const SKILL_MANAGED_ROOTS = [".codex/skills", ".agents", ".claude"];
export const STATE_DIRECTORY = ".openspec";
export const STATE_FILE_PATH = ".openspec/state.json";
export const BACKUP_DIRECTORY = ".openspec/backups";

export enum ExitCode {
  OK = 0,
  USAGE = 1,
  CONFLICT = 2,
  STATE_MISSING = 3,
  FAILURE = 10
}
