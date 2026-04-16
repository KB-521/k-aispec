# OpenSpec CLI npm 单源分发方案

## 方案索引 ID

`DES-GEN-20260415-002`

## 文档定位

本方案描述的是当前仓库如何把 `.codex/skills/`、`.agents/`、`.claude/` 与 `openspec/` 打包、分发到其他项目，因此属于仓库自身的工程实现方案，不进入 `openspec/` 分发资产目录。

## 背景

当前仓库已经具备可复用的 `openspec/` 资产，以及 `.codex/skills/`、`.agents/`、`.claude/` 三套入口，但缺少一套可直接面向其他项目使用的安装与升级机制。

这次不再追求多来源兼容，而是优先选择实现成本最低的方案，把可分发资产稳定同步到目标项目根目录，并支持安全更新与卸载。

## 设计结论

只支持 `npm` 作为唯一分发来源。

原因：

1. 实现成本最低，省掉 `git`、`oss`、认证和下载协议适配。
2. 用户体验直接，可通过 `npx <pkg>` 立即执行，无需额外安装器。
3. 版本管理天然交给 npm 包版本，不需要自建远端版本解析逻辑。
4. `init`、`update`、`uninstall` 依然可以完整保留。

## 目标

1. 提供 `init`、`update`、`uninstall` 三个可用命令。
2. 默认把 `.codex/skills/`、`.agents/`、`.claude/` 与 `openspec/` 同步到目标项目根目录。
3. `update` 基于上次安装状态做差异更新和冲突检测，而不是盲覆盖。
4. `uninstall` 只删除 CLI 管理过的文件，避免误删用户自己的内容。
5. 发布链路只维护一个 npm 包。

## 非目标

1. 不支持 `git`、`oss` 或其他分发来源。
2. 不在首版做复杂模板变量渲染。
3. 不在首版自动改写用户现有 `AGENTS.md`、`package.json`、CI 配置。
4. 不在首版做三方 merge；冲突先以检测、备份、显式确认为主。

## 约束与假设

1. 目标项目根目录允许新增 `.codex/skills/`、`.agents/`、`.claude/`、`openspec/`、`.openspec/`。
2. 默认受控范围包含 `.codex/skills/`、`.agents/`、`.claude/` 与 `openspec/`。
3. `--profile` 先保留接口，当前与默认分发范围一致。
4. 用户通过 `npx` 执行指定版本，或先把 CLI 安装为 devDependency 再执行。

## 推荐架构

```text
目标项目
  -> openspec CLI(npm package)
  -> 包内 distribution/managed + asset-manifest.json
  -> DiffEngine(比较包内资产 / 本地 state / 当前文件)
  -> FileManager(写入、备份、删除)
  -> 项目根目录(.codex/skills + openspec)
```

## 核心设计

### 1. npm 单源发布

仓库中的源资产保持不变：

- `.codex/skills/`
- `.agents/`
- `.claude/`
- `openspec/`

npm 包内只额外维护一套可执行资产目录：

- `distribution/managed/.codex/skills/`
- `distribution/managed/.agents/`
- `distribution/managed/.claude/`
- `distribution/managed/openspec/`
- `distribution/asset-manifest.json`

发布时由构建脚本把当前仓库中的可分发资产拷贝到 `distribution/managed/`，并生成 `asset-manifest.json`。

这样 CLI 运行时不需要再去网络下载 bundle，也不需要再解析其他来源，只需要读取当前 npm 包自身携带的分发目录。

### 2. CLI 包与目录建议

建议技术栈：

- Node.js 20+
- TypeScript
- `commander` 负责命令解析
- `fs-extra` 或 Node 内置 `fs/promises` 负责文件复制
- `fast-glob` 负责构建期扫描资产文件

建议目录：

```text
bin/
  openspec.js
src/
  cli.ts
  commands/
    init.ts
    update.ts
    uninstall.ts
  core/
    diff-engine.ts
    state-store.ts
    backup-manager.ts
    manifest.ts
    file-manager.ts
distribution/
  managed/
    .codex/skills/...
    .agents/...
    .claude/...
    openspec/...
  asset-manifest.json
scripts/
  build-asset-manifest.ts
```

