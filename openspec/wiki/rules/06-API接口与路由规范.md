# API 接口与路由规范

## 文档说明

- 覆盖规则：FastAPI 路由组织、请求响应模型、错误语义和契约同步要求。
- 核心要求：路由层保持薄；请求响应结构必须显式建模；契约变化必须同步技术文档。
- 应用场景：设计或实现 API、调整请求响应结构、补接口文档。
- 命中主题：FastAPI、router、schema、接口契约
- 触发关键词：API 设计,路由,FastAPI,request,response,schema
- 关联 skill：design-manager、python/req-impl、python/code-review
- 前置规则：00、01
- 后置规则：12、14、22、27
- 排除场景：纯前端页面样式修改

## 规则

1. 每个业务域使用独立 router。
2. 路由函数只做参数接收、鉴权和调用 service。
3. 请求体、查询参数、响应体都使用明确的 Pydantic 模型。
4. 对外错误语义保持稳定，不能把内部异常直接暴露给客户端。
5. 契约变化后同步更新 `openspec/wiki/tech/backend-api.md` 或给出无需同步说明。
