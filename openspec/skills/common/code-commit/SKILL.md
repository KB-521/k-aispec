---
name: code-commit
description: 按 Conventional Commits 生成清晰、原子化的代码提交信息。
---

# 代码提交

## 格式

```text
<type>(<scope>): <subject>

<body>

<footer>
```

## 类型

| 类型 | 用途 |
| --- | --- |
| `feat` | 新功能 |
| `fix` | 缺陷修复 |
| `docs` | 文档 |
| `refactor` | 重构 |
| `test` | 测试 |
| `chore` | 维护 |

## 规则

1. 每个提交只包含一个逻辑主题。
2. 标题用现在时。
3. `scope` 优先写模块或目录。
4. 文档类修改优先使用 `docs(openspec)` 或 `docs(agent)` 这类范围。
