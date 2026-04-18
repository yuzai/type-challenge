---
title: 30430-汉诺塔
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

模拟汉诺塔：给定圆盘数 `N`，返回把圆盘从塔 A 借助塔 C 搬到塔 B 的步骤序列。每步是 `[From, To]`。

```ts
type R1 = Hanoi<1>; // [['A', 'B']]
type R2 = Hanoi<2>; // [['A', 'C'], ['A', 'B'], ['C', 'B']]
```

## 分析

经典递归：

1. 把 `n-1` 个盘从 **A → C**（借助 B）；
2. 把第 `n` 个盘从 **A → B**；
3. 把 `n-1` 个盘从 **C → B**（借助 A）。

递归边界是 `N = 0` 返回 `[]`，或 `N = 1` 直接返回 `[[A, B]]`。

在 TS 类型层实现时要解决两件事：

- 让类型函数接收"源 / 目标 / 辅助"三个塔参数；
- 把 `n` 递减 1 —— 使用元组长度。

## 题解

```ts
type BuildTuple<N, R extends any[] = []> =
  R['length'] extends N ? R : BuildTuple<N, [...R, any]>;

type Dec<N> = BuildTuple<N> extends [any, ...infer R] ? R['length'] : 0;

type Hanoi<
  N extends number,
  From extends string = 'A',
  To extends string = 'B',
  Via extends string = 'C',
> = N extends 0
  ? []
  : [
      ...Hanoi<Dec<N>, From, Via, To>,
      [From, To],
      ...Hanoi<Dec<N>, Via, To, From>,
    ];
```

直接把递归结构翻译成 TS：

- 出口：`N = 0` 时返回空步骤。
- 递归：先把 `N-1` 从 `From → Via`（辅助变 `To`），再走当前盘 `[From, To]`，再把 `N-1` 从 `Via → To`（辅助变 `From`）。

## 验证

```ts
type R0 = Hanoi<0>; // []
type R1 = Hanoi<1>; // [['A', 'B']]
type R2 = Hanoi<2>;
// [['A', 'C'], ['A', 'B'], ['C', 'B']]
type R3 = Hanoi<3>;
// [['A', 'B'], ['A', 'C'], ['B', 'C'], ['A', 'B'], ['C', 'A'], ['C', 'B'], ['A', 'B']]
```

## 知识点

- 递归题只要把数学递归式翻译过来就好，注意三塔参数的位置互换。
- `Dec` 靠元组长度减 1，见 [加减乘除](/summary/进阶-计数-加减乘除.md)。
- 汉诺塔的步骤数是 `2^N - 1`，`N` 太大会爆栈，题目测试一般在 `N ≤ 8` 内。
