---
title: 956-DeepPick
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Implement a type DeepPick, that extends Utility types `Pick`. A type takes two arguments.

For example:

```ts
type obj = {
  name: 'hoge';
  age: 20;
  friend: {
    name: 'fuga';
    age: 30;
    family: {
      name: 'baz';
      age: 1;
    };
  };
};

type T1 = DeepPick<obj, 'name'>; // { name : 'hoge' }
type T2 = DeepPick<obj, 'name' | 'friend.name'>; // { name : 'hoge' } & { friend: { name: 'fuga' }}
type T3 = DeepPick<obj, 'name' | 'friend.name' | 'friend.family.name'>; // { name : 'hoge' } &  { friend: { name: 'fuga' }} & { friend: { family: { name: 'baz' }}}
```

## 分析

这个题目和 [270-get](/hard/270-get.md) 几乎一样，不同的是第二个参数支持联合类型，而输出的是交叉类型，同时获取的是 { key: value } 这样的格式。

借助联合类型的分发特性 和 前面 get 进行稍加改动，以及 [联合转交叉](/hard/55-UnionToIntersection.md)，可以很轻松的实现本题目

## 题解

```ts
// [联合转交叉](/hard/55-UnionToIntersection.md)
type UnionToIntersection<U> =
  // 利用分发特性生成 (arg: a) => any | (arg: b) => any
  (U extends any ? (arg: U) => any : never) extends (arg: infer P) => any
    ? // 利用逆变特性，P = a & b
      P
    : never;

// [270-get](/hard/270-get.md)
type Get<T, K> =
  // 是属性
  K extends keyof T
    ? // 直接{ key: value }
      { [P in K]: T[K] }
    : // 分割字符
    K extends `${infer F}.${infer R}`
    ? // 判断是否是 属性
      F extends keyof T
      ? // 是，则递归处理剩余的参数，返回 { key: 递归结果 }
        {
          [P in F]: Get<T[F], R>;
        }
      : // 否则 返回 never
        never
    : // 属性为空，必然是 a.b. 的场景，此时返回 never
      never;

type DeepPick<T, K> = UnionToIntersection<
  // 分发特性
  K extends any ? Get<T, K> : never
>;
```

这里，由于 `Get<T, K>` 中其实已经进行过一次分发了，`K extends keyof T`，所以外层也可以不用再 `K extends any` 触发分发。

## 知识点

1. 联合转交叉
2. 分发特性
3. 递归处理嵌套问题
