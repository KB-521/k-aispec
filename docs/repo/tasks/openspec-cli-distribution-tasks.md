# OpenSpec CLI npm 单源分发任务拆分

## 任务索引 ID

`TASK-GEN-20260415-001`

## 来源文档

- 设计方案：`docs/repo/openspec-cli-distribution-design.md`
- 设计评审：`docs/repo/reviews/openspec-cli-distribution-design-review.md`

## 目标

把 npm 单源的 OpenSpec CLI 方案拆成可直接执行的实现批次和任务卡，覆盖：

1. 包内资产打包；
2. `init/update/uninstall` 三个命令；
3. 本地状态与差异更新；
4. 测试、发布校验和文档收尾。

## 拆分原则

1. 先打通最小闭环，再补治理和体验。
2. 优先完成会阻塞后续开发的基础能力。
3. 命令层不直接承担底层细节，公共能力先沉到 `core/`。
4. 所有发布校验都以 `npm pack` 产物为准，不以源码目录假定成功。

## 实施批次

### 批次 1：骨架与门禁

目标：建立 CLI 工程骨架、包内资产目录和基础底座，确保后续命令实现不返工。

### 批次 2：核心链路

目标：完成 `init`、`update`、`uninstall` 三条主链路，以及差异检测和冲突处理。

### 批次 3：配套能力

目标：补齐命令体验、发布校验和仓库文档，使功能可实际对外使用。

### 批次 4：测试与治理

目标：补齐单元、集成、端到端验证，确保 npm 包产物可稳定安装、更新和卸载。

## 任务总览

| 批次 | 任务 ID | 任务 | 依赖 | 并行性 |
| --- | --- | --- | --- | --- |
| 1 | `T1` | 初始化 CLI 工程骨架与构建入口 | - | 可先做 |
| 1 | `T2` | 建立包内资产目录与 `asset-manifest` 生成脚本 | `T1` | 可与 `T3` 并行一部分 |
| 1 | `T3` | 建立 `core` 基础能力：state、manifest、hash、文件操作 | `T1` | 可与 `T2` 并行一部分 |
| 2 | `T4` | 实现 `init` 命令 | `T2`,`T3` | 串行 |
| 2 | `T5` | 实现差异计划生成器 `diff-engine` | `T2`,`T3` | 可先于 `T6`,`T7` |
| 2 | `T6` | 实现 `update` 命令 | `T4`,`T5` | 串行 |
| 2 | `T7` | 实现 `uninstall` 命令 | `T3`,`T5` | 可与 `T6` 交错 |
| 3 | `T8` | 补齐 CLI 输出、错误码与参数语义 | `T4`,`T6`,`T7` | 串行 |
| 3 | `T9` | 补齐 npm 打包校验与发布脚本 | `T2`,`T8` | 串行 |
| 3 | `T10` | 补齐仓库使用文档与发布说明 | `T8`,`T9` | 串行 |
| 4 | `T11` | 编写单元测试 | `T3`,`T5` | 可与 `T10` 并行 |
| 4 | `T12` | 编写集成/E2E 测试并验证 `npm pack` 产物 | `T4`,`T6`,`T7`,`T9`,`T11` | 最后执行 |

## 依赖矩阵

| 任务 ID | 阻塞项 | 说明 |
| --- | --- | --- |
| `T1` | - | 后续所有实现的起点 |
| `T2` | `T1` | 没有包内资产和 manifest，命令无法读源 |
| `T3` | `T1` | 没有基础能力，命令层会重复实现底层逻辑 |
| `T4` | `T2`,`T3` | `init` 依赖包内资产与写盘能力 |
| `T5` | `T2`,`T3` | 差异引擎依赖 manifest、state 和 hash 能力 |
| `T6` | `T4`,`T5` | `update` 依赖初始安装语义和差异计划 |
| `T7` | `T3`,`T5` | `uninstall` 依赖 state 与差异分类 |
| `T8` | `T4`,`T6`,`T7` | 需要三条命令基本成型后统一收口 |
| `T9` | `T2`,`T8` | 需要确保打包内容和命令入口都稳定 |
| `T10` | `T8`,`T9` | 文档要基于最终命令与发布方式 |
| `T11` | `T3`,`T5` | 公共能力与差异引擎稳定后再测 |
| `T12` | `T4`,`T6`,`T7`,`T9`,`T11` | 依赖功能、打包和基础测试全部到位 |

