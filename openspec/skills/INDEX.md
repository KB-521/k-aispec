# Skills 索引

本目录存放 OpenSpec 可复用技能。每个 skill 以目录管理，入口文件为 `SKILL.md`。

## 使用建议

1. 先通过 `openspec/agent/*.md` 决定当前任务阶段。
2. 再在本页定位对应 skill。
3. 只加载当前任务真正需要的 skill，避免全量读取。

## Skill 清单

| 目录 | `name` | 作用说明 | 典型使用时机 | 主要产出/关注点 |
| --- | --- | --- | --- | --- |
| `common/code-commit` | `code-commit` | 按 Conventional Commits 提交变更 | 需要形成清晰提交时 | 原子提交说明 |
| `common/experience-record` | `experience-record` | 记录经验与复盘结论 | 复杂任务闭环、踩坑或决策后 | 经验条目与索引更新 |
| `common/init-agent` | `init-agent` | 初始化或刷新 `AGENTS.md` | 新仓库接入、项目指南过期 | 可执行的仓库规范 |
| `common/init-business` | `init-business` | 初始化业务知识索引与域文档 | 需要补业务事实时 | `openspec/wiki/business/*` |
| `common/init-rules` | `init-rules` | 初始化或刷新规则库索引 | 规则库首次建立或更新时 | `openspec/wiki/rules/INDEX.md` |
| `common/init-skills` | `init-skills` | 扫描并更新 skills 索引 | 新增或修改 skill 后 | `openspec/skills/INDEX.md` |
| `common/init-tech` | `init-tech` | 初始化技术事实索引与模块文档 | 需要补模块技术事实时 | `openspec/wiki/tech/*` |
| `common/prd-archive` | `prd-archive` | 将 PRD 归档到 OpenSpec 的 SDD 目录 | 外部 PRD 需要落库时 | PRD 基线文件 |
| `common/prd-review` | `prd-review` | 审查 PRD 的结构、边界和可实现性 | 进入设计或实现前 | 问题分级与修订建议 |
| `common/req-create` | `req-create` | 从想法生成结构化需求文档 | 新功能、规范、流程创建 | 需求文档与任务落点 |
| `common/task-split` | `task-split` | 将需求或设计拆成实施批次 | 复杂需求准备开工时 | 任务拆分与依赖矩阵 |
| `common/tech-design-review-template` | `tech-design-review-template` | 为技术方案生成 review 模版 | 方案产出后准备评审时 | review 文档骨架 |
| `python/backend-design` | `python-backend-design` | 将需求转为 Python 后端方案和契约 | API/Service/数据模型设计时 | 设计文档与契约 |
| `python/code-review` | `python-code-review` | 对 Python 后端改动做评审 | 实现后、自检前 | 风险与回归点清单 |
| `python/req-impl` | `python-req-impl` | 按统一门禁完成 Python 后端实现 | FastAPI/API/脚本/服务实现时 | 规则命中矩阵、测试和交付证据 |
| `python/test-create-api` | `python-test-create-api` | 创建并执行 Python 后端接口测试 | FastAPI 路由或 HTTP 回归时 | API 测试代码与结果 |
| `python/test-create-unit` | `python-test-create-unit` | 创建并执行 Python 业务单元测试 | service/domain/util 改动时 | pytest 单元测试与结果 |
| `web/code-review` | `web-code-review` | 对前端改动做评审 | 页面或数据层实现后 | 行为回归与可维护性检查 |
| `web/task-impl` | `web-task-impl` | 按统一顺序完成前端实现 | 页面、数据层、交互开发时 | 接口/页面/评审闭环 |
