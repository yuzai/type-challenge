---
title: 533-实现Concat
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

在类型系统里实现 JavaScript 内置的 `Array.concat` 方法，这个类型接受两个参数，返回的新数组类型应该按照输入参数从左到右的顺序合并为一个新的数组。

例如：

```ts
type Result = Concat<[1], [2]>; // expected to be [1, 2]
```

## 分析

这个题目乍一看，好像没有什么思路，但是实际上非常简单，ts 和 js 一样，支持 `...` 扩展运算符。

相关的官方文档 [Spread](https://www.typescriptlang.org/docs/handbook/variable-declarations.html#spread)。

## 题解

```ts
type Concat<T extends any[], U extends any[]> = [...T, ...U];
```

只需要借助 扩展操作符即可实现。

## 知识点

1. 扩展操作符
