---
title: 55-UnionToIntersection
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现高级util类型 `UnionToIntersection<U>`

例如

```ts
type I = Union2Intersection<'foo' | 42 | true> // expected to be 'foo' & 42 & true
```

## 分析

关于类型转换题，之前做过挺多的，可以参考 TODO: 类型转换题合集。

在所有类型转换中，联合转交叉可以说是进阶里面的入门砖。

核心在于其他类型都有比较简单的遍历方法，比如元组的 `T extends [infer F, ...infer R]`，对象的 `[P in keyof T]: T[P]`，还有字符的遍历套路，在这些类型中，转交叉其实非常简单。这里以元组为例：

```ts
type TupleToIntersection<T extends any[]> =
    // 遍历
    T extends [infer F, ...infer R]
    // 元素交叉即可
    ? F & TupleToIntersection<R>
    // any & unknown = any
    // 所以当 T 为空时，返回 unknown不影响结果
    : unknown;

// Case1 = {a: 1} & {b: 2}
type Case1 = TupleToIntersection<[{a: 1}, { b: 2}]>;
```

但是对联合类型就麻烦了，因为我们无法把联合类型一个一个拉出来进行遍历，联合类型只有分发特性。但是分发特性也是从一个联合类型返回一个新的联合类型，并不能转成交叉类型。

这里就必须引入新的知识点了，TODO: 逆变。

利用逆变特性，这题就有解了，先利用分发特性，生成新的函数组成的联合，再利用入参的逆变特性，就可以得到入参的交叉类型，也就是本题的结果。

## 题解

```ts
type UnionToIntersection<U> =
  (
    // 利用分发特性生成 (arg: a) => any | (arg: b) => any
    U extends any
    ? (arg: U) => any
    : never
  ) extends (arg: infer P) => any
  // 利用逆变特性，P = a & b
  ? P
  : never;
```

## 知识点

1. 逆变特性，TODO:
2. 联合的分发特性，相信题目做到这里的小伙伴没有不懂的了。