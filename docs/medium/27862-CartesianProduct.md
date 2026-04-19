---
title: 27862-CartesianProduct
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现两个联合类型的笛卡尔积，返回所有组合的元组联合。

```ts
type R = CartesianProduct<1 | 2, 'a' | 'b'>;
// [1, 'a'] | [2, 'a'] | [1, 'b'] | [2, 'b']
```

## 分析

笛卡尔积 = 对两个联合的每一支两两组合。利用联合的分发特性，写两层嵌套的"主动分发"即可。

对应 [排列组合大乱炖](/summary/算法-排列组合大乱炖.md) 中的基础模板。

## 题解

```ts
type CartesianProduct<A, B> = A extends any
  ? B extends any
    ? [A, B]
    : never
  : never;
```

解读：

- `A extends any` 触发对 `A` 的分发，每一支都进入内层；
- 内层 `B extends any` 再对 `B` 分发；
- 最里面就是 `[A, B]` 一个元组；
- 分发结果联合起来就是所有组合。

## 验证

```ts
type R1 = CartesianProduct<1 | 2, 'a' | 'b'>;
// [1, 'a'] | [1, 'b'] | [2, 'a'] | [2, 'b']

type R2 = CartesianProduct<1, 'a'>; // [1, 'a']
type R3 = CartesianProduct<never, 'a'>; // never (never 分发为空)
type R4 = CartesianProduct<'x', never>; // never
```

## 知识点

- "`T extends any ? ... : never`" 是触发联合分发的标准模板，见 [分发特性](/summary/战斗基-联合类型的分发特性.md)。
- 两层嵌套分发就是笛卡尔积，更多是 `${A}${B}` 的字符串模板变体（对字符串联合自动笛卡尔积）。
