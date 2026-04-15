---
name: web-code-review
description: 对前端改动做需求一致性、状态边界和可维护性评审。
---

# 前端代码评审

## 重点检查

1. 需求和交互是否一致。
2. 接口类型、mock 和页面调用是否一致。
3. 是否覆盖 loading、empty、error。
4. 状态、副作用和清理是否清晰。
5. 是否存在明显回归风险或缺测试点。
6. 是否有直接写死数据、隐藏竞态或无用重渲染。

## 输出格式

```markdown
## Findings
- 严重级别 + 文件/行号 + 问题

## Residual Risks
- ...
```
