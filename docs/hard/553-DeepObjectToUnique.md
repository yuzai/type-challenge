---
title: 553-DeepObjectToUnique
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

TypeScript has structural type system, but sometimes you want a function to accept only some previously well-defined unique objects (as in the nominal type system), and not any objects that have the required fields.

Create a type that takes an object and makes it and all deeply nested objects in it unique, while preserving the string and numeric keys of all objects, and the values of all properties on these keys.

The original type and the resulting unique type must be mutually assignable, but not identical.

For example,

```ts
import { Equal } from '@type-challenges/utils';

type Foo = { foo: 2; bar: { 0: 1 }; baz: { 0: 1 } };

type UniqFoo = DeepObjectToUniq<Foo>;

declare let foo: Foo;
declare let uniqFoo: UniqFoo;

uniqFoo = foo; // ok
foo = uniqFoo; // ok

type T0 = Equal<UniqFoo, Foo>; // false
type T1 = UniqFoo['foo']; // 2
type T2 = Equal<UniqFoo['bar'], UniqFoo['baz']>; // false
type T3 = UniqFoo['bar'][0]; // 1
type T4 = Equal<keyof Foo & string, keyof UniqFoo & string>; // true
```

## 分析

这个题目描述很长，而且没什么营养。

本质是给每一个属性上都增加一个 `[symbol]` 属性。我看不到实战中的任何应用场景。

仅仅贴个题解。

## 题解

```ts
const symbol = Symbol();
type DeepObjectToUniq<O extends object, Path extends any[] = [O]> = {
  [K in keyof O]: O[K] extends object
    ? DeepObjectToUniq<O[K], [...Path, K]>
    : O[K];
} & { [symbol]?: Path };
```

## 知识点

1. 不太有用的题目和知识
