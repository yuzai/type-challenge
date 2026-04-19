---
title: 30958-帕斯卡三角
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

给定行数 `N`，构造 `N` 行的帕斯卡三角（杨辉三角）。

```ts
type R = Pascal<4>;
// [
//   [1],
//   [1, 1],
//   [1, 2, 1],
//   [1, 3, 3, 1],
// ]
```

## 分析

帕斯卡三角每一行都是从上一行推出来的：第 `i` 行的第 `j` 个数 = 第 `i-1` 行的第 `j-1` 个数 + 第 `i-1` 行的第 `j` 个数。

在类型层：

1. 把"上一行"看成已知元组 `Prev`；
2. 构造新的一行 `Next`：`[1, Prev[0] + Prev[1], Prev[1] + Prev[2], ..., 1]`；
3. 重复 `N` 次，把每一行累积到结果元组里。

加法借 [加减乘除](/summary/进阶-计数-加减乘除.md) 的元组长度法。

## 题解

```ts
type BuildTuple<N, R extends any[] = []> = R['length'] extends N
  ? R
  : BuildTuple<N, [...R, any]>;

type Add<A extends number, B extends number> = [
  ...BuildTuple<A>,
  ...BuildTuple<B>,
]['length'] &
  number;

// 基于上一行构造下一行
type NextRow<Row extends number[], Acc extends number[] = [1]> = Row extends [
  infer A extends number,
  infer B extends number,
  ...infer R extends number[],
]
  ? NextRow<[B, ...R], [...Acc, Add<A, B>]>
  : [...Acc, 1];

// 初始就是 [1]，不需要生成下一行的规则
type Pascal<
  N extends number,
  Acc extends number[][] = [],
> = Acc['length'] extends N
  ? Acc
  : Acc extends [...any, infer Last extends number[]]
  ? Pascal<N, [...Acc, NextRow<Last>]>
  : Pascal<N, [[1]]>;
```

解读：

- `NextRow<Row>` 每次取 Row 的前两项相加放入累加器，最后补一个 1；同时 `Row[0]` 已经是上一次贡献的 1，不再额外加。
- 外层 `Pascal` 从 `[[1]]` 启动，直到累积到 `N` 行。

## 验证

```ts
type R1 = Pascal<0>; // []
type R2 = Pascal<1>; // [[1]]
type R3 = Pascal<3>;
// [[1], [1, 1], [1, 2, 1]]
type R4 = Pascal<4>;
// [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]]
```

## 知识点

- 类型层加法：元组拼接，`[...Tuple<A>, ...Tuple<B>]['length']`，见 [加减乘除](/summary/进阶-计数-加减乘除.md)。
- "**前缀累积**"模式：用累加器元组 `Acc` 维护已经构造出的结果，保持尾递归。
- 注意数字会随行数快速增大（第 `N` 行的中间项约 `2^N / √N`），TS 默认 1000 尾递归足以覆盖 `N ≤ 10` 左右的测试。
