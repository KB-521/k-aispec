import path from "node:path";
import { copyFile, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";

import { DEFAULT_MANAGED_ROOTS, DEFAULT_PACKAGE_NAME, SCHEMA_VERSION } from "../src/core/constants";
import { sha256 } from "../src/core/hash";
import type { AssetManifestFile } from "../src/types";

const repoRoot = path.resolve(__dirname, "..", "..");
const managedOutputRoot = path.join(repoRoot, "distribution", "managed");
const manifestPath = path.join(repoRoot, "distribution", "asset-manifest.json");

const normalize = (value: string): string => value.replace(/\\/g, "/");

const listFiles = async (absoluteRoot: string): Promise<string[]> => {
  const entries = await readdir(absoluteRoot, { withFileTypes: true } as any);
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(absoluteRoot, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(absolutePath)));
      continue;
    }

    if (entry.isFile()) {
      files.push(absolutePath);
    }
  }

  return files;
};

const copyManagedFile = async (sourcePath: string, targetPath: string): Promise<void> => {
  await mkdir(path.dirname(targetPath), { recursive: true });
  await copyFile(sourcePath, targetPath);
};

const buildManifest = async (): Promise<void> => {
  const packageJson = JSON.parse(
    await readFile(path.join(repoRoot, "package.json"), "utf8")
  ) as { name?: string; version?: string };
  const files: AssetManifestFile[] = [];

  await rm(managedOutputRoot, { recursive: true, force: true });
  await mkdir(managedOutputRoot, { recursive: true });

  for (const managedRoot of DEFAULT_MANAGED_ROOTS) {
    const absoluteRoot = path.join(repoRoot, managedRoot);
    const absoluteFiles = await listFiles(absoluteRoot);

    for (const absoluteFile of absoluteFiles.sort()) {
      const relativePath = normalize(path.relative(repoRoot, absoluteFile));
      const targetPath = path.join(managedOutputRoot, relativePath);
      const content = await readFile(absoluteFile);

      await copyManagedFile(absoluteFile, targetPath);
      files.push({
        path: relativePath,
        sha256: sha256(content),
        size: content.length
      });
    }
  }

  const generatedAt = process.env.SOURCE_DATE_EPOCH
    ? new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000).toISOString()
    : new Date(0).toISOString();
  const manifest = {
    schemaVersion: SCHEMA_VERSION,
    packageName: packageJson.name ?? DEFAULT_PACKAGE_NAME,
    packageVersion: packageJson.version ?? "0.0.0",
    generatedAt,
    managedRoots: DEFAULT_MANAGED_ROOTS,
    files
  };

  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Generated asset manifest with ${files.length} files.`);
};

void buildManifest();
