# Service 层与事务规范

## 文档说明

- 覆盖规则：Python 后端的 service 分层、事务边界和 repository 协作方式。
- 核心要求：业务编排集中在 service；事务边界清晰；router 不承载核心业务。
- 应用场景：实现 API、批处理任务、领域服务拆分。
- 命中主题：service、repository、事务、分层
- 触发关键词：service,repository,transaction,session,unit of work
- 关联 skill：python/req-impl、python/code-review
- 前置规则：06、12
- 后置规则：19、22、27
- 排除场景：纯静态配置更新

## 规则

1. router 只负责组装输入和调用 service。
2. service 负责业务编排、事务和跨 repository 协作。
3. repository 负责数据访问，不处理页面语义。
4. 跨多步写操作时，事务边界必须显式。
