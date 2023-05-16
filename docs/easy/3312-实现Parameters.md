---
title: 3312-实现Parameters
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现内置的 `Parameters<T>` 类型，而不是直接使用它，可参考[TypeScript 官方文档](https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype)。

例如：

```ts
const foo = (arg1: string, arg2: number): void => {};

// [arg1: string, arg2: number]
type FunctionParamsType = MyParameters<typeof foo>;
```

## 分析

这一题乍一看没思路，但是其实也是常规套路：`A extends infer B` 这样的匹配推断，不过这里推断的是函数的参数。可以先从一个参数推断开始：

```ts
// infer 处于第一个参数的位置，故可以得到第一个参数
// 如果函数没有第一个参数，则会推断出来 unknown，并不会走 false 逻辑
type MyFirstParameter<T> = T extends (arg: infer F) => any ? F : never;

// Case1 = number;
type Case1 = MyFirstParameter<(a: number) => {}>;

// Case2 = unknown，特殊情况，没有参数
type Case2 = MyFirstParameter<() => {}>;
```

同样的套路，推断第二个参数 or 第三个参数也可以很快写出来。

那么推断所有参数类型呢？

可以通过扩展操作符进行。

## 题解

```ts
type Parameters<T extends (...args: any) => any> =
  // 扩展操作符，推断出 P
  T extends (...args: infer P) => any ? P : never;
```

## 知识点

1. 函数类型，也可以做推断匹配，`A extends (...args: infer P) => infer R`
2. 函数类型，推断匹配时，使用扩展操作符

这里需要注意的就是写法，和元组的推断不同，函数参数的推断必须注明参数名称(名称随便起，并不重要，也不需要和实际参数名称一致，只是占个位置而已)。
