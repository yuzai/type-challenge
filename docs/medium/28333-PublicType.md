---
title: 28333-PublicType
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

移除类型 `T` 中所有以 `_` 开头的字段（私有字段），只保留公共字段。

```ts
type Foo = { name: string; _private: string; age: number };
type R = PublicType<Foo>; // { name: string; age: number }
```

## 分析

标准的 **key 过滤** 题，用 mapped type + `as` + 模板字符串匹配即可：

- 遍历 `T` 的所有 key；
- 把以 `_` 开头的 key 映射到 `never`，mapped type 会自动丢弃；
- 其他 key 保留。

详见 [对象遍历的 as 和索引访问](/summary/基操-对象遍历的as和索引访问.md)。

## 题解

```ts
type PublicType<T> = {
  [K in keyof T as K extends `_${string}` ? never : K]: T[K];
};
```

一行搞定：`K extends `\_${string}``检查 key 是否以下划线开头；是则`never`（丢弃），否则保留 `K`。

## 验证

```ts
type R1 = PublicType<{ name: string; _private: string; age: number }>;
// { name: string; age: number }

type R2 = PublicType<{ _a: 1; _b: 2 }>; // {}
type R3 = PublicType<{ a: 1; b: 2 }>; // { a: 1; b: 2 }
```

## 知识点

- `K extends '_${string}'` 是模板字符串做 key 前缀匹配的标准写法。
- `as ... never` 是 mapped type 过滤 key 的万能手段。
