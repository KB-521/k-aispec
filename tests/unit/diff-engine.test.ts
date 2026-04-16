import assert from "node:assert/strict";
import path from "node:path";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import test from "node:test";

import { buildDiffPlan } from "../../src/core/diff-engine";
import { sha256 } from "../../src/core/hash";

test("diff engine classifies safe updates, conflicts, and deletions", async () => {
  const projectRoot = await mkdtemp(path.join(tmpdir(), "openspec-diff-"));

  try {
    const safePath = path.join(projectRoot, "openspec", "agent", "phase-router.md");
    const conflictPath = path.join(projectRoot, "openspec", "agent", "design-manager.md");
    const deletePath = path.join(projectRoot, ".codex", "skills", "req-dev", "SKILL.md");

    await import("node:fs/promises").then(({ mkdir }) =>
      Promise.all([
        mkdir(path.dirname(safePath), { recursive: true }),
        mkdir(path.dirname(conflictPath), { recursive: true }),
        mkdir(path.dirname(deletePath), { recursive: true })
      ])
    );

    await writeFile(safePath, "v1");
    await writeFile(conflictPath, "user-edited");
    await writeFile(deletePath, "keep? no");

    const desiredFiles = new Map([
      [
        "openspec/agent/phase-router.md",
        {
          path: "openspec/agent/phase-router.md",
          sha256: sha256("v2"),
          size: 2
        }
      ],
      [
        "openspec/agent/design-manager.md",
        {
          path: "openspec/agent/design-manager.md",
          sha256: sha256("v2"),
          size: 2
        }
      ]
    ]);
    const installedFiles = {
      "openspec/agent/phase-router.md": {
        installedSha256: sha256("v1"),
        size: 2
      },
      "openspec/agent/design-manager.md": {
        installedSha256: sha256("v1"),
        size: 2
      },
      ".codex/skills/req-dev/SKILL.md": {
        installedSha256: sha256("keep? no"),
        size: 8
      }
    };

    const plan = await buildDiffPlan(projectRoot, desiredFiles, installedFiles);
    assert.equal(plan.summary["updated-safe"], 1);
    assert.equal(plan.summary["updated-conflict"], 1);
    assert.equal(plan.summary["deleted-safe"], 1);
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});
