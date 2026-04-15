---
name: req-dev
description: AI 任务统一入口与执行门禁（强制流程）
---

# 目标

统一所有任务的执行入口，确保每次都按“路由 -> 代理 -> 技能 -> 执行 -> 沉淀” 顺序推进，避免跳步。

# 何时使用

- 任意需求、设计、实现、评审、记录类任务。
- 当用户明确点名某个 skill 时，仍需先过本流程中的路由与门禁。

# 强制执行流程（必须按顺序）

```
User Task
  -> Phase Router(openspec/agent/phase-router.md)
  -> Load Agent(openspec/agent/*.md)
  -> Match Skill(openspec/skills/*/SKILL.md)
  -> Execute
  -> Record Learnings
```

## Step 1. Phase Router（必做）

1. 读取 `openspec/agent/phase-router.md`。
2. 输出：意图、复杂度、目标代理。
3. 不允许跳过此步骤直接执行任务。

## Step 2. Load Agent（必做）

1. 读取路由到的代理文件（如 `openspec/agent/requirement-manager.md`）。
2. 提取该代理定义的：
   - 适用场景；
   - 需要加载的上下文；
   - 技能匹配规则；
   - 输出要求。

## Step 3. Match Skill（必做）

1. 按代理规则选择 skill 并执行。
2. 若代理定义了先后顺序，必须按顺序执行。
3. 推荐映射：
   - `requirement-manager`：`common/req-create`、`common/prd-review`、`common/task-split`、`common/prd-archive`
   - `design-manager`：`python/backend-design`、`common/tech-design-review-template`
   - `implementation-executor`：
     - 前端：`web/task-impl`、`web/code-review`
     - Python 后端：`python/req-impl`、`python/code-review`、`python/test-create-api`、`python/test-create-unit`
   - `experience-depositor`：`common/experience-record`
3. 若 skill 缺失/不可读，必须显式说明：
   - 缺失项；
   - 采用的 fallback；
   - 可能影响。

## Step 4. Execute（任务执行）

1. 先采集事实，再产出结论。
2. 产出内容需符合对应 skill 的输出格式与检查项。
3. 最终输出中必须列出本次实际加载的索引文档与下钻得到的代码事实（文件/文档路径）。
4. 若任务涉及代码/文档变更，执行基本自检并给出结果。

## Step 5. Record Learnings（沉淀）

根据任务类型更新知识资产并反馈给用户：

- 业务逻辑：`openspec/wiki/business`
- 技术事实：`openspec/wiki/tech/`
- 开发规范：`openspec/wiki/rules/`
- 缺陷与复盘：`openspec/wiki/experience/`
- 需求/设计决策/任务相关：先读取 `openspec/sdd/INDEX.md` 然后按需获取具体内容

# 执行门禁（Gate）

- Gate 1：未完成 Step 1~3，禁止开始具体任务执行。
- Gate 2：最终回复必须包含“使用了哪个 Agent / Skill”。
- Gate 3：若未做沉淀，必须明确原因（如“本次仅评审、无新增事实”）。

# 最小输出模板

```markdown
## 意图分析
- 输入：
- 意图：
- 复杂度：

## 路由决策
- Agent：
- 原因：

## 技能执行
- Skill：
- 执行动作：
- 结果：

## 上下文事实
- 已加载索引：
- 已加载业务/设计文档：
- 已下钻代码事实：

## 已执行操作
- [x] 已完成路由
- [x] 已加载 Agent
- [x] 已执行 Skill
- [x] 已完成任务执行
- [x] 已沉淀（或说明未沉淀原因）
```

# 目录指引

| 目录 | 用途 |
| --- | --- |
| `openspec/agent/` | 代理角色定义 |
| `openspec/skills/` | 可复用工作流技能 |
| `openspec/wiki/` | 项目知识库 |
| `openspec/sdd/` | 统一需求管理 |
| `.codex/skills/` | 固定入口 skill |
