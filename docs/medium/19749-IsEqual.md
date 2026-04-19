---
title: 19749-IsEqual
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现一个 `IsEqual<X, Y>`，判断两个类型是否严格相等。

```ts
type T1 = IsEqual<1, 1>; // true
type T2 = IsEqual<1, 2>; // false
type T3 = IsEqual<any, 1>; // false
type T4 = IsEqual<never, never>; // true
```

## 分析

这就是"判断两个类型相等"的经典问题。本文档 [判断两个类型相等](/summary/基操-判断两个类型相等.md) 有详尽讨论，核心结论是采用官方终极版：

```ts
type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;
```

能覆盖 `never` / `any` / 联合 / 修饰符等边界场景。

## 题解

```ts
type IsEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;
```

## 验证

```ts
type R1 = IsEqual<1, 1>; // true
type R2 = IsEqual<1, 2>; // false
type R3 = IsEqual<any, 1>; // false
type R4 = IsEqual<never, never>; // true
type R5 = IsEqual<{ a: 1 }, { a: 1 }>; // true
type R6 = IsEqual<[1, 2], [1, 2]>; // true
```

具体原理参看 [判断两个类型相等](/summary/基操-判断两个类型相等.md)，不再赘述。
