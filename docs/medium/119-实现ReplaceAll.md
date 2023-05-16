---
title: 119-实现ReplaceAll
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现 `ReplaceAll<S, From, To>` 将一个字符串 `S` 中的所有子字符串 `From` 替换为 `To`。

例如

```ts
type replaced = ReplaceAll<'t y p e s', ' ', ''>; // 期望是 'types'
```

## 分析

这一题就是上一题 [实现 replace](/medium/116-实现Replace.md) 的升级版了，不仅仅需要匹配第一次，还需要匹配剩余字符中的符合条件的字符。不过整体还是非常简单的，只需要通过递归嵌套即可。

## 题解

```ts
type ReplaceAll<S extends string, From extends string, To extends string> =
  // 特殊情况处理
  From extends ''
    ? S
    : S extends `${infer F}${From}${infer R}`
    ? // 核心在于 递归嵌套处理剩余字符
      `${F}${To}${ReplaceAll<R, From, To>}`
    : S;
```

## 知识点

1. 字符匹配推断：`` A extends `${infer F}${From}${infer R}`  ``
2. 递归处理剩余字符
