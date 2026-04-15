# Python 开发基本规范

## 文档说明

- 覆盖规则：Python 代码风格、类型标注、异常、资源管理、测试和交付底线。
- 核心要求：代码必须清晰、可测试、可维护，优先显式而不是隐式，优先简单而不是炫技。
- 应用场景：所有 Python 服务、脚本和工具开发。
- 命中主题：Python 基础规范、类型、资源管理、测试
- 触发关键词：Python 规范,type hints,context manager,pytest,ruff
- 关联 skill：common/init-agent、python/req-impl、python/code-review、python/test-create-unit
- 前置规则：01、04、08、22
- 后置规则：27
- 排除场景：纯前端实现

## 规则

1. 公共函数和核心 service 优先补类型标注。
2. 复杂资源使用 `with` 或显式生命周期管理。
3. 不要滥用动态属性和隐式副作用。
4. 新增逻辑优先配套 pytest。
5. 脚本也要有最小错误处理和日志。
