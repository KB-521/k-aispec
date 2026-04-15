---
name: python-backend-design
description: 将需求转成 Python 后端技术方案、接口契约、数据模型和测试策略。
---

# Python 后端技术方案

## 统一输入

- PRD 或任务卡
- 已有技术约束
- `openspec/wiki/tech/INDEX.md`
- `openspec/wiki/rules/INDEX.md`

## 统一输出

- `openspec/sdd/changes/<change-id>/design/<project>-python-design.md`
- `openspec/sdd/changes/<change-id>/design/<project>-api-contract.md`
- `openspec/sdd/changes/<change-id>/design/<project>-logical-data-model.md`（按需）

## 强制流程

1. 识别变更类型：
   - 新需求
   - 需求变更
   - API 变更
   - 数据模型变更
2. 读取规则索引并建立命中矩阵。
3. 抽取动作级业务逻辑与字段级规则。
4. 冻结接口清单。
5. 设计模块边界：
   - router
   - service
   - repository
   - schema
   - tests
6. 产出测试策略：
   - 哪些走 API 测试
   - 哪些走单元测试
7. 更新设计索引。

## API 契约最小要求

- 路径
- 方法
- 用途
- 权限
- request 字段
- response 字段
- 错误语义
- 主链路步骤

## 门禁

- Gate PBD1：未产出独立 API 契约，禁止进入实现。
- Gate PBD2：未声明测试策略，禁止进入实现。
- Gate PBD3：存在核心待确认项时，禁止标记“定稿版”。
