---
title: 3062-实现Shift
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Implement the type version of ```Array.shift```

For example

```typescript
type Result = Shift<[3, 2, 1]> // [2, 1]
```

## 分析

其实和 [实现Pop](/medium/16-%E5%AE%9E%E7%8E%B0Pop.md) 一样，只需要推断匹配出剩余元素并返回即可

## 题解

```ts
type Shift<T extends any[]> = T extends [infer F, ...infer R] ? R : [];
```

推断出除了第一个元素的剩余元素，就是题目要求的类型。

## 知识点

1. 同 [实现Pop](/medium/16-%E5%AE%9E%E7%8E%B0Pop.md)

