---
title: 8987-Subsequence
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

判断一个string类型中是否有相同的字符
```ts
type CheckRepeatedChars<'abc'>   // false
type CheckRepeatedChars<'aba'>   // true
```

## 分析

这个题目思路很多

## 题解

```ts
type Has<T extends string, U extends string> = T extends `${infer F}${infer R}` ? F extends U ? true : Has<R, U> : false;

type CheckRepeatedChars<T extends string> =
  T extends `${infer F}${infer R}` ? Has<R, F> extends true ? true : CheckRepeatedChars<R> : false
```

## 知识点

