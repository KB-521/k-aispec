# OpenSpec 源资产

## 模块职责

存放仓库要分发到其他项目的固定入口技能与 OpenSpec 方法论资产。

## 源码目录

- `.codex/skills/`
- `openspec/`

## 关键入口

- `.codex/skills/init/SKILL.md`
  固定初始化入口。
- `.codex/skills/req-dev/SKILL.md`
  固定任务执行入口与门禁。
- `openspec/agent/phase-router.md`
  路由用户任务到需求、设计、实现或沉淀阶段。
- `openspec/skills/INDEX.md`
  可复用技能索引。
- `openspec/sdd/INDEX.md`
  需求、设计和任务交付入口。

## 核心依赖

- `openspec/wiki/*` 中的业务、技术、规则、经验知识资产
- `openspec/sdd/*` 中的变更包文档

## 运行与调试

- 该模块本身不是独立可执行程序。
- 通过 `.codex/skills/init` 与 `.codex/skills/req-dev` 被消费。
- 通过 `scripts/build-asset-manifest.ts` 被打包进 `distribution/managed/`。

## 与其它模块的关系

- 为 CLI 提供分发源数据。
- 与 `docs/repo/` 分层：`docs/repo/` 记录仓库自身实现方案，不属于可分发基座资产。

## 风险与待确认项

- 当前已验证存在的源资产根只有 `.codex/skills/` 与 `openspec/`。
- CLI 和 repo 文档还声明 `.agents/`、`.claude/` 也属于默认分发范围，但工作区并无对应目录。
