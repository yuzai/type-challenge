---
title: 5360-unique
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现类型版本的 Lodash.uniq 方法, Unique<T> 接收数组类型 T, 返回去重后的数组类型.

```ts
type Res = Unique<[1, 1, 2, 2, 3, 3]>; // expected to be [1, 2, 3]
type Res1 = Unique<[1, 2, 3, 4, 4, 5, 6, 7]>; // expected to be [1, 2, 3, 4, 5, 6, 7]
type Res2 = Unique<[1, "a", 2, "b", 2, "a"]>; // expected to be [1, "a", 2, "b"]
type Res3 = Unique<[string, number, 1, "a", 1, string, 2, "b", 2, number]>; // expected to be [string, number, 1, "a", 2, "b"]
type Res4 = Unique<[unknown, unknown, any, any, never, never]>; // expected to be [unknown, any, never]
```

## 分析

要想去重，只需要遍历元组，并提供辅助元组，存储当前独一无二的元素，并在遍历元素时，先判断这个辅助元组中是否存在，如果存在，则忽略，否则，加入新元组并继续遍历。

其中判断元组中是否存在某个元素，可以通过 [Includes](/docs/easy/898-%E5%AE%9E%E7%8E%B0Includes.md) 来进行。

## 题解

```ts
type MyEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;

type Includes<T extends readonly any[], U> =
  T extends [infer F, ...infer R]
  ? MyEqual<F, U> extends true
    ? true
    : Includes<R, U>
  : false;

type Unique<T extends any[], Res extends any[] = []> =
  // 遍历元组
  T extends [infer F, ...infer R]
  // 判断辅助元组中是否包含 F
  ? Includes<Res, F> extends true
    // 如果包含，直接遍历剩余元素
    ? Unique<R, Res>
    // 不包含，则将当前元素放入结果，并在辅助元组中放入 F，然后递归剩余元素
    : [F, ...Unique<R, [...Res, F]>]
  : [];
```

## 知识点

1. 元组遍历套路