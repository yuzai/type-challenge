---
title: 223-isAny
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Sometimes it's useful to detect if you have a value with `any` type. This is especially helpful while working with third-party Typescript modules, which can export `any` values in the module API. It's also good to know about `any` when you're suppressing implicitAny checks.

So, let's write a utility type `IsAny<T>`, which takes input type `T`. If `T` is `any`, return `true`, otherwise, return `false`.

## 分析

这个题判断是不是 any，有一个非常简单的方法，就是借助 [Equal](/summary/%E5%88%A4%E6%96%AD%E4%B8%A4%E4%B8%AA%E7%B1%BB%E5%9E%8B%E7%9B%B8%E7%AD%89.md)。即可判断：

```ts
type isAny<T> = Equals<any, T>;
```

当然也有其他的方法，就是借助 any 的特性: `any & 任何值 = any`。

## 题解

```ts
type IsAny<T> =
    // 核心在于 T & 1，如果 T 是 1，那么 T & 1 = 1
    // 0 extends 1 -> false
    // 如果 T 不是 1 和 any，那么 T & 1 之后，只会 = 1 或者 never
    // 0 extends 1 | never -> false
    // 只有 any 满足条件
    0 extends T & 1
    ? true : false
```

当然，上述判断中的 0， 1可以改成其他任意字面量类型。

## 知识点

1. `any & 任意类型 = any`

感觉实际中没什么用，也可以通过 Equal 实现即可。



