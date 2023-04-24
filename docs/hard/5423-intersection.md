---
title: 5423-intersection
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Implement the type version of Lodash.intersection with a little difference. `Intersection<T>` takes an Array T containing several arrays or any type element including the union type, and returns a new union containing all intersection elements.

```ts
type Res = Intersection<[[1, 2], [2, 3], [2, 2]]>; // expected to be 2
type Res1 = Intersection<[[1, 2, 3], [2, 3, 4], [2, 2, 3]]>; // expected to be 2 | 3
type Res2 = Intersection<[[1, 2], [3, 4], [5, 6]]>; // expected to be never
type Res3 = Intersection<[[1, 2, 3], [2, 3, 4], 3]>; // expected to be 3
type Res4 = Intersection<[[1, 2, 3], 2 | 3 | 4, 2 | 3]>; // expected to be 2 | 3
type Res5 = Intersection<[[1, 2, 3], 2, 3]>; // expected to be never
```

## 分析

这个题入参是一个元组，元组中的元素类型可能有：

1. 元组
2. 普通类型
3. 联合类型。

而本题，就是提取这些元素中，每一个元素都包含的类型。

要想所有的逻辑靠自己实现，有点困难，需要遍历元组，并在每一个元素中，同其他元素进行比较才可以实现，这并不好做。

但是可以借助 ts 已有的 交叉的能力，`'a' | 'b' & 'a' = 'a'`，将元组元素转换成联合类型，再借助交叉能力，就可以比较轻松的达到本题的目的。

## 题解

```ts
type Intersection<T> =
  T extends [infer F, ...infer R]
  // 如果元素是元组
  ? F extends any[]
    // 转成 联合，并同剩余元素进行交叉
    ? F[number] & Intersection<R>
    // 否则，直接交叉
    : F & Intersection<R>
  // unknown & any = any
  : unknown;
```

## 知识点

1. 妙用交叉
2. [元组转联合](/medium/10-元组转联合.md)