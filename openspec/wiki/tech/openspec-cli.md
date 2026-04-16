# OpenSpec CLI

## 模块职责

负责把仓库中的 OpenSpec 基座资产打包为 npm CLI，并在目标项目中执行 `init`、`update`、`uninstall` 三条生命周期命令。

## 源码目录

- `bin/openspec.js`
- `src/`
- `scripts/`
- `tests/`
- `package.json`
- `tsconfig.json`

## 关键入口

- `bin/openspec.js`
  npm 命令入口，转调编译后的 `dist/src/cli.js`。
- `src/cli.ts`
  命令分发、参数解析和退出码收口。
- `src/commands/init.ts`
  首次安装流程，负责占用目录检查、写盘和 state 初始化。
- `src/commands/update.ts`
  差异计划执行、安全更新和冲突保留。
- `src/commands/uninstall.ts`
  精准卸载、备份本地改动和 state 清理。
- `scripts/build-asset-manifest.ts`
  从源资产目录生成 `distribution/managed/` 与 `distribution/asset-manifest.json`。
- `scripts/verify-pack.ts`
  基于 `npm pack` tarball 校验发布产物内容。

## 核心依赖

- Node.js `>=20`
- TypeScript 编译器
- Node 内置 `fs/promises`、`path`、`crypto`、`child_process`

## 运行与调试

```bash
rtk npm run build
rtk npm test
rtk npm run verify:pack
```

## 与其它模块的关系

- 读取 `.codex/skills/` 与 `openspec/` 作为源资产。
- 将打包产物写入 `distribution/`。
- `docs/repo/` 只提供仓库自身的设计、任务和发布说明，不进入分发资产。

## 风险与待确认项

- `distribution/` 当前是生成目录，未构建前可能为空。
- `src/core/constants.ts` 中的默认托管根包含 `.agents/` 与 `.claude/`，但当前工作区并不存在这两个源目录。
- 在该缺口修复前，CLI 代码、README 与真实工作区状态不完全一致。
