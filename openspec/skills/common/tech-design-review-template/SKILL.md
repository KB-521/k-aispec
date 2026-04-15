---
name: tech-design-review-template
description: 为技术方案生成 review 模版，便于记录问题、结论和修订动作。
---

# 技术方案 Review 模版生成

## 何时使用

- 方案已产出，准备组织 review
- 需要建立“问题 -> 解决方案 -> 状态”追踪清单

## 输入

- 目标设计文档路径
- 关联 PRD 路径（建议）
- 历史 review 路径（若存在）

## 强制流程

1. 读取技术方案并抽取：
   - 核心链路
   - API 清单
   - 数据模型
   - 外部依赖
2. 计算 review 目标路径：
   - `openspec/sdd/changes/<change-id>/design/reviews/<design-file>-review.md`
3. 生成 review 模版。
4. 若已有历史 review，仅复用人工结论字段，不直接继承全部问题。

## 模版骨架

```markdown
# 设计 Review

## 关联信息
- 技术方案：
- 关联 PRD：
- 评审范围：

## 问题清单
| 严重级别 | 问题 | 影响 | 解决方案 | 状态 | 备注 |
| --- | --- | --- | --- | --- | --- |

## 待确认项
- ...
```
