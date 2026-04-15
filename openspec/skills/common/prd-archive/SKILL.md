---
name: prd-archive
description: 将外部 PRD 或现有需求文档归档到 `openspec/sdd/changes/<change-id>/prd/`。
---

# PRD 归档

## 输入

- `change-id`
- PRD 来源路径、链接或原文
- 目标文件名（可选）

## 强制流程

1. 确认目标目录：`openspec/sdd/changes/<change-id>/prd/`
2. 若来源为外部文档，先获取完整正文
3. 只做最小清洗：
   - 去样式噪音
   - 保留结构、列表、表格、链接
4. 覆盖写入目标文件
5. 更新索引或关联需求文档

## 规则

- 不做摘要化改写
- 不擅自补业务事实
- 写盘后必须确认文件落库成功