### 3. 包内资产清单

建议 `asset-manifest.json` 结构：

```json
{
  "schemaVersion": 1,
  "packageName": "@king/openspec-cli",
  "packageVersion": "0.1.0",
  "generatedAt": "2026-04-15T00:00:00Z",
  "managedRoots": [".codex/skills", "openspec"],
  "files": [
    {
      "path": ".codex/skills/init/SKILL.md",
      "sha256": "...",
      "size": 1234
    },
    {
      "path": "openspec/agent/phase-router.md",
      "sha256": "...",
      "size": 2345
    }
  ]
}
```

说明：

1. `path` 既是目标项目的写入路径，也是包内 `distribution/managed/` 下的相对路径。
2. CLI 运行时不再扫描整个包目录，而是直接依赖 manifest。
3. `update` 和 `uninstall` 都基于这份 manifest 做精确管理。

### 4. 本地状态文件

建议在目标项目根目录写入：

`/.openspec/state.json`

示例字段：

```json
{
  "schemaVersion": 1,
  "packageName": "@king/openspec-cli",
  "installedVersion": "0.1.0",
  "installedAt": "2026-04-15T08:00:00+08:00",
  "managedRoots": [".codex/skills", "openspec"],
  "files": {
    ".codex/skills/init/SKILL.md": {
      "installedSha256": "..."
    },
    ".agents/skills/init/SKILL.md": {
      "installedSha256": "..."
    },
    ".claude/skills/init/SKILL.md": {
      "installedSha256": "..."
    },
    "openspec/agent/phase-router.md": {
      "installedSha256": "..."
    }
  }
}
```

这个状态文件是 `update` 和 `uninstall` 的安全基线，没有它就无法可靠区分：

- CLI 安装的文件；
- 用户后续手工改过的文件；
- 用户自己新建但刚好落在相同目录下的文件。

### 5. 命令契约

建议命令名直接使用 `openspec`。

#### `openspec init`

用途：

- 首次安装 `.codex/skills/`、`.agents/`、`.claude/` 与 `openspec/`；
- 若目标目录已有内容但未被 CLI 接管，则拒绝覆盖并提示用户确认。

建议参数：

- `--scope <all|skills|openspec>`：安装范围，默认 `all`
- `--profile <default|full-compat>`：默认只装 `.codex/skills` + `openspec`
- `--force`：允许覆盖未托管文件
- `--dry-run`：只输出计划，不落盘

默认行为：

1. 读取包内 `asset-manifest.json`；
2. 检测目标项目是否已存在冲突文件；
3. 从 `distribution/managed/` 写入文件；
4. 生成 `.openspec/state.json`。

#### `openspec update`

用途：

- 用当前执行中的 npm 包版本更新目标项目；
- 只更新安全文件，对冲突文件给出报告。

调用方式建议：

- `npx @king/openspec-cli@latest update`
- `npx @king/openspec-cli@0.1.3 update`
- 或先升级本地 devDependency，再执行 `openspec update`

建议参数：

- `--check`：只看差异，不执行更新
- `--force`：冲突时以当前包内版本为准
- `--backup`：更新前备份被覆盖文件，默认开启
- `--dry-run`：输出差异计划

差异分类建议：

1. `added`：当前包内新增，本地不存在，直接写入。
2. `updated-safe`：本地文件 hash 仍等于上次安装 hash，可直接覆盖。
3. `updated-conflict`：本地文件已被用户改动且当前包内版本也变更，停止并报冲突。
4. `deleted-safe`：当前包内已删除且本地未改动，可直接删除。
5. `deleted-conflict`：当前包内已删除但本地已改动，默认移动到备份目录。

建议默认策略：

- 安全项自动执行；
- 冲突项停止并返回非 0 code；
- 输出简洁 diff 摘要和冲突文件列表。

#### `openspec uninstall`

用途：

