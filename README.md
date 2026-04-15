# OpenSpec AI 工作流

OpenSpec 参考 `metaai/` 的分层方式整理，但目标不是做一份缩写版，而是形成一套更适合当前仓库的长期工作流：

1. 固定入口仍然只有 `.codex/skills/req-dev` 和 `.codex/skills/init`
2. 主体方法论和沉淀资产全部转移到 `openspec/`
3. 后端默认实现口径不再围绕 Java/Maven，而是改为 Python/FastAPI

## 核心链路

```text
用户任务
  -> .codex/skills/req-dev
  -> openspec/agent/phase-router.md
  -> openspec/agent/<agent>.md
  -> openspec/skills/<skill>/SKILL.md
  -> 执行
  -> openspec/wiki/* + openspec/sdd/*
```

## 设计原则

### 1. 入口极简，执行分层

- 入口层只负责门禁、路由和初始化入口。
- 具体执行逻辑统一落在 `openspec/agent/` 与 `openspec/skills/`。

### 2. 索引优先，按需下钻

- 所有任务先读索引，再读正文。
- 禁止一开始全量扫描仓库。

### 3. 事实和建议分离

- `AGENTS.md`、`openspec/wiki/tech/*` 记录仓库事实。
- `openspec/wiki/rules/*` 记录默认规则与执行门禁。
- “默认 Python 建议”不能写成“当前仓库事实”。

### 4. 文档与实现同等重要

- 新需求必须进入 `openspec/sdd/`
- 业务、技术、规则、经验都要进入 `openspec/wiki/`
- 设计与实现不能只停留在聊天记录里

## 目录分层

```text
openspec/
├── agent/                  # 任务路由与阶段代理
├── skills/                 # 可复用执行技能
├── wiki/
│   ├── business/           # 业务事实
│   ├── tech/               # 技术事实
│   ├── rules/              # 执行规则
│   └── experience/         # 经验沉淀
└── sdd/                    # 需求、设计、任务交付物
```

### `agent/`

- 定义阶段代理，而不是堆执行细节。
- 负责说明何时使用、需要加载哪些上下文、产出什么结果。

### `skills/`

- 定义可复用工作流。
- 按 `common / web / python` 分层，避免前后端混写。

### `wiki/`

- `business/`：目标、流程、规则、边界
- `tech/`：模块结构、接口、数据模型、依赖与运行方式
- `rules/`：执行规范、评审门禁、编码口径
- `experience/`：坑点、模式、决策、复盘

### `sdd/`

- `changes/<change-id>/prd/`：需求文档
- `changes/<change-id>/design/`：方案和评审材料
- `changes/<change-id>/tasks/`：拆分任务与实施计划
- `archive/`：归档历史交付

## 与 `metaai/` 的映射关系

| `metaai/` | `openspec/` | 说明 |
| --- | --- | --- |
| `metaai/agent/` | `openspec/agent/` | 保留阶段代理机制 |
| `metaai/skills/common/` | `openspec/skills/common/` | 保留通用工作流 |
| `metaai/skills/web/` | `openspec/skills/web/` | 保留前端工作流 |
| `metaai/skills/server/` | `openspec/skills/python/` | 用 Python 后端替代 Java 后端 |
| `metaai/wiki/` | `openspec/wiki/` | 沉淀事实、规则和经验 |
| `metaai/sdd/` | `openspec/sdd/` | 统一需求、设计和任务交付 |

## 默认 Python 技术建议

当仓库还没有明确后端栈时，OpenSpec 使用以下 Python 默认建议口径：

- Python `3.12`
- FastAPI + Pydantic v2
- SQLAlchemy 2 + Alembic
- pytest + httpx
- Ruff
- `logging` 或 `structlog`
- `uv` 或 `pip-tools` 作为依赖管理候选

这些都是默认建议，不是仓库事实。真实项目初始化后，应以 `AGENTS.md` 和 `openspec/wiki/tech/*` 中沉淀的事实为准。

## 命名约定

### `change-id`

建议使用稳定的 `kebab-case`，例如：

- `openspec-ai-workflow`
- `billing-invoice-v2`
- `user-auth-refresh-token`

### 需求 ID

- `REQ-WEB-YYYYMMDD-XXX`
- `REQ-PY-YYYYMMDD-XXX`
- `REQ-GEN-YYYYMMDD-XXX`

### 设计 ID

- `DES-WEB-YYYYMMDD-XXX`
- `DES-PY-YYYYMMDD-XXX`
- `DES-GEN-YYYYMMDD-XXX`

## 使用方式

1. 所有需求、设计、实现、评审任务先走 `.codex/skills/req-dev`
2. 仓库首次接入或知识资产过期时走 `.codex/skills/init`
3. 发生需求、设计、实现、评审、复盘时，同步回填 `openspec/sdd` 或 `openspec/wiki`

## 当前范围

本版 OpenSpec 已经覆盖：

- 统一路由与门禁
- 需求、设计、实现、沉淀四阶段代理
- 通用 skill、前端 skill、Python 后端 skill
- Python/Web 规则索引
- SDD 交付骨架

尚未做自动化脚本化的部分，后续可继续补：

- 自动扫描仓库并生成 `wiki/tech`
- PRD 外部来源自动归档
- 基于仓库实际结构生成更完整的 `AGENTS.md`

## 仓库边界

- `openspec/` 与 `.codex/skills/` 是要分发到其他项目的基座资产。
- 当前仓库自己的实现方案、打包方案、发布方案放在 `docs/repo/`，不要写入 `openspec/sdd/`。
