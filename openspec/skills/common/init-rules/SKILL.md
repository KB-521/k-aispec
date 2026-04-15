---
name: init-rules
description: 初始化或刷新 OpenSpec 规则库及其索引。
---

# 初始化规则库

## 目标

维护 `openspec/wiki/rules/*.md` 和 `openspec/wiki/rules/INDEX.md`，让实现任务能先命中索引，再下钻规则正文。

## 执行要求

1. 规则正文以 `openspec/wiki/rules/*.md` 为真源。
2. `INDEX.md` 必须覆盖当前所有规则文档。
3. 规则新增、重命名、删除后都要同步刷新索引。
4. 默认规则以 Python 后端和通用 Web 开发为主，不再保留 Java 专属约束。
5. 规则文档尽量包含：
   - 文档说明
   - 核心要求
   - 应用场景
   - 触发关键词
   - 关联 skill
   - 前置/后置规则

## 校验项

- 索引路径可打开。
- 说明与当前规则正文一致。
- 没有孤儿规则条目。