## 任务卡

### `T1` 初始化 CLI 工程骨架与构建入口

目标：

- 建立 npm CLI 最小工程；
- 能执行 `openspec --help`；
- 为后续命令和打包脚本提供统一入口。

输入：

- `docs/repo/openspec-cli-distribution-design.md`

输出：

- `package.json`
- `bin/openspec.js`
- `src/cli.ts`
- 基础构建配置，例如 `tsconfig.json`

验收标准：

- `bin` 正确暴露 `openspec` 命令；
- CLI 至少注册 `init`、`update`、`uninstall` 三个占位命令；
- 项目可完成一次构建或直接以开发模式运行 CLI。

### `T2` 建立包内资产目录与 `asset-manifest` 生成脚本

目标：

- 把 `.codex/skills/` 与 `openspec/` 显式复制到 npm 包资产目录；
- 生成可供运行时消费的 `asset-manifest.json`。

输入：

- 当前仓库中的 `.codex/skills/`
- 当前仓库中的 `openspec/`

输出：

- `assets/managed/.codex/skills/`
- `assets/managed/openspec/`
- `assets/asset-manifest.json`
- `scripts/build-asset-manifest.ts`

验收标准：

- manifest 包含全部托管文件的 `path`、`sha256`、`size`；
- 打包时不会把仓库自身 `docs/repo/` 误带进分发资产；
- 资产生成脚本可重复执行，结果稳定。

### `T3` 建立 `core` 基础能力：state、manifest、hash、文件操作

目标：

- 抽出命令共享的底层能力，避免三条命令各自复制逻辑。

输入：

- `asset-manifest.json` 结构定义
- 设计文档中的 `.openspec/state.json` 约束

输出：

- `src/core/manifest.ts`
- `src/core/state-store.ts`
- `src/core/file-manager.ts`
- `src/core/backup-manager.ts`
- hash/path 等公共工具

验收标准：

- 能读取并校验包内 manifest；
- 能读写 `.openspec/state.json`；
- 能创建备份目录并执行原子写入；
- 公共方法边界清晰，可被命令层直接复用。

### `T4` 实现 `init` 命令

目标：

- 在目标项目中完成首次安装；
- 拒绝接管未托管的同名目录内容，除非用户显式强制。

输入：

- 包内资产目录
- `asset-manifest.json`
- `core` 文件能力

输出：

- `src/commands/init.ts`

验收标准：

- 支持 `--scope`、`--profile`、`--force`、`--dry-run`；
- 能把 `.codex/skills/` 与 `openspec/` 写到目标项目根目录；
- 首次安装完成后生成 `.openspec/state.json`；
- 遇到冲突文件时能中止并给出明确提示。

### `T5` 实现差异计划生成器 `diff-engine`

目标：

- 统一生成 `added`、`updated-safe`、`updated-conflict`、`deleted-safe`、`deleted-conflict` 五类差异计划。

输入：

- 包内 manifest
- 本地 state
- 目标项目当前文件状态

输出：

- `src/core/diff-engine.ts`
- 差异结果类型定义

验收标准：

- 差异分类稳定、可测试；
- 计划结果可直接供 `update` 和 `uninstall` 使用；
- 冲突判断只依赖显式规则，不夹杂命令层分支。

### `T6` 实现 `update` 命令

目标：

- 基于当前 npm 包版本，对目标项目执行安全更新。

输入：

- `diff-engine`
- `state-store`
- `file-manager`

输出：

- `src/commands/update.ts`

验收标准：

- 支持 `--check`、`--force`、`--backup`、`--dry-run`；
- 默认自动执行安全项，冲突项停止；
- 更新成功后刷新 `.openspec/state.json`；
- 输出变更摘要和冲突文件清单。

### `T7` 实现 `uninstall` 命令

目标：

- 仅清理 CLI 托管的文件，不误删用户后续自定义内容。

输入：

