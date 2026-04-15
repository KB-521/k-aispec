---
name: python-req-impl
description: Python 后端实现执行器，用于按统一规则完成 FastAPI/API/Service/Repository/测试与交付。
---

# Python 后端实现

## 阶段定位

- 本 skill 属于 `implementation-executor` 阶段。
- 规则真源统一来自 `openspec/wiki/rules/`。

## 输入清单

- 需求与设计输入：PRD、任务卡、API 契约
- 技术上下文：`AGENTS.md`、`openspec/wiki/tech/INDEX.md`
- 业务上下文：`openspec/wiki/business/INDEX.md`
- 规则上下文：`openspec/wiki/rules/INDEX.md`
- 当前变更包：`openspec/sdd/INDEX.md`

## 强制流程

1. 规则命中矩阵
   - 先读 `openspec/wiki/rules/INDEX.md`
   - 至少命中：日志、注释与文档、参数校验、Service 与事务、测试与质量、实现阶段门禁
2. 模块落点确认
   - 明确 router、service、repository、schema、tests 的归属
3. 契约冻结
   - 冻结路径、方法、请求响应结构、错误语义、鉴权约束
4. 离散值盘点
   - 枚举、状态、类型字段先盘点再编码
5. 代码实现
   - FastAPI 路由层保持薄
   - 业务编排放 service
   - 数据访问放 repository
6. API 文档同步
   - 若改动影响对外契约，更新 `openspec/wiki/tech/backend-api.md`
7. 测试与自检
   - 至少 1 个成功用例 + 1 个失败或边界用例
   - HTTP 路由优先评估是否补 `python/test-create-api`
   - 纯业务逻辑优先评估是否补 `python/test-create-unit`
8. 代码评审
   - 执行 `python/code-review`
9. 交付回填
   - 回填规则命中矩阵、测试证据、剩余风险

## 规则命中矩阵最小结构

| 规则 | 命中状态 | 执行动作 | 证据路径 | 未命中原因 |
| --- | --- | --- | --- | --- |
| 日志规范 | 命中 | 补入口与异常日志 | ... | - |

## 高频规则映射

| 规则主题 | 规则文档 |
| --- | --- |
| API 接口与路由 | `openspec/wiki/rules/06-API接口与路由规范.md` |
| 日志规范 | `openspec/wiki/rules/09-日志规范.md` |
| 注释与文档规范 | `openspec/wiki/rules/11-注释与文档规范.md` |
| 入参与参数校验 | `openspec/wiki/rules/12-入参与参数校验规范.md` |
| Service 与事务 | `openspec/wiki/rules/14-Service层与事务规范.md` |
| 配置与环境 | `openspec/wiki/rules/16-配置与环境规范.md` |
| 第三方集成 | `openspec/wiki/rules/19-第三方集成适配规范.md` |
| 测试与质量 | `openspec/wiki/rules/22-测试与质量保障规范.md` |
| 项目初始化清单 | `openspec/wiki/rules/23-项目初始化清单.md` |
| 实现阶段执行与门禁 | `openspec/wiki/rules/27-实现阶段执行与门禁规范.md` |

## 交付清单

- 变更文件清单
- 契约映射表
- 规则命中矩阵
- 测试命令与结果
- API 基线同步证据或无需同步说明
- 代码评审结论
- 剩余风险

## 禁止项

- 禁止把业务编排直接塞进 router
- 禁止只生成测试文件而不执行
- 禁止未说明原因就跳过文档同步
