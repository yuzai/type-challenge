---
title: 8987-Subsequence
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

判断一个 string 类型中是否有相同的字符

```ts
type CheckRepeatedChars<'abc'>   // false
type CheckRepeatedChars<'aba'>   // true
```

## 分析

这个题目思路比较简单，只需要遍历字符，每次都查看剩余的字符里面有没有这个字符，如果有，就 true，否则就遍历，直到结束返回 false

## 题解

```ts
// 可以查看 easy 里面的 Includes, 这里的实现更为简单
type Has<T extends string, U extends string> = T extends `${infer F}${infer R}`
  ? F extends U
    ? true
    : Has<R, U>
  : false;

type CheckRepeatedChars<T extends string> = T extends `${infer F}${infer R}`
  ? // 如果剩余字符中有 F
    Has<R, F> extends true
    ? // 那么这个字符串里必然就有重复字符
      true
    : // 否则继续遍历剩余字符
      CheckRepeatedChars<R>
  : // 全都遍历完了，那就是真的没有重复字符了
    false;
```

## 知识点

1. 字符遍历套路
