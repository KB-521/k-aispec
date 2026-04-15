---
name: init-skills
description: 递归扫描 `openspec/skills` 并刷新 Skills 索引。
---

# 初始化 Skills 索引

## 执行步骤

1. 扫描 `openspec/skills` 下所有包含 `SKILL.md` 的目录。
2. 提取 `name` 和 `description`。
3. 按目录排序刷新 `openspec/skills/INDEX.md`。

## 约束

- 不记录不存在的 skill。
- 不把分组目录当成 skill。
- 重复执行结果必须稳定。
- 作用说明和使用时机必须来自真实 `SKILL.md` 内容。
