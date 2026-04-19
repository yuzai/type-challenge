---
title: 27958-CheckRepeatedTuple
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

判断元组 `T` 中是否有重复元素。

```ts
type R1 = CheckRepeatedTuple<[1, 2, 3]>; // false
type R2 = CheckRepeatedTuple<[1, 2, 1]>; // true
```

## 分析

典型的元组头递归。对每一项：

- 检查它是否出现在"剩余部分"中；
- 出现了就立刻返回 `true`；
- 否则继续对剩余递归。

判等需要精确（防止联合吸收 / any 干扰），直接用 `Equal` 终极版，见 [判断两个类型相等](/summary/基操-判断两个类型相等.md)。

## 题解

```ts
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type Includes<T extends any[], U> = T extends [infer F, ...infer R]
  ? Equal<F, U> extends true
    ? true
    : Includes<R, U>
  : false;

type CheckRepeatedTuple<T extends any[]> = T extends [infer F, ...infer R]
  ? Includes<R, F> extends true
    ? true
    : CheckRepeatedTuple<R>
  : false;
```

## 验证

```ts
type R1 = CheckRepeatedTuple<[]>; // false
type R2 = CheckRepeatedTuple<[1]>; // false
type R3 = CheckRepeatedTuple<[1, 2, 3]>; // false
type R4 = CheckRepeatedTuple<[1, 2, 1]>; // true
type R5 = CheckRepeatedTuple<[1, 2, 3, 4, 2]>; // true
```
