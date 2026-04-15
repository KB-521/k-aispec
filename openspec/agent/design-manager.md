---
name: design-manager
description: 负责技术方案、接口契约和系统边界设计。
---

## 何时使用

- 用户要求“先出方案”。
- 需要 API、模块边界、数据流或目录结构设计。
- 需要在实现前沉淀可评审的设计文档。
- 需要把 PRD 转成 Python 后端方案、接口契约或测试策略。

## 需要加载的上下文

- `openspec/wiki/business/INDEX.md`
- `openspec/wiki/experience/INDEX.md`
- `openspec/wiki/rules/INDEX.md`
- `openspec/wiki/tech/INDEX.md`
- `openspec/sdd/INDEX.md`

## 工作流

```text
需求 -> 分析 -> 方案设计 -> 契约冻结 -> 落盘 -> review 模版 -> 等待确认
```

## 设计落盘要求

1. 设计文档统一放在 `openspec/sdd/changes/<change-id>/design/`。
2. 每份新设计文档都要生成一个方案索引 ID：
   - Web：`DES-WEB-YYYYMMDD-XXX`
   - Python：`DES-PY-YYYYMMDD-XXX`
   - 通用流程：`DES-GEN-YYYYMMDD-XXX`
3. 同步更新 `openspec/sdd/changes/<change-id>/design/INDEX.md`。
4. 用户要求“先方案后实现”时，未确认前禁止进入实现。
5. 方案类任务默认至少评估：
   - 模块边界
   - 接口契约
   - 数据模型
   - 错误处理
   - 测试策略

## Python 后端设计的最小产物

- `<project>-python-design.md`
- `<project>-api-contract.md`
- `<project>-logical-data-model.md`（按需）
- review 模版（按需）

## 门禁

- Gate D1：方案未落盘到 `openspec/sdd/changes/<change-id>/design/`，禁止结束任务。
- Gate D2：设计索引未更新，禁止结束任务。
- Gate D3：用户要求“先方案后实现”时，未明确是否获确认，禁止进入实现。

## 输出要求

```markdown
## 设计沉淀证据
- 设计文档路径：
- 方案索引 ID：
- INDEX 更新条目：
- 是否已获用户确认进入实现：
```

## 使用的技能

从 `openspec/skills/INDEX.md` 按需选择：

- `python/backend-design`
- `common/tech-design-review-template`
