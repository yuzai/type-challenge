---
title: 5153-IndexOf
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Implement the type version of Array.indexOf, indexOf<T, U> takes an Array T, any U and returns the index of the first U in Array T.

```ts
type Res = IndexOf<[1, 2, 3], 2>; // expected to be 1
type Res1 = IndexOf<[2,6, 3,8,4,1,7, 3,9], 3>; // expected to be 2
type Res2 = IndexOf<[0, 0, 0], 2>; // expected to be -1
```

## 分析

这题可以说是 [Includes](/easy/898-实现Includes.md) 的加强版了，不仅要判断是否存在，还需要找到第一个出现的位置。

位置本质上也就是计数了，通过增加辅助的元组进行计数，遍历元组，遇到相同的元素时，返回元组长度即可

## 题解

```ts
// 标准 Equal 判断逻辑，具体原因看 Equal判断 章节
type MyEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;

type IndexOf<T, U, Arr extends any[] = []> =
  T extends [infer F, ...infer R]
  // 如果相等
  ? MyEqual<F, U> extends true
    // 返回计数元组的长度
    ? Arr['length']
    // 否则继续查找
    : IndexOf<R, U, [...Arr, 1]>
  // 找到最后都没找着，返回 -1
  : -1;
```

## 知识点

1. 元组遍历套路
2. 元组长度来实现计数