# 后端 API 基线

本文件用于记录 Python 后端当前对外 API 契约。

## 状态

当前仓库无独立 Python 后端 API 运行时。

## 已验证事实

- `openspec/skills/python/*` 和 `openspec/wiki/rules/*` 提供的是默认 Python 工作流与规则模板，不是当前仓库正在运行的 HTTP 服务。
- 当前仓库的可执行程序是 npm CLI，而不是 FastAPI 或其他 Python API 服务。

## 影响

- 需要后端 API 契约时，应先在目标业务仓库中初始化并沉淀，而不是把当前仓库误判为后端项目。
