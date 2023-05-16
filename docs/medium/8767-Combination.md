---
title: 8767-实现组合
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Given an array of strings, do Permutation & Combination.
It's also useful for the prop types like video [controlsList](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/controlsList)

```ts
// expected to be `"foo" | "bar" | "baz" | "foo bar" | "foo bar baz" | "foo baz" | "foo baz bar" | "bar foo" | "bar foo baz" | "bar baz" | "bar baz foo" | "baz foo" | "baz foo bar" | "baz bar" | "baz bar foo"`
type Keys = Combination<['foo', 'bar', 'baz']>
```

## 分析

之前的题目中，已经实现了 [全排列](/medium/296-实现全排列.md) 和实现 [全组合](/medium/4260-实现所有组合.md)。

均借助了分发特性后，用非常简洁的代码实现了全排列和全组合。

<!-- 这个题目要求的是，实现组合，在以前的数学中，以 3 个元素为例，这个题目一共有 `A31 + A32 + A33` = 15 种组合方式，`A31` 表示从3个里任取一个元素，共有3种，`A32` 表示从3个里任取两个元素，共有 6 种取法，`A33` 表示从 3 个里任取3种，此时也是 6种取法。(还记得 Axx 和 Cxx 的关系吗？ Axx 表示不考虑顺序， Cxx 要去掉顺序相同的，比如 bar baz 和 baz bar  Cxx 认为要去掉)。 -->

其实之前的全组合，已经实现了本题目，只不过这题目少了一种情况，空字符。

想要实现组合，即使是用 js，也挺麻烦，但是借助 ts 联合类型的分发特性帮助了我们去做遍历，反而可以比较简单的实现这个题目。

## 题解

```ts
type Combination<
  T extends string[],
  // 将输入的元组转成联合类型
  C = T[number],
  // 保留原始的联合类型，因为分发后，就只表示自身了，想要 Exclude ，就必须保留原始的联合类型
  K = C
> =
  // 触发分发特性，
  K extends string
  // 此时 K 表示 元组中的某一个元素，将 K 加入结果中，同时递归剩余元素：Exclude<C, K> 即可
  // 左侧的 K ，借助分发，产出了单个元素的所有结果，递归中的第一次分发，产出了所有的两个元素的结果，再次递归，产出了所有的3个元素的结果
  ? K | `${K} ${Combination<[], Exclude<C, K>>}`
  // 永远走不到这个逻辑
  : '';
```

## 知识点

1. 1. 充分理解分发特性，本质其实也算是一层遍历，层层递归，直接帮助我们轻松遍历了所有组合
2. 同 [全排列](/medium/296-实现全排列.md)
3. 同 [10-元组转联合](/medium/10-元组转联合.md)