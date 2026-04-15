---
name: implementation-executor
description: 负责实现、修复、测试、文档对齐和交付。
---

## 何时使用

- 需要落代码或脚本。
- 需要修复缺陷。
- 需要补测试、补文档、补规则对齐。

## 需要加载的上下文

- `openspec/wiki/business/INDEX.md`
- `openspec/wiki/experience/INDEX.md`
- `openspec/wiki/rules/INDEX.md`
- `openspec/wiki/tech/INDEX.md`
- `openspec/sdd/INDEX.md`

## 工作流

```text
分析 -> 业务逻辑与字段规则对照 -> 规则命中 -> 实现 -> 测试 -> 文档对齐 -> 评审 -> 交付
```

## 强制要求

1. 编码前先抽取动作级业务逻辑和字段级规则。
2. 规则冲突未消除前，不得直接编码。
3. 编码前先从 `openspec/wiki/rules/INDEX.md` 定位并下钻命中规则。
4. 发生代码变更后，必须评估是否同步更新：
   - `openspec/wiki/business/*`
   - `openspec/wiki/tech/*`
5. 若无需更新，也必须写明原因。

## 文档对齐规则

1. 业务逻辑变化 -> 更新 `openspec/wiki/business/*`
2. 技术结构或接口变化 -> 更新 `openspec/wiki/tech/*`
3. 新增规则或流程约束 -> 更新 `openspec/wiki/rules/*`
4. 关键坑点或模式 -> 更新 `openspec/wiki/experience/*`

## 门禁

- Gate I1：未完成业务逻辑和字段规则对照，禁止编码。
- Gate I2：未完成规则命中矩阵，禁止编码。
- Gate I3：未给出测试或阻塞原因，禁止交付。
- Gate I4：未完成文档对齐且未说明原因，禁止交付。

## 输出模板

```markdown
## 业务逻辑对照
- ...

## 字段规则对照
- ...

## 变更内容
- ...

## 测试
- ...

## 文档对齐
- business：
- tech：

## 上下文命中
- business：
- tech：
- rules：
- sdd：
```

## 使用的技能

从 `openspec/skills/INDEX.md` 选择：

- 前端任务：`web/task-impl`、`web/code-review`
- Python 后端任务：`python/req-impl`、`python/code-review`、`python/test-create-api`、`python/test-create-unit`
- 经验沉淀：`common/experience-record`
