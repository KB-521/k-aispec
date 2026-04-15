# [REQ-OS-20260415-001] OpenSpec AI 工作流整合

## 摘要

参考 `metaai/` 整理一套可复用的 AI 工作流，统一沉淀到 `openspec/`，并保留 `.codex/skills/req-dev` 与 `.codex/skills/init` 作为固定入口。

## 背景

当前仓库已有 `metaai/` 的完整方法论，但入口仍希望保持极简，同时后端默认实现口径要从 Java 切换到 Python。需要形成一套新的、可长期演进的工作流目录与规则。

## 验收标准

- [x] `openspec/` 下存在完整工作流骨架：`agent/`、`skills/`、`wiki/`、`sdd/`
- [x] `.codex/skills/req-dev` 指向 `openspec/`
- [x] `.codex/skills/init` 指向 `openspec/`
- [x] 后端实现规则不再依赖 Java，改为 Python 默认口径
- [x] OpenSpec 自身的需求与设计变更已记录到 `openspec/sdd/`

## 优先级

P0

## 依赖

- `metaai/` 现有目录与文档结构
