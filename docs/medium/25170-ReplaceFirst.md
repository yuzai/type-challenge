---
title: 25170-ReplaceFirst
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现 `ReplaceFirst<T, S, R>`，将元组 `T` 中 **第一个** 等于 `S` 的元素替换为 `R`。若 `T` 中没有 `S`，返回原元组。

```ts
type R1 = ReplaceFirst<[1, 2, 3], 2, 9>; // [1, 9, 3]
type R2 = ReplaceFirst<[1, 2, 3], 4, 9>; // [1, 2, 3]
type R3 = ReplaceFirst<[], 4, 9>; // []
```

## 分析

典型的元组头递归题：

- 空元组：直接返回 `[]`。
- 非空元组拆出首项 `F` 和余下 `Rest`：
  - 若 `F` 等于 `S`，替换成 `R` 并直接拼回 `Rest`（不再递归），因为只替换"第一个"；
  - 否则保留 `F`，对 `Rest` 继续递归。

判等要精确，使用 `Equal` 终极版，见 [判断两个类型相等](/summary/基操-判断两个类型相等.md)。

## 题解

```ts
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type ReplaceFirst<T extends readonly unknown[], S, R> = T extends [
  infer F,
  ...infer Rest,
]
  ? Equal<F, S> extends true
    ? [R, ...Rest]
    : [F, ...ReplaceFirst<Rest, S, R>]
  : [];
```

## 验证

```ts
type A = ReplaceFirst<[1, 2, 3], 2, 9>; // [1, 9, 3]
type B = ReplaceFirst<[1, 2, 3], 4, 9>; // [1, 2, 3]
type C = ReplaceFirst<[], 4, 9>; // []
type D = ReplaceFirst<[1, 1, 1], 1, 0>; // [0, 1, 1]
```
