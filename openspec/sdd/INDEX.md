# SDD 索引

本目录用于统一管理需求、设计与任务交付物。

## 维护规则

1. 所有新需求都优先进入 `changes/<change-id>/`
2. 一个 `change-id` 下至少维护 `prd/`、`design/`、`tasks/` 其中之一
3. 若进入实现阶段，建议三者都存在
4. 已完成且长期不再变更的内容再转入 `archive/`

## 目录说明

| 目录 | 说明 |
| --- | --- |
| `openspec/sdd/changes` | 按变更包组织进行中的需求、设计和任务。 |
| `openspec/sdd/archive` | 已完成或归档的历史交付。 |

## 推荐结构

```text
openspec/sdd/changes/<change-id>/
├── prd/
├── design/
└── tasks/
```

## 当前变更包

| 变更包 | PRD | Design | Tasks |
| --- | --- | --- | --- |
| `openspec-ai-workflow` | `openspec/sdd/changes/openspec-ai-workflow/prd/openspec-ai-workflow.md` | `openspec/sdd/changes/openspec-ai-workflow/design/openspec-ai-workflow-bootstrap.md` | `openspec/sdd/changes/openspec-ai-workflow/tasks/INDEX.md` |
