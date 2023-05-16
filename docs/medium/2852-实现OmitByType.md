---
title: 2852-实现OmitByType
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

From `T`, pick a set of properties whose type are not assignable to `U`.

For Example

```typescript
type OmitBoolean = OmitByType<
  {
    name: string;
    count: number;
    isReadonly: boolean;
    isEnable: boolean;
  },
  boolean
>; // { name: string; count: number }
```

## 分析

这题和 [2595-实现 PickByType](/medium/2595-实现PickByType.md) 一样，只不过是去除属性，了解该题目的同学，只需要把条件判断改一下位置即可。

## 题解

```ts
// type PickByType<T, U> = {
//   [P in keyof T as T[P] extends U ? P : never]: T[P]
// }

type OmitByType<T, U> = {
  [P in keyof T as T[P] extends U ? never : P]: T[P];
};
```

相比 PickByType，只是调整了 never 的位置。

## 知识点

1. 同 [实现 Omit](/medium/3-实现Omit.md)
