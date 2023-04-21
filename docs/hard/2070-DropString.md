---
title: 2070-DropString
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Drop the specified chars from a string.

For example:

```ts
type Butterfly = DropString<'foobar!', 'fb'> // 'ooar!'
```

## 分析

从字符中移除某些字符，只需要把字符遍历一次，每次都判断当前字符是否在被移除的字符中即可。

判断字符串中是否存在某一字符，本质也是遍历字符，依次判断是否存在。可以拆成一个辅助类型去处理。

本题在 hard 中相对简单，不再赘述直接上题解。

## 题解

```ts
type InCludes<S, Q> =
  S extends `${infer F}${infer R}`
  ? F extends Q
    ? true
    : InCludes<R, Q>
  : false;

type DropString<S, C> =
  S extends `${infer F}${infer R}`
  ? InCludes<C, F> extends true
    ? DropString<R, C>
    : `${F}${DropString<R, C>}`
  : S;
```

## 知识点

1. 字符遍历套路