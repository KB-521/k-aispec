import path from "node:path";
import { readFile } from "node:fs/promises";

import type { AssetManifest, ManagedScope, StateFile } from "../types";

import { SCHEMA_VERSION, STATE_FILE_PATH } from "./constants";
import { CliError } from "./errors";
import { atomicWriteFile } from "./file-manager";
import { filterByScope, filterRecordByScope, matchesScope } from "./scope";

export const getStatePath = (projectRoot: string): string =>
  path.join(projectRoot, STATE_FILE_PATH);

export const validateState = (value: unknown): StateFile => {
  if (!value || typeof value !== "object") {
    throw new CliError("Local `.openspec/state.json` is invalid.");
  }

  const state = value as StateFile;
  if (
    typeof state.schemaVersion !== "number" ||
    typeof state.packageName !== "string" ||
    typeof state.installedVersion !== "string" ||
    typeof state.installedAt !== "string" ||
    !Array.isArray(state.managedRoots) ||
    !state.files ||
    typeof state.files !== "object"
  ) {
    throw new CliError("Local `.openspec/state.json` has an unsupported shape.");
  }

  return state;
};

export const loadState = async (projectRoot: string): Promise<StateFile | null> => {
  try {
    const raw = await readFile(getStatePath(projectRoot), "utf8");
    return validateState(JSON.parse(raw));
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      return null;
    }

    throw error;
  }
};

export const writeState = async (projectRoot: string, state: StateFile): Promise<void> => {
  await atomicWriteFile(getStatePath(projectRoot), `${JSON.stringify(state, null, 2)}\n`);
};

export const createStateFromManifest = (
  manifest: AssetManifest,
  scope: ManagedScope,
  installedAt: string
): StateFile => {
  const files = Object.fromEntries(
    filterByScope(manifest.files, scope).map((file) => [
      file.path,
      {
        installedSha256: file.sha256,
        size: file.size
      }
    ])
  );

  return {
    schemaVersion: SCHEMA_VERSION,
    packageName: manifest.packageName,
    installedVersion: manifest.packageVersion,
    installedAt,
    managedRoots: manifest.managedRoots,
    files
  };
};

export const mergeStateWithManifest = (
  previousState: StateFile | null,
  manifest: AssetManifest,
  scope: ManagedScope,
  installedAt: string
): StateFile => {
  const nextState = createStateFromManifest(manifest, scope, installedAt);
  if (!previousState) {
    return nextState;
  }

  return {
    ...previousState,
    schemaVersion: SCHEMA_VERSION,
    packageName: manifest.packageName,
    installedVersion: manifest.packageVersion,
    installedAt,
    managedRoots: manifest.managedRoots,
    files: {
      ...Object.fromEntries(
        Object.entries(previousState.files).filter(
          ([relativePath]) => !matchesScope(relativePath, scope)
        )
      ),
      ...nextState.files
    }
  };
};

export const dropStateScope = (state: StateFile, scope: ManagedScope): StateFile => ({
  ...state,
  files:
    scope === "all"
      ? {}
      : Object.fromEntries(
          Object.entries(state.files).filter(([relativePath]) => !matchesScope(relativePath, scope))
        )
});
