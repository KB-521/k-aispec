import path from "node:path";
import { readdir } from "node:fs/promises";

import type { CommandContext, ManagedScope, ProfileName } from "../types";

import { ExitCode } from "../core/constants";
import { CliError } from "../core/errors";
import { copyFileAtomic } from "../core/file-manager";
import { describeFile } from "../core/hash";
import { formatEntries } from "../core/output";
import { getManagedAssetPath, loadManifest } from "../core/manifest";
import { matchesScope, resolveManagedRoots } from "../core/scope";
import { loadState, mergeStateWithManifest, writeState } from "../core/state-store";

interface InitOptions {
  scope: ManagedScope;
  profile: ProfileName;
  force: boolean;
  dryRun: boolean;
}

const rootHasContent = async (projectRoot: string, relativeRoot: string): Promise<boolean> => {
  const absoluteRoot = path.join(projectRoot, relativeRoot);

  try {
    const entries = await readdir(absoluteRoot);
    return entries.length > 0;
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      return false;
    }

    if (error?.code === "ENOTDIR") {
      return true;
    }

    throw error;
  }
};

export const runInitCommand = async (
  context: CommandContext,
  options: InitOptions
): Promise<number> => {
  const manifest = await loadManifest(context.packageRoot);
  const selectedFiles = manifest.files.filter((file) => matchesScope(file.path, options.scope));
  const existingState = await loadState(context.cwd);

  if (
    existingState &&
    Object.keys(existingState.files).some((relativePath) => matchesScope(relativePath, options.scope))
  ) {
    throw new CliError(
      "OpenSpec is already managing this scope. Use `openspec update` instead of `init`.",
      ExitCode.CONFLICT
    );
  }

  const occupiedRoots: string[] = [];
  for (const managedRoot of resolveManagedRoots(options.scope, options.profile)) {
    if (await rootHasContent(context.cwd, managedRoot)) {
      occupiedRoots.push(managedRoot);
    }
  }

  if (occupiedRoots.length > 0 && !options.force) {
    throw new CliError(
      `Refusing to take over existing content in: ${occupiedRoots.join(", ")}. Re-run with \`--force\` to proceed.`,
      ExitCode.CONFLICT
    );
  }

  const overwritten: string[] = [];
  const created: string[] = [];

  for (const file of selectedFiles) {
    const sourcePath = getManagedAssetPath(context.packageRoot, file.path);
    const targetPath = path.join(context.cwd, file.path);
    const current = await describeFile(targetPath);

    if (current.exists && current.sha256 === file.sha256) {
      continue;
    }

    if (current.exists) {
      overwritten.push(file.path);
    } else {
      created.push(file.path);
    }

    if (!options.dryRun) {
      await copyFileAtomic(sourcePath, targetPath);
    }
  }

  const nextState = mergeStateWithManifest(
    existingState,
    manifest,
    options.scope,
    context.now().toISOString()
  );

  if (!options.dryRun) {
    await writeState(context.cwd, nextState);
  }

  context.stdout.write(
    `init ${options.dryRun ? "(dry-run) " : ""}completed: created ${created.length}, overwritten ${overwritten.length}, adopted ${selectedFiles.length - created.length - overwritten.length}\n`
  );

  if (overwritten.length > 0) {
    context.stdout.write(formatEntries({
      entries: overwritten.map((relativePath) => ({
        kind: "updated-safe",
        path: relativePath,
        operation: "write",
        reason: "target file existed and will be replaced during init",
        targetSha256: null,
        installedSha256: null,
        currentSha256: null
      })),
      summary: {
        added: 0,
        "updated-safe": overwritten.length,
        "updated-conflict": 0,
        "deleted-safe": 0,
        "deleted-conflict": 0
      }
    }).join("\n") + "\n");
  }

  return ExitCode.OK;
};
