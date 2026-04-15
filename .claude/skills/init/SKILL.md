---
name: init
description: 根据用户输入执行全量或特定初始化；未指定具体范围时，默认依次初始化 AGENTS.md、技术文档、业务文档、规则文档与 skills 索引
---

# 初始化项目指南（入口）

本文件作为 `init` skill 的入口，实际执行逻辑委托给：

- `openspec/skills/common/init-agent/SKILL.md`
- `openspec/skills/common/init-tech/SKILL.md`
- `openspec/skills/common/init-business/SKILL.md`
- `openspec/skills/common/init-rules/SKILL.md`
- `openspec/skills/common/init-skills/SKILL.md`

## 输入识别规则

1. 先解析用户输入中是否明确指定初始化范围：
   - 命中 `AGENTS`、`项目指南`、`仓库规范`：执行 `openspec/skills/common/init-agent/SKILL.md`
   - 命中 `技术`、`tech`、`技术文档`：执行 `openspec/skills/common/init-tech/SKILL.md`
   - 命中 `业务`、`business`、`业务文档`：执行 `openspec/skills/common/init-business/SKILL.md`
   - 命中 `规则`、`rules`、`规则文档`：执行 `openspec/skills/common/init-rules/SKILL.md`
   - 命中 `skills`、`skill 索引`、`技能索引`：执行 `openspec/skills/common/init-skills/SKILL.md`
2. 若输入同时命中多个初始化项，只执行命中的项，并按默认顺序编排：
   - `init-agent` → `init-tech` → `init-business` → `init-rules` → `init-skills`
3. 若输入未明确指定范围，或明确表达“全部初始化 / 全量初始化 / 初始化项目”，执行默认全量初始化流程。
4. 不得因为触发了某一个初始化项而强制执行全部初始化；只有在未指定范围或用户明确要求全量时才执行全链路。

## 调用规则

### A. 特定初始化

1. 用户触发 `init` skill 且明确指定初始化范围时，仅执行命中的初始化项。
2. 若命中多个初始化项，按以下顺序执行命中的项：
   - `openspec/skills/common/init-agent/SKILL.md`
   - `openspec/skills/common/init-tech/SKILL.md`
   - `openspec/skills/common/init-business/SKILL.md`
   - `openspec/skills/common/init-rules/SKILL.md`
   - `openspec/skills/common/init-skills/SKILL.md`
3. 未命中的初始化项不得自动补跑。

### B. 默认全量初始化

1. 用户触发 `init` skill 且未明确指定范围时，先读取并执行 `openspec/skills/common/init-agent/SKILL.md`。
2. 完成 `AGENTS.md` 规范沉淀后，读取并执行 `openspec/skills/common/init-tech/SKILL.md`，同步维护 `openspec/wiki/tech/*` 技术文档。
3. 完成技术文档沉淀后，读取并执行 `openspec/skills/common/init-business/SKILL.md`，同步维护 `openspec/wiki/business/*` 业务文档。
4. 完成业务文档沉淀后，读取并执行 `openspec/skills/common/init-rules/SKILL.md`，同步维护 `openspec/wiki/rules/INDEX.md` 文档。
5. 完成规则文档沉淀后，读取并执行 `openspec/skills/common/init-skills/SKILL.md`，同步维护 `openspec/skills/INDEX.md` 索引文档。

## 初始化结果要求

最终至少明确：

- 本次初始化范围
- 新增或更新的目标路径
- 已确认的仓库事实
- 尚待补充的事实或阻塞项
