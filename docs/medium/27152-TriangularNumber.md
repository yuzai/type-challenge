---
title: 27152-三角形数
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

给定一个数字 `N`，返回第 `N` 个三角形数 `1 + 2 + 3 + ... + N`。

```ts
type R1 = TriangularNumber<1>; // 1
type R2 = TriangularNumber<2>; // 3
type R3 = TriangularNumber<3>; // 6
type R4 = TriangularNumber<5>; // 15
```

## 分析

就是把 `1..N` 累加。类型层做加法参见 [加减乘除](/summary/进阶-计数-加减乘除.md) —— 用元组长度累计。

两种写法：

1. **递归累加**：从 1 到 N 逐步累加到一个结果元组里。
2. **数学公式**：`N * (N + 1) / 2`，但类型层做乘除更贵。

递归累加更直接。

## 题解

```ts
type BuildTuple<N, R extends any[] = []> =
  R['length'] extends N ? R : BuildTuple<N, [...R, any]>;

type TriangularNumber<
  N extends number,
  Cur extends any[] = [],
  Acc extends any[] = [],
> = Cur['length'] extends N
  ? [...Acc, ...BuildTuple<N>]['length']
  : TriangularNumber<N, [...Cur, any], [...Acc, ...BuildTuple<Cur['length']>]>;
```

思路：

- `Cur` 当作计数器（从 0 开始），每轮 +1。
- `Acc` 累加到当前为止的"前 k 项和"。
- 出口：`Cur` 长度 = `N` 时，再加上一份 `BuildTuple<N>`（即 N 本身），返回长度。

等价于把 `0 + 1 + 2 + ... + (N-1) + N` 的累加过程展开到类型层。

## 验证

```ts
type R0 = TriangularNumber<0>; // 0
type R1 = TriangularNumber<1>; // 1
type R2 = TriangularNumber<2>; // 3
type R3 = TriangularNumber<3>; // 6
type R4 = TriangularNumber<5>; // 15
type R5 = TriangularNumber<10>; // 55
```

## 知识点

- "当前计数 + 累加器"两个元组协同，是所有"求和 / 求积到 N"类型题的通用套路。
- 类型层加法本质是元组拼接，见 [加减乘除](/summary/进阶-计数-加减乘除.md)。
