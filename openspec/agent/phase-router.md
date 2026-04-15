---
name: phase-router
description: OpenSpec 统一任务入口，负责识别意图、判断复杂度并选择合适代理。
---

## 核心机制

```text
用户输入 -> 分析意图 -> 判断复杂度 -> 路由到代理 -> 更新知识资产
```

## 步骤 1：分析意图

| 意图类型 | 关键词/信号 | 路由到 |
| --- | --- | --- |
| 新需求/需求拆分 | 创建、设计一个、拆分、规划、里程碑 | `requirement-manager` |
| 技术方案/API/架构 | 架构、技术方案、API、数据流、先出方案 | `design-manager` |
| 实现/修复/重构 | 实现、修改、修复、重构、补测试 | `implementation-executor` |
| 复盘/沉淀/记住 | 记住、沉淀、总结经验、复盘 | `experience-depositor` |
| 初始化/刷新索引 | 初始化、补文档、刷新规则、更新 skills 索引 | `requirement-manager` |

## 步骤 2：判断复杂度

| 等级 | 信号 | 路径 |
| --- | --- | --- |
| 简单 | 小改动、局部修复、单文档维护 | 直接到 `implementation-executor` |
| 中等 | 新功能、接口变更、初始化某一块资产 | 需求 -> 设计/实现 |
| 复杂 | 新模块、新工作流、新系统规范 | 需求 -> 设计 -> 实现 -> 沉淀 |

## 步骤 3：推荐路径

### 简单任务

```text
用户: "补一条规则文档"
-> implementation-executor
-> 文档对齐
-> experience-depositor（如有新增模式）
```

### 中等任务

```text
用户: "给 Python 后端补 API 设计和实现流程"
-> requirement-manager
-> design-manager
-> implementation-executor
-> experience-depositor
```

### 复杂任务

```text
用户: "整合一套新的 AI 工作流"
-> requirement-manager
-> design-manager
-> implementation-executor
-> experience-depositor
```

## 步骤 3：知识更新

每次任务完成后，按结果更新：

- 需求/设计/任务：`openspec/sdd/`
- 业务事实：`openspec/wiki/business/`
- 技术事实：`openspec/wiki/tech/`
- 规则约定：`openspec/wiki/rules/`
- 经验复盘：`openspec/wiki/experience/`

## 路由门禁

- Gate R1：未输出意图、复杂度和目标代理，禁止进入执行。
- Gate R2：任务涉及需求、设计或实现时，必须声明后续要加载的上下文索引。
- Gate R3：任务完成后必须说明是否需要沉淀到 `wiki/` 或 `sdd/`。

## 输出格式

```markdown
## 意图分析
- 输入：
- 意图：
- 复杂度：

## 路由决策
- Agent：
- 原因：

## 已执行操作
- [x] 已完成路由
- [x] 已确认知识沉淀位置
```
