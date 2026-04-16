import type { ManagedScope, ProfileName } from "../types";

import { DEFAULT_MANAGED_ROOTS, DEFAULT_PROFILE, SKILL_MANAGED_ROOTS } from "./constants";
import { CliError } from "./errors";

const VALID_SCOPES = new Set<ManagedScope>(["all", "skills", "openspec"]);
const VALID_PROFILES = new Set<ProfileName>(["default", "full-compat"]);

const normalizePath = (value: string): string => value.replace(/\\/g, "/");

export const parseScope = (value: unknown): ManagedScope => {
  if (typeof value !== "string" || !VALID_SCOPES.has(value as ManagedScope)) {
    throw new CliError("`--scope` must be one of: all, skills, openspec.");
  }

  return value as ManagedScope;
};

export const parseProfile = (value: unknown): ProfileName => {
  if (value === undefined) {
    return DEFAULT_PROFILE as ProfileName;
  }

  if (typeof value !== "string" || !VALID_PROFILES.has(value as ProfileName)) {
    throw new CliError("`--profile` must be one of: default, full-compat.");
  }

  return value as ProfileName;
};

export const matchesScope = (relativePath: string, scope: ManagedScope): boolean => {
  if (scope === "all") {
    return true;
  }

  const normalized = normalizePath(relativePath);
  return scope === "skills"
    ? SKILL_MANAGED_ROOTS.some((root) => normalized.startsWith(`${root}/`))
    : normalized.startsWith("openspec/");
};

export const filterByScope = <T extends { path: string }>(items: T[], scope: ManagedScope): T[] =>
  items.filter((item) => matchesScope(item.path, scope));

export const filterRecordByScope = <T>(record: Record<string, T>, scope: ManagedScope): Record<string, T> =>
  Object.fromEntries(
    Object.entries(record).filter(([relativePath]) => matchesScope(relativePath, scope))
  );

export const resolveManagedRoots = (scope: ManagedScope, profile: ProfileName): string[] => {
  const roots =
    profile === "full-compat" ? DEFAULT_MANAGED_ROOTS : DEFAULT_MANAGED_ROOTS;

  return scope === "all"
    ? roots
    : roots.filter((root) => matchesScope(`${root}/`, scope));
};
