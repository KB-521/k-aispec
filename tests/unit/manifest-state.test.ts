import assert from "node:assert/strict";
import path from "node:path";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import test from "node:test";

import { describeFile } from "../../src/core/hash";
import { validateManifest } from "../../src/core/manifest";
import {
  createStateFromManifest,
  loadState,
  writeState
} from "../../src/core/state-store";

const manifest = {
  schemaVersion: 1,
  packageName: "@king/openspec-cli",
  packageVersion: "0.1.0",
  generatedAt: "1970-01-01T00:00:00.000Z",
  managedRoots: [".codex/skills", "openspec"],
  files: [
    {
      path: ".codex/skills/req-dev/SKILL.md",
      sha256: "abc",
      size: 3
    },
    {
      path: ".agents/skills/req-dev/SKILL.md",
      sha256: "ghi",
      size: 3
    },
    {
      path: ".claude/skills/req-dev/SKILL.md",
      sha256: "jkl",
      size: 3
    },
    {
      path: "openspec/agent/phase-router.md",
      sha256: "def",
      size: 3
    }
  ]
};

test("validateManifest accepts a valid manifest shape", () => {
  const parsed = validateManifest(manifest);
  assert.equal(parsed.files.length, 4);
});

test("state round-trip writes scoped files to .openspec/state.json", async () => {
  const projectRoot = await mkdtemp(path.join(tmpdir(), "openspec-state-"));

  try {
    const state = createStateFromManifest(manifest, "skills", "2026-04-16T00:00:00.000Z");
    await writeState(projectRoot, state);

    const loaded = await loadState(projectRoot);
    assert.ok(loaded);
    assert.deepEqual(Object.keys(loaded.files).sort(), [
      ".agents/skills/req-dev/SKILL.md",
      ".claude/skills/req-dev/SKILL.md",
      ".codex/skills/req-dev/SKILL.md"
    ]);

    const file = await readFile(path.join(projectRoot, ".openspec", "state.json"), "utf8");
    assert.match(file, /installedVersion/);
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});

test("describeFile reports hash and size for existing files", async () => {
  const projectRoot = await mkdtemp(path.join(tmpdir(), "openspec-hash-"));

  try {
    const targetPath = path.join(projectRoot, "sample.txt");
    await writeState(projectRoot, {
      schemaVersion: 1,
      packageName: "@king/openspec-cli",
      installedVersion: "0.1.0",
      installedAt: "2026-04-16T00:00:00.000Z",
      managedRoots: [],
      files: {}
    });
    await rm(path.join(projectRoot, ".openspec"), { recursive: true, force: true });
    await import("node:fs/promises").then(({ writeFile }) => writeFile(targetPath, "hello"));

    const fingerprint = await describeFile(targetPath);
    assert.equal(fingerprint.exists, true);
    assert.equal(fingerprint.size, 5);
    assert.ok(fingerprint.sha256);
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});
