---
title: 13580-Replaceunions
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Given an `union of types` and `array of type pairs` to replace (`[[string, number], [Date, null]]`), return a new union replaced with the `type pairs`.

## 分析

题目的入参比较清晰，联合类型和一个元组类型，元组的元素必定是两个值，表示将第一个值的联合类型替换成第二个值。

可以看下用例：

```ts
type cases = [
  // string -> null
  Expect<Equal<UnionReplace<number | string, [[string, null]]>, number | null>>,

  // Date -> string; Function -> undefined
  Expect<Equal<UnionReplace<Function | Date | object, [[Date, string], [Function, undefined]]>, undefined | string | object>>,
]
```

只需要遍历一下联合类型，并遍历元组类型，排查是否有相同类型的，如果有，替换成元组的第二个值。

联合类型的遍历直接借助分发特性就行。

本题放在 hard 里面算是比较简单的，不赘述，直接看题解

## 题解

```ts
type FindEl<U extends [any, any][], T> =
  U extends [infer F extends [any, any], ...infer R extends [any, any][]]
  // 如果相等
  ? Equal<F[0], T> extends true
    // 替换为 F[1]
    ? F[1]
    // 否则遍历剩余元素
    : FindEl<R, T>
  // 没找到，就返回原来的元素
  : T;

type UnionReplace<T, U extends [any, any][]> =
  T extends any
  ? FindEl<U, T>
  : never;
```

## 知识点

1. 联合类型的分发特性
