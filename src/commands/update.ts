import path from "node:path";

import type {
  AssetManifestFile,
  CommandContext,
  DiffEntry,
  ManagedScope,
  StateFile
} from "../types";

import { createBackupRoot, backupFile } from "../core/backup-manager";
import { ExitCode } from "../core/constants";
import { buildDiffPlan } from "../core/diff-engine";
import { CliError } from "../core/errors";
import { cleanupEmptyParents, copyFileAtomic, removeFileIfExists } from "../core/file-manager";
import { describeFile } from "../core/hash";
import { getManagedAssetPath, indexManifestFiles, loadManifest } from "../core/manifest";
import { formatEntries, formatSummary } from "../core/output";
import { matchesScope } from "../core/scope";
import { loadState, writeState } from "../core/state-store";

interface UpdateOptions {
  scope: ManagedScope;
  check: boolean;
  force: boolean;
  backup: boolean;
  dryRun: boolean;
}

const applyWrite = async (
  context: CommandContext,
  file: AssetManifestFile,
  backupRoot: string | null
): Promise<void> => {
  const targetPath = path.join(context.cwd, file.path);
  const current = await describeFile(targetPath);

  if (current.exists && current.sha256 !== file.sha256 && backupRoot) {
    await backupFile(context.cwd, targetPath, backupRoot);
  }

  await copyFileAtomic(getManagedAssetPath(context.packageRoot, file.path), targetPath);
};

const applyDelete = async (
  context: CommandContext,
  relativePath: string,
  backupRoot: string | null
): Promise<void> => {
  const absolutePath = path.join(context.cwd, relativePath);
  const current = await describeFile(absolutePath);

  if (current.exists && backupRoot) {
    await backupFile(context.cwd, absolutePath, backupRoot);
  }

  if (current.exists) {
    await removeFileIfExists(absolutePath);
    await cleanupEmptyParents(absolutePath, context.cwd);
  }
};

const buildNextState = (
  previousState: StateFile,
  desiredFiles: Map<string, AssetManifestFile>,
  planEntries: DiffEntry[],
  scope: ManagedScope,
  manifestPackage: { packageName: string; packageVersion: string; managedRoots: string[] },
  installedAt: string,
  force: boolean
): StateFile => {
  const nextFiles = Object.fromEntries(
    Object.entries(previousState.files).filter(([relativePath]) =>
      scope === "all" ? false : !matchesScope(relativePath, scope)
    )
  );
  const conflicts = new Set(
    planEntries
      .filter((entry) => entry.kind.endsWith("conflict") && !force)
      .map((entry) => entry.path)
  );
  const scopedPaths = [...new Set([...desiredFiles.keys(), ...planEntries.map((entry) => entry.path)])].sort();

  for (const relativePath of scopedPaths) {
    if (conflicts.has(relativePath)) {
      if (previousState.files[relativePath]) {
        nextFiles[relativePath] = previousState.files[relativePath];
      }
      continue;
    }

    const desired = desiredFiles.get(relativePath);
    if (desired) {
      nextFiles[relativePath] = {
        installedSha256: desired.sha256,
        size: desired.size
      };
    }
  }

  return {
    ...previousState,
    packageName: manifestPackage.packageName,
    installedVersion: manifestPackage.packageVersion,
    installedAt,
    managedRoots: manifestPackage.managedRoots,
    files: nextFiles
  };
};

export const runUpdateCommand = async (
  context: CommandContext,
  options: UpdateOptions
): Promise<number> => {
  const manifest = await loadManifest(context.packageRoot);
  const state = await loadState(context.cwd);

  if (!state) {
    throw new CliError(
      "No `.openspec/state.json` found. Run `openspec init` before `update`.",
      ExitCode.STATE_MISSING
    );
  }

  const desiredFiles = new Map(
    manifest.files.filter((file) => matchesScope(file.path, options.scope)).map((file) => [file.path, file])
  );
  const installedFiles = Object.fromEntries(
    Object.entries(state.files).filter(([relativePath]) => matchesScope(relativePath, options.scope))
  );
  const plan = await buildDiffPlan(context.cwd, desiredFiles, installedFiles);
  const conflicts = plan.entries.filter((entry) => entry.kind.endsWith("conflict"));

  context.stdout.write(`update plan: ${formatSummary(plan)}\n`);
  if (plan.entries.length > 0) {
    context.stdout.write(`${formatEntries(plan).join("\n")}\n`);
  }

  if (options.check || options.dryRun) {
    return conflicts.length > 0 && !options.force ? ExitCode.CONFLICT : ExitCode.OK;
  }

  const desiredIndex = indexManifestFiles(manifest);
  let backupRoot: string | null = null;
  const ensureBackupRoot = async (): Promise<string> => {
    if (!backupRoot) {
      const timestamp = context.now().toISOString().replace(/[:.]/g, "-");
      backupRoot = await createBackupRoot(context.cwd, timestamp);
    }

    return backupRoot;
  };

  for (const entry of plan.entries) {
    const isConflict = entry.kind.endsWith("conflict");
    if (isConflict && !options.force) {
      continue;
    }

    const current = await describeFile(path.join(context.cwd, entry.path));
    const shouldBackup = options.backup && current.exists;
    const activeBackupRoot = shouldBackup ? await ensureBackupRoot() : null;

    if (entry.operation === "write") {
      const desired = desiredIndex.get(entry.path);
      if (!desired) {
        throw new CliError(`Missing package asset for ${entry.path}.`);
      }

      await applyWrite(context, desired, activeBackupRoot);
      continue;
    }

    if (entry.operation === "delete") {
      await applyDelete(context, entry.path, activeBackupRoot);
    }
  }

  const nextState = buildNextState(
    state,
    desiredFiles,
    plan.entries,
    options.scope,
    manifest,
    context.now().toISOString(),
    options.force
  );
  await writeState(context.cwd, nextState);

  if (conflicts.length > 0 && !options.force) {
    context.stderr.write(
      `update completed with conflicts left untouched: ${conflicts.length}\n`
    );
    return ExitCode.CONFLICT;
  }

  return ExitCode.OK;
};
