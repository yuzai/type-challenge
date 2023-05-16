---
title: 5181-mutablekeys
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Implement the advanced util type `MutableKeys<T>`, which picks all the mutable (not readonly) keys into a union.

For example:

```ts
type Keys = MutableKeys<{ readonly foo: string; bar: number }>;
// expected to be “bar”
```

## 分析

要想判断一个属性是否是 readonly，只能通过 [Equal](/summary/基操-判断两个类型相等) 的终极版去判断。

所以接下来就比较简单了，遍历对象，借助 as 判断当前属性生成的对象是否和去除了只读属性生成的对象是否相同，就可以去除 readonly 的属性，最终通过 keyof 拿到所有的属性值即可。

## 题解

```ts
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

type MutableKeys<T> = keyof {
  [P in keyof T as Equal<
    { [K in P]: T[P] },
    Mutable<{ [K in P]: T[P] }>
  > extends true
    ? P
    : never]: T[P];
};
```

## 知识点

1. [Equal](/summary/基操-判断两个类型相等)。
