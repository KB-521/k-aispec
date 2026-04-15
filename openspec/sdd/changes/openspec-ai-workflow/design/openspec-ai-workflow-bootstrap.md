# OpenSpec AI 工作流骨架方案

## 方案索引 ID

`DES-GEN-20260415-001`

## 目标

把 `metaai/` 的方法论收敛成一套更轻的 OpenSpec 工作流：

1. 入口固定在 `.codex/skills/req-dev` 和 `.codex/skills/init`
2. 方法论主体放在 `openspec/`
3. 后端默认技术口径改为 Python

## 设计决策

### 1. 目录分层保持与 `metaai` 同构，但收敛为最小闭环

- `agent/`：路由与阶段代理
- `skills/`：通用、前端、Python 后端技能
- `wiki/`：业务、技术、规则、经验索引
- `sdd/`：需求、设计、任务的变更包

### 2. 入口与实现解耦

`.codex/skills` 只保留两个固定入口：

- `req-dev`：门禁与路由
- `init`：初始化入口

具体执行逻辑全部委托给 `openspec/`。

### 3. Java 专属实现规则替换为 Python 默认建议

保留 `metaai` 的流程意识，但把实现阶段映射改为：

- FastAPI router
- service
- repository
- Pydantic schema
- pytest

### 4. 规则库保持“索引 -> 正文 -> 证据回填”链路

`openspec/wiki/rules/INDEX.md` 作为规则入口，`python/req-impl` 等 skill 通过它定位正文，不在 skill 中复制规则内容。

## 结果

OpenSpec 可以作为后续新仓库或现有仓库的统一 AI 工作流基线，且不再绑定 Java 后端实现。

## 本轮补全范围

在初版骨架基础上，继续补齐了以下内容：

- 更完整的 agent 门禁与输出要求
- `common` 通用 skill：`prd-review`、`prd-archive`、`tech-design-review-template`、`code-commit`
- Python 后端 skill：`backend-design`、`test-create-api`、`test-create-unit`
- 更完整的规则库：模块分层、命名、返回、异常、枚举、异步、上下文、导入导出、代码生成模板、Python 基础规范
- `wiki` 与 `sdd` 的维护规则
