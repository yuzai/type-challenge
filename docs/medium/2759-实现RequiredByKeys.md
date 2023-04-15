---
title: 2759-实现RequiredByKeys
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现一个通用的`RequiredByKeys<T, K>`，它接收两个类型参数`T`和`K`。

`K`指定应设为必选的`T`的属性集。当没有提供`K`时，它就和普通的`Required<T>`一样使所有的属性成为必选的。

例如:

```ts
interface User {
  name?: string
  age?: number
  address?: string
}

type UserRequiredName = RequiredByKeys<User, 'name'> // { name: string; age?: number; address?: string }

```

## 分析

这题和上一题一样，只不过可选变成了非可选，只需要参照官网 [修饰符一节](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#mapping-modifiers)，查看不同的修饰符增加方式即可。

## 题解

```ts
type Merge<T> = {
  [P in keyof T]: T[P];
}
type RequiredByKeys<T, K extends keyof T = keyof T> = Merge<{
  [P in K]-?: T[P]
} & {
  [P in keyof T as P extends K ? never : P]: T[P]
}>
```

这里，省略部分属性，也可以通过 `Pick<T, Exclude<T, K>>` 实现，反正就一行代码，自己实现来的又快又简单就没必要使用库工具了。

## 知识点

1. 同 [实现PartialByKeys](/docs/medium/2757-%E5%AE%9E%E7%8E%B0PartialByKeys.md)