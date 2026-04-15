---
name: python-test-create-unit
description: 创建并执行 Python 单元测试，覆盖 service、domain、util 等纯业务逻辑。
---

# 创建 Python 单元测试

## 目标

- 验证纯业务逻辑
- 覆盖边界值和异常分支
- 为缺陷修复补回归测试

## 适用场景

- service 逻辑变更
- domain 规则变更
- util 或 mapper 转换逻辑变更

## 最小用例清单

- 正常路径
- 边界场景
- 异常路径
- 缺陷回归

## 推荐落点

- `tests/unit/`
- 受影响模块已有的单元测试目录

## 输出格式

```markdown
## 单元测试结果
- 目标模块：
- 被测对象：
- 测试文件：
- 执行命令：
- 最终结果：PASS / FAIL
- 风险与待补充：
```
