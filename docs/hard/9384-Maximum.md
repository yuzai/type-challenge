---
title: 9384-Maximum
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

### Description

Implement the type `Maximum`, which takes an input type `T`, and returns the maximum value in `T`.

If `T` is an empty array, it returns `never`. **Negative numbers** are not considered.

For example:

```ts
Maximum<[]>; // never
Maximum<[0, 2, 1]>; // 2
Maximum<[1, 20, 200, 150]>; // 200
```

### Advanced

Can you implement type `Minimum` inspired by `Maximum`?

## 分析

要找出元组中最大的数字，可以通过遍历元组，每次都记录下最大值，将他同下一个值比较，如果大于则更新最大值，否则沿用以前的最大值，直到遍历结束，此时的最大值就是最终的结果。

对于比较，已经在 [4425-实现比较](/medium/4425-实现比较.md) 题目中实现过了。此处可以直接拿来用。

而为了记录最大值，需要引入一个辅助泛型进行记录。

## 题解

```ts
// [4425-实现比较](/medium/4425-实现比较.md)
type GreaterThan<T extends number, U extends number, Arr extends any[] = []> =
  // 先达到 T，则 T 小
  T extends Arr['length']
    ? false
    : // 先达到 U
    U extends Arr['length']
    ? // 则 T 大
      true
    : // 都没到，膨胀元组
      GreaterThan<T, U, [...Arr, 1]>;

type Maximum<
  T extends any[],
  // 记录最大值，默认是 T[0] 或 never，处理 Maximum<[]> 的情况
  MAX extends number = T extends [] ? never : T[0],
> =
  // 遍历元组
  T extends [infer F extends number, ...infer R]
    ? // 如果当前元素大于 MAX
      GreaterThan<F, MAX> extends true
      ? // 更新 MAX
        Maximum<R, F>
      : // 否则沿用以前的 MAX
        Maximum<R, MAX>
    : // 遍历结束，返回 MAX
      MAX;
```

## 知识点

1. 同 [4425-实现比较](/medium/4425-实现比较.md)。
