# Design Review

## 关联信息

- 技术方案：`docs/repo/openspec-cli-distribution-design.md`
- 关联 PRD：本次基于用户直接需求产出，暂未单独建 PRD
- 评审范围：npm 单源 CLI 命令契约、包内资产清单、更新机制、卸载安全边界

## 问题清单

| 严重级别 | 问题 | 影响 | 解决方案 | 状态 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 中 | 首版默认 profile 范围是否仅限 `.codex/skills/` + `openspec/` | 影响实现范围和兼容成本 | 明确是否需要同时兼容 `.agents/skills/`、`.claude/skills/` | open | 建议首版只做最小可用范围 |
| 中 | 包内资产目录是直接发布原始路径还是生成 `assets/managed/` | 影响打包脚本和运行时路径解析 | 建议统一生成 `assets/managed/`，避免把仓库工程文件一并暴露为分发资产 | open | 倾向显式资产目录 |
| 中 | `update` 是否要求默认自动应用安全变更 | 影响用户体验和回滚预期 | 建议默认自动应用安全项，冲突项停止 | open | 需要和命令输出一起设计 |
| 低 | CLI 包名和安装入口未定 | 影响命令示例与发布文档 | 在实现前冻结命名 | open | 建议命令名直接叫 `openspec` |

## 待确认项

1. 命令名和 npm 包名最终采用什么命名。
2. 默认推荐 `npx` 执行，还是推荐先安装为 devDependency。
3. 是否允许 `update` 默认自动应用安全变更。
4. 是否需要在首版支持 `--scope skills` / `--scope openspec` 的局部安装。
