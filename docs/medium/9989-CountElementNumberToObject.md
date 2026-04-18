---
title: 9989-统计数组中的元素个数
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现 `CountElementNumberToObject`，统计数组里每个元素的出现次数，返回一个对象；嵌套数组要先拉平。

```ts
type A = CountElementNumberToObject<[]>;                         // {}
type B = CountElementNumberToObject<[1, 2, 3, 4, 5]>;            // { 1: 1; 2: 1; 3: 1; 4: 1; 5: 1 }
type C = CountElementNumberToObject<[1, 2, 3, 4, 5, [1, 2, 3]]>; // { 1: 2; 2: 2; 3: 2; 4: 1; 5: 1 }
```

## 分析

两个小问题：

1. **Flatten**：先把嵌套数组展平成一维。用递归 + 判断首项是否是数组即可。
2. **计数**：对展平后的元组，依次给结果对象的对应 key 累加 1。

关键点：对象的 value 从 `未定义` 递增到 `N`。需要在 mapped 层面迭代时，把当前 `value + 1`。TS 里没有原生加法，借助元组长度计数（见 [加减乘除](/summary/进阶-计数-加减乘除.md)）。

## 题解

```ts
// 1. 先把多层嵌套数组拉平
type Flatten<T extends any[]> = T extends [infer F, ...infer R]
  ? F extends any[]
    ? [...Flatten<F>, ...Flatten<R>]
    : [F, ...Flatten<R>]
  : [];

// 2. 把结果对象里某个 key 的值 +1
type Inc<N> = N extends number
  ? [...BuildTuple<N>, any]['length']
  : never;

type BuildTuple<N, R extends any[] = []> =
  R['length'] extends N ? R : BuildTuple<N, [...R, any]>;

type CountElementNumberToObject<
  T extends any[],
  Acc extends Record<any, any> = {},
> = Flatten<T> extends [infer F, ...infer R extends any[]]
  ? F extends keyof Acc
    ? CountElementNumberToObject<R, Omit<Acc, F & keyof Acc> & { [K in F & PropertyKey]: Inc<Acc[F & keyof Acc]> }>
    : CountElementNumberToObject<R, Acc & { [K in F & PropertyKey]: 1 }>
  : Acc;
```

思路：

1. `Flatten` 把嵌套数组拉平。每一项若是数组，先展开它再连上剩余；否则直接头插。
2. 每次把当前首项 `F` 往累加器 `Acc` 里塞：
   - 如果 `Acc` 已经有这个 key，把它的值 +1；
   - 否则新增字段，值为 1。
3. 用 `BuildTuple` 实现"数字 +1"：把当前值转成等长元组，push 一个占位再取 `length`。

## 验证

```ts
type R1 = CountElementNumberToObject<[]>;
// {}

type R2 = CountElementNumberToObject<[1, 2, 3, 4, 5]>;
// { 1: 1; 2: 1; 3: 1; 4: 1; 5: 1 }

type R3 = CountElementNumberToObject<[1, 2, 3, 4, 5, [1, 2, 3]]>;
// { 1: 2; 2: 2; 3: 2; 4: 1; 5: 1 }
```

## 知识点

- 元组展平：递归 + 判断数组。
- 类型层 +1：借 `BuildTuple`，见 [加减乘除](/summary/进阶-计数-加减乘除.md)。
- 对象累加：`Omit + &` 改写已有字段，`&` 追加新字段。
