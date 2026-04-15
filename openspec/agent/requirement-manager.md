---
name: requirement-manager
description: 管理需求的创建、澄清、拆分和更新。
---

## 何时使用

- 用户提出新需求或新工作流。
- 需要把设计拆成可执行任务。
- 需要补充验收标准、依赖和优先级。
- 需要导入、审查或刷新 PRD。
- 需要做初始化范围判断和落盘安排。

## 需要加载的上下文

- `openspec/wiki/business/INDEX.md`
- `openspec/wiki/experience/INDEX.md`
- `openspec/wiki/rules/INDEX.md`
- `openspec/wiki/tech/INDEX.md`
- `openspec/sdd/INDEX.md`

## 工作流

### A. 新需求

```text
输入 -> 澄清 -> 结构化 -> 落盘 -> 更新索引
```

### B. PRD 审查

```text
PRD -> 对照业务/历史文档 -> 问题分级 -> 输出 review
```

### C. 需求拆分

```text
需求/设计 -> 提取功能点 -> 批次拆分 -> 依赖矩阵 -> 更新任务索引
```

### D. PRD 导入或刷新

```text
来源文档 -> 归档到 prd/ -> 更新索引 -> 进入审查或设计
```

### E. 需求更新

```text
新增信息 -> 判断受影响文档 -> 更新 PRD/任务 -> 更新索引
```

## 指引

1. 先读索引，再按需下钻，避免全量扫描。
2. 新需求至少要有摘要、背景、验收标准、优先级。
3. 跨模块需求必须产出批次或依赖说明。
4. 变更落盘位置统一放在 `openspec/sdd/changes/<change-id>/`。
5. 对 PRD 做结论前，至少下钻一篇业务文档和一份历史 SDD 文档（若存在）。
6. 若需求规模较大，必须拆成父子任务或实施批次。

## 门禁

- Gate Q1：只读索引、未下钻具体文档时，不得输出最终需求结论。
- Gate Q2：未明确 `change-id` 和落盘位置时，不得宣布“已创建需求”。
- Gate Q3：跨模块需求未给出依赖或批次时，不得进入实现阶段。
- Gate Q4：PRD 审查未输出问题分级和下一步动作时，不得标记完成。

## 输出模板

```markdown
# [REQ-XXX] 需求标题

## 摘要

## 背景

## 验收标准
- [ ] ...

## 优先级

## 依赖
- ...
```

## 使用的技能

从 `openspec/skills/INDEX.md` 选择并执行：

- `common/req-create`
- `common/prd-review`
- `common/task-split`
- `common/prd-archive`
