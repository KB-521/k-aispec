import path from "node:path";
import { copyFile, mkdir, readdir, rename, rm, rmdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

export const ensureDirectory = async (absolutePath: string): Promise<void> => {
  await mkdir(absolutePath, { recursive: true });
};

export const ensureParentDirectory = async (absolutePath: string): Promise<void> => {
  await ensureDirectory(path.dirname(absolutePath));
};

export const atomicWriteFile = async (
  absolutePath: string,
  content: string | Uint8Array
): Promise<void> => {
  await ensureParentDirectory(absolutePath);
  const temporaryPath = `${absolutePath}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, content);
  await rename(temporaryPath, absolutePath);
};

export const copyFileAtomic = async (sourcePath: string, targetPath: string): Promise<void> => {
  await ensureParentDirectory(targetPath);
  const temporaryPath = `${targetPath}.${randomUUID()}.tmp`;
  await copyFile(sourcePath, temporaryPath);
  await rename(temporaryPath, targetPath);
};

export const removeFileIfExists = async (absolutePath: string): Promise<void> => {
  await rm(absolutePath, { force: true });
};

export const removeDirectoryIfEmpty = async (absolutePath: string): Promise<boolean> => {
  try {
    const entries = await readdir(absolutePath);
    if (entries.length > 0) {
      return false;
    }

    await rmdir(absolutePath);
    return true;
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      return true;
    }

    if (error?.code === "ENOTDIR") {
      return false;
    }

    throw error;
  }
};

export const cleanupEmptyParents = async (
  absolutePath: string,
  stopAtAbsolutePath: string
): Promise<void> => {
  let current = path.dirname(absolutePath);
  const boundary = path.resolve(stopAtAbsolutePath);

  while (current.startsWith(boundary) && current !== boundary) {
    const removed = await removeDirectoryIfEmpty(current);
    if (!removed) {
      break;
    }

    current = path.dirname(current);
  }
};
