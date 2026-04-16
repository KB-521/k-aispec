import path from "node:path";

import type { CommandContext, ManagedScope, StateFile } from "../types";

import { createBackupRoot, moveFileToBackup } from "../core/backup-manager";
import { ExitCode } from "../core/constants";
import { buildDiffPlan } from "../core/diff-engine";
import { CliError } from "../core/errors";
import {
  cleanupEmptyParents,
  removeDirectoryIfEmpty,
  removeFileIfExists
} from "../core/file-manager";
import { describeFile } from "../core/hash";
import { formatEntries, formatSummary } from "../core/output";
import { matchesScope } from "../core/scope";
import { dropStateScope, getStatePath, loadState, writeState } from "../core/state-store";

interface UninstallOptions {
  scope: ManagedScope;
  backup: boolean;
  force: boolean;
  dryRun: boolean;
}

const updateStateAfterUninstall = async (
  context: CommandContext,
  previousState: StateFile,
  scope: ManagedScope
): Promise<void> => {
  const nextState = dropStateScope(previousState, scope);
  if (Object.keys(nextState.files).length === 0) {
    const statePath = getStatePath(context.cwd);
    await removeFileIfExists(statePath);
    await cleanupEmptyParents(statePath, context.cwd);
    await removeDirectoryIfEmpty(path.join(context.cwd, ".openspec"));
    return;
  }

  await writeState(context.cwd, nextState);
};

export const runUninstallCommand = async (
  context: CommandContext,
  options: UninstallOptions
): Promise<number> => {
  const state = await loadState(context.cwd);
  if (!state) {
    throw new CliError(
      "No `.openspec/state.json` found. Nothing to uninstall.",
      ExitCode.STATE_MISSING
    );
  }

  const installedFiles = Object.fromEntries(
    Object.entries(state.files).filter(([relativePath]) => matchesScope(relativePath, options.scope))
  );
  const plan = await buildDiffPlan(context.cwd, new Map(), installedFiles);
  const unsafeConflicts = plan.entries.filter(
    (entry) => entry.kind === "deleted-conflict" && !options.backup && !options.force
  );

  context.stdout.write(`uninstall plan: ${formatSummary(plan)}\n`);
  if (plan.entries.length > 0) {
    context.stdout.write(`${formatEntries(plan).join("\n")}\n`);
  }

  if (options.dryRun) {
    return unsafeConflicts.length > 0 ? ExitCode.CONFLICT : ExitCode.OK;
  }

  let backupRoot: string | null = null;
  const ensureBackupRoot = async (): Promise<string> => {
    if (!backupRoot) {
      const timestamp = context.now().toISOString().replace(/[:.]/g, "-");
      backupRoot = await createBackupRoot(context.cwd, timestamp);
    }

    return backupRoot;
  };

  for (const entry of plan.entries) {
    if (entry.operation !== "delete") {
      continue;
    }

    const absolutePath = path.join(context.cwd, entry.path);
    const current = await describeFile(absolutePath);
    if (!current.exists) {
      continue;
    }

    if (entry.kind === "deleted-conflict") {
      if (options.force) {
        await removeFileIfExists(absolutePath);
      } else if (options.backup) {
        await moveFileToBackup(context.cwd, absolutePath, await ensureBackupRoot());
      } else {
        continue;
      }
    } else {
      await removeFileIfExists(absolutePath);
    }

    await cleanupEmptyParents(absolutePath, context.cwd);
  }

  await updateStateAfterUninstall(context, state, options.scope);
  return unsafeConflicts.length > 0 ? ExitCode.CONFLICT : ExitCode.OK;
};
