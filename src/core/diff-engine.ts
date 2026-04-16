import path from "node:path";

import type { AssetManifestFile, DiffEntry, DiffPlan, DiffKind, StateFileRecord } from "../types";

import { describeFile } from "./hash";

const emptySummary = (): Record<DiffKind, number> => ({
  added: 0,
  "updated-safe": 0,
  "updated-conflict": 0,
  "deleted-safe": 0,
  "deleted-conflict": 0
});

export const buildDiffPlan = async (
  projectRoot: string,
  desiredFiles: Map<string, AssetManifestFile>,
  installedFiles: Record<string, StateFileRecord>
): Promise<DiffPlan> => {
  const allPaths = [...new Set([...desiredFiles.keys(), ...Object.keys(installedFiles)])].sort();
  const entries: DiffEntry[] = [];

  for (const relativePath of allPaths) {
    const desired = desiredFiles.get(relativePath) ?? null;
    const installed = installedFiles[relativePath] ?? null;
    const current = await describeFile(path.join(projectRoot, relativePath));

    if (desired && !installed) {
      if (!current.exists) {
        entries.push({
          kind: "added",
          path: relativePath,
          operation: "write",
          reason: "new managed file is missing locally",
          targetSha256: desired.sha256,
          installedSha256: null,
          currentSha256: current.sha256
        });
      } else if (current.sha256 === desired.sha256) {
        entries.push({
          kind: "added",
          path: relativePath,
          operation: "skip",
          reason: "local file already matches the package asset and can be adopted",
          targetSha256: desired.sha256,
          installedSha256: null,
          currentSha256: current.sha256
        });
      } else {
        entries.push({
          kind: "updated-conflict",
          path: relativePath,
          operation: "write",
          reason: "local file exists but is not tracked by OpenSpec",
          targetSha256: desired.sha256,
          installedSha256: null,
          currentSha256: current.sha256
        });
      }

      continue;
    }

    if (desired && installed) {
      const currentMatchesInstalled = current.exists && current.sha256 === installed.installedSha256;
      const currentMatchesDesired = current.exists && current.sha256 === desired.sha256;
      const desiredMatchesInstalled = desired.sha256 === installed.installedSha256;

      if (desiredMatchesInstalled) {
        if (!current.exists) {
          entries.push({
            kind: "added",
            path: relativePath,
            operation: "write",
            reason: "managed file is missing locally and will be restored",
            targetSha256: desired.sha256,
            installedSha256: installed.installedSha256,
            currentSha256: current.sha256
          });
        } else if (!currentMatchesInstalled && !currentMatchesDesired) {
          entries.push({
            kind: "updated-conflict",
            path: relativePath,
            operation: "write",
            reason: "local file diverged from the installed managed version",
            targetSha256: desired.sha256,
            installedSha256: installed.installedSha256,
            currentSha256: current.sha256
          });
        }

        continue;
      }

      if (!current.exists) {
        entries.push({
          kind: "updated-safe",
          path: relativePath,
          operation: "write",
          reason: "managed file is missing locally and will be recreated from the package",
          targetSha256: desired.sha256,
          installedSha256: installed.installedSha256,
          currentSha256: current.sha256
        });
      } else if (currentMatchesInstalled) {
        entries.push({
          kind: "updated-safe",
          path: relativePath,
          operation: "write",
          reason: "local file still matches the previously installed version",
          targetSha256: desired.sha256,
          installedSha256: installed.installedSha256,
          currentSha256: current.sha256
        });
      } else if (currentMatchesDesired) {
        entries.push({
          kind: "updated-safe",
          path: relativePath,
          operation: "skip",
          reason: "local file already matches the new package version",
          targetSha256: desired.sha256,
          installedSha256: installed.installedSha256,
          currentSha256: current.sha256
        });
      } else {
        entries.push({
          kind: "updated-conflict",
          path: relativePath,
          operation: "write",
          reason: "local file diverged from both the installed and target versions",
          targetSha256: desired.sha256,
          installedSha256: installed.installedSha256,
          currentSha256: current.sha256
        });
      }

      continue;
    }

    if (!desired && installed) {
      if (!current.exists || current.sha256 === installed.installedSha256) {
        entries.push({
          kind: "deleted-safe",
          path: relativePath,
          operation: current.exists ? "delete" : "skip",
          reason: current.exists
            ? "package removed this file and the local copy still matches the installed version"
            : "package removed this file and the local copy is already gone",
          targetSha256: null,
          installedSha256: installed.installedSha256,
          currentSha256: current.sha256
        });
      } else {
        entries.push({
          kind: "deleted-conflict",
          path: relativePath,
          operation: "delete",
          reason: "package removed this file but the local copy was modified",
          targetSha256: null,
          installedSha256: installed.installedSha256,
          currentSha256: current.sha256
        });
      }
    }
  }

  const summary = emptySummary();
  for (const entry of entries) {
    summary[entry.kind] += 1;
  }

  return { entries, summary };
};
