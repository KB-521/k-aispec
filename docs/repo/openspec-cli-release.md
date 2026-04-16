# OpenSpec CLI 发布与使用说明

## 适用范围

本文档只描述当前仓库的 npm CLI 工程、打包方式和发布前检查，不属于将来要分发给其他项目的 `openspec/` 基座资产。

## 固定决策

- npm 包名：`@king/openspec-cli`
- CLI 命令名：`openspec`
- 运行时来源：仅 npm 包内 `distribution/managed/`
- 默认托管范围：`.codex/skills/`、`.agents/`、`.claude/`、`openspec`
- Node 基线：`>=20`

## 仓库结构

```text
bin/                    # npm CLI 入口
src/                    # TypeScript CLI 源码
scripts/                # 资产生成与 pack 校验脚本
tests/                  # 单元 + 基于 npm pack 的 E2E 测试
distribution/managed/   # 构建时生成的托管资产
distribution/asset-manifest.json
```

## 命令语义

### `openspec init`

- 首次安装托管资产到目标项目根目录
- 默认拒绝接管已有同名目录内容
- 支持 `--scope <all|skills|openspec>`、`--profile <default|full-compat>`、`--force`、`--dry-run`

### `openspec update`

- 基于本地 `.openspec/state.json` 和包内 manifest 生成差异计划
- 默认自动执行 `added`、`updated-safe`、`deleted-safe`
- 默认保留冲突文件并返回非 0
- 支持 `--check`、`--force`、`--backup/--no-backup`、`--dry-run`

### `openspec uninstall`

- 仅卸载 CLI 管理过的文件
- 本地已修改文件默认备份到 `.openspec/backups/<timestamp>/`
- 支持 `--scope`、`--backup/--no-backup`、`--force`、`--dry-run`

## 构建与发布前检查

```bash
npm run build
npm test
npm run verify:pack
```

说明：

- `build`：编译 TypeScript，并从仓库源资产生成 `distribution/managed/` 与 `asset-manifest.json`
- `test`：执行逻辑层单元测试，以及覆盖 `init/update/uninstall` 的 `npm pack` 产物 E2E 测试
- `verify:pack`：执行 `npm pack`，校验 tarball 必带文件，并确保 `docs/repo/` 不进入分发包

## 推荐发布流程

1. 确认 `.codex/skills/`、`.agents/`、`.claude/` 与 `openspec/` 已是待发布版本。
2. 运行 `npm run build`，检查 `distribution/asset-manifest.json` 已更新。
3. 运行 `npm test` 与 `npm run verify:pack`。
4. 用 `npm pack` 再看一次最终 tarball 文件名。
5. 再执行正式发布。

## 使用示例

```bash
npx @king/openspec-cli@latest init
npx @king/openspec-cli@latest update
npx @king/openspec-cli@latest uninstall
```

若需只处理一部分托管范围：

```bash
npx @king/openspec-cli@latest init --scope skills
npx @king/openspec-cli@latest update --scope openspec --check
npx @king/openspec-cli@latest uninstall --scope skills
```
