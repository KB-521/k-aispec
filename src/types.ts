export type ManagedScope = "all" | "skills" | "openspec";
export type ProfileName = "default" | "full-compat";
export type DiffKind =
  | "added"
  | "updated-safe"
  | "updated-conflict"
  | "deleted-safe"
  | "deleted-conflict";
export type PlannedOperation = "write" | "delete" | "skip";

export interface AssetManifestFile {
  path: string;
  sha256: string;
  size: number;
}

export interface AssetManifest {
  schemaVersion: number;
  packageName: string;
  packageVersion: string;
  generatedAt: string;
  managedRoots: string[];
  files: AssetManifestFile[];
}

export interface StateFileRecord {
  installedSha256: string;
  size: number;
}

export interface StateFile {
  schemaVersion: number;
  packageName: string;
  installedVersion: string;
  installedAt: string;
  managedRoots: string[];
  files: Record<string, StateFileRecord>;
}

export interface FileFingerprint {
  exists: boolean;
  sha256: string | null;
  size: number | null;
}

export interface DiffEntry {
  kind: DiffKind;
  path: string;
  operation: PlannedOperation;
  reason: string;
  targetSha256: string | null;
  installedSha256: string | null;
  currentSha256: string | null;
}

export interface DiffPlan {
  entries: DiffEntry[];
  summary: Record<DiffKind, number>;
}

export interface WriterLike {
  write(chunk: string): void;
}

export interface CommandContext {
  cwd: string;
  packageRoot: string;
  stdout: WriterLike;
  stderr: WriterLike;
  now(): Date;
}
