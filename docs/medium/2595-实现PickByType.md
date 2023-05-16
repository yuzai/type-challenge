---
title: 2595-实现PickByType
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

From `T`, pick a set of properties whose type are assignable to `U`.

For Example

```typescript
type OnlyBoolean = PickByType<{
  name: string
  count: number
  isReadonly: boolean
  isEnable: boolean
}, boolean> // { isReadonly: boolean; isEnable: boolean; }
```

## 分析

这个题，可以说是非常简单了，理解了 [实现 Omit](/medium/3-实现Omit.md) 中 `as` 的写法，可以很轻松的写出本道题目，只需要遍历所有属性，并通过 as 判断类型不是目标类型的属性置为 never 即可过滤掉该属性。

## 题解

```ts
type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P] 
}
```

as 过滤属性即可

## 知识点

1. 同 [实现 Omit](/medium/3-实现Omit.md)

