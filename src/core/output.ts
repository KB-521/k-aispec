import type { DiffKind, DiffPlan } from "../types";

const ORDER: DiffKind[] = [
  "added",
  "updated-safe",
  "updated-conflict",
  "deleted-safe",
  "deleted-conflict"
];

export const formatSummary = (plan: DiffPlan): string =>
  ORDER.map((kind) => `${kind}: ${plan.summary[kind]}`).join(", ");

export const formatEntries = (plan: DiffPlan): string[] =>
  plan.entries.map((entry) => `- ${entry.kind} ${entry.path} (${entry.reason})`);
