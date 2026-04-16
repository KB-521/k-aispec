import path from "node:path";
import { readFile } from "node:fs/promises";

import type { AssetManifest, AssetManifestFile } from "../types";

import { CliError } from "./errors";

export const getManifestPath = (packageRoot: string): string =>
  path.join(packageRoot, "distribution", "asset-manifest.json");

export const getManagedAssetPath = (packageRoot: string, relativePath: string): string =>
  path.join(packageRoot, "distribution", "managed", relativePath);

const isManifestFile = (value: unknown): value is AssetManifestFile => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as AssetManifestFile;
  return (
    typeof candidate.path === "string" &&
    typeof candidate.sha256 === "string" &&
    typeof candidate.size === "number"
  );
};

export const validateManifest = (value: unknown): AssetManifest => {
  if (!value || typeof value !== "object") {
    throw new CliError("Asset manifest is missing or invalid.");
  }

  const manifest = value as AssetManifest;
  if (
    typeof manifest.schemaVersion !== "number" ||
    typeof manifest.packageName !== "string" ||
    typeof manifest.packageVersion !== "string" ||
    typeof manifest.generatedAt !== "string" ||
    !Array.isArray(manifest.managedRoots) ||
    !Array.isArray(manifest.files)
  ) {
    throw new CliError("Asset manifest has an unsupported shape.");
  }

  for (const file of manifest.files) {
    if (!isManifestFile(file)) {
      throw new CliError("Asset manifest contains an invalid file entry.");
    }
  }

  return manifest;
};

export const loadManifest = async (packageRoot: string): Promise<AssetManifest> => {
  try {
    const raw = await readFile(getManifestPath(packageRoot), "utf8");
    return validateManifest(JSON.parse(raw));
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      throw new CliError(
        "Missing `distribution/asset-manifest.json`. Run `npm run build` before using the CLI."
      );
    }

    throw error;
  }
};

export const indexManifestFiles = (manifest: AssetManifest): Map<string, AssetManifestFile> =>
  new Map(manifest.files.map((file) => [file.path, file]));
