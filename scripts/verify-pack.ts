import path from "node:path";
import { rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const repoRoot = path.resolve(__dirname, "..", "..");
const requiredPrefixes = [
  "package/bin/openspec.js",
  "package/dist/src/cli.js",
  "package/distribution/asset-manifest.json",
  "package/distribution/managed/openspec/agent/phase-router.md",
  "package/distribution/managed/.codex/skills/req-dev/SKILL.md",
  "package/distribution/managed/.agents/skills/req-dev/SKILL.md",
  "package/distribution/managed/.claude/skills/req-dev/SKILL.md"
];
const forbiddenPrefixes = ["package/docs/repo/"];

const run = (command: string, args: string[]): string => {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      npm_config_cache: path.join(repoRoot, ".npm-cache")
    }
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `${command} ${args.join(" ")} failed`);
  }

  return result.stdout.trim();
};

const verify = async (): Promise<void> => {
  const packInfo = JSON.parse(run("npm", ["pack", "--json"]))[0];
  const tarballPath = path.join(repoRoot, packInfo.filename);

  try {
    const entries = run("tar", ["-tf", tarballPath]).split("\n").filter(Boolean);
    for (const requiredPrefix of requiredPrefixes) {
      if (!entries.some((entry) => entry === requiredPrefix || entry.startsWith(`${requiredPrefix}/`))) {
        throw new Error(`Packed tarball is missing required entry: ${requiredPrefix}`);
      }
    }

    for (const forbiddenPrefix of forbiddenPrefixes) {
      if (entries.some((entry) => entry.startsWith(forbiddenPrefix))) {
        throw new Error(`Packed tarball contains forbidden entry: ${forbiddenPrefix}`);
      }
    }

    console.log(`Verified npm pack artifact: ${packInfo.filename}`);
  } finally {
    await rm(tarballPath, { force: true });
  }
};

void verify();
