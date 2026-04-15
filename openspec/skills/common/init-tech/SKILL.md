---
name: init-tech
description: 初始化技术事实索引；前端与 Python 后端分开沉淀，未指定范围时按前端 -> Python 后端顺序执行。
---

# 初始化技术沉淀

## 路由规则

- 命中 `前端`、`web`、`frontend`、`React`、`Next.js`：沉淀前端技术事实。
- 命中 `后端`、`python`、`FastAPI`、`API`、`service`、`pytest`：沉淀 Python 技术事实。
- 未指定范围：默认按“前端 -> Python 后端”顺序执行。

## 产出要求

1. 更新 `openspec/wiki/tech/INDEX.md`。
2. 为每个已确认模块建立独立技术文档。
3. 共享资产按需补充：
   - `backend-api.md`
   - `backend-data-model.md`
   - `frontend-overview.md`

## 技术文档建议字段

- 模块职责
- 源码目录
- 关键入口
- 核心依赖
- 运行方式
- 与其它模块的关系
- 当前风险或待确认项

## 约束

- 只记录已验证事实。
- 默认建议必须和仓库事实分开写。
