# OpenSpec 基座分发

## 目标

把仓库中的 OpenSpec 基座资产打包为单一 npm CLI，并让目标项目通过 `init`、`update`、`uninstall` 安装、升级和卸载这些资产。

## 关键流程

1. 维护者更新源资产目录中的技能、agent、wiki 与 SDD 文档。
2. 维护者运行 CLI 构建与打包校验命令，生成 `distribution/managed/` 和 `distribution/asset-manifest.json`。
3. 使用方通过 `npx @king/openspec-cli@<version>` 执行 `init`、`update` 或 `uninstall`。
4. CLI 在目标项目中写入或刷新 `.openspec/state.json`，并在必要时创建备份目录。

## 角色与权限

- 仓库维护者
  负责维护源资产、CLI 代码、repo 设计文档和发布流程。
- 目标项目使用者
  负责在自己的项目根目录运行 CLI，并决定是否接受 `--force` 覆盖或 `--backup` 备份策略。

## 规则与边界

- `docs/repo/` 属于仓库自身工程文档，不进入可分发资产。
- 目标项目中的 `.openspec/state.json` 是更新与卸载的安全基线。
- `update` 默认只自动处理安全项；冲突项保留原文件并返回非 0。
- `uninstall` 默认对本地已修改的托管文件先备份，再清理已托管内容。
- 当前工作区已验证存在的源资产根是 `.codex/skills/` 与 `openspec/`。

## 异常与失败行为

- `init` 在目标目录已有未托管同名内容时会拒绝接管，除非显式传入 `--force`。
- `update` 遇到冲突时会输出计划摘要并保留冲突文件。
- `uninstall` 在默认模式下会把本地已修改的托管文件移动到 `.openspec/backups/<timestamp>/`。
- 当前代码和 repo 文档把 `.agents/` 与 `.claude/` 视为默认分发范围，但这两个源目录并未在工作区中验证到；在该缺口解决前，构建与发布流程存在源资产不完整风险。
