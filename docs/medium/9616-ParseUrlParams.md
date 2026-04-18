---
title: 9616-ParseUrlParams
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现一个类型层面的 URL 参数解析器，从给定的 URL 字符串里抽取出所有以 `:` 开头的参数名，以联合类型的形式返回。

```ts
type A = ParseUrlParams<':id'>; // 'id'
type B = ParseUrlParams<'posts/:id'>; // 'id'
type C = ParseUrlParams<'posts/:id/:user'>; // 'id' | 'user'
```

## 分析

思路拆成两步：

1. 遍历整个字符串，遇到 `:`，就把紧跟着的那一段"到下一个 `/` 或字符串末尾"的子串提取出来。
2. 提取到的每一段拼成联合。

字符串遍历用模板匹配 + 递归是体操的经典套路（参考 [类型转换大集合](/summary/基操-类型转换大集合.md)）。关键是"**吃到冒号后**"的处理：再来一次模板匹配，把冒号后直到 `/` 的部分捞出来。

## 题解

```ts
type ParseUrlParams<U> = U extends `${infer L}:${infer P}`
  ? P extends `${infer Param}/${infer R}`
    ? Param | ParseUrlParams<R>
    : P
  : never;
```

- 第一层 `${infer L}:${infer P}`：把字符串在第一个 `:` 处切开，`L` 是冒号前的部分（丢弃），`P` 是冒号后的部分。
- 第二层 `${infer Param}/${infer R}`：检查冒号后是否还有 `/`。
  - 有：`Param` 就是"冒号到下一个 `/`"之间的参数名，继续对 `R` 递归。
  - 没有：说明冒号后到字符串结尾都是参数名，直接返回 `P`。
- 如果连一个 `:` 都没有，返回 `never`，递归出口。

## 验证

```ts
type R1 = ParseUrlParams<':id'>; // 'id'
type R2 = ParseUrlParams<'posts/:id'>; // 'id'
type R3 = ParseUrlParams<'posts/:id/:user'>; // 'id' | 'user'
type R4 = ParseUrlParams<'a/b/c'>; // never，没有参数
```
