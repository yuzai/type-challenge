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
  - 若 `F` 可被视作 `S`（即 `F extends S`），替换成 `R` 并直接拼回 `Rest`（不再递归），因为只替换"第一个"；
  - 否则保留 `F`，对 `Rest` 继续递归。

注意：题目用的是 `F extends S`（赋值兼容）而不是 `Equal<F, S>`（严格相等）。例如 `ReplaceFirst<[1, 'two', 3], string, 2>` 要求把"第一个可以当作 `string` 的元素"换掉，得到 `[1, 2, 3]`，用严格 Equal 判等就拿不到这个结果。

## 题解

```ts
type ReplaceFirst<T extends readonly unknown[], S, R> = T extends readonly [
  infer F,
  ...infer Rest,
]
  ? [F] extends [S]
    ? [R, ...Rest]
    : [F, ...ReplaceFirst<Rest, S, R>]
  : [];
```

外面多套的一层 `[F] extends [S]` 是为了关掉 `F` 走进条件类型时的联合分发——题目要求的是整体判"第一个元素能不能当 S"，而不是把 F 按联合拆开逐项判断。

## 验证

```ts
type A = ReplaceFirst<[1, 2, 3], 2, 9>; // [1, 9, 3]
type B = ReplaceFirst<[1, 2, 3], 4, 9>; // [1, 2, 3]
type C = ReplaceFirst<[], 4, 9>; // []
type D = ReplaceFirst<[1, 1, 1], 1, 0>; // [0, 1, 1]
```
