# Repository Guide

## Project Shape

This repository has two layers:

1. Source-of-truth OpenSpec assets that are meant to be distributed to other projects.
2. A Node.js CLI that packages those assets into an npm artifact and manages `init / update / uninstall`.

## Top-Level Structure

- `.codex/skills/`
  Fixed local entry skills. The current workspace contains `init` and `req-dev`.
- `openspec/`
  Distributed OpenSpec assets: agents, reusable skills, wiki knowledge, and SDD documents.
- `src/`, `bin/`, `scripts/`, `tests/`
  TypeScript CLI implementation, npm entrypoint, build helpers, and unit/E2E tests.
- `docs/repo/`
  Repository-only design, task, review, and release docs. These are not distributed as OpenSpec assets.
- `distribution/`
  Generated output directory for packaged assets and `asset-manifest.json`. Treat it as build output, not source.

## Build And Test Commands

Run shell commands with the local `rtk` prefix in this repository.

```bash
rtk npm run build
rtk npm test
rtk npm run verify:pack
```

- `npm run build`
  Compiles TypeScript into `dist/` and generates `distribution/managed/` plus `distribution/asset-manifest.json`.
- `npm test`
  Runs unit tests and E2E coverage against the `npm pack` artifact.
- `npm run verify:pack`
  Checks that the tarball contains the CLI entrypoint, compiled runtime, and managed assets, while excluding `docs/repo/`.

## Code Organization

- `bin/openspec.js`
  npm executable entrypoint that delegates to the compiled CLI.
- `src/cli.ts`
  Command router and argument parsing.
- `src/commands/*.ts`
  User-facing `init`, `update`, and `uninstall` flows.
- `src/core/*.ts`
  Shared manifest, state, diff, file, backup, scope, and output helpers.
- `scripts/build-asset-manifest.ts`
  Copies source assets into `distribution/managed/` and writes the manifest.
- `scripts/verify-pack.ts`
  Runs `npm pack` and validates tarball contents.
- `tests/unit/*.test.ts`
  Logic-layer validation for manifest/state/diff behavior.
- `tests/e2e/cli-pack.test.ts`
  Artifact-level lifecycle verification.

## Conventions

- Keep repository facts in `AGENTS.md` and `openspec/wiki/tech/*`.
- Keep reusable workflow definitions under `openspec/skills/`.
- Keep repo-specific implementation decisions under `docs/repo/`.
- Prefer ASCII and stable `kebab-case` file names unless a directory already uses a different convention.
- Do not treat generated `distribution/` or `dist/` content as hand-edited source.

## Known Consistency Check

- The current workspace has verified source asset roots for `.codex/skills/` and `openspec/`.
- CLI constants and repo docs also reference `.agents/` and `.claude/` as managed roots, but those directories are not present in the workspace right now.
- Until that mismatch is resolved, any release or build workflow that expects `.agents/` and `.claude/` should be treated as blocked by missing source assets.

## Documentation Workflow

- Use `.codex/skills/req-dev` as the fixed execution gateway for requirement, design, implementation, and review work.
- Use `.codex/skills/init` when refreshing repository guidance, tech docs, business docs, rules, or skill indexes.
- Update `openspec/wiki/business/*`, `openspec/wiki/tech/*`, `openspec/wiki/rules/*`, or `openspec/sdd/*` when repository facts or workflow boundaries change.
