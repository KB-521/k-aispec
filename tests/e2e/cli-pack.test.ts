import assert from "node:assert/strict";
import path from "node:path";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { after, before, test } from "node:test";

import { sha256 } from "../../src/core/hash";

const repoRoot = path.resolve(__dirname, "..", "..", "..");
let tarballPath = "";

const run = (cwd: string, command: string, args: string[]) => {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      npm_config_cache: path.join(cwd, ".npm-cache")
    }
  });

  return {
    status: result.status ?? 1,
    stdout: result.stdout,
    stderr: result.stderr
  };
};

const setupProject = async (): Promise<string> => {
  const projectRoot = await mkdtemp(path.join(tmpdir(), "openspec-e2e-"));

  const initResult = run(projectRoot, "npm", ["init", "-y"]);
  assert.equal(initResult.status, 0, initResult.stderr);

  const installResult = run(projectRoot, "npm", ["install", "--no-save", tarballPath]);
  assert.equal(installResult.status, 0, installResult.stderr);

  return projectRoot;
};

const installedPackageRoot = (projectRoot: string): string =>
  path.join(projectRoot, "node_modules", "@king", "openspec-cli");

const mutateInstalledAsset = async (
  projectRoot: string,
  relativePath: string,
  content: string
): Promise<void> => {
  const packageRoot = installedPackageRoot(projectRoot);
  const assetPath = path.join(packageRoot, "distribution", "managed", relativePath);
  const manifestPath = path.join(packageRoot, "distribution", "asset-manifest.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  await writeFile(assetPath, content);
  manifest.packageVersion = "0.1.1";
  manifest.files = manifest.files.map((entry: any) =>
    entry.path === relativePath
      ? {
          ...entry,
          sha256: sha256(content),
          size: Buffer.byteLength(content)
        }
      : entry
  );
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
};

before(() => {
  const result = run(repoRoot, "npm", ["pack", "--json"]);
  assert.equal(result.status, 0, result.stderr);
  const packInfo = JSON.parse(result.stdout)[0];
  tarballPath = path.join(repoRoot, packInfo.filename);
});

after(async () => {
  if (tarballPath) {
    await rm(tarballPath, { force: true });
  }
});

test("npm pack artifact can init a target project", async () => {
  const projectRoot = await setupProject();

  try {
    const initResult = run(projectRoot, "npx", ["--no-install", "openspec", "init"]);
    assert.equal(initResult.status, 0, initResult.stderr);

    const state = JSON.parse(
      await readFile(path.join(projectRoot, ".openspec", "state.json"), "utf8")
    );
    assert.equal(state.packageName, "@king/openspec-cli");
    assert.equal(
      typeof state.files["openspec/agent/phase-router.md"].installedSha256,
      "string"
    );
    assert.equal(
      typeof state.files[".agents/skills/req-dev/SKILL.md"].installedSha256,
      "string"
    );
    assert.equal(
      typeof state.files[".claude/skills/req-dev/SKILL.md"].installedSha256,
      "string"
    );
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});

test("update applies safe package changes from the packed artifact", async () => {
  const projectRoot = await setupProject();

  try {
    assert.equal(run(projectRoot, "npx", ["--no-install", "openspec", "init"]).status, 0);
    await mutateInstalledAsset(
      projectRoot,
      "openspec/agent/phase-router.md",
      "# mutated\nsafe update\n"
    );

    const updateResult = run(projectRoot, "npx", ["--no-install", "openspec", "update"]);
    assert.equal(updateResult.status, 0, updateResult.stderr);

    const updatedFile = await readFile(
      path.join(projectRoot, "openspec", "agent", "phase-router.md"),
      "utf8"
    );
    assert.match(updatedFile, /safe update/);
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});

test("update reports conflicts without overwriting user edits", async () => {
  const projectRoot = await setupProject();

  try {
    assert.equal(run(projectRoot, "npx", ["--no-install", "openspec", "init"]).status, 0);

    const targetRelativePath = "openspec/agent/design-manager.md";
    const targetPath = path.join(projectRoot, targetRelativePath);
    await writeFile(targetPath, "local custom content\n");
    await mutateInstalledAsset(
      projectRoot,
      targetRelativePath,
      "# package change\nconflicting update\n"
    );

    const updateResult = run(projectRoot, "npx", ["--no-install", "openspec", "update"]);
    assert.equal(updateResult.status, 2, updateResult.stderr);

    const fileAfterUpdate = await readFile(targetPath, "utf8");
    assert.equal(fileAfterUpdate, "local custom content\n");
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});

test("uninstall backs up locally modified files by default", async () => {
  const projectRoot = await setupProject();

  try {
    assert.equal(run(projectRoot, "npx", ["--no-install", "openspec", "init"]).status, 0);

    const targetRelativePath = "openspec/agent/requirement-manager.md";
    const targetPath = path.join(projectRoot, targetRelativePath);
    await writeFile(targetPath, "custom local edits\n");

    const uninstallResult = run(projectRoot, "npx", ["--no-install", "openspec", "uninstall"]);
    assert.equal(uninstallResult.status, 0, uninstallResult.stderr);

    const backupsRoot = path.join(projectRoot, ".openspec", "backups");
    const backupEntries = run(projectRoot, "find", [backupsRoot, "-type", "f"]).stdout.trim().split("\n");
    assert.ok(backupEntries.some((entry) => entry.endsWith(targetRelativePath)));
    assert.equal(run(projectRoot, "test", ["-f", targetPath]).status, 1);
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});
