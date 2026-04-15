---
name: req-create
description: 从用户想法创建结构化需求文档，并写入 OpenSpec 的 SDD 目录。
---

# 创建需求

## 工作流

1. 捕捉用户目标。
2. 必要时补充澄清。
3. 按模板结构化。
4. 选择或生成 `change-id`。
5. 写入 `openspec/sdd/changes/<change-id>/tasks/` 或 `prd/`。
6. 更新对应 `INDEX.md`。

## `change-id` 建议

- 使用稳定 `kebab-case`
- 优先按“项目-领域-主题”命名
- 一次需求讨论尽量只对应一个主 `change-id`

## 模板

```markdown
# [REQ-XXX] 标题

## 摘要

## 用户故事
作为一名 [角色]，我希望 [目标]，以便 [收益]。

## 验收标准
- [ ] ...

## 优先级

## 工作量
```

## 要求

- 需求尽量原子化。
- 验收标准必须可验证。
- 跨模块需求应继续使用 `task-split`。
- 若属于规范或工作流类需求，背景里要明确“旧链路 -> 新链路”的替换关系。