- `state-store`
- `diff-engine`
- `backup-manager`

输出：

- `src/commands/uninstall.ts`

验收标准：

- 支持 `--scope`、`--backup`、`--force`、`--dry-run`；
- 未修改文件直接删除；
- 已修改文件默认备份到 `.openspec/backups/<timestamp>/`；
- 清理完成后删除空目录和 `.openspec/state.json`。

### `T8` 补齐 CLI 输出、错误码与参数语义

目标：

- 统一命令输出、退出码和冲突提示，避免命令行为不一致。

输入：

- `init/update/uninstall` 已有实现

输出：

- 公共输出工具
- 错误码或退出语义约定
- 参数语义收口，例如 `--scope`、`--profile`、`--force`

验收标准：

- 三个命令输出风格一致；
- `dry-run`、冲突、成功、部分成功等场景有清晰提示；
- 非 0 退出场景定义明确。

### `T9` 补齐 npm 打包校验与发布脚本

目标：

- 确保真正发布出去的 npm 包包含 CLI 可执行入口和完整托管资产。

输入：

- `assets/managed/`
- `asset-manifest.json`
- `package.json`

输出：

- `npm pack` 校验脚本
- 打包前构建命令
- 发布前检查说明或脚本

验收标准：

- `npm pack` 产物中包含 `bin/`、编译后 CLI、`assets/managed/`、`asset-manifest.json`；
- 不会把 `docs/repo/` 等非分发资产带入包中；
- 发布前检查可重复执行。

### `T10` 补齐仓库使用文档与发布说明

目标：

- 给仓库维护者和使用者提供最小可用说明，减少后续试错成本。

输入：

- 最终命令契约
- 打包与发布方式

输出：

- `README.md` 中的 CLI 使用说明
- `docs/repo/` 中的发布/实现说明补充

验收标准：

- 至少包含 `init`、`update`、`uninstall` 使用示例；
- 说明推荐的 `npx` 使用方式；
- 说明冲突与备份行为。

### `T11` 编写单元测试

目标：

- 覆盖最容易出错的纯逻辑层，降低回归风险。

输入：

- `manifest`、`state-store`、`diff-engine`、`file-manager`

输出：

- 单元测试文件

验收标准：

- 至少覆盖 manifest 解析、state 读写、hash 比对、差异分类；
- 关键边界如空 state、缺失文件、文件已修改等场景有测试；
- 测试能在本地稳定运行。

### `T12` 编写集成/E2E 测试并验证 `npm pack` 产物

目标：

- 从真实产物视角验证安装、更新、卸载三条链路。

输入：

- `npm pack` 产物
- 三个命令实现
- 单元测试基础

输出：

- 集成/E2E 测试脚本
- 打包产物验证流程

验收标准：

- 至少覆盖首装、无冲突更新、有冲突更新、卸载保留修改文件四类场景；
- 测试使用临时目录，不污染工作区；
- 验证对象是 `npm pack` 产物，而不是源码目录直跑。

## 推荐里程碑

### 里程碑 M1：可安装

完成条件：

- `T1`、`T2`、`T3`、`T4`

结果：

- 用户可以在目标项目里完成首次安装。

### 里程碑 M2：可升级可卸载

完成条件：

- `T5`、`T6`、`T7`、`T8`

结果：

- 用户可以安全更新和卸载，并获得可读反馈。

### 里程碑 M3：可发布可验证

完成条件：

- `T9`、`T10`、`T11`、`T12`

结果：

- npm 包可验证发布，且具备基础质量保障。

## 建议实施顺序

1. 先做 `T1`、`T2`、`T3`，把包结构和基础能力定住。
2. 接着做 `T4`，先打通最小“安装成功”闭环。
3. 再做 `T5`、`T6`、`T7`，把更新和卸载建立在统一差异引擎上。
4. 收口 `T8`、`T9`、`T10`，统一对外行为和文档。
5. 最后做 `T11`、`T12`，以 `npm pack` 产物完成验证。

## 当前结论

这份任务拆分已经可以直接作为实现 backlog 使用。若你准备进入编码阶段，建议优先以 `M1` 为第一批交付目标。