- 只删除 CLI 管理的文件；
- 尽量保留用户后续自定义内容。

建议参数：

- `--scope <all|skills|openspec>`
- `--backup`：卸载前备份已改动文件，默认开启
- `--force`：直接删除已改动文件
- `--dry-run`

默认行为：

1. 读取 `.openspec/state.json`；
2. 逐个检查托管文件当前 hash；
3. 未修改文件直接删除；
4. 已修改文件移动到 `.openspec/backups/<timestamp>/`；
5. 删除空目录；
6. 清理 `.openspec/state.json`。

### 6. 冲突与备份策略

首版不建议自动 merge 文本内容，原因是被管理资产里大量是规则文档和 skill 文件，自动 merge 反而容易生成不可控结果。

建议策略：

1. 任何冲突先基于 hash 检出；
2. 默认生成冲突报告；
3. 若用户显式传入 `--force`，则先备份再覆盖；
4. 所有备份统一写入 `.openspec/backups/<timestamp>/`。

### 7. 原子性与失败恢复

为避免安装中断导致半成品目录，建议：

1. 写入前先计算执行计划；
2. 批量写入时优先“写临时文件后 rename”；
3. 更新 state 作为最后一步；
4. 若中途失败，依据执行计划回滚已写入文件，至少保证 state 不会指向未完成安装。

### 8. 发布与版本策略

建议把 CLI 版本与资产版本保持一致，避免：

- CLI 版本升级了但资产没变；
- 资产变了但 `state.json` 无法明确对应哪个包版本。

建议规则：

1. `schemaVersion` 独立管理重大协议升级；
2. npm 包版本直接表示本次 skills/openspec 资产版本；
3. 每次发布前重新生成 `asset-manifest.json`；
4. 只有 npm 一个发布渠道，不再维护多源一致性问题。

### 9. 测试策略

至少覆盖三层：

1. 单元测试
   - manifest 解析
   - diff 分类
   - hash 比对
   - state 读写
2. 集成测试
   - init 首装
   - update 安全更新
   - update 冲突检测
   - uninstall 精准卸载
3. 端到端测试
   - `npm pack` 产物安装
   - 指定版本 update
   - 中断恢复

### 10. 风险与应对

| 风险 | 影响 | 应对 |
| --- | --- | --- |
| 用户手改了托管文件 | update/uninstall 容易误覆盖或误删 | 依赖 state hash 做冲突检测，默认备份 |
| 目标项目已有同名目录 | init 容易污染已有仓库 | 首次安装必须先检查托管边界并拒绝接管未知内容 |
| npm 包漏发某些资产文件 | 目标项目安装不完整 | 发布前由构建脚本生成 manifest，并用 `npm pack` 做产物校验 |
| 安装中断 | 产生半更新状态 | 原子写入、state 最后提交 |

## 推荐实施顺序

### Phase 1：npm 单源 MVP

1. 建立 Node CLI 骨架；
2. 支持 `init/update/uninstall`；
3. 建立 `asset-manifest.json`、`state.json`、`diff engine`；
4. 用当前 `.codex/skills/`、`.agents/`、`.claude/` 与 `openspec/` 生成 `distribution/managed/`；
5. 用 `npm pack` 验证发布产物。

### Phase 2：扩展 profile 与兼容入口

1. 细化 `.agents/` 与 `.claude/` 的局部 scope 语义；
2. 视使用情况决定是否支持文件级选择安装；
3. 若后续出现差异配置，再让 `--profile` 承担真正分流。

## 待确认项

1. CLI 对外包名是否使用 `@king/openspec-cli`。
2. 默认推荐使用 `npx`，还是推荐先安装为 devDependency。
3. 首版是否支持 `--scope skills` / `--scope openspec` 的局部安装。

## 结论

推荐采用“npm 单源 + 包内资产清单 + 本地 state 锁文件”的方案。

这套方案保留了 `init/update/uninstall` 的完整能力，同时把实现面收敛到最低，不再需要处理多源下载、适配器和发布一致性问题。对于当前阶段，这是成本最低且足够可用的设计。
