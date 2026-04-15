# 规则约定文档索引

本目录用于沉淀可按需读取的规则与约定，默认以后端 Python 和通用 Web 开发为主。

## 规则读取流程（推荐）

1. 先读 `openspec/wiki/rules/00-规则总览.md`。
2. 再按主题定位具体规则文档。
3. 实现任务至少继续下钻 API、日志、文档、校验、Service、测试和实现门禁。

## 约定主题与文档索引

| 主题 | 文档路径 | 说明 |
| --- | --- | --- |
| OpenSpec 规则总览 | `openspec/wiki/rules/00-规则总览.md` | 规则库目标、阅读顺序和默认技术建议。 |
| 技术栈与版本基线 | `openspec/wiki/rules/01-技术栈与版本基线.md` | Python 默认技术栈与工具链建议。 |
| 模块与依赖分层规则 | `openspec/wiki/rules/02-模块与依赖分层规则.md` | 前后端模块边界与依赖方向。 |
| 项目目录与包结构规则 | `openspec/wiki/rules/03-项目目录与包结构规则.md` | 目录分层和包结构建议。 |
| 命名规范 | `openspec/wiki/rules/04-命名规范.md` | 文件、类、函数、API 与变更 ID 命名。 |
| 依赖注入与装饰器规范 | `openspec/wiki/rules/05-依赖注入与装饰器规范.md` | FastAPI Depends、中间件和装饰器边界。 |
| API 接口与路由规范 | `openspec/wiki/rules/06-API接口与路由规范.md` | FastAPI 路由、schema 和契约同步要求。 |
| 返回结果封装规范 | `openspec/wiki/rules/07-返回结果封装规范.md` | 成功、失败和分页响应结构。 |
| 异常处理与错误码规范 | `openspec/wiki/rules/08-异常处理与错误码规范.md` | 内外异常分层和错误语义。 |
| 日志规范 | `openspec/wiki/rules/09-日志规范.md` | 结构化日志、关键日志点和敏感信息约束。 |
| 字段映射与序列化规范 | `openspec/wiki/rules/10-字段映射与序列化规范.md` | API、领域和持久化字段映射。 |
| 注释与文档规范 | `openspec/wiki/rules/11-注释与文档规范.md` | 高价值注释和文档沉淀要求。 |
| 入参与参数校验规范 | `openspec/wiki/rules/12-入参与参数校验规范.md` | schema 层和 service 层校验分工。 |
| Service 层与事务规范 | `openspec/wiki/rules/14-Service层与事务规范.md` | service、repository 与事务边界。 |
| 配置与环境规范 | `openspec/wiki/rules/16-配置与环境规范.md` | 环境变量、配置加载和密钥治理。 |
| 定时任务与异步规范 | `openspec/wiki/rules/17-定时任务与异步规范.md` | 异步、cron、重试与幂等。 |
| 多租户与请求上下文规范 | `openspec/wiki/rules/18-多租户与请求上下文规范.md` | tenant、org、user 和 trace 上下文。 |
| 第三方集成适配规范 | `openspec/wiki/rules/19-第三方集成适配规范.md` | adapter/client 分层、超时和降级。 |
| 文件导入导出规范 | `openspec/wiki/rules/20-文件导入导出规范.md` | 上传、下载、导入导出和错误反馈。 |
| 枚举常量与状态机规范 | `openspec/wiki/rules/21-枚举常量与状态机规范.md` | 离散值、状态流转和魔法字符串治理。 |
| 测试与质量保障规范 | `openspec/wiki/rules/22-测试与质量保障规范.md` | 成功/失败路径测试和质量门禁。 |
| 项目初始化清单 | `openspec/wiki/rules/23-项目初始化清单.md` | 空白项目到可持续迭代项目的初始化阶段。 |
| 代码生成提示词模板 | `openspec/wiki/rules/24-代码生成提示词模板.md` | 生成代码前的输入模板与约束。 |
| Python 开发基本规范 | `openspec/wiki/rules/26-python开发基本规范.md` | Python 编码、类型、资源管理和测试底线。 |
| 实现阶段执行与门禁规范 | `openspec/wiki/rules/27-实现阶段执行与门禁规范.md` | 规则命中矩阵、契约冻结和交付门禁。 |

## 使用建议

1. 新仓库先看 `23`、`01`、`02`、`03`。
2. API 或服务实现先看 `06`、`07`、`08`、`12`、`14`、`22`、`27`。
3. 涉及线上可观测性或第三方集成时补看 `09`、`16`、`17`、`18`、`19`。
4. 涉及模型、字段和状态时补看 `10`、`21`、`26`。
