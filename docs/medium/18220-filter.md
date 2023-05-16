---
title: 18220-filter
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Implement the type `Filter<T, Predicate>` takes an Array `T`, primitive type or union primitive type `Predicate` and returns an Array include the elements of `Predicate`.

## 分析

这一题的思路其实也非常简单，只需要遍历元组，判断当前元素是否是 Predicate 即可。

## 题解

```ts
type Filter<T extends any[], P> = T extends [infer F, ...infer R]
  ? // 简单判定 F 是否是 P 类型
    F extends P
    ? // 是，保留当前元素，并递归剩余元素
      [F, ...Filter<R, P>]
    : // 否则去除当前元素，递归剩余元素即可
      Filter<R, P>
  : [];
```

## 知识点

1. 元组遍历套路
