---
title: 3242-实现FlattenDepth
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Recursively flatten array up to depth times.

For example:

```typescript
type a = FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2> // [1, 2, 3, 4, [5]]. flattern 2 times
type b = FlattenDepth<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, [[5]]]. Depth defaults to be 1
```

If the depth is provided, it's guaranteed to be positive integer.

## 分析

我第一次在做这个题的时候，似曾相识，但是怎么加了个深度，就这么难实现了呢？明明都实现过 [实现 Flatten](/docs/medium/459-%E5%AE%9E%E7%8E%B0Flatten.md) 了，怎么这还更难了。

实际答案就是更难了，在不考虑深度的时候，其实少了一层变量的考虑，反而更简单一点。

回归正题，怎么控制当前递归深度呢？还记得之前在做 [minus 1](/docs/medium/2257-%E5%87%8F%E4%B8%80.md) 中提到的元组长度计数吗？通过元组的长度就可以进行计数。

具体到题目，其实有两种思路：

第一种思路，遍历每一个元素，如果该元素是元组，那么需要对该元素进行递归，并将控制递归深度的 Arr 长度 + 1，否则直接返回元素本身，递归处理剩余元素后，拼接成最终的元组返回。

```ts

type FlattenDepth<T extends any[], D extends number = 1, Arr extends any[] = []> =
  // 深度是否达到，达到了就直接返回
  Arr['length'] extends D
  ? T
  // 否则匹配出第一个元素
  : T extends [infer F, ...infer R]
    // 第一个元素是元组
    ? F extends any[]
      // Arr 长度 + 1，进行递归，剩余元素 Arr 长度不变，递归
      ? [...FlattenDepth<F, D, [...Arr, 1]>, ...FlattenDepth<R, D, Arr>]
      // 直接 F，，剩余元素 Arr 长度不变，递归
      : [F, ...FlattenDepth<R, D, Arr>]
    : [];
```

这里值得注意的是 `...FlattenDepth<R, D, Arr>` 中的 Arr，这里 Arr 记录了当前递归的深度，这样，对于嵌套的元组，就能够正确计算出还需要递归几次。（笔者也是费了不少劲才整出来的）。

另一种思路，相对好理解一点，先实现一个 FlattenOnce，对整个元组解一层，用 Arr 控制长度，直到解了 Depth 层为止。

```ts
type FlattenOnce<T> = T extends [infer F, ...infer R]
  // 第一个元素是否是元组
  ? F extends any[]
    // 是，解构一层，并对剩余元素进行一层解构
    ? [...F, ...FlattenOnce<R>]
    // 否则直接返回 F，并对剩余元素进行一层解构
    : [F, ...FlattenOnce<R>]
  : []

type FlattenDepth<T extends any[], D extends number = 1, Arr extends any[] = []> =
  // 深度是否达到
  Arr['length'] extends D
  ? T
  // 没达到就继续解构一次
  : FlattenDepth<FlattenOnce<T>, D, [1, ...Arr]>
```

这一解法从思路上来讲更清晰一点，但是不容易想到。

同时由于递归最大深度是 1000，此时需要加一些限制才能通过用例。

```ts
type FlattenDepth<T extends any[], D extends number = 1, Arr extends any[] = []> =
  Arr['length'] extends D
  ? T
  // 判断 T 和解构一次之后的 T 是否一致
  : T extends FlattenOnce<T>
    // 一致，提前结束递归，从而保证性能
    ? T
    : FlattenDepth<FlattenOnce<T>, D, [1, ...Arr]>
```

## 解法

```ts
// 思路1
type FlattenDepth<T extends any[], D extends number = 1, Arr extends any[] = []> =
  // 深度是否达到，达到了就直接返回
  Arr['length'] extends D
  ? T
  // 否则匹配出第一个元素
  : T extends [infer F, ...infer R]
    // 第一个元素是元组
    ? F extends any[]
      // Arr 长度 + 1，进行递归，剩余元素 Arr 长度不变，递归
      ? [...FlattenDepth<F, D, [...Arr, 1]>, ...FlattenDepth<R, D, Arr>]
      // 直接 F，，剩余元素 Arr 长度不变，递归
      : [F, ...FlattenDepth<R, D, Arr>]
    : [];

// 思路2
type FlattenOnce<T> = T extends [infer F, ...infer R]
  ? F extends any[]
    ? [...F, ...FlattenOnce<R>]
    : [F, ...FlattenOnce<R>]
  : []

type FlattenDepth<T extends any[], D extends number = 1, Arr extends any[] = []> =
  Arr['length'] extends D
  ? T
  : T extends FlattenOnce<T>
    ? T
    : FlattenDepth<FlattenOnce<T>, D, [1, ...Arr]>
```

## 知识点

1. 元组长度进行计数
2. 元组遍历套路： `A extends [infer F, ...infer R]`





