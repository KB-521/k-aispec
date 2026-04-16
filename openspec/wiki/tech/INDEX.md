# 技术文档索引

本目录用于沉淀可按需读取的技术事实，避免任务执行时反复盲扫代码库。

- 状态：已按当前仓库结构初始化
- 原则：只记录已验证事实；默认建议与仓库事实分开写。

## 维护规则

1. 技术文档只记录能从代码、配置、运行方式或设计文档确认的事实。
2. 发现接口、数据模型或模块边界发生变化时，同步更新对应文档。
3. 模块粒度优先，不把多个无关模块混在一篇文档中。
4. 共享资产文档负责沉淀全局接口、模型或基础设施口径。

## 模块与文档索引

| 模块 | 源码目录 | 文档路径 | 说明 |
| --- | --- | --- | --- |
| OpenSpec CLI | `bin/`, `src/`, `scripts/`, `tests/`, `package.json`, `tsconfig.json` | `openspec/wiki/tech/openspec-cli.md` | npm CLI、构建脚本与测试资产。 |
| OpenSpec 源资产 | `.codex/skills/`, `openspec/` | `openspec/wiki/tech/openspec-assets.md` | 要被 CLI 打包和分发的固定入口与方法论资产。 |

## 默认共享技术资产

| 资产 | 建议文档路径 | 说明 |
| --- | --- | --- |
| API 基线 | `openspec/wiki/tech/backend-api.md` | 当前仓库无独立 Python 后端 API，文档用于显式记录“不适用”事实。 |
| 数据模型基线 | `openspec/wiki/tech/backend-data-model.md` | 当前仓库无后端持久化模型，文档用于显式记录“不适用”事实。 |
| 前端架构概览 | `openspec/wiki/tech/frontend-overview.md` | 当前仓库无前端应用，文档用于显式记录“不适用”事实。 |

## 使用建议

1. 先在本页定位模块。
2. 再下钻具体技术文档。
3. 没有文档时，先执行 `init` 或补技术沉淀。

## 推荐文档模板

```markdown
# <模块名>

## 模块职责

## 源码目录

## 关键入口

## 核心依赖

## 运行与调试

## 风险与待确认项
```
