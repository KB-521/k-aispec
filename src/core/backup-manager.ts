import path from "node:path";

import { BACKUP_DIRECTORY } from "./constants";
import { copyFileAtomic, ensureDirectory, removeFileIfExists } from "./file-manager";

export const createBackupRoot = async (projectRoot: string, timestamp: string): Promise<string> => {
  const backupRoot = path.join(projectRoot, BACKUP_DIRECTORY, timestamp);
  await ensureDirectory(backupRoot);
  return backupRoot;
};

export const backupFile = async (
  projectRoot: string,
  absolutePath: string,
  backupRoot: string
): Promise<string> => {
  const relativePath = path.relative(projectRoot, absolutePath);
  const backupPath = path.join(backupRoot, relativePath);
  await copyFileAtomic(absolutePath, backupPath);
  return backupPath;
};

export const moveFileToBackup = async (
  projectRoot: string,
  absolutePath: string,
  backupRoot: string
): Promise<string> => {
  const backupPath = await backupFile(projectRoot, absolutePath, backupRoot);
  await removeFileIfExists(absolutePath);
  return backupPath;
};
