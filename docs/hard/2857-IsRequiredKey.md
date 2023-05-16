---
title: 2857-IsRequiredKey
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Implement a generic `IsRequiredKey<T, K>` that return whether `K` are required keys of `T` .

For example

```typescript
type A = IsRequiredKey<{ a: number; b?: string }, 'a'>; // true
type B = IsRequiredKey<{ a: number; b?: string }, 'b'>; // false
type C = IsRequiredKey<{ a: number; b?: string }, 'b' | 'a'>; // false
```

## 分析

这题其实和 [57-获取必填属性](/hard/57-获取必填属性.md) 是一样的，只需要通过该题目的方法，获取必填属性，然后判断必填属性中是否包含目标类型就可以了。同时由于入参可能为联合类型，加上 `[]` 去除分发特性就可以解决本问题

## 题解

```ts
// [57-获取必填属性](/hard/57-获取必填属性.md)
type GetRequired<T> = {
  [P in keyof T as T[P] extends Required<T>[P] ? P : never]: T[P];
};

type IsRequiredKey<T, K extends keyof T> =
  // [] 去除分发特性
  [K] extends [keyof GetRequired<T>] ? true : false;
```

## 知识点

1. 分发特性
2. 同 [57-获取必填属性](/hard/57-获取必填属性.md)
