---
name: python-code-review
description: 对 Python 后端改动做功能、契约、分层、测试和运维风险评审。
---

# Python 代码评审

## 重点检查

1. 契约是否与设计一致。
2. router/service/repository 分层是否清晰。
3. 校验、异常和日志是否完整。
4. 配置和第三方调用是否存在风险。
5. 测试是否覆盖成功与失败路径。
6. 是否存在同步/异步误用、会话泄漏或状态机缺口。

## 输出格式

```markdown
## Findings
- 严重级别 + 文件/行号 + 问题

## Open Questions
- ...

## Residual Risks
- ...
```

## 评审纪律

- 只评论可验证事实
- 每条问题都带风险与最小修复建议
- 有待确认信息时显式写 `待确认`
