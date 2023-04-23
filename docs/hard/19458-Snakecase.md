---
title: 19458-Snakecase
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Create a `SnakeCase<T>` generic that turns a string formatted in **camelCase** into a string formatted in **snake_case**.

A few examples:

```ts
type res1 = SnakeCase<"hello">; // => "hello"
type res2 = SnakeCase<"userName">; // => "user_name"
type res3 = SnakeCase<"getElementById">; // => "get_element_by_id"
```

## 分析

这个题目在字符转换题中算是非常简单的，遍历一次，遇到大写，转成 `_小写` 就能完成。

不需要考虑第一个字符，不需要考虑之前的字符，可以说是非常简单了。

## 题解

```ts
type cases = [
  Expect<Equal<SnakeCase<'hello'>, 'hello'>>,
  Expect<Equal<SnakeCase<'userName'>, 'user_name'>>,
  Expect<Equal<SnakeCase<'getElementById'>, 'get_element_by_id'>>,
  Expect<Equal<SnakeCase<'getElementById' | 'getElementByClassNames'>, 'get_element_by_id' | 'get_element_by_class_names'>>,
]

type SnakeCase<T> =
  T extends `${infer F}${infer R}`
  ? F extends Uppercase<F>
    ? `_${Lowercase<F>}${SnakeCase<R>}`
    : `${F}${SnakeCase<R>}`
  : ''
```

即便是应对题目中的联合类型，借助其分发特性，也不需要做任何调整

## 知识点

1. 字符遍历