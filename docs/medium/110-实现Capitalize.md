---
title: 110-实现Capitalize
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现 `Capitalize<T>` 它将字符串的第一个字母转换为大写，其余字母保持原样。

例如

```ts
type capitalized = Capitalize<'hello world'>; // expected to be 'Hello world'
```

## 分析

思路其实比较简单，就是找到第一个字符，大写之后和其余字符拼接即可。

这里值得一提的是 ts 本身自带这个方法，可以参考[官方文档](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#uppercasestringtype)，但是其定义的地方是 intrinsic，我们看不到。

同时 Ts 还自带了大写整个字符的方法 Uppercase， 想要实现本题目，可以通过推断匹配的方式选出第一个字符后，大写该字符，并和原字符拼接即可。

## 题解

```ts
type MyCapitalize<S extends string> = S extends `${infer F}${infer R}`
  ? `${Uppercase<F>}${R}`
  : '';
```

## 知识点

1. 字符串推断匹配： `` A extends `${infer F}${infer R}`  ``
